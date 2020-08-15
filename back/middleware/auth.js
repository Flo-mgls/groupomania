// MODULES
const env = require("../environment"); // Récupère les variables d'environnement
const jwt = require("jsonwebtoken"); // Crée et check un token d'identification sécurisé
// FIN MODULES

// MIDDLEWARE AUTH
module.exports = (req, res, next) => { // Check si le token est bon
    try { // Check si le token est bon grâce à notre phrase secrète
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, env.token);
        const userID = decodedToken.userID;

        if (req.body.userID && req.body.userID !== userID) { // Check si l'userId est le même que dans la requête (si présent)
            throw "userID invalide";
        } else {
            next();
        }
    } catch{
        res.status(401).json(new Error('Requête invalide!'));
    }
};
// FIN MIDDLEWARE