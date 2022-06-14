//variable environnement
require('dotenv').config()

//appel methode token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // récuperation du token d'authentification
    const token = req.headers.authorization.split(' ')[1];
    // décodage du token
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    //récupération du userId encodé dans le token
    const userId = decodedToken.userId;
    req.auth = { userId };
    //comparaison du userId de la request avec celui présent dans le token
    if (req.body.userId && req.body.userId !== userId) {
      res.status(403).json({ error: 'Requête non autorisée'});
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};