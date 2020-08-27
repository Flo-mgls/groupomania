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
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const password = hash;

            let sqlSignup;
            let values;

            sqlSignup = "INSERT INTO user VALUES (NULL, ?, ?, ?, NULL, ?, NULL, avatarUrl, NOW())";
            values = [email, firstName, lastName, password,];
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

    let sqlFindUser;
    let sqlDeleteUser;

    sqlFindUser = "SELECT password, avatarUrl FROM User WHERE userID = ?";
    mysql.query(sqlFindUser, [userID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }

        const filename = result[0].avatarUrl.split("/images/")[1];
        if (filename !== "avatarDefault.jpg") {
            fs.unlink(`images/${filename}`, (e) => { // On supprime le fichier image en amont
                if (e) {
                    console.log(e);
                }
            })
        }
        passwordHashed = result[0].password;

        bcrypt.compare(password, passwordHashed)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: "Mot de passe incorrect !" });
                }
                sqlDeleteUser = "DELETE FROM User WHERE userID = ?";
                mysql.query(sqlDeleteUser, [userID], function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    };
                    if (result.affectedRows == 0) {
                        return res.status(400).json({ message: "Suppression échouée" });
                    }
                    res.status(200).json({ message: "Utilisateur supprimé !" });
                });
            })
            .catch(e => res.status(500).json(e));
    });
}
// FIN MIDDLEWARE

// MIDDLEWARE PROFILE
exports.profile = (req, res, next) => {
    const userID = res.locals.userID;
    let userIDAsked = req.params.id;

    let sqlGetUser;

    if (userIDAsked === "yourProfile") {
        userIDAsked = userID;
    }

    sqlGetUser = `SELECT email, firstName, lastName, pseudo, bio, avatarUrl, DATE_FORMAT(dateCreation, 'Inscrit depuis le %e %M %Y à %kh%i') AS dateCreation,
    COUNT(CASE WHEN userID = ? then 1 else null end) AS yourProfile FROM User WHERE userID = ?`;
    mysql.query(sqlGetUser, [userID, userIDAsked], function (err, result) {
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

    let sqlFindUser;
    let sqlModifyUser;
    let sqlChangePassword;
    let values;

    if (req.file) { // Si le changement concerne l'avatar on update directement
        const avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

        sqlFindUser = "SELECT avatarUrl FROM User WHERE userID = ?";
        mysql.query(sqlFindUser, [userID], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }

            const filename = result[0].avatarUrl.split("/images/")[1];
            sqlModifyUser = "UPDATE User SET avatarUrl = ? WHERE userID = ?";
            if (filename !== "avatarDefault.jpg") {
                fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                    mysql.query(sqlModifyUser, [avatarUrl, userID], function (err, result) {
                        if (err) {
                            return res.status(500).json(err.message);
                        };
                        return res.status(200).json({ message: "Utilisateur modifé !" });
                    });
                })
            } else {
                mysql.query(sqlModifyUser, [avatarUrl, userID], function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    };
                    return res.status(200).json({ message: "Utilisateur modifé !" });
                });
            }
        });

    } else { // Si le changement concerne les infos de l'user on demande le mdp
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

                    if (newPassword) { // Si un nouveau mdp est défini
                        bcrypt.hash(newPassword, 10)
                            .then(hash => {
                                sqlChangePassword = "UPDATE User SET email=?, pseudo=?, bio=?, password=? WHERE userID = ?";
                                values = [email, pseudo, bio, hash, userID];
                                mysql.query(sqlChangePassword, values, function (err, result) {
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

                    } else { // Si le mdp reste le même
                        sqlModifyUser = "UPDATE User SET email=?, pseudo=?, bio=? WHERE userID = ?";
                        values = [email, pseudo, bio, userID];
                        mysql.query(sqlModifyUser, values, function (err, result) {
                            if (err) {
                                return res.status(500).json(err.message);
                            }
                            if (result.affectedRows == 0) {
                                return res.status(400).json({ message: "Changement échoué !" });
                            }
                            res.status(200).json({ message: "Changement réussi !" });
                        });
                    }
                })
                .catch(e => res.status(500).json(e));
        });
    }
}
// FIN MIDDLEWARE