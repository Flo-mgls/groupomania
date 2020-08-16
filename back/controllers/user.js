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
            res.status(201).json({message: "Utilisateur crée !"});
          });
    })
    .catch(e => res.status(500).json(e));
}
// FIN MIDDLEWARE

// MIDDLEWARE LOGIN
exports.login = (req, res, next) => {
    email = req.body.email;
    password = req.body.password;

    sqlFindUser = "SELECT userID, password FROM User WHERE email = ?";
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
    const password = req.body.password;
    let passwordToHash;
    const userID = res.locals.userID;

    sqlFindUser = "SELECT password FROM User WHERE userID = ?";
    mysql.query(sqlFindUser, [userID], function (err, result) {
        if (err) {
           return res.status(500).json(err.message);
        };

        if (result.length == 0) {
            return res.status(401).json({error: "Utilisateur non trouvé !"});
         }

        passwordToHash = result[0].password;
        bcrypt.compare(password, passwordToHash)
        .then(valid => {
            if(!valid){
                return res.status(401).json({error: "Mot de passe incorrect !"});
            }
            sqlDeleteUser = "DELETE FROM User WHERE userID = ?";
            mysql.query(sqlDeleteUser, [userID], function (err, result) {
                if (err) {
                   return res.status(500).json(err.message);
                };
                if (result.affectedRows == 0) {
                    return res.status(400).json({message: "Suppression échouée"});
                }
                res.status(204).end();
            });
        })
        .catch(e => res.status(500).json(e));
    }); 
}
// FIN MIDDLEWARE

// MIDDLEWARE PROFILE
exports.profile = (req, res, next) => {
    const userID = req.params.id;

    sqlGetUser = "SELECT email, pseudo, bio, avatarUrl FROM User WHERE userID = ?";
    mysql.query(sqlGetUser, [userID], function (err, result) {
        if (err) {
           return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({message: "Aucun utilisateur ne correspond à votre requête"});
        }
        res.status(200).json(result);
    });
}
// FIN MIDDLEWARE