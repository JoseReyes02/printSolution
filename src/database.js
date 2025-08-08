const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://joseeladio29jer:20161248Josereyes@printsolution.ziedkph.mongodb.net/',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false

}).then(db => console.log('DB Esta Conectada'))
.catch(err => console.error(err))

