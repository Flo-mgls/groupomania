// MODULES
const env = require("../environment"); // Récupère les variables d'environnement
const jwt = require("jsonwebtoken"); // Crée et check un token d'identification sécurisé
// FIN MODULES

// MIDDLEWARE AUTH
module.exports = (req, res, next) => { // Check si le token est bon
    try { // Check si le token est bon grâce à notre phrase secrète
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, env.token);
        res.locals.userID = decodedToken.userID;
        next();
    } catch{
        res.status(401).json({message: 'Requête invalide!'});
    }
};
// FIN MIDDLEWARE