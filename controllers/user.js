const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJS = require('crypto-js');

const config = require('../config');


// Regex de contrôle des entrées utilisateur :

// EMAIL : Same regex used to check type="email" input in HTML5.
// Remark : it allows emails without Top Level Domain (ex : admin@mailserver1), which are rare, but possible and valid emails.
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// PASSWORD : de 8 à 15 caractères avec au moins : 1 minuscule, 1 majuscule, un chiffre, un caractère spécial 
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%#=_])([-+!*$@%#=_\w]{8,15})$/;

// Paramétrage difficulté de hashage du password
const passwordHashDifficulty = 10;


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
    // Auto-génération d'un salt et hashage du password
    bcrypt.hash(config.passwordSaltData + req.body.password, passwordHashDifficulty)
      .then(hash => {
        // Cryptage de l'email avant stockage en base
        const keyWordArray = cryptoJS.enc.Hex.parse(config.emailEncryptKey);
        // Utilisation mode ECB pour obtenir la même chaine chiffrée à chaque chiffrage pour un même email
        const encryptedEmail = cryptoJS.AES.encrypt(req.body.email, keyWordArray, {mode: cryptoJS.mode.ECB}).toString();

        const user = new User({
          email: encryptedEmail,
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
    // Cryptage de l'email à rechercher
    const keyWordArray = cryptoJS.enc.Hex.parse(config.emailEncryptKey);
    const encryptedEmail = cryptoJS.AES.encrypt(req.body.email, keyWordArray, {mode: cryptoJS.mode.ECB}).toString();
    
    // Recherche de l'user dans la base,
    User.findOne({ email: encryptedEmail })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // Test de décryptage de l'email
      // console.log(cryptoJS.AES.decrypt(user.email, cryptoJS.enc.Hex.parse(config.emailEncryptKey), {mode: cryptoJS.mode.ECB} ).toString(cryptoJS.enc.Utf8));

      // Comparaison du password saisi par l'user avec le password en base
        bcrypt.compare(config.passwordSaltData + req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                // Données a encoder dans le token
                {userId: user._id},
                // Secret pour crypter le token
                config.sessionTokenSecret,
                // Délai d'expiration du token
                {expiresIn: config.sessionTokenExpirationDelay}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };