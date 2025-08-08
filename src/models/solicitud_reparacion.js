const mongoose = require('mongoose');

const { Schema } = mongoose;
const SolicitudesDeReparacionSchema = new Schema({
    user_id: {
        type: String,// required: true
    },
 equipment_type: {
        type: String,// required: true
    },
 model_brand: {
        type: String,// required: true
    },
 problem_descrition: {
        type: String,// required: true
    },
 image: {
        type: String,// required: true
    },
 condition: {
        type: String,// required: true
    },
 application_date: {
        type: String,// required: true
    },


});

module.exports = mongoose.model('solicitudesdereparacion', SolicitudesDeReparacionSchema)
