// MODULES
const express = require("express");
const router = express.Router();
// FIN MODULES

// IMPORTATION CONTROLLERS
const postCtrl = require("../controllers/post");
// FIN IMPORTATION

// IMPORTATION MIDDLEWARES
const auth = require("../middleware/auth"); // Crée un token d'identification
const multer = require("../middleware/multer-config"); // Permet d'envoyer un fichier dans la requête
// FIN IMPORTATION

// ROUTES
router.get("/", postCtrl.getAllPosts);
router.get("/:id", postCtrl.getOnePost);
router.post("/", auth, postCtrl.createPost);
router.delete("/:id", postCtrl.deletePost);
router.post("/:id/comment", postCtrl.createComment);
router.post("/:id/reaction", postCtrl.reactPost);
// FIN ROUTES

module.exports = router;