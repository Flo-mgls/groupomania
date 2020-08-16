// MODULES
const mysql = require('../dbConnect').connection;
const env = require("../environment"); // Récupère les variables d'environnement
const bcrypt = require('bcrypt'); // Hash le mot de passe
const jwt = require("jsonwebtoken"); // Génère un token sécurisé
const fs = require("fs"); // Permet de gérer les fichiers stockés
// FIN MODULES

// MIDDLEWARE SIGNUP
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const email = req.body.email;
            const pseudo = req.body.pseudo;
            const password = hash;
            const bio = req.body.bio;
            const avatarUrl = req.body.avatarUrl;

            const sqlSignup = "INSERT INTO user VALUES (NULL, ?, ?, ?, ?, ?, CURDATE())";
            const values = [email, pseudo, password, bio, avatarUrl];
            mysql.query(sqlSignup, values, function (err, result) {
                if (err) {
                    return res.status(500).json(err.message);
                };
                res.status(201).json({ message: "Utilisateur crée !" });
            });
        })
        .catch(e => res.status(500).json(e));
}
// FIN MIDDLEWARE

// MIDDLEWARE LOGIN
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlFindUser = "SELECT userID, password FROM User WHERE email = ?";
    mysql.query(sqlFindUser, [email], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        bcrypt.compare(password, result[0].password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: "Mot de passe incorrect !" });
                }
                res.status(200).json({
                    userID: result[0].userID,
                    token: jwt.sign(
                        { userID: result[0].userID },
                        env.token,
                        { expiresIn: "24h" }
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
    let passwordHashed;
    const userID = res.locals.userID;

    const sqlFindUser = "SELECT password, avatarUrl FROM User WHERE userID = ?";
    mysql.query(sqlFindUser, [userID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };

        if (result.length == 0) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        const filename = result[0].avatarUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
            passwordHashed = result[0].password;
            bcrypt.compare(password, passwordHashed)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }
                    const sqlDeleteUser = "DELETE FROM User WHERE userID = ?";
                    mysql.query(sqlDeleteUser, [userID], function (err, result) {
                        if (err) {
                            return res.status(500).json(err.message);
                        };
                        if (result.affectedRows == 0) {
                            return res.status(400).json({ message: "Suppression échouée" });
                        }
                        console.log(filename);
                        res.status(204).end();
                    });
                })
                .catch(e => res.status(500).json(e));
        })
    });
}
// FIN MIDDLEWARE

// MIDDLEWARE PROFILE
exports.profile = (req, res, next) => {
    const userID = req.params.id;

    const sqlGetUser = "SELECT email, pseudo, bio, avatarUrl FROM User WHERE userID = ?";
    mysql.query(sqlGetUser, [userID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({ message: "Aucun utilisateur ne correspond à votre requête" });
        }
        res.status(200).json(result);
    });
}
// FIN MIDDLEWARE

// MIDDLEWARE MODIFY
exports.modify = (req, res, next) => {
    const userID = res.locals.userID;
    const email = req.body.email;
    const pseudo = req.body.pseudo;
    const bio = req.body.bio;
    const password = req.body.password;

    if (req.file) {
        const avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        let sqlFindUser = "SELECT avatarUrl FROM User WHERE userID = ?";
        mysql.query(sqlFindUser, [userID], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }
            const filename = result[0].avatarUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                let sqlModifyUser = "UPDATE User SET email=?, pseudo=?, bio=?, avatarUrl=? WHERE userID = ?";
                let values = [email, pseudo, bio, avatarUrl, userID];
                mysql.query(sqlModifyUser, values, function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    };
                    return res.status(200).json({ message: "Utilisateur modifé !" });
                });
            })
        });
    } else if (!req.file && !password) {
        let sqlModifyUser = "UPDATE User SET email=?, pseudo=?, bio=? WHERE userID = ?";
        values = [email, pseudo, bio, userID];
        mysql.query(sqlModifyUser, values, function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            };
            return res.status(200).json({ message: "Utilisateur modifé !" });
        });
    } else if (!req.file && password) {
        sqlFindUser = "SELECT password FROM User WHERE userID = ?";
        mysql.query(sqlFindUser, [userID], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }

            if (result.length == 0) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }

            const newPassword = req.body.newPassword;
            const passwordHashed = result[0].password;
            bcrypt.compare(password, passwordHashed)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }
                    bcrypt.hash(newPassword, 10)
                        .then(hash => {
                            const sqlChangePassword = "UPDATE User SET password=? WHERE userID = ?";
                            mysql.query(sqlChangePassword, [hash, userID], function (err, result) {
                                if (err) {
                                    return res.status(500).json(err.message);
                                }
                                if (result.affectedRows == 0) {
                                    return res.status(400).json({ message: "Changement échoué !" });
                                }
                                res.status(200).json({ message: "Changement réussi !" });
                            });
                        })
                        .catch(e => res.status(500).json(e));
                })
                .catch(e => res.status(500).json(e));
        });
    }
}
// FIN MIDDLEWARE