function addtocar(id) {
    const cantidad = document.getElementById('cantidad').value;

    fetch('/addtocar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, cantidad: cantidad })
    })
        .then(response => response.json())
        .then(data => {
            try {

                $('.js-modal1').removeClass('show-modal1');

                Swal.fire({
                    title: "Agregado al carrito!",
                    icon: "success",
                    draggable: true
                }).then((result) => {

                    // Cargar el carrito actualizado desde localStorage
                    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                    const existe = carrito.find(p => p.idProduc === data.idProduc);
                    if (existe) {

                        existe.cantidad = (parseInt(existe.cantidad) + parseInt(cantidad)).toString();

                    } else {

                        carrito.push(data);

                    }

                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    mostrarCarrito()
                });

            } catch (error) {
                console.log('Error guardando en el localStorage: ' + error)
            }

        })
        .catch(error => {
            console.error('Error al cargar los detalles del producto:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('carrito');
    const productos = JSON.parse(localStorage.getItem('carrito')) || [];
    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos en el carrito.</p>";

           document.getElementById('header-cart-content').style.display = 'none'

        return;
    }else{
        document.getElementById('header-cart-content').style.display = 'block'
    }

   
    const cantidadProduct = productos.length
    document.getElementById('iconoCar').innerHTML = `
    	<div class="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti "
							data-notify="${cantidadProduct}">
							<i class="zmdi zmdi-shopping-cart"></i>
						</div>

    `
    var sumTotal = 0
    productos.forEach(producto => {
        const cantidad = parseFloat(producto.cantidad)
        const precio = parseFloat(producto.precio)

        const total = cantidad * precio
        sumTotal += total
    })
    const formateado = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(sumTotal);
    document.getElementById('vewTotal').innerHTML = 'Total: $ ' + formateado
    productos.forEach(producto => {

        contenedor.innerHTML += `
       <li class="header-cart-item flex-w flex-t m-b-12">
    <div class="header-cart-item-img">
        <img src="${producto.image.urlImagen}" alt="IMG">
    </div>

    <div class="header-cart-item-txt p-t-8" style="flex: 1;">
        <a href="#" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
            ${producto.descrition}
        </a>

        <span class="header-cart-item-info">
            $${producto.cantidad} x $${producto.precio}
        </span>
    </div>

    <!-- Ícono de eliminar -->
    <div class="cart-delete-btn p-l-10 p-t-8">
        <i class="fa fa-trash text-danger" style="cursor:pointer;" onclick="eliminarDelCarrito('${producto.idProduc}')"></i>
    </div>
</li>


        `;

    });
});

function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Eliminar el producto con idProduc igual al que se pasa
    carrito = carrito.filter(producto => producto.idProduc !== id);

    // Guardar el nuevo carrito sin ese producto

    localStorage.setItem('carrito', JSON.stringify(carrito));

    // (Opcional) actualizar la vista del carrito
    mostrarCarrito();
}



function mostrarCarrito() {
    const contenedor = document.getElementById('carrito');
    contenedor.innerHTML = '';
    const productos = JSON.parse(localStorage.getItem('carrito')) || [];
    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos en el carrito.</p>";
          document.getElementById('vewTotal').innerHTML = 'Total: $ 0.00'
           document.getElementById('header-cart-content').style.display = 'none'
        return;
    }else{
         document.getElementById('header-cart-content').style.display = 'block'
    }
    const cantidadProduct = productos.length
    document.getElementById('iconoCar').innerHTML = `
    	<div class="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti "
							data-notify="${cantidadProduct}">
							<i class="zmdi zmdi-shopping-cart"></i>
						</div>

    `
    var sumTotal = 0
    productos.forEach(producto => {
        const cantidad = parseFloat(producto.cantidad)
        const precio = parseFloat(producto.precio)

        const total = cantidad * precio
        sumTotal += total
    })
    const formateado = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(sumTotal);
    document.getElementById('vewTotal').innerHTML = 'Total: $ ' + formateado
    productos.forEach(producto => {
        contenedor.innerHTML += `
       <li class="header-cart-item flex-w flex-t m-b-12">
    <div class="header-cart-item-img">
        <img src="${producto.image.urlImagen}" alt="IMG">
    </div>

    <div class="header-cart-item-txt p-t-8" style="flex: 1;">
        <a href="#" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
            ${producto.descrition}
        </a>

        <span class="header-cart-item-info">
            $${producto.cantidad} x $${producto.precio}
        </span>
    </div>

    <!-- Ícono de eliminar -->
    <div class="cart-delete-btn p-l-10 p-t-8">
 <i class="fa fa-trash text-danger" style="cursor:pointer;" onclick="eliminarDelCarrito('${producto.idProduc}')"></i>
    </div>
</li>


        `;

    });
}


function hiddenModal(){
    $('.js-panel-cart').removeClass('show-header-cart');
}