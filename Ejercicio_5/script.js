/* ==========================================================================
   Ejercicio 5 · Barrio Supply — tu código JavaScript va aquí
   ==========================================================================

   Elementos con los que vas a trabajar
   ------------------------------------
   Catálogo         #product-list (tbody) con filas .product-row.
                    Datos en data-* (dataset): name, sku, category, icon,
                    thumb, price, comparePrice, status, stock ("S:4,M:12"),
                    colors ("Negro|Gris"), colorHexes, sales30d,
                    revenue30d, returns, rating, weekly ("12,14,…"),
                    description.
                    Filtros: botones .tab (data-filter), #search-product,
                    #filter-category.

   Ficha            #product-empty  -> mensaje "Elige un producto"
                    #product-detail -> ficha completa
                    Campos: #detail-sku, #detail-thumb (fondo: --thumb),
                    #detail-status, #detail-icon (<use href="#i-…">),
                    #detail-price, #detail-name, #detail-category,
                    #detail-compare, #detail-stock-total, #size-stock
                    (cajas .size; vacía = .is-empty, baja = .is-low),
                    #detail-colors, #detail-sales, #detail-revenue,
                    #detail-returns, #detail-rating, #week-bar-1..6
                    (alto: --v), #detail-description.
                    Botones: #btn-close-detail, #btn-edit-product,
                    #btn-duplicate-product, #btn-archive-product.

   Modal            #modal-new-product (overlay)
                    Abrir: #btn-new-product · Cerrar: #btn-close-modal,
                    #btn-cancel-product · Formulario: #new-product-form
                    (campos #prod-…, checkboxes name="sizes" y
                    name="colors", radios name="status").
                    Vista previa: #preview-thumb, #preview-status,
                    #preview-category, #preview-name, #preview-price.

   La clase .hidden (en styles.css) oculta cualquier elemento.
   La clase .is-selected marca la fila activa.

   Retos
   -----
   1. Al iniciar, ocultar #product-detail y #modal-new-product.
   2. Clic en una fila: marcarla, ocultar #product-empty y mostrar la ficha.
   3. Convertir data-stock en cajas de talla con createElement y aplicar
      .is-empty (0 unidades) o .is-low (1 o 2 unidades).
   4. Crear los chips de color a partir de data-colors y data-color-hexes.
   5. Ocultar el "Precio antes" si data-compare-price es 0.
   6. Abrir y cerrar el modal; actualizar la vista previa con el evento
      "input" mientras se escribe.
   7. Al enviar: evitar la recarga y agregar una fila nueva al catálogo.
   8. Extra: filtrar con las pestañas .tab, el buscador y la categoría.
   ========================================================================== */
