/* ==========================================================================
   Ejercicio 7 · Sonríe — tu código JavaScript va aquí
   ==========================================================================

   Elementos con los que vas a trabajar
   ------------------------------------
   Agenda           #appointment-list con tarjetas .appointment.
                    Datos en data-* (dataset): start, end, duration,
                    patient, initials, age, document, phone, insurance,
                    procedure, dentist, room, price, status, teeth
                    ("16:filled,36:treatment"), plan, planDone, planTotal,
                    alert, lastVisit, notes.
                    Filtros: botones dentro de .status-filter (data-filter)
                    e interruptores .dentist-filter (value = odontólogo).
                    Calendario: botones .day (data-date) en #calendar.

   Ficha            #appointment-empty  -> mensaje "Selecciona una cita"
                    #appointment-detail -> ficha del paciente
                    Campos: #detail-initials, #detail-patient, #detail-age,
                    #detail-document, #detail-alert (+ #detail-alert-text),
                    #detail-status, #detail-procedure, #detail-time,
                    #detail-duration, #detail-dentist, #detail-room,
                    #detail-insurance, #detail-price, #detail-phone,
                    #odontogram (dientes .tooth con data-tooth), #detail-plan,
                    #detail-plan-done, #detail-plan-total, #detail-plan-bar
                    (ancho: --v), #detail-notes, #detail-last-visit.
                    Botones: #btn-close-detail, #btn-check-in,
                    #btn-reschedule, #btn-cancel-appointment.

   Modal            #modal-new-appointment (overlay)
                    Abrir: #btn-new-appointment · Cerrar: #btn-close-modal,
                    #btn-cancel-modal · Formulario: #new-appointment-form
                    (campos #apt-…, radios name="dentist" y name="slot").
                    Cada <option> de #apt-procedure tiene data-duration y
                    data-price. Resumen: #summary-dentist,
                    #summary-procedure, #summary-when, #summary-duration,
                    #summary-price.

   Estados del odontograma (clases): tooth--caries, tooth--filled,
   tooth--crown, tooth--treatment, tooth--missing.
   La clase .hidden (en styles.css) oculta cualquier elemento.
   La clase .is-selected marca la cita activa.

   Retos
   -----
   1. Al iniciar, ocultar #appointment-detail y #modal-new-appointment.
   2. Clic en una cita: marcarla, ocultar #appointment-empty y mostrar la
      ficha con sus datos.
   3. Ocultar #detail-alert cuando data-alert esté vacío.
   4. Pintar el odontograma: limpiar las clases de todos los .tooth y aplicar
      las que indique data-teeth.
   5. Cambiar la clase del estado (status--confirmed, status--pending, …).
   6. "Registrar llegada": cambiar el estado a "En consulta" en la tarjeta y
      en la ficha.
   7. Formulario: actualizar el resumen al elegir odontólogo, procedimiento y
      horario; al enviar, agregar la nueva cita a la agenda.
   8. Extra: filtrar la agenda por estado y por odontólogo.
   ========================================================================== */
