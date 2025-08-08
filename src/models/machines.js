const mongoose = require('mongoose');

const { Schema } = mongoose;
const ProductoSchema = new Schema({
    name: {
        type: String,//  required: true 
    },
    serial: {
        type: String,//  required: true 
    },
    type: {
        type: String, //  required: true 
    },
    brand: {
        type: String, //  required: true 
    },
    model: {
        type: String, //  required: true 
    },
    description: {
        type: String,//  required: true 
    },
    price: {
        type: String,// require: true
    },
    image: [],
    stock: {
        type: Number,
    },
    condition: {
        type: String
    },
    state: {
        type: String
    },
        availabilityType: {
        type: String
    },
    
         date: { type: Date, default: Date.now},

    carritoporusuario: { type: String }

});

module.exports = mongoose.model('producto', ProductoSchema)