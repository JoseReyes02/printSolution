const express = require('express');
const router = express.Router();
const Carrousel = require('../models/carrousel')
const Machines = require('../models/machines')
const ORDER = require('../models/pedido');

const nodemailer = require('nodemailer')


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
    const machinesRentails = await Machines.find({ state: 'completed', availabilityType: 'rental' })
   
      const ordenes = await ORDER.find()
    console.log(ordenes)
    res.render('index', { carrousel, machines, machinesRentails });

});
router.get('/services', async (req, res) => {

    res.render('services');

});
router.get('/Repair', async (req, res) => {
    const machinesRentails = await Machines.find({ state: 'completed', availabilityType: 'rental' })
    console.log(machinesRentails)
    res.render('Repair', { machinesRentails });

});
router.get('/Rentals', async (req, res) => {
    const machinesRentails = await Machines.find({ state: 'completed', availabilityType: 'rental' })
    console.log(machinesRentails)
    res.render('Rentals', { machinesRentails });

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
        const newOrder = new ORDER({ fullname, email, phone, address, city, postalcode, notes, count, estado, numeroOrden })
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

                        await ORDER.findByIdAndUpdate(newOrder._id, { total })

                    }
                })
                .catch((error) => {
                    console.error('Error interno:', error);
                });
        }


        const today = new Date();
        const orderDate = today.toLocaleDateString('es-ES'); // Ejemplo: 12/08/2025

        const contentHTML = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                        <meta charset="UTF-8">
                        <title>New Order Received</title>
                        </head>
                        <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <tr>
                            <td style="background-color: #007bff; padding: 20px; color: #fff; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="margin: 0;">New Order Notification</h1>
                            </td>
                            </tr>
                            <tr>
                            <td style="padding: 20px; color: #333;">
                                <p>Hello,</p>
                                <p>You have received a new order. Please find the details below:</p>

                                <h3 style="margin-bottom: 5px;">Order Information</h3>
                                <p><strong>Order #:</strong> ${numeroOrden}</p>
                                <p><strong>Date:</strong> ${orderDate}</p>

                                <h3 style="margin-bottom: 5px;">Customer Information</h3>
                                <p><strong>Name:</strong> ${fullname}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Phone:</strong> ${phone}</p>

                                <div style="text-align: center; margin-top: 20px;">
                                <a href="https://printsolutionadmin-61d693d27dc7.herokuapp.com/ordenSelect/${newOrder._id}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                                    View Order
                                </a>
                                </div>

                                <p style="margin-top: 20px; font-size: 12px; color: #888;">
                                This email was generated automatically. Please do not reply.
                                </p>
                            </td>
                            </tr>
                        </table>
                        </body>
                        </html>
                        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'findmyhouse57@gmail.com',
                pass: 'mktoxcekrsrceebl'
            }
        })
        const mailOptions = {
            from: '"PrintSolutions" <findmyhouse57@gmail.com>',
            to: 'joseeladio29.jer@gmail.com',
            subject: 'Nueva orden!',
            html: contentHTML,
        }
        await transporter.sendMail(mailOptions);
        res.json({ success: 'Orden Send!', numOrden: numeroOrden })

    } catch (error) {

    }

})


router.get('/sale', async (req, res) => {
      const productos = await Machines.find({ state: 'completed' })
    res.render('sale',{productos})
})


module.exports = router;