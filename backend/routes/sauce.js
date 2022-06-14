//importation d'express
const express = require('express');
const router = express.Router();

//importation des middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const idTrust = require('../middleware/idTrust');

//importation du controller sauce
const sauceCtrl = require('../controllers/sauce');


//route de l'Api pour les sauces et le like
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, idTrust, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, idTrust, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.rankSauce);

//exportation des routes
module.exports = router;