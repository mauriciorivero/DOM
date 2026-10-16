/* ==========================================================================
   control.js · Playground de eventos del DOM — versión COMPLETA
   --------------------------------------------------------------------------
   Aquí está cada listener funcionando. Es la "solución" que se proyecta en
   clase. Para que los estudiantes la escriban ellos, cambia en index.html el
   script por js/control-retos.js.

   Cómo está organizado
   --------------------
   · Un bloque { … } por tarjeta, en el mismo orden de la pantalla, para que
     los nombres de variables no choquen entre tarjetas.
   · Cada listener hace dos cosas: (1) la lógica de la demo y (2) avisa al
     playground con track("tarjeta", evento, { datos }) para actualizar el
     contador, el inspector y el registro. track y trace vienen de base.js.
   ========================================================================== */
"use strict";

/* ==========================================================================
   SECCIÓN 1 · EVENTOS DE NAVEGACIÓN
   ========================================================================== */

/* ---------- DOMContentLoaded y load (ciclo de vida de la página) ----------
   Se registran PRIMERO y de forma síncrona: ocurren una sola vez, al cargar.
   Ambos comparten la línea de tiempo de la tarjeta "load". */
{
  const marks = { script: performance.now() };
  const navigationType = performance.getEntriesByType("navigation")[0]?.type ?? "navigate";

  function paintTimeline() {
    const longest = Math.max(...Object.values(marks));
    for (const [name, ms] of Object.entries(marks)) {
      const row = $(`[data-mark="${name}"]`);
      $(".timeline__time", row).textContent = `${Math.round(ms)} ms`;
      $(".progress__bar", row).style.setProperty("--v", (ms / longest) * 100);
    }
  }

  $("#dcl-state").textContent = document.readyState; // "loading": el DOM aún se está leyendo
  $("#dcl-nav").textContent = navigationType;
  paintTimeline();

  document.addEventListener("DOMContentLoaded", (event) => {
    marks.dcl = performance.now();
    $("#dcl-state").textContent = document.readyState; // "interactive"
    paintTimeline();
    track("domcontentloaded", event, {
      readyState: document.readyState,
      elapsed: `${Math.round(marks.dcl)} ms`,
      navigationType,
    });
  });

  window.addEventListener("load", (event) => {
    marks.load = performance.now();
    $("#dcl-state").textContent = document.readyState; // "complete"
    paintTimeline();
    track("load-window", event, {
      readyState: document.readyState,
      elapsed: `${Math.round(marks.load)} ms`,
      afterDOMContentLoaded: `+${Math.round(marks.load - marks.dcl)} ms`,
    });
  });

  // Escuchar DOMContentLoaded cuando ya ocurrió: el listener nunca se ejecuta
  $("#btn-late-dcl").addEventListener("click", () => {
    const status = $("#dcl-late-status");
    document.addEventListener(
      "DOMContentLoaded",
      (event) => track("domcontentloaded", event, { note: "¡llegó!" }),
      { once: true },
    );
    trace("domcontentloaded", "addEventListener()", { event: "DOMContentLoaded", note: "registrado tarde" });
    status.textContent = "Listener registrado. Esperando el evento…";
    setTimeout(() => {
      status.textContent = `Nunca llegó: el evento ya había ocurrido (readyState = "${document.readyState}"). Revisa readyState antes de escuchar.`;
    }, 1500);
  });
}

/* ---------- click ---------- */
{
  const demo = $("#click-demo");
  const pad = $("#click-pad");

  // Un solo listener en el contenedor atiende a los tres botones y al recuadro
  demo.addEventListener("click", (event) => {
    track("click", event, {
      currentTarget: describe(event.currentTarget),
      action: event.target.closest("[data-action]")?.dataset.action ?? "—",
      clientX: event.clientX,
      clientY: event.clientY,
      button: event.button,
      detail: event.detail, // 1 = clic simple, 2 = doble clic…
      modifiers: modifiers(event),
    });

    // Onda de Material que nace en el punto exacto del clic
    if (pad.contains(event.target)) {
      const rect = pad.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      Object.assign(ripple.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${event.clientX - rect.left - size / 2}px`,
        top: `${event.clientY - rect.top - size / 2}px`,
      });
      pad.append(ripple);
      ripple
        .animate([{ transform: "scale(0)", opacity: 0.3 }, { transform: "scale(1)", opacity: 0 }], { duration: 600, easing: "ease-out" })
        .addEventListener("finish", () => ripple.remove());
    }
  });
}

/* ---------- submit (navegación) ---------- */
{
  const form = $("#nav-form");
  const prevent = $("#nav-prevent");
  const result = $("#nav-form-result");

  // Si el envío NO se canceló, la página se recargó con ?q=… en la URL
  const sent = new URLSearchParams(location.search).get("q");
  if (sent !== null) {
    form.elements.q.value = sent;
    result.textContent = `La página se recargó: el navegador navegó a ?q=${sent}. Eso pasa cuando no se llama a preventDefault().`;
  }

  form.addEventListener("submit", (event) => {
    if (prevent.checked) event.preventDefault(); // sin esto, el formulario navega

    track("submit-nav", event, {
      defaultPrevented: event.defaultPrevented,
      submitter: describe(event.submitter),
      q: form.elements.q.value,
      result: event.defaultPrevented ? "se queda en la página" : "la página se recargará",
    });

    if (event.defaultPrevented) {
      result.textContent = `Envío interceptado en JavaScript. Búsqueda: «${form.elements.q.value}»`;
    }
  });
}

/* ---------- hashchange ---------- */
{
  const links = $$(".hash-link");
  const view = $("#hash-view");
  const views = {
    "#/inicio": ["Inicio", "Página principal del sitio."],
    "#/perfil": ["Perfil", "Datos de la cuenta del usuario."],
    "#/ajustes": ["Ajustes", "Preferencias de la aplicación."],
  };

  function render() {
    const known = views[location.hash];
    const [title, text] = known ?? (location.hash
      ? ["Ruta desconocida", `No hay una vista para «${location.hash}».`]
      : ["Vista", "Elige un enlace."]);
    $(".view__title", view).textContent = title;
    $(".view__text", view).textContent = text;
    links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === location.hash));
  }

  window.addEventListener("hashchange", (event) => {
    render();
    track("hashchange", event, {
      oldURL: new URL(event.oldURL).hash || "(sin hash)",
      newURL: new URL(event.newURL).hash || "(sin hash)",
      hash: location.hash,
    });
  });

  // Cambiar el hash por código también dispara hashchange
  $("#btn-random-hash").addEventListener("click", () => {
    location.hash = `#/ruta-${Math.floor(Math.random() * 90) + 10}`;
  });

  render();
}

/* ---------- popstate ---------- */
{
  const TOTAL = 4;
  const steps = $$(".stepper__step", $("#pop-stepper"));
  const label = $("#pop-label");
  const url = $("#pop-url");
  const push = $("#btn-push");
  let step = history.state?.step ?? 1;

  function render() {
    steps.forEach((item, index) => {
      item.classList.toggle("is-done", index + 1 < step);
      item.classList.toggle("is-current", index + 1 === step);
    });
    label.textContent = `Paso ${step} de ${TOTAL}`;
    url.textContent = location.search || location.hash || "(sin cambios)";
    push.disabled = step >= TOTAL;
  }

  push.addEventListener("click", () => {
    step += 1;
    try {
      history.pushState({ step }, "", `?step=${step}`);
    } catch (error) {
      history.pushState({ step }, "", `#step-${step}`); // por si el navegador no permite ?query en file://
    }
    // pushState NO dispara popstate: lo dejamos anotado como acción en el registro
    trace("popstate", "pushState()", {
      state: JSON.stringify({ step }),
      url: location.search || location.hash,
      note: "no dispara popstate",
    });
    render();
  });

  $("#btn-back").addEventListener("click", () => history.back());
  $("#btn-forward").addEventListener("click", () => history.forward());

  window.addEventListener("popstate", (event) => {
    step = event.state?.step ?? 1; // state es null en la entrada inicial
    render();
    track("popstate", event, {
      state: JSON.stringify(event.state),
      step,
      historyLength: history.length,
    });
  });

  render();
}

/* ---------- beforeunload ---------- */
{
  const toggle = $("#unload-toggle");
  const status = $("#unload-status");

  // Función con nombre: removeEventListener necesita la MISMA referencia
  function warnBeforeLeaving(event) {
    event.preventDefault(); // pide confirmación al navegador
    event.returnValue = ""; // algunos navegadores lo exigen
    track("beforeunload", event, {
      defaultPrevented: event.defaultPrevented,
      note: "el navegador mostrará su aviso",
    });
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      window.addEventListener("beforeunload", warnBeforeLeaving);
      status.textContent = "Armado: ahora recargar o salir pedirá confirmación.";
    } else {
      window.removeEventListener("beforeunload", warnBeforeLeaving);
      status.textContent = "Desarmado: no hay listener registrado.";
    }
    trace("beforeunload", toggle.checked ? "addEventListener()" : "removeEventListener()", { event: "beforeunload" });
  });
}

/* ---------- scroll ---------- */
{
  const box = $("#scroll-box");
  const bar = $("#scroll-bar");
  const boxLabel = $("#scroll-label");
  const pageLabel = $("#scroll-page-label");
  const percent = (position, max) => (max > 0 ? Math.round((position / max) * 100) : 0);

  // scroll no burbuja desde un elemento: el listener va en la propia caja
  box.addEventListener(
    "scroll",
    (event) => {
      const progress = percent(box.scrollTop, box.scrollHeight - box.clientHeight);
      bar.style.setProperty("--v", progress);
      boxLabel.textContent = `Caja: ${progress} %`;
      track("scroll", event, { scrollTop: Math.round(box.scrollTop), progress: `${progress} %` });
    },
    { passive: true },
  );

  // En la página completa el target es document y el evento llega a window
  window.addEventListener(
    "scroll",
    (event) => {
      const progress = percent(scrollY, document.documentElement.scrollHeight - innerHeight);
      pageLabel.textContent = `Página: ${progress} %`;
      track("scroll", event, { scrollY: Math.round(scrollY), progress: `${progress} %` });
    },
    { passive: true },
  );
}

/* ---------- resize ---------- */
{
  const size = $("#resize-size");
  const sizeClassChip = $("#resize-class");
  const dpr = $("#resize-dpr");
  const ruler = $("#resize-ruler");

  // Clases de tamaño de ventana de Material 3
  const sizeClass = (width) =>
    width < 600 ? "Compact" : width < 840 ? "Medium" : width < 1200 ? "Expanded" : width < 1600 ? "Large" : "Extra-large";

  function paint() {
    size.textContent = `${innerWidth} × ${innerHeight} px`;
    sizeClassChip.textContent = sizeClass(innerWidth);
    dpr.textContent = `devicePixelRatio ${devicePixelRatio}`;
    ruler.style.setProperty("--v", Math.min(100, (innerWidth / 1920) * 100));
  }

  window.addEventListener("resize", (event) => {
    paint();
    track("resize", event, { innerWidth, innerHeight, sizeClass: sizeClass(innerWidth) });
  });

  paint();
}

/* ==========================================================================
   SECCIÓN 2 · EVENTOS DE MANEJO DE DATOS
   ========================================================================== */

/* ---------- input (y change, para comparar) ---------- */
{
  const field = $("#input-text");
  const counter = $("#input-counter");
  const echo = $("#input-echo");
  const range = $("#input-range");
  const rangeOutput = $("#input-range-out");

  // input: en cada pulsación, pegado o borrado
  field.addEventListener("input", (event) => {
    counter.textContent = `${field.value.length} / ${field.maxLength}`;
    echo.textContent = field.value || "…";
    track("input", event, {
      inputType: event.inputType, // insertText, deleteContentBackward, insertFromPaste…
      data: event.data,
      value: field.value,
      length: field.value.length,
    });
  });

  // change: solo cuando el usuario confirma (Enter o sale del campo)
  field.addEventListener("change", (event) => {
    track("input", event, { value: field.value, note: "valor confirmado al salir del campo" });
  });

  range.addEventListener("input", (event) => {
    rangeOutput.value = range.value;
    track("input", event, { value: range.value });
  });
}

/* ---------- change ---------- */
{
  const form = $("#change-form");
  const summary = $("#change-summary");

  function paint() {
    const data = new FormData(form);
    summary.textContent = `Plan: ${data.get("plan")} · Novedades: ${data.has("news") ? "sí" : "no"} · Entrega: ${data.get("delivery")}`;
  }

  // change burbuja: un listener en el formulario atiende a todos los controles
  form.addEventListener("change", (event) => {
    const control = event.target;
    paint();
    track("change", event, {
      name: control.name,
      value: control.value,
      checked: control.type === "checkbox" || control.type === "radio" ? control.checked : "—",
    });
  });

  paint();
}

/* ---------- focus / blur ---------- */
{
  const form = $("#focus-form");
  const active = $("#focus-active");

  // focus y blur NO burbujean: se capturan con el tercer argumento (true)
  form.addEventListener(
    "focus",
    (event) => {
      event.target.closest(".field").classList.add("is-focused");
      active.textContent = event.target.name;
      track("focus", event, {
        relatedTarget: describe(event.relatedTarget), // el elemento que perdió el foco
        activeElement: describe(document.activeElement),
      });
    },
    true,
  );

  form.addEventListener(
    "blur",
    (event) => {
      event.target.closest(".field").classList.remove("is-focused");
      active.textContent = "ninguno";
      track("focus", event, {
        relatedTarget: describe(event.relatedTarget), // el elemento que recibirá el foco
        activeElement: describe(document.activeElement), // durante blur aún es <body>
      });
    },
    true,
  );
}

/* ---------- keydown / keyup ---------- */
{
  const pad = $("#key-pad");
  const cap = $("#key-cap");
  const keyOutput = $("#key-key");
  const codeOutput = $("#key-code");
  const repeatOutput = $("#key-repeat");
  const mods = $$("[data-mod]", pad);
  const BLOCKED = [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"];

  function paint(event) {
    keyOutput.textContent = event.key === " " ? "(espacio)" : event.key;
    codeOutput.textContent = event.code;
    repeatOutput.textContent = event.repeat;
    mods.forEach((mod) => mod.classList.toggle("is-on", event[mod.dataset.mod]));
  }

  pad.addEventListener("keydown", (event) => {
    if (BLOCKED.includes(event.key)) event.preventDefault(); // evita que la página haga scroll
    cap.textContent = event.key === " " ? "␣" : event.key;
    cap.classList.add("is-down");
    paint(event);
    track("keyboard", event, { key: event.key, code: event.code, repeat: event.repeat, modifiers: modifiers(event) });
  });

  pad.addEventListener("keyup", (event) => {
    cap.classList.remove("is-down");
    paint(event);
    track("keyboard", event, { key: event.key, code: event.code, repeat: event.repeat, modifiers: modifiers(event) });
  });
}

/* ---------- submit (datos) ---------- */
{
  const form = $("#data-form");
  const result = $("#data-result");

  // Solo se dispara si el formulario pasó la validación (required, type="email")
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Con event.submitter, FormData incluye también el botón que envió el formulario
    const data = Object.fromEntries(new FormData(form, event.submitter));
    result.textContent = JSON.stringify(data, null, 2);

    track("submit-data", event, {
      submitter: event.submitter?.value ?? "—",
      fields: Object.keys(data).length,
      data,
    });

    if (event.submitter?.value === "new") form.reset();
  });
}

/* ---------- invalid ---------- */
{
  const form = $("#invalid-form");
  const custom = $("#invalid-custom");
  const status = $("#invalid-status");
  const FLAGS = ["valueMissing", "typeMismatch", "patternMismatch", "tooShort", "tooLong", "rangeUnderflow", "rangeOverflow", "stepMismatch", "badInput", "customError"];
  let focusTimer = 0;

  // invalid NO burbuja: se captura desde el formulario con true
  form.addEventListener(
    "invalid",
    (event) => {
      const control = event.target;
      const box = control.closest(".field");
      const support = $(".field__support", box);

      if (custom.checked) {
        event.preventDefault(); // oculta el globo nativo del navegador
        support.dataset.help ??= support.textContent; // guarda el texto de ayuda original
        box.classList.add("is-invalid");
        support.textContent = control.validationMessage;

        // Lleva el foco al primer campo inválido cuando termine la ronda de eventos
        clearTimeout(focusTimer);
        focusTimer = setTimeout(() => form.querySelector(":invalid")?.focus(), 0);
      }

      track("invalid", event, {
        validity: FLAGS.filter((flag) => control.validity[flag]).join(", "),
        validationMessage: control.validationMessage,
        defaultPrevented: event.defaultPrevented,
      });
      status.textContent = "Hay campos inválidos: submit NO se dispara.";
    },
    true,
  );

  // Al corregir un campo se limpia su error
  form.addEventListener("input", (event) => {
    const box = event.target.closest(".field");
    if (!box) return; // el interruptor de mensajes propios no está dentro de un .field
    const support = $(".field__support", box);
    box.classList.remove("is-invalid");
    if (support.dataset.help) support.textContent = support.dataset.help;
  });

  // Solo llega aquí cuando TODO es válido
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "✓ Todo válido: ahora sí se disparó submit.";
    trace("invalid", "submit", { note: "solo ocurre si no hubo invalid" });
  });

  // checkValidity() dispara invalid en cada campo inválido, sin enviar
  $("#btn-check-validity").addEventListener("click", () => {
    const valid = form.checkValidity();
    if (valid) status.textContent = "checkValidity() = true: no hubo eventos invalid.";
  });
}

/* ---------- dragstart / dragover / drop ---------- */
{
  const board = $("#drag-board");
  const zones = $$(".dropzone", board);
  const fileList = $("#drag-files");
  const fileHint = $("#drag-files-hint");
  const accepts = (event, zone) => event.dataTransfer.types.includes(zone.dataset.accepts);

  // dragstart burbuja: un listener en el tablero atiende a todas las fichas
  board.addEventListener("dragstart", (event) => {
    const chip = event.target.closest(".drag-chip");
    if (!chip) return;
    event.dataTransfer.setData("text/plain", chip.id); // el dato viaja con el arrastre
    event.dataTransfer.effectAllowed = "move";
    chip.classList.add("is-dragging");
    track("drag", event, { data: chip.id, effectAllowed: event.dataTransfer.effectAllowed });
  });

  board.addEventListener("dragend", () => {
    $$(".is-dragging", board).forEach((chip) => chip.classList.remove("is-dragging"));
    zones.forEach((zone) => zone.classList.remove("is-over"));
  });

  zones.forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      if (!accepts(event, zone)) return; // sin preventDefault el navegador rechaza soltar aquí
      event.preventDefault();
      event.dataTransfer.dropEffect = zone.dataset.accepts === "Files" ? "copy" : "move";
      zone.classList.add("is-over");
      track("drag", event, { zone: zone.dataset.zone, dropEffect: event.dataTransfer.dropEffect });
    });

    // dragleave también se dispara al pasar sobre los hijos: hay que descartar ese caso
    zone.addEventListener("dragleave", (event) => {
      if (!zone.contains(event.relatedTarget)) zone.classList.remove("is-over");
    });

    zone.addEventListener("drop", (event) => {
      if (!accepts(event, zone)) return;
      event.preventDefault(); // evita que el navegador abra el archivo soltado
      zone.classList.remove("is-over");

      const files = Array.from(event.dataTransfer.files);
      const id = event.dataTransfer.getData("text/plain");

      if (zone.dataset.zone === "files") {
        fileHint.hidden = files.length > 0;
        fileList.replaceChildren(
          ...files.map((file) => {
            const item = document.createElement("li");
            item.textContent = `${file.name} · ${(file.size / 1024).toFixed(1)} KB`;
            return item;
          }),
        );
      } else {
        const chip = document.getElementById(id);
        if (chip) $(".dropzone__items", zone).append(chip);
      }

      track("drag", event, { zone: zone.dataset.zone, data: id || "—", files: files.length });
    });
  });
}

/* ---------- paste ---------- */
{
  const field = $("#paste-field");
  const upper = $("#paste-upper");
  const preview = $("#paste-preview");
  let imageUrl = "";

  field.addEventListener("paste", (event) => {
    const clipboard = event.clipboardData;
    const text = clipboard.getData("text");
    const image = Array.from(clipboard.files).find((file) => file.type.startsWith("image/"));
    const transform = upper.checked && text !== "";

    if (transform) {
      event.preventDefault(); // cancela el pegado normal y lo hacemos nosotros
      field.setRangeText(text.toUpperCase(), field.selectionStart, field.selectionEnd, "end");
    }

    // Vista previa de lo pegado
    URL.revokeObjectURL(imageUrl);
    if (image) {
      imageUrl = URL.createObjectURL(image);
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "Imagen pegada";
      preview.replaceChildren(img, document.createTextNode(`${image.type} · ${(image.size / 1024).toFixed(1)} KB`));
    } else {
      preview.textContent = text ? `Texto pegado (${text.length} caracteres): «${text.slice(0, 120)}»` : "El portapapeles no trae texto ni imágenes.";
    }

    track("paste", event, {
      types: Array.from(clipboard.types).join(", ") || "—",
      characters: text.length,
      files: clipboard.files.length,
      transformed: transform ? "MAYÚSCULAS" : "no",
    });
  });
}

/* ---------- abort ---------- */
{
  const bar = $("#abort-bar");
  const status = $("#abort-status");
  const start = $("#btn-abort-start");
  const cancel = $("#btn-abort-cancel");
  let controller = null;
  let timer = 0;
  let progress = 0;

  start.addEventListener("click", () => {
    controller = new AbortController();
    const { signal } = controller;
    progress = 0;
    bar.style.setProperty("--v", 0);
    status.textContent = "Descargando… 0 %";
    start.disabled = true;
    cancel.disabled = false;

    // abort se dispara en la señal cuando alguien llama a controller.abort()
    signal.addEventListener("abort", (event) => {
      clearInterval(timer);
      status.textContent = `Cancelada al ${progress} %: se disparó abort, no error.`;
      start.disabled = false;
      cancel.disabled = true;
      track("abort", event, { source: "AbortSignal", progress: `${progress} %`, reason: signal.reason?.name });
    });

    timer = setInterval(() => {
      progress += 2;
      bar.style.setProperty("--v", progress);
      status.textContent = `Descargando… ${progress} %`;
      if (progress >= 100) {
        clearInterval(timer);
        status.textContent = "Descarga completa: si nadie cancela, abort no se dispara.";
        start.disabled = false;
        cancel.disabled = true;
      }
    }, 100);
  });

  cancel.addEventListener("click", () => controller.abort());

  // FileReader también emite abort cuando se cancela la lectura
  $("#btn-abort-reader").addEventListener("click", () => {
    const reader = new FileReader();
    reader.addEventListener("abort", (event) => {
      track("abort", event, { source: "FileReader", readyState: reader.readyState, loaded: event.loaded });
    });
    reader.readAsText(new Blob(["contenido de ejemplo"]));
    reader.abort();
  });
}

/* ---------- error ---------- */
{
  const image = $("#error-img");
  const status = $("#error-status");
  const FALLBACK =
    "data:image/svg+xml," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='320' height='200' fill='#e6b8b5'/><path d='M120 126l26-32 20 24 14-16 30 24z' fill='#b3261e'/><text x='160' y='160' font-family='sans-serif' font-size='16' text-anchor='middle' fill='#b3261e'>Sin imagen</text></svg>",
    );

  // Recurso que falla: el evento llega al propio <img> (no burbujea)
  image.addEventListener("error", (event) => {
    if (image.dataset.failed) return; // evita un bucle si la alternativa también fallara
    image.dataset.failed = "true";
    track("error", event, { source: "img", src: image.getAttribute("src") });
    status.textContent = "El recurso no se pudo cargar: se muestra la imagen alternativa.";
    image.src = FALLBACK;
  });

  $("#btn-error-img").addEventListener("click", () => {
    delete image.dataset.failed;
    status.textContent = "Cargando una imagen que no existe…";
    image.src = `img/no-existe.png?${Date.now()}`;
  });

  // Excepción sin capturar: el evento llega a window como ErrorEvent
  window.addEventListener("error", (event) => {
    track("error", event, {
      source: "window",
      message: event.message,
      filename: (event.filename || "").split("/").pop(),
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  $("#btn-error-throw").addEventListener("click", () => {
    setTimeout(() => {
      throw new Error("Excepción de ejemplo lanzada a propósito");
    }, 0);
  });
}

/* ---------- load (recursos) ---------- */
{
  const thumb = $("#load-thumb");
  const image = $("#load-img");
  const file = $("#load-file");

  const randomImage = () => {
    const hue = Math.floor(Math.random() * 360);
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'>` +
      `<rect width='320' height='200' fill='hsl(${hue} 70% 55%)'/>` +
      `<circle cx='238' cy='66' r='30' fill='hsl(${(hue + 40) % 360} 80% 88%)'/>` +
      `<path d='M0 200 L110 92 L190 168 L250 118 L320 200Z' fill='hsl(${hue} 60% 32%)'/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  // 1) Primero el listener…
  image.addEventListener("load", (event) => {
    thumb.classList.remove("is-loading");
    track("load-resource", event, {
      source: "img",
      naturalSize: `${image.naturalWidth} × ${image.naturalHeight}`,
      complete: image.complete,
    });
  });
  image.addEventListener("error", () => thumb.classList.remove("is-loading"));

  // 2) …y después se asigna el src
  $("#btn-load-image").addEventListener("click", () => {
    thumb.classList.add("is-loading");
    setTimeout(() => {
      image.src = randomImage();
    }, 600);
  });

  file.addEventListener("change", () => {
    const chosen = file.files[0];
    if (!chosen) return;

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      track("load-resource", event, { source: "FileReader", file: chosen.name, loaded: event.loaded });
      image.src = reader.result; // esto dispara el load del <img>
    });
    thumb.classList.add("is-loading");
    reader.readAsDataURL(chosen);
    file.value = ""; // permite elegir el mismo archivo otra vez
  });
}

/* ---------- visibilitychange ---------- */
{
  const state = $("#visibility-state");
  const label = $(".vis__label", state);
  const count = $("#visibility-count");
  const time = $("#visibility-time");
  let hiddenAt = 0;
  let hiddenTimes = 0;

  document.addEventListener("visibilitychange", (event) => {
    const props = { visibilityState: document.visibilityState, hidden: document.hidden };

    if (document.hidden) {
      hiddenAt = Date.now();
      hiddenTimes += 1;
      count.textContent = hiddenTimes;
    } else {
      const seconds = (Date.now() - hiddenAt) / 1000;
      time.textContent = `${seconds.toFixed(1)} s`;
      props.hiddenFor = `${seconds.toFixed(1)} s`;
    }

    state.dataset.state = document.visibilityState;
    label.textContent = document.hidden ? "oculta" : "visible";
    track("visibility", event, props);
  });
}
