const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({

    name:{type: String},
    email:{type: String},
    password:{type: String},
    password_type:{type: String},
    telephone:{type: String},
    register_date:{type: String},
    address:{type: String},
     date: { type: Date, default: Date.now},

     
});

UserSchema.methods.encryptPassword = async (password) =>{
  const salt = await bcrypt.genSalt(10);  
  const hash = bcrypt.hash(password,salt);
  return hash;
};

UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);