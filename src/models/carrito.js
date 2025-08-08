const mongoose = require('mongoose');

const { Schema } = mongoose;
const CarritoSchema = new Schema({
    urlImagen: {
        type: String,// required: true
    },
    idImagen: {
        type: String,// required: true
    },
    description: {
        type: String,// required: true
    },
    precio: {
        type: String,// required: true
    },
    cantidad: {
        type: String,// required: true
    },
    numOrder: {
        type: String,// required: true
    },
    date: { type: Date, default: Date.now},

});


module.exports = mongoose.model('carrito', CarritoSchema)