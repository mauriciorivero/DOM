# Proyecto 1 · Manipulación del DOM

Nueve interfaces de negocio construidas **solo con HTML y CSS**. La tarea es darles vida con **JavaScript puro** manipulando el DOM: mostrar y ocultar secciones, llenar fichas de detalle con datos, responder a clics y formularios, y calcular valores.

Cada ejercicio tiene un estilo visual diferente para que, además del DOM, se puedan estudiar tendencias de diseño de interfaces.

---

## Cómo empezar

1. Abre la carpeta del ejercicio y luego `index.html` en el navegador (doble clic o la extensión *Live Server* de VS Code).
2. Lee el comentario al inicio de `index.html` y el de `script.js`: ahí están la tarea, los elementos que vas a usar y los retos.
3. Escribe tu código en `script.js`. **No es necesario modificar el HTML ni el CSS.**

> Los ejercicios 4 a 9 cargan fuentes desde Google Fonts. Sin internet se ven con la fuente del sistema, pero funcionan igual.

```
DOM/
├── Ejercicio_1/   index.html · styles.css · script.js
├── Ejercicio_2/   …
└── Ejercicio_9/
```

---

## La regla de este proyecto: todo empieza visible

Para practicar, **cada sección que debería aparecer después de un clic ya está construida, con estilos y visible** al abrir la página: modales, paneles de detalle, pestañas, formularios… Por eso, la primera vez la página se ve "rota", con todo amontonado.

**El primer reto de cada ejercicio es ocultar lo necesario al iniciar** y mostrarlo solo cuando el usuario haga clic.

Herramientas que ya están listas en cada ejercicio:

| Herramienta | Para qué sirve | Ejemplo |
|---|---|---|
| Clase `.hidden` | Oculta cualquier elemento (`display: none`). | `modal.classList.add("hidden")` |
| Clases de estado | Marcan el elemento activo: `.is-selected`, `.is-active`. | `fila.classList.toggle("is-selected")` |
| Atributos `data-*` | Cada tarjeta o fila guarda **todos** sus datos. | `fila.dataset.salary` → `"9800000"` |
| Variable CSS `--v` | Controla el alto o ancho de barras y medidores (0 a 100). | `barra.style.setProperty("--v", 75)` |
| `id` en inglés | Cada elemento que vas a tocar tiene un `id` claro. | `#employee-detail`, `#btn-new-employee` |

La ficha de detalle trae datos **de ejemplo** (los del primer elemento de la lista) para que veas cómo debe quedar. Tu código debe reemplazarlos con los datos del elemento al que se le hace clic.

---

## Los ejercicios

| # | Negocio | Estilo visual | Clic principal → qué se muestra | Al iniciar hay que ocultar | Nivel |
|---|---|---|---|---|---|
| 1 | Fintech (finanzas personales) | Bento oscuro | Tarjeta del bento → modal con gráficos | Los 7 modales `#view-…` | Básico |
| 2 | Recursos humanos | Dashboard claro | Fila de empleado → ficha y desempeño | `#employee-detail`, `#modal-new-employee` | Intermedio |
| 3 | Renta de vehículos | Dashboard claro | Tarjeta de carro → panel lateral | `#car-detail`, `#drawer-scrim`, `#modal-new-rental` | Intermedio |
| 4 | Bar disco · reservas de eventos | **Kitsch** | Boleta de evento → detalle con mapa de mesas | `#event-detail`, `#modal-new-reservation` | Intermedio |
| 5 | E-commerce de moda urbana | **Neo-brutalismo** | Fila de producto → ficha con stock por talla | `#product-detail`, `#modal-new-product` | Intermedio |
| 6 | Parqueadero | **Plano industrial** | Espacio del mapa → detalle y cobro | `#level-2`, `#space-detail`, `#modal-new-entry` | Avanzado |
| 7 | Clínica odontológica | **Neumorfismo** | Cita de la agenda → ficha con odontograma | `#appointment-detail`, `#modal-new-appointment` | Avanzado |
| 8 | Agencia de viajes | **Material Design 3** | Paquete → diálogo con pestañas | `#package-detail`, `#modal-new-booking`, 2 de los 3 paneles de pestaña | Avanzado |
| 9 | Transporte y logística | **Glassmorfismo** | Guía de envío → seguimiento y ruta en el mapa | `#shipment-detail`, `#modal-new-shipment` | Avanzado |

Todos los ejercicios (menos el 1) incluyen además un **formulario en modal** para crear un registro nuevo (empleado, alquiler, reserva, producto, ingreso, cita, viaje o envío).

### Qué agrega cada nivel

- **Básico (1):** seleccionar elementos, escuchar clics y mostrar u ocultar con `classList`.
- **Intermedio (2 a 5):** leer `dataset`, llenar la ficha con `textContent`, mover barras con `style.setProperty`, abrir y cerrar modales, leer formularios con `submit` y `preventDefault`.
- **Avanzado (6 a 9):** convertir textos de `data-*` en elementos nuevos (`split` + `createElement`), pestañas, cálculos (tiempo, tarifas, totales), cambiar clases según el estado y actualizar vistas previas mientras se escribe.

---

## Conceptos del DOM que se practican

- **Seleccionar:** `getElementById`, `querySelector`, `querySelectorAll`
- **Eventos:** `click`, `input`, `change`, `submit`, `keydown` (tecla Escape)
- **Delegación de eventos:** un solo listener en el contenedor de la lista
- **Clases:** `classList.add`, `remove`, `toggle`, `contains`
- **Datos:** `element.dataset`
- **Contenido:** `textContent`, `innerHTML` (con cuidado), `createElement`, `append`, `replaceChildren`
- **Estilos:** `style.setProperty("--v", valor)`
- **Formularios:** `FormData`, `event.preventDefault()`, validación de campos
- **Formato:** `toLocaleString("es-CO")` para pesos y fechas

---

## Ruta sugerida

1. **Ejercicio 1:** solo mostrar y ocultar.
2. **Ejercicios 2 y 3:** leer datos de la fila o tarjeta y llenar la ficha.
3. **Ejercicios 4 y 5:** sumar cálculos y vistas previas en el formulario.
4. **Ejercicios 6 a 9:** construir elementos nuevos desde los datos y manejar varios estados a la vez.

Cada `script.js` trae una lista numerada de retos. Los marcados como **Extra** (filtros, buscadores) son opcionales.

---

## Convenciones

- **Interfaz en español**; **`id`, clases y nombres de `data-*` en inglés**, como en la documentación de JavaScript.
- Los `data-*` se escriben con guiones en HTML (`data-rate-day`) y se leen en camelCase en JavaScript (`dataset.rateDay`).
- Los números en `data-*` van sin formato (`9800000`, `4.6`): dales formato tú al mostrarlos.
- Las listas dentro de un `data-*` usan separadores: `|` entre elementos, `:` o `~` entre partes (el `script.js` de cada ejercicio explica el formato).
- La "hora actual" de cada ejercicio es el **13 de octubre de 2026** (en el parqueadero, las 18:42).

---

## Datos

Todos los nombres, empresas, documentos, placas y cifras son **ficticios** y están en pesos colombianos (COP). Se crearon solo con fines educativos.
