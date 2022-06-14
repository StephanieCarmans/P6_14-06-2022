//variable environnement
require('dotenv').config()

//importation d'express
const express = require('express');

//importation helmet ----protection injection <>
const helmet = require("helmet");

//importation mongo sanitize ----protection injection $
const mongoSanitize = require("express-mongo-sanitize");

//importation morgan lecture dans terminal
const morgan = require("morgan");

//importation quotas de requests
const rateLimit = require('express-rate-limit');

//importation de MongoDB
const mongoose = require('mongoose');

//traiter les requests vers la route image
const path = require('path');

//création application Express
const app = express();

//constantes pour appeler les routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//conversion en JSON
app.use(express.json());

//connexion à MongoDB
mongoose.connect('mongodb+srv://' + process.env.MDB_user + ':' + process.env.MDB_pw + '@cluster0.pbebu83.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Headers CORS  
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//gestion des images
app.use('/images', express.static(path.join(__dirname, 'images')));

//sécurité sur injection de balise
app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }));

//sécurité sur injection de $
app.use(mongoSanitize());

//sécurité log
app.use(morgan("dev"));

//limitation des requests
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limite chaque IP à 100 requests
	standardHeaders: true, // Retourne une rate limit info dans the `RateLimit-*` headers
	legacyHeaders: false, // Deconnecte le `X-RateLimit-*` headers
})

// Application de rate-limit à toutes les requests
app.use(limiter)


//gestion des routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);  

//exportation de app
module.exports = app;