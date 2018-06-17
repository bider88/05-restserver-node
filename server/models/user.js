const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const roleValidates = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El correo electrónico es requerido'] },
    password: { type: String, required: [true, 'Contraseña es requeridad'] }, 
    img: { type: String }, 
    role: { type: String, default: 'USER_ROLE', enum: roleValidates },
    state: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('user', userSchema);