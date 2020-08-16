// MODULES
const express = require("express");
const router = express.Router();
// FIN MODULES

// IMPORTATION USER CONTROLLERS
const userCtrl = require("../controllers/user");
// FIN IMPORTATION

// IMPORTATION MIDDLEWARES
const auth = require("../middleware/auth"); // Crée un token d'identification
// FIN IMPORTATION

// ROUTE
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.delete("/delete", auth, userCtrl.delete);
router.get("/:id/profile", auth, userCtrl.profile);
router.put("/modify", auth, userCtrl.modify);
// ROUTE

module.exports = router;