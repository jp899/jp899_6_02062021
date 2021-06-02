const multer = require('multer');

// Dictionnaire pour convertir les mime_types des fichiers en extension de fichier exploitable
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/png': 'png'
};

// définir configuration de multer pour indiquer comment enregistrer les fichiers
// MULTER AJOUTE UNE PROPRIETE FILE A LA REQUETTE
const storage = multer.diskStorage({
// dossier de destination
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
//   Nom du fichier
  filename: (req, file, callback) => {
    //   remplacement des eventuels espaces par des underscores
    const name = file.originalname.split(' ').join('_');
    // On a pas acces à l'extension du fichier envoyer par le client mais on a l'info via
    // le mime_type du fichier
    const extension = MIME_TYPES[file.mimetype];
    // Ajouter un timestamp au nom du fichier (permet nottament l'unicité des fichiers en théorie)
    callback(null, name + Date.now() + '.' + extension);
  }
});

// methode single pour indiquer qu'il s'agit d'un seul fichier et pas d'un ensemble de fichiers
// et parametre image pour indiquer le type de fichier
module.exports = multer({storage: storage}).single('image');