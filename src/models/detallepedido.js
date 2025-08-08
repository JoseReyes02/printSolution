const mongoose = require('mongoose');

const { Schema } = mongoose;
const DetallePedidoSchema = new Schema({
    order_id: {
        type: String,// required: true
    },
 product_id: {
        type: String,// required: true
    },
 quantity: {
        type: String,// required: true
    },
 unit_price: {
        type: String,// required: true
    },


});

module.exports = mongoose.model('detallepedido', DetallePedidoSchema)
