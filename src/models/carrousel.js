const mongoose = require('mongoose');

const { Schema } = mongoose;
const CarrouselSchema = new Schema({
    urlImagen: {
        type: String,// required: true
    },
    idImagen: {
        type: String,// required: true
    },
    texto1: {
        type: String,// required: true
    },
    texto2: {
        type: String,// required: true
    },
    iduser: {
        type: String,// required: true
    },
    date: { type: Date, default: Date.now},

});


module.exports = mongoose.model('carrousel', CarrouselSchema)
