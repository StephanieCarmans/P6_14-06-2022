//importation express
const express = require('express');
const router = express.Router();

//importation du controller user
const userCtrl = require('../controllers/user');

// création des différentes routes de l'api pour le user création puis connexion
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//exportation des routes
module.exports = router;