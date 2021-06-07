// Récupération des variables d'environnements depuis le fichier .env
require('dotenv').config();


// Identifiants connection base de données Mongo Atlas
exports.dbCluster = process.env.DB_CLUSTER;
exports.dbUser = process.env.DB_USER;
exports.dbPassword = process.env.DB_PASSWORD;

// Données de salage du mot de passe avant hashage des passwords
exports.passwordSaltData = process.env.PASSWORD_SALT_DATA;

// paramétrage du token de session
exports.sessionTokenSecret = process.env.SESSION_TOKEN_SECRET;
exports.sessionTokenExpirationDelay = process.env.SESSION_TOKEN_EXPIRATION_DELAY;

// paramétrage de la clé de cryptage des emails
exports.emailEncryptKey = process.env.EMAIL_ENCRYPTION_KEY;