//Partie gestion des sauces
const Sauce = require('../models/sauce');
const fs = require('fs');

//création des sauces
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

//obtenir une sauce selon son id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

//modifier un sauce selon son id
exports.modifySauce = (req, res, next) => {
  //retirer la sauce existante dans dossier "/images" si modification image
  if(req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
          if(err) throw err;
        });
      })
      .catch(error => res.status(400).json({ error }));
  }
   // Mise à jour des infos suite à modification (nouvelle image + détails)
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
};

//suppression d'une sauce selon son id
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//obtenir toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Partie systeme de like et dislike
//Memo : like = req.body.like ----------// userId = req.body.userId------------// sauceId = req.params.id
//Operateur Mongo : $inc = incrémentation ----------// $push = ajouter au tableau ------------// $pull = retirer du tableau

exports.rankSauce = (req, res, next) => {
  Sauce.findOne({_id : req.params.id})
    .then(sauce => {

      switch(req.body.like) {
        case 1 : 
          //ajout du nouveau userId dans le tableau usersLiked & +1 like
          if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
            console.log("ajout 1 like d'un nouveau userID dans tableau usersLiked")
             
            Sauce.updateOne(
              {_id : req.params.id},
              {
                $inc: {likes: 1},
                $push: {usersLiked: req.body.userId}
              }
            )
              .then(() => res.status(200).json({message: "sauce +1 like"}))
              .catch((error) => res.status(400).json({error}));
          }
          break;
        
        case -1 :
          //ajout du nouveau userId dans le tableau usersDisliked & +1 dislike
          if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
            console.log("ajout 1 dislike d'un nouveau userID dans tableau usersDisliked")
              
            Sauce.updateOne(
              { _id : req.params.id },
              {
                $inc: {dislikes: 1},
                $push: {usersDisliked: req.body.userId}
              }
            )
              .then(() => res.status(200).json({message: "sauce +1 dislike"}))
              .catch((error) => res.status(400).json({error}));
          }
          break;

          case 0 :
            //retrait d'un userId dans le tableau usersLiked et de son like
            if(sauce.usersLiked.includes(req.body.userId)) {
              console.log("retrait 1 like d'un userID connu dans tableau usersLiked")
              
              Sauce.updateOne(
                { _id : req.params.id },
                {
                  $inc: {likes: -1},
                  $pull: {usersLiked: req.body.userId}
                }
              )
                .then(() => res.status(200).json({message: "sauce -1 like"}))
                .catch((error) => res.status(400).json({error}));
            }

            //retrait d'un userId dans le tableau usersDisliked et de son dislike
            if(sauce.usersDisliked.includes(req.body.userId)) {
              console.log("retrait 1 dislike d'un userID connu dans tableau usersDisliked")
        
              Sauce.updateOne(
                {_id : req.params.id},
                {
                  $inc: {dislikes: -1},
                  $pull: {usersDisliked: req.body.userId}
                }
              )
                .then(() => res.status(200).json({message: "sauce -1 dislike"}))
                .catch((error) => res.status(400).json({error}));
            }     

          } 
        })

      
    .catch((error) => res.status(404).json({error}));
  }