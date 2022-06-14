//importation de mongoose
const mongoose = require('mongoose');

//importation validateur unique
const uniqueValidator = require('mongoose-unique-validator')

//modèle données connexion
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//mise en place du plugin unique validator
userSchema.plugin(uniqueValidator);

//exportation du module
module.exports = mongoose.model('User', userSchema);