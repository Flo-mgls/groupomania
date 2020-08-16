// MODULES
const mysql = require('../dbConnect').connection;
const fs = require("fs"); // Permet de gérer les fichiers stockés
// FIN MODULES

// MIDDLEWARE GETALLPOSTS
exports.getAllPosts = (req, res, next) => {

}
// FIN MIDDLEWARE

// MIDDLEWARE GETONEPOST
exports.getOnePost = (req, res, next) => {

}
// FIN MIDDLEWARE

// MIDDLEWARE CREATEPOST
exports.createPost = (req, res, next) => {
    const userID = res.locals.userID;
    const legend = req.body.legend;
    const gifUrl = req.body.gifUrl;

    let sqlCreatePost;
    let values;

    sqlCreatePost = "INSERT INTO post VALUES (NULL, ?, ?, ?, NULL, NULL, CURDATE())";
    values = [userID, legend, gifUrl];
    mysql.query(sqlCreatePost, values, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        res.status(201).json({ message: "Post crée !" });
    });
}
// FIN MIDDLEWARE

// MIDDLEWARE DELETEPOST
exports.deletePost = (req, res, next) => {

}
// FIN MIDDLEWARE

// MIDDLEWARE CREATECOMMENT
exports.createComment = (req, res, next) => {

}
// FIN MIDDLEWARE

// MIDDLEWARE REACTPOST
exports.reactPost = (req, res, next) => {

}
// FIN MIDDLEWARE