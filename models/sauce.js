// Fichier de définition d'un schéma "sauce" pour la BDD mongo
// Le schéma est créé avec le package mongoose

const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: [] },
});


// Définition de méthodes sur les instances de sauce

sauceSchema.methods.isLiked = function(userId) {
  return this.usersLiked.includes(userId);
}

sauceSchema.methods.isDisliked = function(userId) {
  return this.usersDisliked.includes(userId);
}

sauceSchema.methods.like = function(userId) {
  this.usersLiked.push(userId);
  this.likes ++;
}

sauceSchema.methods.dislike = function(userId) {
  this.usersDisliked.push(userId);
  this.dislikes ++;
}

sauceSchema.methods.unLike = function(userId) {
  this.usersLiked = this.usersLiked.filter(function(user){ return user !== userId;});
  this.likes --;
}

sauceSchema.methods.unDislike = function(userId) {
  this.usersDisliked = this.usersDisliked.filter(function(user){ return user !== userId;});
  this.dislikes --;
}


module.exports = mongoose.model('Sauce', sauceSchema);