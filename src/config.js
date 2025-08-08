const { config } =  require('dotenv');
require('./config');
config()

const MONGODB_URI = process.env.MONGODB_URI
module.exports = MONGODB_URI;