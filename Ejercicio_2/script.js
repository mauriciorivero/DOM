/* ==========================================================================
   Ejercicio 2 · Talenta — tu código JavaScript va aquí
   ==========================================================================

   Elementos con los que vas a trabajar
   ------------------------------------
   Lista            #employee-list (tbody) con filas .employee-row.
                    Cada fila guarda los datos completos en data-* (dataset):
                    name, role, department, status, email, phone, document,
                    city, hired, tenure, contract, salary, manager, mode,
                    score, quarters, skills, goalsDone, goalsTotal,
                    review, reviewAuthor, reviewDate.

   Panel            #employee-empty   -> mensaje "Selecciona un empleado"
                    #employee-detail  -> ficha completa del empleado
                    Campos: #detail-avatar, #detail-name, #detail-role,
                    #detail-department, #detail-status, #detail-document,
                    #detail-city, #detail-email, #detail-phone, #detail-mode,
                    #detail-hired, #detail-tenure, #detail-contract,
                    #detail-salary, #detail-manager, #detail-score,
                    #detail-rating, #detail-score-delta,
                    #quarter-bar-1..4 / #quarter-value-1..4  (alto: --v),
                    #skill-bar-1..4 / #skill-value-1..4      (ancho: --v),
                    #detail-goals-done, #detail-goals-total, #detail-goals-pct,
                    #detail-goals-bar, #detail-review, #detail-review-author,
                    #detail-review-date.
                    Botón para cerrar el detalle: #btn-close-detail.

   Modal            #modal-new-employee  (overlay + .modal)
                    Abrir:   #btn-new-employee
                    Cerrar:  #btn-close-modal, #btn-cancel-employee
                    Formulario: #new-employee-form (campos #emp-...)

   La clase .hidden (en styles.css) oculta cualquier elemento.
   La clase .is-selected marca la fila activa de la tabla.

   Retos
   -----
   1. Al iniciar, ocultar #employee-detail y #modal-new-employee.
   2. Clic en una fila: marcarla con .is-selected (y quitarla de las demás),
      ocultar #employee-empty y mostrar #employee-detail.
   3. Llenar el detalle con los datos de la fila (textContent) y mover las
      barras con style.setProperty("--v", valor).
   4. Dar formato al salario ($9.800.000) y a la fecha de ingreso.
   5. Botón "Nuevo empleado": abrir el modal; cancelar o cerrar: ocultarlo.
   6. Al enviar el formulario (submit): evitar la recarga, leer los campos y
      agregar una fila nueva a la tabla.
   7. Extra: filtrar la tabla con #search-employee, #filter-department y
      #filter-status.
   ========================================================================== */
