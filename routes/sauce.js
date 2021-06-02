
// Fichier qui aiguille les requettes en fonction de leur type et url
// vers les traitements fonctionnels correspondants (fichier controller/sauce.js)

const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// On applique à chaque route d'abord le middleware pour controler l'authentification,
// puis si necessaire le middleware pour ajouter un objet FILE à la requette avec le fichier fourni par le front
// et enfin le middleware "fonctionnel"

router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);

router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;