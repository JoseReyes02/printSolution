const mongoose = require('mongoose');

const { Schema } = mongoose;
const PedidoSchema = new Schema({
    numeroOrden: { type: String, unique: true, required: true }, // número único
    fullname: {
        type: String,// required: true
    },
    email: {
        type: String,// required: true
    },
    phone: {
        type: String,// required: true
    },
    address: {
        type: String,// required: true
    },
    city: {
        type: String,// required: true
    },
    postalcode: {
        type: String,// required: true
    },
    notes: {
        type: String,// required: true
    },
    total: {
        type: Number,// required: true
    },
    count: {
        type: Number,// required: true
    },
    estado: {
        type: String,// required: true
    },
    order: [],
});
module.exports = mongoose.model('order', PedidoSchema)

