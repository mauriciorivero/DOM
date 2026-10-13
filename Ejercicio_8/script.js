/* ==========================================================================
   Ejercicio 8 · Rumbo Viajes — tu código JavaScript va aquí
   ==========================================================================

   Elementos con los que vas a trabajar
   ------------------------------------
   Catálogo         #package-list con tarjetas .package-card.
                    Datos en data-* (dataset): name, destination, type,
                    category, nights, price, childPrice, rating, reviews,
                    scene, media, includes ("a|b|c"), itinerary ("día 1|…"),
                    departures ("2026-10-23:24:30|…" = fecha:vendidos:cupos).
                    Filtros: chips .chip (data-filter) y #search-package.

   Detalle          #package-detail (scrim + diálogo)
                    Campos: #detail-hero (fondo: --media), #detail-scene
                    (<use href="#scene-…">), #detail-type, #detail-name,
                    #detail-destination, #detail-rating, #detail-duration,
                    #detail-price, #detail-child-price,
                    #detail-departure-count, #detail-includes (ul),
                    #detail-itinerary (ol), #detail-departures,
                    #detail-price-footer.
                    Pestañas .tab (data-tab = id del panel) y paneles
                    #tab-summary, #tab-itinerary, #tab-departures.
                    Botones: #btn-close-detail, #btn-share-package,
                    #btn-book-package.

   Formulario       #modal-new-booking (scrim + diálogo)
                    Abrir: FAB #btn-new-booking y #btn-book-package
                    Cerrar: #btn-close-booking, #btn-cancel-booking
                    Formulario #new-booking-form (campos #bk-…, radios
                    name="room" y name="payment"). Contadores: #bk-adults
                    y #bk-children con sus botones -minus / -plus.
                    Resumen: #sum-package, #sum-departure, #sum-adults,
                    #sum-children, #sum-insurance, #sum-total.

   La clase .hidden (en styles.css) oculta cualquier elemento.
   Clases de estado: .is-selected (tarjeta), .is-active (pestaña),
   .is-selected (chip).

   Retos
   -----
   1. Al iniciar, ocultar #package-detail, #modal-new-booking, y dejar
      visible solo #tab-summary.
   2. Clic en una tarjeta: abrir el detalle y llenarlo con sus datos.
   3. Construir con createElement las listas de "incluye", el itinerario y
      las salidas a partir de los textos separados por "|".
   4. Pestañas: mostrar solo el panel elegido y mover la clase .is-active.
   5. "Reservar este paquete": abrir el formulario con ese paquete elegido
      y llenar #bk-departure con sus salidas (deshabilitar las agotadas).
   6. Botones + / − de viajeros (mínimo 1 adulto, máximo 9).
   7. Recalcular el resumen: adultos × precio, niños × precio niño y seguro
      por viajero solo si #bk-insurance está activo.
   8. Al enviar: agregar la reserva a #recent-bookings.
   9. Extra: filtrar las tarjetas con los chips y el buscador.
   ========================================================================== */
