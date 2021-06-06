const jwt = require('jsonwebtoken');
const Sauce = require('../models/sauce');

const config = require('../config');



// Middelware d'authentification général pour toutes les routes
exports.generalAuth = (req, res, next) => {
  try {
    //   on récupere le token dans le header (forme "Bearer <token>" à parser)
    const token = req.headers.authorization.split(' ')[1];
    // On décode le token pour récupérer le user encrypté dedans
    const decodedToken = jwt.verify(token, config.sessionTokenSecret);
    const userId = decodedToken.userId;
    // On controle le user décrypté par rapport au userID fourni dans la requette
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

// Middleware spécifique aux routes de modification/suppression d'un élément par son propriétaire
// Vérifie que le user courant est le proprietaire/créateur de cet élément
exports.ownerAuth = (req, res, next) => {
  try {
    //   on récupere le token dans le header 
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.sessionTokenSecret);
    const userId = decodedToken.userId;

    // Recherche de la sauce à modifier en base de donnée
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // Comparer le user courant au user propriétaire de la sauce à modifier
      if(sauce.userId !== userId){
        throw 'Forbidden request : the user is not the owner of the ressource';
      }
      else{
        next();
      }
    }).catch( err => res.status(401).json({error: err}));

  } catch (err){
    res.status(403).json({
      error: new Error('Forbidden request!')
    });
  }
};