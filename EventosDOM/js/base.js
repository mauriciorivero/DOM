/* ==========================================================================
   base.js · Infraestructura compartida del playground
   --------------------------------------------------------------------------
   NO es parte de los retos: se carga antes de control.js o control-retos.js
   y les entrega estas herramientas globales:

     $(selector, raíz?)      → document.querySelector
     $$(selector, raíz?)     → document.querySelectorAll, ya como Array
     describe(nodo)          → "button#guardar.btn" (texto corto de un nodo)
     modifiers(evento)       → "Ctrl+Shift" o "ninguno"
     track(tarjeta, evento, datos?)
                             → suma 1 al contador de la tarjeta, pinta el
                               inspector y agrega la línea al registro.
     trace(tarjeta, texto, datos?)
                             → agrega al registro una ACCIÓN que no es un
                               evento (por ejemplo "pushState()").

   También se encarga de la interfaz que rodea a las tarjetas: tema claro y
   oscuro, riel de navegación, registro lateral, resaltado de código, etc.
   ========================================================================== */
"use strict";

/* ---------- Utilidades globales ---------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function describe(target) {
  if (target === window) return "window";
  if (target === document) return "document";
  if (target === null || target === undefined) return "null";
  if (!(target instanceof Element)) return target.constructor?.name ?? String(target);

  const id = target.id ? `#${target.id}` : "";
  const classes = Array.from(target.classList).slice(0, 2).map((name) => `.${name}`).join("");
  return `${target.localName}${id}${classes}`;
}

function modifiers(event) {
  const active = [
    event.ctrlKey && "Ctrl",
    event.shiftKey && "Shift",
    event.altKey && "Alt",
    event.metaKey && "Meta",
  ].filter(Boolean);
  return active.length ? active.join("+") : "ninguno";
}

(() => {
  /* ---------- Almacenamiento seguro (puede fallar en modo privado) ---------- */
  const pick = (kind) => {
    try {
      const storage = window[kind];
      storage.setItem("__test", "1");
      storage.removeItem("__test");
      return storage;
    } catch (error) {
      return null;
    }
  };
  const local = pick("localStorage");
  const session = pick("sessionStorage");

  const readJSON = (storage, key, fallback) => {
    try {
      const raw = storage?.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  };
  const writeJSON = (storage, key, value) => {
    try {
      storage?.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* sin espacio o bloqueado: el playground sigue funcionando */
    }
  };

  const KEY_LOG = "eventosdom.log";
  const KEY_PANEL = "eventosdom.panel";
  const KEY_THEME = "eventosdom.theme";

  const motion = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pulse = (element, keyframes, options) => {
    if (motion && element?.animate) element.animate(keyframes, options);
  };

  /* ---------- Formato de valores ---------- */
  function formatValue(value) {
    if (value instanceof Element || value === window || value === document) return describe(value);
    if (typeof value === "string") {
      if (value === "") return '""';
      return value.length > 90 ? `${value.slice(0, 87)}…` : value;
    }
    if (typeof value === "object" && value !== null) {
      try {
        return JSON.stringify(value);
      } catch (error) {
        return String(value);
      }
    }
    return String(value);
  }

  const summarize = (rows) =>
    Object.entries(rows)
      .filter(([name]) => name !== "type")
      .slice(0, 4)
      .map(([name, value]) => `${name}: ${formatValue(value)}`)
      .join(" · ");

  const pad = (number, size = 2) => String(number).padStart(size, "0");
  const clock = (ms) => {
    const date = new Date(ms);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
  };

  /* ---------- Registro global ---------- */
  const MAX_ENTRIES = 150;
  const MAX_SAVED = 120;
  const COALESCE_MS = 700; // eventos repetidos en este lapso se agrupan (×N)

  const logList = $("#log");
  const logTotal = $("#log-total");
  const logSheet = $("#log-sheet");
  const logScrim = $("#log-scrim");
  const logBadge = $("#log-badge");
  const wideLayout = matchMedia("(min-width: 1200px)");

  const entries = []; // la más reciente primero
  let paused = false;
  let unread = 0;
  let saveTimer = 0;

  function paintItem(item, entry) {
    const time = $(".log__time", item);
    time.textContent = clock(entry.t);
    time.dateTime = new Date(entry.t).toISOString();
    $(".log__count", item).textContent = entry.count > 1 ? `×${entry.count}` : "";
    $(".log__text", item).textContent = entry.text;
  }

  function buildItem(entry) {
    const item = document.createElement("li");
    item.className = "log__item";
    item.dataset.group = entry.group;
    item.dataset.kind = entry.kind;

    const time = document.createElement("time");
    time.className = "log__time";
    const type = document.createElement("span");
    type.className = "log__type";
    type.textContent = entry.type;
    const count = document.createElement("span");
    count.className = "log__count";
    const text = document.createElement("p");
    text.className = "log__text";

    item.append(time, type, count, text);
    paintItem(item, entry);
    return item;
  }

  function refreshTotals() {
    const total = entries.length;
    logTotal.textContent = `${total} ${total === 1 ? "registro" : "registros"}`;
  }

  function paintBadge() {
    logBadge.hidden = unread === 0;
    logBadge.textContent = unread > 99 ? "99+" : String(unread);
  }

  function save() {
    writeJSON(session, KEY_LOG, entries.slice(0, MAX_SAVED));
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 250);
  }

  function addEntry(data) {
    if (paused && data.kind !== "system") return;

    const now = Date.now();
    const last = entries[0];
    const repeated = last && data.kind !== "system" && last.key === data.key && last.kind === data.kind && now - last.t < COALESCE_MS;

    if (repeated) {
      last.t = now;
      last.count += 1;
      last.text = data.text;
      paintItem(logList.firstElementChild, last);
      scheduleSave();
      return;
    }

    const entry = { ...data, t: now, count: 1 };
    entries.unshift(entry);
    logList.prepend(buildItem(entry));
    while (entries.length > MAX_ENTRIES) {
      entries.pop();
      logList.lastElementChild.remove();
    }

    if (data.kind !== "system" && !wideLayout.matches && !logSheet.classList.contains("is-open")) {
      unread += 1;
      paintBadge();
    }
    refreshTotals();
    scheduleSave();
  }

  /* ---------- API global: track y trace ---------- */
  function track(cardId, evt, props = {}) {
    const card = $(`[data-card="${cardId}"]`);
    const isEvent = typeof evt !== "string";
    const type = isEvent ? evt.type : evt;
    const rows = { type, ...(isEvent ? { target: describe(evt.target) } : {}), ...props };
    const group = card?.closest("[data-panel]")?.dataset.panel ?? "nav";

    if (!card) console.warn(`track(): no existe una tarjeta con data-card="${cardId}"`);

    if (card) {
      const counter = $(`.counter[data-type="${type}"]`, card);
      if (counter) {
        const total = $("b", counter);
        total.textContent = Number(total.textContent) + 1;
        pulse(counter, [{ transform: "scale(1.2)" }, { transform: "scale(1)" }], { duration: 260, easing: "ease-out" });
      } else {
        console.warn(`track(): la tarjeta "${cardId}" no tiene un contador para "${type}"`);
      }

      const list = $(".inspector__list", card);
      if (list) {
        list.replaceChildren(
          ...Object.entries(rows).map(([name, value]) => {
            const row = document.createElement("div");
            row.className = "inspector__row";
            const dt = document.createElement("dt");
            dt.textContent = name;
            const dd = document.createElement("dd");
            dd.textContent = formatValue(value);
            row.append(dt, dd);
            return row;
          }),
        );
        pulse($(".inspector", card), [{ backgroundColor: "var(--primary-container)" }, { backgroundColor: "var(--surface-container)" }], { duration: 450 });
      }
    }

    addEntry({
      kind: "event",
      card: cardId,
      type,
      group,
      key: `${cardId}|${type}|${rows.target ?? ""}`,
      text: summarize(rows),
    });
  }

  function trace(cardId, label, props = {}) {
    const card = $(`[data-card="${cardId}"]`);
    addEntry({
      kind: "action",
      card: cardId,
      type: label,
      group: card?.closest("[data-panel]")?.dataset.panel ?? "nav",
      key: `${cardId}|action|${label}`,
      text: summarize(props),
    });
  }

  window.track = track;
  window.trace = trace;

  /* ---------- Restaurar el registro de la página anterior ---------- */
  const saved = readJSON(session, KEY_LOG, []);
  if (Array.isArray(saved)) {
    saved
      .filter((entry) => entry && typeof entry.type === "string" && typeof entry.t === "number")
      .slice(0, MAX_ENTRIES)
      .forEach((entry) => {
        entries.push(entry);
        logList.append(buildItem(entry));
      });
  }

  const navigationType = performance.getEntriesByType?.("navigation")[0]?.type ?? "navigate";
  addEntry({
    kind: "system",
    card: "page",
    type: "página",
    group: "sys",
    key: "page-load",
    text: `Página cargada (${navigationType})`,
  });
  refreshTotals();

  // Guardar al salir o al ocultarse la pestaña (la última escritura no se pierde)
  window.addEventListener("pagehide", save);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") save();
  });

  /* ---------- Controles del registro ---------- */
  function setSheet(open) {
    logSheet.classList.toggle("is-open", open);
    logScrim.classList.toggle("is-open", open);
    if (open) {
      unread = 0;
      paintBadge();
    }
  }

  $("#btn-log-open").addEventListener("click", () => setSheet(true));
  $("#btn-log-close").addEventListener("click", () => setSheet(false));
  logScrim.addEventListener("click", () => setSheet(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSheet(false);
  });

  $("#btn-log-clear").addEventListener("click", () => {
    entries.length = 0;
    logList.replaceChildren();
    unread = 0;
    paintBadge();
    refreshTotals();
    save();
  });

  const pauseButton = $("#btn-log-pause");
  pauseButton.addEventListener("click", () => {
    const next = !paused;
    addEntry({ kind: "system", card: "page", type: "registro", group: "sys", key: "pause", text: next ? "Registro en pausa" : "Registro reanudado" });
    paused = next;
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.setAttribute("aria-label", paused ? "Reanudar el registro" : "Pausar el registro");
    pauseButton.title = paused ? "Reanudar el registro" : "Pausar el registro";
  });

  $$("[data-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      logList.dataset.filter = chip.dataset.filter;
      $$("[data-filter]").forEach((other) => {
        const selected = other === chip;
        other.classList.toggle("is-selected", selected);
        other.setAttribute("aria-pressed", String(selected));
      });
    });
  });

  /* ---------- Tema claro / oscuro ---------- */
  const root = document.documentElement;
  $("#btn-theme").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      local?.setItem(KEY_THEME, next);
    } catch (error) {
      /* se aplica igual, solo que no se recuerda */
    }
  });

  /* ---------- Secciones (riel de navegación) ---------- */
  const panels = $$("[data-panel]");
  const railItems = $$("[data-panel-target]");

  function showPanel(name, { scroll = true } = {}) {
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== name;
    });
    railItems.forEach((item) => {
      const active = item.dataset.panelTarget === name;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    writeJSON(session, KEY_PANEL, name);
    if (scroll) window.scrollTo({ top: 0 });
  }

  railItems.forEach((item) => item.addEventListener("click", () => showPanel(item.dataset.panelTarget)));
  showPanel(readJSON(session, KEY_PANEL, "nav") === "data" ? "data" : "nav", { scroll: false });

  /* ---------- Atajos de la interfaz ---------- */
  $$("[data-jump]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const card = document.getElementById(chip.dataset.jump);
      if (!card) return;
      card.scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "start" });
      card.classList.remove("is-highlight");
      void card.offsetWidth; // reinicia la animación si ya estaba resaltada
      card.classList.add("is-highlight");
    });
  });

  $$('[data-action="reload"]').forEach((button) => button.addEventListener("click", () => location.reload()));

  /* ---------- Barra superior: elevación y progreso de lectura ---------- */
  const appBar = $(".top-app-bar");
  function paintChrome() {
    const max = document.documentElement.scrollHeight - innerHeight;
    appBar.style.setProperty("--p", max > 0 ? (scrollY / max).toFixed(4) : "0");
    appBar.classList.toggle("is-scrolled", scrollY > 4);
  }
  window.addEventListener("scroll", paintChrome, { passive: true });
  window.addEventListener("resize", paintChrome);
  paintChrome();

  /* ---------- Red de seguridad al soltar archivos ---------- */
  // Sin esto, soltar un archivo fuera de la zona haría que el navegador
  // lo abra y se pierda la página. Solo aplica a archivos del escritorio.
  const hasFiles = (event) => event.dataTransfer?.types?.includes("Files");
  window.addEventListener("dragover", (event) => {
    if (hasFiles(event)) event.preventDefault();
  });
  window.addEventListener("drop", (event) => {
    if (hasFiles(event)) event.preventDefault();
  });

  /* ---------- Resaltado de código (sin librerías) ---------- */
  const TOKENS = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\b(const|let|var|function|return|if|else|for|of|new|true|false|null|undefined|async|await|typeof)\b|\b(\d+(?:\.\d+)?)\b|(=>)/g;
  const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function highlight(source) {
    let html = "";
    let last = 0;
    for (const match of source.matchAll(TOKENS)) {
      const kind = match[1] ? "c" : match[2] ? "s" : match[4] ? "n" : "k";
      html += escapeHtml(source.slice(last, match.index));
      html += `<span class="tok-${kind}">${escapeHtml(match[0])}</span>`;
      last = match.index + match[0].length;
    }
    return html + escapeHtml(source.slice(last));
  }

  $$(".code pre code").forEach((block) => {
    block.innerHTML = highlight(block.textContent);
  });
})();
