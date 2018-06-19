const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, unique: true, required: [ true, 'El nombre de la categoría es requerida']},
    user: { type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Categorie', categorySchema);