// MODULES
const mysql = require('../dbConnect').connection;
const fs = require("fs"); // Permet de gérer les fichiers stockés
// FIN MODULES

// MIDDLEWARE GETALLPOSTS
exports.getAllPosts = (req, res, next) => {
    const userID = res.locals.userID;

    let sqlGetPosts;

    sqlGetPosts = `SELECT Post.postID, post.userID, legend, gifUrl, post.dateCreation, fistName, lastName, pseudo, avatarUrl,
    COUNT(CASE WHEN reaction.reaction = 1 then 1 else null end) AS countUp, 
    COUNT(CASE WHEN reaction.reaction = -1 then 1 else null end) AS countDown,
    SUM(CASE WHEN reaction.userID = ? AND reaction.reaction = 1 then 1 WHEN reaction.userID = ? AND reaction.reaction = -1 then -1 else 0 end) AS yourReaction,
    COUNT(CASE WHEN Post.userID = ? then 1 else null end) AS yourPost
    FROM Post LEFT OUTER JOIN User ON Post.userID = User.userID LEFT OUTER JOIN Reaction ON Post.postID = Reaction.postID GROUP BY Post.postID`;
    mysql.query(sqlGetPosts, [userID, userID, userID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({ message: "Aucun post à afficher !" });
        }
        res.status(200).json(result);
    });
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