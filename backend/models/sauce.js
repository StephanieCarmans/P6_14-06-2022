//importation de mongoose
const mongoose = require('mongoose');

//modèle données sauce
const sauceSchema = mongoose.Schema({
  userId: {type: String, required: true},
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  //système like et dislike
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: {type: Array, default: []},
  usersDisliked: {type: Array, default: []},
});

//exportation du module
module.exports = mongoose.model('Sauce', sauceSchema);

