const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, required: [true, 'El correo electrónico es requerido'] },
    password: { type: String, required: [true, 'Contraseña es requeridad'] }, 
    img: { type: String }, 
    role: { type: String, default: 'USER_ROLE' },
    state: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

module.exports = mongoose.model('user', userSchema);