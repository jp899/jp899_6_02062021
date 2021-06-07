const Sauce = require('../models/sauce');
const fs = require('fs');

const logger = require('../logger');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
    // Contruire l'url de l'image enregistrée sur le serveur (http://ipserveur/images/nomfichier)
    // Le fichier est fourni par multer dans une propriété file qui a été ajoutée à la requette
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Item saved !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {

    // Suppression de l'ancienne image si le fichier a été modifié par l'user
    if(req.file){
      Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // Récuperer l'adresse du fichier lié à l'objet
        const filename = sauce.imageUrl.split('/images/')[1];
        // Supprimer ce fichier
        fs.unlink(`images/${filename}`,(err => {
          if (err) logger.warning(`Failed to delete file : images/${filename}`);
          else logger.info(`File deleted : ${filename}`);
        }));
      })
      .catch(error => res.status(500).json({ error }));
    }

    const sauceObject = req.file ?
    // Si un fichier a été inclus dans la requette (fichier modifié par lutilisateur)
    // Alors on traite l'image
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    // sinon ou traite simplement l'objet entrant 
      : { ...req.body };

    // Ensuite on enregistre l'objet mis à jour
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Item modified !'}))
      .catch(error => res.status(400).json({ error }));
  };


  exports.deleteSauce = (req, res, next) => {
    // Trouver l'objet à supprimer
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // Récuperer l'adresse du fichier lié à l'objet
        const filename = sauce.imageUrl.split('/images/')[1];
        // Supprimer ce fichier
        fs.unlink(`images/${filename}`, () => {
            // Supprimer l'objet lui-même
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Item deleted !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };


exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


exports.likeSauce = (req, res, next) => {
  // recherche de la sauce
  Sauce.findOne({_id: req.params.id})
  .then(
    (sauce) => {
      // Like et pas déja liké/disliké
      if(req.body.like === 1 && ! sauce.isLiked(req.body.userId) && ! sauce.isDisliked(req.body.userId) ){
        sauce.like(req.body.userId);
        Sauce.updateOne({ _id: sauce._id }, sauce)
        .then(() => res.status(200).json({ message: 'Item liked !'}))
        .catch(error => res.status(400).json({ error }));
      }
      // Dislike et pas déja liké/disliké
      else if(req.body.like === -1 && ! sauce.isLiked(req.body.userId) && ! sauce.isDisliked(req.body.userId) ){
        sauce.dislike(req.body.userId);
        Sauce.updateOne({ _id: sauce._id }, sauce)
        .then(() => res.status(200).json({ message: 'Item disliked !'}))
        .catch(error => res.status(400).json({ error }));
      }
      // Unlike/Undislike et déja liké
      else if(req.body.like === 0 && sauce.isLiked(req.body.userId) ){
        sauce.unLike(req.body.userId);
        Sauce.updateOne({ _id: sauce._id }, sauce)
        .then(() => res.status(200).json({ message: 'Item unliked !'}))
        .catch(error => res.status(400).json({ error }));
      }
      // Unlike/Undislike et déja disliké
      else if(req.body.like === 0 && sauce.isDisliked(req.body.userId) ){
        sauce.unDislike(req.body.userId);
        Sauce.updateOne({ _id: sauce._id }, sauce)
        .then(() => res.status(200).json({ message: 'Item undisliked !'}))
        .catch(error => res.status(400).json({ error }));
      }
      // Autres cas : requette impossible à traiter
      else{
        res.status(400).json({error: "Bad request"});
      }
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );






};