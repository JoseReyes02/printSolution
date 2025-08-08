document.getElementById('orderForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Obtener carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Combinar datos del formulario + orden
    const datosCompletos = {
        ...data,
        orden: carrito
    };

    fetch('/sendOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosCompletos)
    })
        .then(res => res.json())
        .then(data => {
              document.getElementById('btnCerrarModal').click()
            Swal.fire({
                title: data.success,
                icon: "success",
                draggable: true
            }).then(() => {
                  document.getElementById('customModal').style.display = 'block';
                  localStorage.clear();
                  document.getElementById('numeroOrdenPersonalizado').innerHTML = data.numOrden
            
              
            });

        })
        .catch(error => {
            console.error('Error al enviar formulario:', error);
        });
});

