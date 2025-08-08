const express = require('express');
const router = express.Router();
const Carrousel = require('../models/carrousel')
const Machines = require('../models/machines')
const ORDER = require('../models/pedido');


const generarNumeroOrdenUnico = async () => {
  const generarNumero = () => {
    // Formato: ORD + 6 dígitos aleatorios (puedes cambiarlo)
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  };

  let numero;
  let existe = true;

  while (existe) {
    numero = generarNumero();
    existe = await ORDER.exists({ numeroOrden: numero });
  }

  return numero;
};


router.get('/', async (req, res) => {
    const carrousel = (await Carrousel.find().sort({ date: -1 }))
    const machines = await Machines.find({ state: 'completed' })
    const machinesRentails = await Machines.find({ state: 'completed', availabilityType:'rental' })

    res.render('index', { carrousel, machines ,machinesRentails});

});
router.get('/services', async (req, res) => {

    res.render('services');

});
router.get('/Repair', async (req, res) => {
     const machinesRentails = await Machines.find({ state: 'completed', availabilityType:'rental' })
    console.log(machinesRentails)
     res.render('Repair',{machinesRentails});

});
router.get('/Rentals', async (req, res) => {
      const machinesRentails = await Machines.find({ state: 'completed', availabilityType:'rental' })
    console.log(machinesRentails)
    res.render('Rentals',{machinesRentails});

});
router.get('/about', async (req, res) => {
    const todos = await Note.find();
    const vinos = await Note.find({ categoria: 'vinos' });
    const vodka = await Note.find({ categoria: 'vodka' });
    const whisky = await Note.find({ categoria: 'whisky' });
    const tequila = await Note.find({ categoria: 'tequila' });
    const ron = await Note.find({ categoria: 'ron' });
    res.render('about', { todos, vinos, vodka, whisky, tequila, ron });

});

router.get('/prueba', (req, res) => {
    res.render('prueba');
});



router.post('/verDetalles', async (req, res) => {
    const { id } = req.body

    const producto = await Machines.findById(id);
    res.json({ producto: producto })
});
router.post('/addtocar', async (req, res) => {
    try {
        const { id, cantidad } = req.body
        const producto = await Machines.findById(id);

        const carritoProduc = {
            idProduc: producto._id,
            descrition: producto.name,
            precio: producto.price,
            cantidad: cantidad,
            image: producto.image[0]
        }


        res.json(carritoProduc)
    } catch (error) {
        console.log(error)
    }

});

router.post('/sendOrder', async (req, res) => {
    const { fullname, email, phone, address, city, postalcode, notes } = req.body;
    const { orden } = req.body
    try {
        const numeroOrden = await generarNumeroOrdenUnico();
        var total = 0
        const estado = 'Pending';
        const count = (await ORDER.find()).length + 1
        const newOrder = new ORDER({ fullname, email, phone, address, city, postalcode, notes, count, estado,numeroOrden})
        await newOrder.save()
        for (var i = 0; i < orden.length; i++) {
            total += parseFloat(orden[i].precio)
            const order = ({
                descrition: orden[i].descrition,
                precio: orden[i].precio,
                cantidad: orden[i].cantidad,
                idProduc: orden[i].idProduc,
                imagen: orden[i].image
            })
            ORDER.findByIdAndUpdate(newOrder._id, { $push: { order: order } }, { new: true })
                .then(async (publicacionActualizada) => {
                    if (!publicacionActualizada) {
                        console.log('Publicación no encontrada');
                        // Manejar el caso en el que no se encuentra la publicación
                    } else {
                     
                        await ORDER.findByIdAndUpdate(newOrder._id, {total})
                        res.json({success: 'Orden Send!',numOrden:numeroOrden})

                    }
                })
                .catch((error) => {
                    console.error('Error interno:', error);
                });
        }






    } catch (error) {

    }





})

module.exports = router;