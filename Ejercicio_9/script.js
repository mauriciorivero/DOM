/* ==========================================================================
   Ejercicio 9 · Ruta Andina — tu código JavaScript va aquí
   ==========================================================================

   Elementos con los que vas a trabajar
   ------------------------------------
   Envíos           #shipment-list con tarjetas .shipment.
                    Datos en data-* (dataset): code, origin, destination,
                    route (id de la ruta en el mapa sin "route-"), status,
                    progress, eta, truck, driver, phone, cargo, weight,
                    volume, value, client, priority, temperature,
                    events ("fecha~texto~estado|…", estado = done /
                    current / pending).
                    Filtro: botones de .segmented (data-filter) y
                    #search-shipment.

   Mapa             Rutas <polyline class="map-route" id="route-BOG-BAQ">…
                    La ruta resaltada lleva la clase .is-active.
                    Camiones <circle class="map-truck" data-shipment="…">.

   Detalle          #shipment-detail (overlay)
                    Campos: #detail-code, #detail-route, #detail-client,
                    #detail-status, #detail-progress, #detail-eta,
                    #detail-progress-bar (ancho: --v), #detail-timeline
                    (ol con .event; clases .is-done / .is-current),
                    #detail-cargo, #detail-weight, #detail-volume,
                    #detail-value, #detail-priority, #detail-temp-row,
                    #detail-temperature, #detail-driver-initials,
                    #detail-driver, #detail-truck, #detail-phone.
                    Botones: #btn-close-detail, #btn-call-driver,
                    #btn-report-incident, #btn-share-tracking.

   Formulario       #modal-new-shipment (overlay)
                    Abrir: #btn-new-shipment · Cerrar: #btn-close-modal,
                    #btn-cancel-shipment · Formulario: #new-shipment-form
                    (campos #sh-…, radios name="priority").
                    Cotización: #quote-route, #quote-distance, #quote-base,
                    #quote-priority, #quote-insurance, #quote-eta,
                    #quote-total.

   Colores de estado (clases): st-transit, st-delayed, st-delivered,
   st-warehouse.
   La clase .hidden (en styles.css) oculta cualquier elemento.

   Retos
   -----
   1. Al iniciar, ocultar #shipment-detail y #modal-new-shipment.
   2. Clic en un envío: marcarlo con .is-selected, abrir el detalle y
      llenarlo con sus datos.
   3. Construir la línea de tiempo con createElement a partir de
      data-events (split("|") y split("~")).
   4. Mostrar #detail-temp-row solo si el envío tiene temperatura.
   5. Mapa: quitar .is-active de todas las rutas y ponerla en
      "route-" + data-route del envío elegido.
   6. Cambiar la clase de color del estado en #detail-status.
   7. Formulario: calcular la cotización (distancia × tarifa por km,
      recargo según el servicio y seguro del 0,5 %) y validar que el
      origen sea distinto del destino.
   8. Al enviar: agregar una nueva tarjeta de envío a la lista.
   9. Extra: filtrar por estado y por texto con el buscador.
   ========================================================================== */
