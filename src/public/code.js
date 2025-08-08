function verDetalles(id) {
    fetch('/verDetalles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })  // Enviamos el ID como JSON
    })
        .then(response => response.json())
        .then(data => {

            $('.js-modal1').addClass('show-modal1');

            // Mostrar datos del producto
            document.getElementById('js-name-detail').innerHTML = data.producto.name;
            document.getElementById('mtext-106 cl2').innerHTML = `$ ${data.producto.price}`;
            document.getElementById('descripcion').innerHTML = data.producto.description;
            document.getElementById('btnCarrito').innerHTML = `
                     <button class="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04" onclick="addtocar('${data.producto._id}', '${data.producto.image.urlImagen}', event)">
                       Add to Car </button>
        `;

            // Generar carrusel con las imágenes del producto
            const contenedor = document.getElementById("contenedorCarrusel");
            contenedor.innerHTML = ""; // Limpiar carrusel anterior

            let indicadores = "";
            let items = "";

            data.producto.image.forEach((imgObj, i) => {
                const activo = i === 0 ? 'active' : '';
                indicadores += `
                <li data-target="#carouselExampleControls" data-slide-to="${i}" class="${activo}"></li>
            `;
                items += `
                <div class="carousel-item ${activo}">
                    <img src="${imgObj.urlImagen}" class="img-carousel" style="width: 100%; height: 500px;" alt="Imagen ${i}">
                </div>
            `;
            });

            // Construir el HTML del carrusel
            const carruselHTML = `
            <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                    ${indicadores}
                </ol>
                <div class="carousel-inner" style="height: 100%;">
                    ${items}
                </div>
                <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        `;

            contenedor.innerHTML = carruselHTML;

        })
        .catch(error => {
            console.error('Error al cargar los detalles del producto:', error);
        });
}
