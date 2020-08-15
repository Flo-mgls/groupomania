// MODULES
const mysql = require('../dbConnect').connection;
const bcrypt = require('bcrypt');
// FIN MODULES

// MIDDLEWARE SIGNUP
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        email = req.body.email;
        pseudo = hash;
        password = req.body.password;
        bio = req.body.bio;
        avatar = req.body.avatar;
    
        sqlSignup = "INSERT INTO user VALUES (NULL, ?, ?, ?, ?, ?, CURDATE())";
        values = [email, pseudo, password, bio, avatar];
        mysql.query(sqlSignup, values, function (err, result) {
            if (err) {
                res.status(500).json(err.message);
            };
            res.status(201).json(result);
          });
    })
    .catch(e => res.status(500).json(e));
}
// FIN MIDDLEWARE

// MIDDLEWARE LOGIN
exports.login = (req, res, next) => {
    
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