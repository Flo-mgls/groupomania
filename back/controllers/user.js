// MODULES
const mysql = require('../dbConnect').connection;
const env = require("../environment"); // Récupère les variables d'environnement
const bcrypt = require('bcrypt'); // Hash le mot de passe
const jwt = require("jsonwebtoken"); // Génère un token sécurisé
// FIN MODULES

// MIDDLEWARE SIGNUP
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        email = req.body.email;
        pseudo = req.body.pseudo;
        password = hash;
        bio = req.body.bio;
        avatar = req.body.avatar;
    
        sqlSignup = "INSERT INTO user VALUES (NULL, ?, ?, ?, ?, ?, CURDATE())";
        values = [email, pseudo, password, bio, avatar];
        mysql.query(sqlSignup, values, function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            };
            res.status(201).json(result);
          });
    })
    .catch(e => res.status(500).json(e));
}
// FIN MIDDLEWARE

// MIDDLEWARE LOGIN
exports.login = (req, res, next) => {
    email = req.body.email;
    password = req.body.password;

    sqlFindUser = "SELECT userID, password FROM User where email = ?";
    mysql.query(sqlFindUser, [email], function (err, result) {
        if (err) {
           return res.status(500).json(err.message);
        };
        if (result.length == 0) {
           return res.status(401).json({error: "Utilisateur non trouvé !"});
        }
        bcrypt.compare(password, result[0].password)
        .then(valid => {
            if(!valid){
                return res.status(401).json({error: "Mot de passe incorrect !"});
            }
            res.status(200).json({
                userID: result[0].userID,
                token: jwt.sign(
                    {userID: result[0].userID},
                    env.token,
                    {expiresIn: "24h"}
                )
            });
        })
        .catch(e => res.status(500).json(e));
    });
}
// FIN MIDDLEWARE

// MIDDLEWARE DELETE
exports.delete = (req, res, next) => {
    
}
// FIN MIDDLEWARE

// MIDDLEWARE PROFILE
exports.profile = (req, res, next) => {
    
}
// FIN MIDDLEWARE