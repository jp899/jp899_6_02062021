// Importer le module EXPRESS
const express = require('express');

// Importer le module mongoose
const mongoose = require('mongoose');

const mongoSanitize = require('express-mongo-sanitize');
// Importer un module pour acceder au dossier de notre serveur
const path = require('path');

// Importer les routeurs
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const logger = require('./logger');

// Importer les paramètres d'environnement
const config = require('./config');

// Créer une application express
const app = express();

// test du logger
// logger.info('Voici une info simple !');
// logger.warning('Voici un warning simple !');
// logger.error('Voici une erreur simple !');

// Connection à la BDD mongoDB atlas
mongoose.connect(`mongodb+srv://${config.dbUser}:${config.dbPassword}@cluster0.p3gpt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true })
    .then(() => logger.info('Connected successfully to MongoDB !'))
    .catch(() => logger.error('Failed connection to MongoDB !'));


// Middleware GENERAL de gestion des headers pour le CORS
app.use((req, res, next) => {
    // Permettre des requettes de n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Ajouter les headers listés au requettes renvoyées par notre server
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Définir les types de requettes autorisées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Middleware GENERAL pour parser le body des requettes POST
app.use(express.json());

// Middleware pour filtrer certains caractères spéciaux ($ et . nottament) pouvant être utilisés
// dans le cadre d'injection NoSQL (remplacement des caractères interdits par '_')
app.use(mongoSanitize({replaceWith: '_',}));

// Indiquer que le dossier images est un dossier à gérer de manière statique
// et donner l'url a suivre à chaque fois qu'une requette cherche à y acceder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Utiliser le routeur pour toutes les requettes de format /api/sauces
app.use('/api/sauces', sauceRoutes);
// Utiliser le routeur pour toutes les requettes de format /api/auth
app.use('/api/auth', userRoutes);


// exporter l'application pour y acceder depuis les autres fichiers du projet
module.exports = app;