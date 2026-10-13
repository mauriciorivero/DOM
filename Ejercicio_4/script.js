/* ==========================================================================
   Ejercicio 4 · Club Lentejuela — tu código JavaScript va aquí
   ==========================================================================

   Elementos con los que vas a trabajar
   ------------------------------------
   Eventos          #event-list con tarjetas .event-card.
                    Cada tarjeta guarda los datos en data-* (dataset):
                    title, date, time, artist, genre, cover, capacity,
                    reserved, vipTotal, vipFree, dressCode, poster,
                    description.

   Detalle          #event-detail (overlay del modal)
                    Campos: #event-poster (fondo: --poster), #event-genre,
                    #event-title, #event-capacity-pct, #event-date,
                    #event-time, #event-artist, #event-cover,
                    #event-description, #event-dress-code,
                    #event-capacity-text, #event-capacity-bar (ancho: --v),
                    mapas de mesas #zone-vip, #zone-dance, #zone-balcony
                    (cada mesa es un .spot; reservada = .is-reserved),
                    tabla #event-reservations (tbody).
                    Cerrar: #btn-close-event. Reservar: #btn-reserve-event.

   Formulario       #modal-new-reservation (overlay)
                    Abrir:  #btn-new-reservation y #btn-reserve-event
                    Cerrar: #btn-close-reservation, #btn-cancel-reservation
                    Formulario #new-reservation-form (campos #res-... y
                    radios name="zone"). Cuenta: #receipt-event,
                    #receipt-people, #receipt-cover, #receipt-package,
                    #receipt-total. Cada <option> de #res-package tiene
                    data-price.

   La clase .hidden (en styles.css) oculta cualquier elemento.
   La clase .is-selected marca la tarjeta activa.

   Retos
   -----
   1. Al iniciar, ocultar #event-detail y #modal-new-reservation.
   2. Clic en una tarjeta: mostrar el detalle con los datos del evento
      (textContent) y cambiar el fondo con style.setProperty("--poster", …).
   3. Calcular el porcentaje de aforo y mover la barra (--v).
   4. "Reservar para este evento": cerrar el detalle, abrir el formulario y
      dejar seleccionado ese evento en #res-event.
   5. Recalcular la cuenta cuando cambien el evento, las personas o el
      paquete (evento "input" / "change").
   6. Mostrar #res-birthday-name solo si #res-birthday está marcado.
   7. Validar que la persona sea mayor de 18 años con #res-birth.
   8. Al enviar: evitar la recarga y agregar la reserva a la tabla.
   9. Extra: crea un arreglo con las reservas de cada evento para llenar
      #event-reservations y pintar las mesas libres/reservadas.
   ========================================================================== */
