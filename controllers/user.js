const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Paramétrage dela dificulté de hashage
const saltRounds = 10;
// paramétrage du token de session
const sessionTokenSecret = 'RANDOM_TOKEN_SECRET';
const sessionTokenExpiresDelay = '24h';

// Regex de contrôle des entrées utilisateur :

// EMAIL : Same regex used to check type="email" input in HTML5.
// Remark : it allows emails without Top Level Domain (ex : admin@mailserver1), which are rare, but possible and valid emails.
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// PASSWORD : de 8 à 15 caractères avec au moins : 1 minuscule, 1 majuscule, un chiffre, un caractère spécial 
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%#=_])([-+!*$@%#=_\w]{8,15})$/ ;


// Fonction de création d'un nouvel user
exports.signup = (req, res, next) => {

  // Validation des entrées utilisateur
  if(! emailRegex.test(req.body.email)){
    return res.status(400).json({ error: "Format de l'email incorrect !" });
  }
  else if(! passwordRegex.test(req.body.password)){
    return res.status(400).json({ error: 'Format du mot de passe incorrect !' });
  }
  else{
    // Auto-génération d'un salt et hashage
    bcrypt.hash(req.body.password, saltRounds)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    } 
  };

// Fonction d'authentification
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                // Données a encoder dans le token
                {userId: user._id},
                //   seed de random a changer pour une production
                sessionTokenSecret,
                //   delai d'expiration du token
                {expiresIn: sessionTokenExpiresDelay}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };