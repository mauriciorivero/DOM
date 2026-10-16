/* ==========================================================================
   control-retos.js · Playground de eventos del DOM — versión con RETOS
   --------------------------------------------------------------------------
   Esta es la misma página que js/control.js, pero con los listeners VACÍOS.
   Tu tarea es escribirlos. No hace falta tocar el HTML ni el CSS.

   Cómo se usa
   -----------
   1. En index.html deja activo este archivo (y comenta control.js).
   2. Abre la página: verás los contadores en 0 y el registro vacío.
   3. Resuelve los retos EN ORDEN (van de básico a avanzado). Cada vez que
      un listener funcione, el contador de su tarjeta sube y el registro
      muestra el evento.
   4. Compara con js/control.js solo cuando ya lo hayas intentado.

   Herramientas que ya tienes (vienen de base.js)
   ----------------------------------------------
     $(selector)             document.querySelector
     $$(selector)            document.querySelectorAll, ya como Array
     describe(nodo)          texto corto de un elemento: "button#guardar.btn"
     modifiers(evento)       "Ctrl+Shift" o "ninguno"
     track(tarjeta, evento, { datos })
                             Avisa al playground: sube el contador, llena el
                             inspector y escribe en el registro.
                             · tarjeta = el data-card de la tarjeta (ver lista)
                             · evento  = el objeto event del listener
                             · datos   = lo que quieras mostrar en el inspector
     trace(tarjeta, "texto", { datos })
                             Anota en el registro una ACCIÓN que no es un evento
                             (por ejemplo "pushState()").

   Tarjetas (primer argumento de track)
   ------------------------------------
     Navegación: click · submit-nav · hashchange · popstate ·
                 domcontentloaded · load-window · beforeunload · scroll · resize
     Datos:      input · change · focus · keyboard · submit-data · invalid ·
                 drag · paste · abort · error · load-resource · visibility

   Si te equivocas de nombre, la consola del navegador (F12) te lo dirá.

   Convenciones: ids, clases y variables en inglés; comentarios en español.
   Las funciones marcadas "(ya hecha)" no hay que escribirlas.
   ========================================================================== */
"use strict";

// Muestra el aviso "Modo retos" y oculta el código de solución de las tarjetas
document.body.dataset.mode = "retos";

/* ==========================================================================
   SECCIÓN 1 · EVENTOS DE NAVEGACIÓN
   ========================================================================== */

/* ---------- Reto 1 · click (básico) ----------
   Tarjeta: "click"
   Elementos: #click-demo (contenedor con 3 botones y un recuadro), #click-pad

   Tarea
     1. Escucha "click" UNA sola vez, en #click-demo (delegación de eventos).
     2. Llama a track("click", event, { … }) con:
          currentTarget: describe(event.currentTarget)
          action:        el data-action del botón pulsado, o "—"
          clientX, clientY, button, detail
          modifiers:     modifiers(event)
     3. Si el clic fue dentro del recuadro (pad.contains(event.target)),
        llama a addRipple(event).

   Pista: event.target.closest("[data-action]")?.dataset.action
   Extra: pulsa dos veces seguidas y mira cómo cambia event.detail. */
{
  const demo = $("#click-demo");
  const pad = $("#click-pad");

  // (ya hecha) Onda de Material que nace en el punto del clic
  function addRipple(event) {
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

  // TODO 1: demo.addEventListener("click", (event) => { … });
}

/* ---------- Reto 2 · submit de navegación (básico) ----------
   Tarjeta: "submit-nav"
   Elementos: #nav-form, #nav-prevent (interruptor), #nav-form-result

   Tarea
     1. Escucha "submit" en el formulario.
     2. Si #nav-prevent está marcado, llama a event.preventDefault().
     3. Llama a track("submit-nav", event, { … }) con:
          defaultPrevented: event.defaultPrevented
          submitter:        describe(event.submitter)
          q:                form.elements.q.value
          result:           "se queda en la página" o "la página se recargará"
     4. Si el envío se canceló, escribe un mensaje en #nav-form-result.

   Prueba: con el interruptor apagado la página se recarga y la URL trae ?q=…
   Pista: event.defaultPrevented es true solo después de preventDefault(). */
{
  const form = $("#nav-form");
  const prevent = $("#nav-prevent");
  const result = $("#nav-form-result");

  // (ya hecho) Si la página se recargó por un envío sin preventDefault, la URL trae ?q=…
  const sent = new URLSearchParams(location.search).get("q");
  if (sent !== null) {
    form.elements.q.value = sent;
    result.textContent = `La página se recargó: el navegador navegó a ?q=${sent}. Eso pasa cuando no se llama a preventDefault().`;
  }

  // TODO 2: form.addEventListener("submit", (event) => { … });
}

/* ---------- Reto 3 · hashchange (básico) ----------
   Tarjeta: "hashchange"
   Elementos: .hash-link (3 enlaces), #btn-random-hash, #hash-view

   Tarea
     1. Escucha "hashchange" en window. Dentro: llama a renderView() y a
        track("hashchange", event, { oldURL, newURL, hash }).
          oldURL: new URL(event.oldURL).hash || "(sin hash)"
          newURL: igual con event.newURL
          hash:   location.hash
     2. Al hacer clic en #btn-random-hash, asigna location.hash a un valor
        nuevo (por ejemplo "#/ruta-42"). Verás que el evento también se dispara.

   Extra: observa en el registro que primero llega popstate y luego hashchange. */
{
  const links = $$(".hash-link");
  const view = $("#hash-view");
  const views = {
    "#/inicio": ["Inicio", "Página principal del sitio."],
    "#/perfil": ["Perfil", "Datos de la cuenta del usuario."],
    "#/ajustes": ["Ajustes", "Preferencias de la aplicación."],
  };

  // (ya hecha) Pinta la vista que corresponde a location.hash
  function renderView() {
    const known = views[location.hash];
    const [title, text] = known ?? (location.hash
      ? ["Ruta desconocida", `No hay una vista para «${location.hash}».`]
      : ["Vista", "Elige un enlace."]);
    $(".view__title", view).textContent = title;
    $(".view__text", view).textContent = text;
    links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === location.hash));
  }

  renderView();

  // TODO 3a: window.addEventListener("hashchange", (event) => { … });
  // TODO 3b: $("#btn-random-hash").addEventListener("click", () => { … });
}

/* ---------- Reto 4 · popstate (intermedio) ----------
   Tarjeta: "popstate"
   Elementos: #btn-push, #btn-back, #btn-forward (y el asistente de 4 pasos)

   Tarea
     1. #btn-push: suma 1 a step, llama a
          history.pushState({ step }, "", `?step=${step}`)
        y luego a renderStep(). Anota la acción con
          trace("popstate", "pushState()", { state: JSON.stringify({ step }), note: "no dispara popstate" })
     2. #btn-back y #btn-forward: history.back() e history.forward().
     3. Escucha "popstate" en window. Recupera el paso con
          step = event.state?.step ?? 1
        llama a renderStep() y a
          track("popstate", event, { state: JSON.stringify(event.state), step, historyLength: history.length })

   Pregunta para pensar: ¿por qué pushState no dispara popstate pero back() sí?
   Pista: state es null en la entrada inicial del historial. */
{
  const TOTAL = 4;
  const steps = $$(".stepper__step", $("#pop-stepper"));
  const label = $("#pop-label");
  const url = $("#pop-url");
  const push = $("#btn-push");
  let step = history.state?.step ?? 1;

  // (ya hecha) Pinta el asistente según el valor de step
  function renderStep() {
    steps.forEach((item, index) => {
      item.classList.toggle("is-done", index + 1 < step);
      item.classList.toggle("is-current", index + 1 === step);
    });
    label.textContent = `Paso ${step} de ${TOTAL}`;
    url.textContent = location.search || location.hash || "(sin cambios)";
    push.disabled = step >= TOTAL;
  }

  renderStep();

  // TODO 4a: push.addEventListener("click", () => { … });
  // TODO 4b: $("#btn-back") y $("#btn-forward")
  // TODO 4c: window.addEventListener("popstate", (event) => { … });
}

/* ---------- Retos 5 y 6 · DOMContentLoaded y load (intermedio) ----------
   Tarjetas: "domcontentloaded" y "load-window"
   Elementos: #dcl-state, #btn-late-dcl, #dcl-late-status, #load-timeline

   Importante: estos dos eventos ocurren UNA sola vez al cargar la página, así
   que los listeners deben registrarse mientras el script se ejecuta (aquí
   mismo). Para volver a verlos, recarga la página: el registro se conserva.

   Tarea
     Reto 5 · DOMContentLoaded
       Escucha "DOMContentLoaded" en document. Guarda marks.dcl =
       performance.now(), actualiza #dcl-state con document.readyState,
       llama a paintTimeline() y a
         track("domcontentloaded", event, { readyState: document.readyState,
                elapsed: `${Math.round(marks.dcl)} ms`, navigationType })
     Reto 6 · load
       Escucha "load" en window. Igual, con marks.load y la tarjeta
       "load-window". Agrega afterDOMContentLoaded: `+${Math.round(marks.load - marks.dcl)} ms`
     Extra del reto 5 · escucha tardía
       #btn-late-dcl: registra un listener de DOMContentLoaded (con
       { once: true }) y, a los 1500 ms, escribe en #dcl-late-status por qué
       nunca llegó. Pista: document.readyState.
       Usa trace("domcontentloaded", "addEventListener()", { note: "registrado tarde" }).

   Pregunta para pensar: ¿cuál llega primero y por qué? */
{
  const marks = { script: performance.now() };
  const navigationType = performance.getEntriesByType("navigation")[0]?.type ?? "navigate";

  // (ya hecha) Dibuja las tres barras de la línea de tiempo
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

  // TODO 5a: document.addEventListener("DOMContentLoaded", (event) => { … });
  // TODO 6: window.addEventListener("load", (event) => { … });
  // TODO 5b: $("#btn-late-dcl").addEventListener("click", () => { … });
}

/* ---------- Reto 7 · beforeunload (intermedio) ----------
   Tarjeta: "beforeunload"
   Elementos: #unload-toggle (interruptor), #unload-status

   Tarea
     1. Crea UNA función con nombre, warnBeforeLeaving(event), que llame a
        event.preventDefault(), asigne event.returnValue = "" y haga
          track("beforeunload", event, { defaultPrevented: event.defaultPrevented,
                 note: "el navegador mostrará su aviso" })
     2. Al cambiar el interruptor ("change"): si está marcado, registra la
        función con window.addEventListener("beforeunload", …); si no, quítala
        con window.removeEventListener(…). Actualiza #unload-status.
        Anota con trace("beforeunload", "addEventListener()" o "removeEventListener()").

   Prueba: arma el interruptor y pulsa "Recargar página" (o cierra la pestaña).
   Pista: removeEventListener solo funciona con la MISMA referencia de función,
          por eso no sirve una función anónima. */
{
  const toggle = $("#unload-toggle");
  const status = $("#unload-status");

  // TODO 7a: function warnBeforeLeaving(event) { … }
  // TODO 7b: toggle.addEventListener("change", () => { … });
}

/* ---------- Reto 8 · scroll (intermedio) ----------
   Tarjeta: "scroll"
   Elementos: #scroll-box (caja con scroll), #scroll-bar, #scroll-label, #scroll-page-label

   Tarea
     1. Escucha "scroll" en la CAJA (scroll no burbuja desde un elemento).
        Calcula el progreso con percent(box.scrollTop, box.scrollHeight - box.clientHeight),
        pinta la barra con bar.style.setProperty("--v", progress), escribe
        `Caja: ${progress} %` y llama a
          track("scroll", event, { scrollTop: Math.round(box.scrollTop), progress: `${progress} %` })
     2. Escucha "scroll" en window. Progreso: percent(scrollY, document.documentElement.scrollHeight - innerHeight).
          track("scroll", event, { scrollY: Math.round(scrollY), progress: `${progress} %` })
     3. En ambos usa la opción { passive: true }.

   Pregunta para pensar: en el de window, ¿por qué el target es "document"? */
{
  const box = $("#scroll-box");
  const bar = $("#scroll-bar");
  const boxLabel = $("#scroll-label");
  const pageLabel = $("#scroll-page-label");
  const percent = (position, max) => (max > 0 ? Math.round((position / max) * 100) : 0); // (ya hecha)

  // TODO 8a: box.addEventListener("scroll", (event) => { … }, { passive: true });
  // TODO 8b: window.addEventListener("scroll", (event) => { … }, { passive: true });
}

/* ---------- Reto 9 · resize (básico) ----------
   Tarjeta: "resize"
   Elementos: #resize-size, #resize-class, #resize-dpr, #resize-ruler

   Tarea
     1. Escucha "resize" en window. Dentro: llama a paint() y a
          track("resize", event, { innerWidth, innerHeight, sizeClass: sizeClass(innerWidth) })

   Prueba: arrastra el borde de la ventana. Mira cómo cambian las clases de
   tamaño de Material 3 (Compact, Medium, Expanded…).
   Extra: ¿cómo observarías el tamaño de UN elemento? Investiga ResizeObserver. */
{
  const size = $("#resize-size");
  const sizeClassChip = $("#resize-class");
  const dpr = $("#resize-dpr");
  const ruler = $("#resize-ruler");

  // (ya hecha) Clases de tamaño de ventana de Material 3
  const sizeClass = (width) =>
    width < 600 ? "Compact" : width < 840 ? "Medium" : width < 1200 ? "Expanded" : width < 1600 ? "Large" : "Extra-large";

  // (ya hecha) Muestra las medidas actuales
  function paint() {
    size.textContent = `${innerWidth} × ${innerHeight} px`;
    sizeClassChip.textContent = sizeClass(innerWidth);
    dpr.textContent = `devicePixelRatio ${devicePixelRatio}`;
    ruler.style.setProperty("--v", Math.min(100, (innerWidth / 1920) * 100));
  }

  paint();

  // TODO 9: window.addEventListener("resize", (event) => { … });
}

/* ==========================================================================
   SECCIÓN 2 · EVENTOS DE MANEJO DE DATOS
   ========================================================================== */

/* ---------- Reto 10 · input y change (básico) ----------
   Tarjeta: "input" (cuenta input y change a la vez)
   Elementos: #input-text, #input-counter, #input-echo, #input-range, #input-range-out

   Tarea
     1. "input" en #input-text: actualiza #input-counter con
        `${field.value.length} / ${field.maxLength}` y #input-echo (textContent),
        y llama a
          track("input", event, { inputType: event.inputType, data: event.data,
                 value: field.value, length: field.value.length })
     2. "change" en #input-text: track("input", event, { value: field.value }).
        Observa cuántos input llegan por cada change.
     3. "input" en #input-range: copia range.value a rangeOutput.value y llama a track.

   Pregunta para pensar: ¿cuándo se dispara change en un campo de texto?
   Extra: escribe, pega (Ctrl+V) y borra: ¿cómo cambia event.inputType? */
{
  const field = $("#input-text");
  const counter = $("#input-counter");
  const echo = $("#input-echo");
  const range = $("#input-range");
  const rangeOutput = $("#input-range-out");

  // TODO 10a: field.addEventListener("input", (event) => { … });
  // TODO 10b: field.addEventListener("change", (event) => { … });
  // TODO 10c: range.addEventListener("input", (event) => { … });
}

/* ---------- Reto 11 · change con delegación (intermedio) ----------
   Tarjeta: "change"
   Elementos: #change-form (select, interruptor, 2 radios), #change-summary

   Tarea
     1. UN solo listener de "change" en el formulario (change burbuja).
     2. Dentro: llama a paint() y a
          track("change", event, { name: control.name, value: control.value,
                 checked: control.type === "checkbox" || control.type === "radio" ? control.checked : "—" })
        donde control = event.target.

   Pregunta para pensar: ¿qué cambiaría si pusieras un listener por cada control? */
{
  const form = $("#change-form");
  const summary = $("#change-summary");

  // (ya hecha) Resumen de lo elegido, con FormData
  function paint() {
    const data = new FormData(form);
    summary.textContent = `Plan: ${data.get("plan")} · Novedades: ${data.has("news") ? "sí" : "no"} · Entrega: ${data.get("delivery")}`;
  }

  paint();

  // TODO 11: form.addEventListener("change", (event) => { … });
}

/* ---------- Reto 12 · focus y blur (intermedio) ----------
   Tarjeta: "focus" (cuenta focus y blur)
   Elementos: #focus-form (3 campos), #focus-active

   Tarea
     1. focus y blur NO burbujean. Escúchalos en el formulario usando la fase de
        captura: form.addEventListener("focus", handler, true).
     2. En focus: agrega la clase "is-focused" al .field más cercano
        (event.target.closest(".field")), escribe event.target.name en
        #focus-active y llama a
          track("focus", event, { relatedTarget: describe(event.relatedTarget),
                 activeElement: describe(document.activeElement) })
     3. En blur: quita la clase, escribe "ninguno" y llama también a track("focus", …).
        (El primer argumento es la TARJETA "focus"; el tipo "blur" lo toma del evento.)

   Pregunta para pensar: durante blur, ¿qué es document.activeElement? ¿Y relatedTarget?
   Extra: prueba con "focusin" y "focusout" sin captura: ¿qué cambia? */
{
  const form = $("#focus-form");
  const active = $("#focus-active");

  // TODO 12a: form.addEventListener("focus", (event) => { … }, true);
  // TODO 12b: form.addEventListener("blur", (event) => { … }, true);
}

/* ---------- Reto 13 · keydown y keyup (intermedio) ----------
   Tarjeta: "keyboard" (cuenta keydown y keyup)
   Elementos: #key-pad (zona enfocable), #key-cap (tecla grande), .mod (modificadores)

   Tarea
     1. "keydown" en #key-pad: si event.key está en BLOCKED, llama a
        event.preventDefault() (evita que la página haga scroll). Pon el texto de
        la tecla en cap (␣ para el espacio), agrega la clase "is-down", llama a
        paint(event) y a
          track("keyboard", event, { key: event.key, code: event.code,
                 repeat: event.repeat, modifiers: modifiers(event) })
     2. "keyup" en #key-pad: quita "is-down", llama a paint(event) y a track igual.

   Prueba: mantén una tecla pulsada y mira repeat. Prueba Shift, Ctrl, Alt y Meta.
   Extra: detecta el atajo Ctrl + K y escribe un trace("keyboard", "atajo Ctrl+K"). */
{
  const pad = $("#key-pad");
  const cap = $("#key-cap");
  const keyOutput = $("#key-key");
  const codeOutput = $("#key-code");
  const repeatOutput = $("#key-repeat");
  const mods = $$("[data-mod]", pad);
  const BLOCKED = [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"];

  // (ya hecha) Muestra key, code, repeat y enciende los modificadores activos
  function paint(event) {
    keyOutput.textContent = event.key === " " ? "(espacio)" : event.key;
    codeOutput.textContent = event.code;
    repeatOutput.textContent = event.repeat;
    mods.forEach((mod) => mod.classList.toggle("is-on", event[mod.dataset.mod]));
  }

  // TODO 13a: pad.addEventListener("keydown", (event) => { … });
  // TODO 13b: pad.addEventListener("keyup", (event) => { … });
}

/* ---------- Reto 14 · submit de datos (intermedio) ----------
   Tarjeta: "submit-data"
   Elementos: #data-form, #data-result (resultado), botones "Guardar" y "Guardar y nuevo"

   Tarea
     1. Escucha "submit" en el formulario y llama a event.preventDefault().
     2. Lee los datos: Object.fromEntries(new FormData(form, event.submitter)).
        Muéstralos en #data-result con JSON.stringify(data, null, 2).
     3. track("submit-data", event, { submitter: event.submitter?.value ?? "—",
              fields: Object.keys(data).length, data })
     4. Si el botón fue "Guardar y nuevo" (event.submitter.value === "new"),
        limpia el formulario con form.reset().

   Prueba: con campos obligatorios vacíos el evento NO se dispara. ¿Por qué?
   Pista: el segundo argumento de FormData es el botón que envió el formulario. */
{
  const form = $("#data-form");
  const result = $("#data-result");

  // TODO 14: form.addEventListener("submit", (event) => { … });
}

/* ---------- Reto 15 · invalid (avanzado) ----------
   Tarjeta: "invalid"
   Elementos: #invalid-form, #invalid-custom (interruptor), #btn-check-validity, #invalid-status

   Tarea
     1. invalid NO burbuja: escúchalo en el formulario con captura (true).
     2. Si #invalid-custom está marcado: event.preventDefault() (oculta el globo
        nativo) y llama a showError(event.target).
     3. Siempre: track("invalid", event, { validity: activeFlags(control), validationMessage:
        control.validationMessage, defaultPrevented: event.defaultPrevented })
     4. "input" en el formulario: llama a clearError(event.target) para limpiar el error al corregir.
     5. "submit" en el formulario: event.preventDefault(), muestra
        "✓ Todo válido: ahora sí se disparó submit." en #invalid-status y anota
        trace("invalid", "submit", { note: "solo ocurre si no hubo invalid" }).
     6. #btn-check-validity: llama a form.checkValidity() (dispara invalid sin enviar).

   Pregunta para pensar: mientras haya campos inválidos, ¿se dispara submit? */
{
  const form = $("#invalid-form");
  const custom = $("#invalid-custom");
  const status = $("#invalid-status");
  const FLAGS = ["valueMissing", "typeMismatch", "patternMismatch", "tooShort", "tooLong", "rangeUnderflow", "rangeOverflow", "stepMismatch", "badInput", "customError"];
  let focusTimer = 0;

  // (ya hecha) Lista las banderas de validity que están activas en un campo
  const activeFlags = (control) => FLAGS.filter((flag) => control.validity[flag]).join(", ");

  // (ya hecha) Marca el campo como inválido y escribe el mensaje del navegador
  function showError(control) {
    const box = control.closest(".field");
    const support = $(".field__support", box);
    support.dataset.help ??= support.textContent;
    box.classList.add("is-invalid");
    support.textContent = control.validationMessage;
    clearTimeout(focusTimer);
    focusTimer = setTimeout(() => form.querySelector(":invalid")?.focus(), 0); // foco al primer inválido
  }

  // (ya hecha) Quita el error de un campo y devuelve su texto de ayuda
  function clearError(control) {
    const box = control.closest(".field");
    if (!box) return; // el interruptor no está dentro de un .field
    const support = $(".field__support", box);
    box.classList.remove("is-invalid");
    if (support.dataset.help) support.textContent = support.dataset.help;
  }

  // TODO 15a: form.addEventListener("invalid", (event) => { … }, true);
  // TODO 15b: form.addEventListener("input", (event) => { … });
  // TODO 15c: form.addEventListener("submit", (event) => { … });
  // TODO 15d: $("#btn-check-validity").addEventListener("click", () => { … });
}

/* ---------- Reto 16 · dragstart, dragover y drop (avanzado) ----------
   Tarjeta: "drag" (cuenta dragstart, dragover y drop)
   Elementos: #drag-board, .dropzone (data-zone, data-accepts), .drag-chip

   Tarea
     1. "dragstart" en #drag-board (burbuja). Si event.target.closest(".drag-chip"):
        event.dataTransfer.setData("text/plain", chip.id), effectAllowed = "move",
        clase "is-dragging" y
          track("drag", event, { data: chip.id, effectAllowed: event.dataTransfer.effectAllowed })
     2. "dragend" en el tablero: llama a cleanUp().
     3. En CADA zona (zones.forEach):
        · "dragover": si accepts(event, zone) es falso, no hagas nada. Si es
          verdadero: event.preventDefault() (¡obligatorio para poder soltar!),
          dropEffect = "move" (o "copy" para archivos), clase "is-over" y
            track("drag", event, { zone: zone.dataset.zone, dropEffect: event.dataTransfer.dropEffect })
        · "dragleave": quita "is-over" solo si la salida no es hacia un hijo
          (zone.contains(event.relatedTarget)).
        · "drop": si accepts(event, zone): event.preventDefault(); quita "is-over";
          si la zona es "files" llama a renderFiles(files); si no, moveChip(zone, id).
            track("drag", event, { zone: zone.dataset.zone, data: id || "—", files: files.length })

   Prueba: arrastra una ficha a "Hecho". Luego quita el preventDefault de dragover
   y observa que drop deja de dispararse. También arrastra un archivo de tu escritorio.
   Pista: files = Array.from(event.dataTransfer.files); id = event.dataTransfer.getData("text/plain") */
{
  const board = $("#drag-board");
  const zones = $$(".dropzone", board);
  const fileList = $("#drag-files");
  const fileHint = $("#drag-files-hint");

  // (ya hecha) ¿La zona acepta lo que se está arrastrando? ("text/plain" o "Files")
  const accepts = (event, zone) => event.dataTransfer.types.includes(zone.dataset.accepts);

  // (ya hecha) Quita los estados visuales de arrastre
  function cleanUp() {
    $$(".is-dragging", board).forEach((chip) => chip.classList.remove("is-dragging"));
    zones.forEach((zone) => zone.classList.remove("is-over"));
  }

  // (ya hecha) Lista los archivos soltados en la zona "Archivos"
  function renderFiles(files) {
    fileHint.hidden = files.length > 0;
    fileList.replaceChildren(
      ...files.map((file) => {
        const item = document.createElement("li");
        item.textContent = `${file.name} · ${(file.size / 1024).toFixed(1)} KB`;
        return item;
      }),
    );
  }

  // (ya hecha) Mueve una ficha a una zona de tareas
  function moveChip(zone, id) {
    const chip = document.getElementById(id);
    if (chip) $(".dropzone__items", zone).append(chip);
  }

  // TODO 16a: board.addEventListener("dragstart", (event) => { … });
  // TODO 16b: board.addEventListener("dragend", cleanUp);
  // TODO 16c: zones.forEach((zone) => { dragover, dragleave y drop });
}

/* ---------- Reto 17 · paste (intermedio) ----------
   Tarjeta: "paste"
   Elementos: #paste-field (textarea), #paste-upper (interruptor), #paste-preview

   Tarea
     1. Escucha "paste" en #paste-field. Lee el portapapeles con event.clipboardData:
          text  = clipboard.getData("text")
          image = Array.from(clipboard.files).find((file) => file.type.startsWith("image/"))
     2. Si #paste-upper está marcado y hay texto: event.preventDefault() y escribe
        el texto en MAYÚSCULAS tú mismo con
          field.setRangeText(text.toUpperCase(), field.selectionStart, field.selectionEnd, "end")
     3. Llama a showPreview(text, image) para mostrar lo pegado.
     4. track("paste", event, { types: Array.from(clipboard.types).join(", ") || "—",
              characters: text.length, files: clipboard.files.length,
              transformed: transform ? "MAYÚSCULAS" : "no" })

   Prueba: pega texto; luego copia una captura de pantalla y pégala.
   Pregunta para pensar: ¿por qué hay que cancelar el pegado nativo para transformarlo? */
{
  const field = $("#paste-field");
  const upper = $("#paste-upper");
  const preview = $("#paste-preview");
  let imageUrl = "";

  // (ya hecha) Muestra el texto o la imagen pegados
  function showPreview(text, image) {
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
  }

  // TODO 17: field.addEventListener("paste", (event) => { … });
}

/* ---------- Reto 18 · abort (avanzado) ----------
   Tarjeta: "abort"
   Elementos: #btn-abort-start, #btn-abort-cancel, #btn-abort-reader, #abort-bar, #abort-status

   Tarea
     1. #btn-abort-start: crea un AbortController y guarda su signal. Pon
        start.disabled = true y cancel.disabled = false. Inicia la descarga con
        fakeDownload({ onProgress, onDone }) (ya hecha) y guarda la función que
        devuelve (stop).
          · onProgress(value): progress = value; paintProgress(value)
          · onDone(): texto "Descarga completa…" y restablece los botones
     2. signal.addEventListener("abort", (event) => { … }): llama a stop(), escribe en
        #abort-status "Cancelada al X %", restablece los botones y llama a
          track("abort", event, { source: "AbortSignal", progress: `${progress} %`,
                 reason: signal.reason?.name })
     3. #btn-abort-cancel: controller.abort().
     4. #btn-abort-reader: crea un FileReader, escucha "abort" (track con
        source: "FileReader", readyState: reader.readyState, loaded: event.loaded),
        llama a reader.readAsText(new Blob(["contenido de ejemplo"])) y enseguida a reader.abort().

   Pregunta para pensar: ¿en qué se diferencia abort de error?
   Pista: en la señal, abort se dispara cuando alguien llama a controller.abort(). */
{
  const bar = $("#abort-bar");
  const status = $("#abort-status");
  const start = $("#btn-abort-start");
  const cancel = $("#btn-abort-cancel");
  let controller = null;
  let progress = 0;

  // (ya hecha) Mueve la barra de progreso
  const paintProgress = (value) => {
    bar.style.setProperty("--v", value);
    status.textContent = `Descargando… ${value} %`;
  };

  // (ya hecha) Descarga simulada de 5 s: avisa el progreso cada 100 ms. Devuelve stop().
  function fakeDownload({ onProgress, onDone }) {
    let value = 0;
    const timer = setInterval(() => {
      value += 2;
      onProgress(value);
      if (value >= 100) {
        clearInterval(timer);
        onDone();
      }
    }, 100);
    return () => clearInterval(timer);
  }

  // TODO 18a: start.addEventListener("click", () => { … });
  // TODO 18b: cancel.addEventListener("click", () => { … });
  // TODO 18c: $("#btn-abort-reader").addEventListener("click", () => { … });
}

/* ---------- Reto 19 · error (intermedio) ----------
   Tarjeta: "error"
   Elementos: #error-img, #btn-error-img, #btn-error-throw, #error-status

   Tarea
     1. "error" en #error-img (el evento va al propio <img> y no burbuja):
        si image.dataset.failed ya existe, no hagas nada (evita bucles); si no,
        márcalo, llama a
          track("error", event, { source: "img", src: image.getAttribute("src") })
        y asigna image.src = FALLBACK.
     2. #btn-error-img: borra image.dataset.failed y asigna una imagen que no
        existe, por ejemplo `img/no-existe.png?${Date.now()}`.
     3. "error" en window (excepciones sin capturar). Es un ErrorEvent:
          track("error", event, { source: "window", message: event.message,
                 filename: (event.filename || "").split("/").pop(),
                 lineno: event.lineno, colno: event.colno })
     4. #btn-error-throw: lanza una excepción SIN capturar. Hazlo dentro de un
        setTimeout para que no ocurra dentro del propio clic:
          setTimeout(() => { throw new Error("Excepción de ejemplo"); }, 0)

   Pregunta para pensar: ¿por qué evitamos el bucle con dataset.failed?
   Extra: ¿qué pasa si en window usas la fase de captura (true)? */
{
  const image = $("#error-img");
  const status = $("#error-status");

  // (ya hecha) Imagen alternativa en formato data: URL
  const FALLBACK =
    "data:image/svg+xml," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='320' height='200' fill='#e6b8b5'/><path d='M120 126l26-32 20 24 14-16 30 24z' fill='#b3261e'/><text x='160' y='160' font-family='sans-serif' font-size='16' text-anchor='middle' fill='#b3261e'>Sin imagen</text></svg>",
    );

  // TODO 19a: image.addEventListener("error", (event) => { … });
  // TODO 19b: $("#btn-error-img").addEventListener("click", () => { … });
  // TODO 19c: window.addEventListener("error", (event) => { … });
  // TODO 19d: $("#btn-error-throw").addEventListener("click", () => { … });
}

/* ---------- Reto 20 · load de recursos (intermedio) ----------
   Tarjeta: "load-resource"
   Elementos: #load-thumb, #load-img, #btn-load-image, #load-file

   Tarea
     1. "load" en #load-img: quita la clase "is-loading" de #load-thumb y llama a
          track("load-resource", event, { source: "img",
                 naturalSize: `${image.naturalWidth} × ${image.naturalHeight}`, complete: image.complete })
        IMPORTANTE: registra este listener ANTES de asignar src.
     2. #btn-load-image: agrega "is-loading" a #load-thumb y, a los 600 ms,
        asigna image.src = randomImage().
     3. "change" en #load-file: toma file.files[0], crea un FileReader y
        escucha su "load": track("load-resource", event, { source: "FileReader",
        file: chosen.name, loaded: event.loaded }) y luego image.src = reader.result.
        Inicia con reader.readAsDataURL(chosen).

   Pregunta para pensar: con un archivo ves DOS load. ¿De quién es cada uno?
   Extra: escucha también "error" en la imagen para quitar el "is-loading". */
{
  const thumb = $("#load-thumb");
  const image = $("#load-img");
  const file = $("#load-file");

  // (ya hecha) Imagen de colores aleatorios como data: URL
  const randomImage = () => {
    const hue = Math.floor(Math.random() * 360);
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'>` +
      `<rect width='320' height='200' fill='hsl(${hue} 70% 55%)'/>` +
      `<circle cx='238' cy='66' r='30' fill='hsl(${(hue + 40) % 360} 80% 88%)'/>` +
      `<path d='M0 200 L110 92 L190 168 L250 118 L320 200Z' fill='hsl(${hue} 60% 32%)'/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  // TODO 20a: image.addEventListener("load", (event) => { … });
  // TODO 20b: $("#btn-load-image").addEventListener("click", () => { … });
  // TODO 20c: file.addEventListener("change", () => { … });
}

/* ---------- Reto 21 · visibilitychange (básico) ----------
   Tarjeta: "visibility"
   Elementos: #visibility-state (con data-state), .vis__label, #visibility-count, #visibility-time

   Tarea
     1. Escucha "visibilitychange" en document (no en window).
     2. Arma props = { visibilityState: document.visibilityState, hidden: document.hidden }.
     3. Si la pestaña quedó oculta (document.hidden): guarda hiddenAt = Date.now(),
        suma 1 a hiddenTimes y escribe el total en #visibility-count.
        Si quedó visible: calcula los segundos ocultos, escríbelos en
        #visibility-time y agrégalos a props como hiddenFor.
     4. Actualiza state.dataset.state y el texto de .vis__label ("oculta" / "visible").
     5. track("visibility", event, props).

   Prueba: cambia de pestaña y regresa; el registro muestra ambos cambios con su hora.
   Pregunta para pensar: ¿por qué es mejor guardar un borrador aquí que en unload? */
{
  const state = $("#visibility-state");
  const label = $(".vis__label", state);
  const count = $("#visibility-count");
  const time = $("#visibility-time");
  let hiddenAt = 0;
  let hiddenTimes = 0;

  // TODO 21: document.addEventListener("visibilitychange", (event) => { … });
}
