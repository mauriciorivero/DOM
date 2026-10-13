/* ==========================================================================
   Ejercicio 3 · Rodar — tu código JavaScript va aquí
   ==========================================================================

   Elementos con los que vas a trabajar
   ------------------------------------
   Flota            #fleet-grid con tarjetas .car-card.
                    Cada tarjeta guarda la información completa en data-*
                    (dataset): name, brand, model, year, plate, category,
                    color, colorHex, body, transmission, fuel, seats, bags,
                    km, branch, rateDay, rateWeek, rateMonth, status,
                    statusNote, revenueYear, occupancy, rating, reviews,
                    rentals, soat, techno, lastService, nextService,
                    lastServiceKm, nextServiceKm, monthly.
                    Filtros de estado: botones .filter con data-filter.

   Panel lateral    #car-detail  (aside)   y   #drawer-scrim (fondo oscuro)
                    Campos: #car-status, #car-image (la silueta: <use href>),
                    #car-category, #car-name, #car-plate, #car-status-note,
                    #car-branch, #car-rate-day, #car-rate-week,
                    #car-rate-month, #car-year, #car-color, #car-transmission,
                    #car-fuel, #car-seats, #car-bags, #car-km,
                    #car-plate-spec, #car-soat, #car-techno,
                    #car-last-service, #car-next-service, #car-service-left,
                    #car-service-pct, #car-service-bar (ancho: --v),
                    #car-revenue, #car-rentals, #car-occupancy,
                    #car-occupancy-bar, #car-rating, #car-reviews,
                    #car-month-bar-1..6 (alto: --v), #car-history (tbody).
                    Cerrar: #btn-close-detail o clic en #drawer-scrim.
                    El color del auto se cambia con --car en #car-media.

   Modal            #modal-new-rental  (overlay + .modal)
                    Abrir:   #btn-new-rental (encabezado) y
                             #btn-rent-this-car (dentro del panel)
                    Cerrar:  #btn-close-modal, #btn-cancel-rental
                    Formulario: #new-rental-form (campos #rent-...)
                    Resumen de costo: #summary-days, #summary-base,
                    #summary-insurance, #summary-extras, #summary-total.

   La clase .hidden (en styles.css) oculta cualquier elemento.
   La clase .is-selected marca la tarjeta activa de la flota.

   Retos
   -----
   1. Al iniciar, ocultar #car-detail, #drawer-scrim y #modal-new-rental.
   2. Clic en una tarjeta: marcarla con .is-selected, mostrar el panel y el
      fondo oscuro.
   3. Llenar el panel con los datos de la tarjeta (textContent), dar formato
      a precios y fechas, y mover las barras con style.setProperty("--v", n).
   4. Cambiar la insignia de estado (status-badge--available / --rented /
      --maintenance) y la silueta (#car-sedan, #car-suv, #car-pickup, #car-van).
   5. Botón "Nuevo alquiler con este vehículo": abrir el modal con ese
      vehículo ya seleccionado en #rent-car.
   6. Calcular el resumen: días entre #rent-start y #rent-end, tarifa, seguro
      y extras marcados.
   7. Al enviar el formulario (submit): evitar la recarga y leer los datos.
   8. Extra: filtrar tarjetas con los botones .filter y con #search-car.
   ========================================================================== */

document.getElementById("car-detail").style.display = "none";
document.getElementById("drawer-scrim").style.display = "none";
document.getElementById("modal-new-rental").style.display = "none";
