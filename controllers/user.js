const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sessionTokenSecret = 'RANDOM_TOKEN_SECRET';
const sessionTokenExpiresDelay = '24h';


// fonction de création d'un nouvel user
exports.signup = (req, res, next) => {
    // paramètre 10 = difficulté du hashage
    bcrypt.hash(req.body.password, 10)
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
  };

// fonction d'authentification
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