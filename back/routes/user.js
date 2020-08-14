// MODULES
const express = require("express");
const router = express.Router();
// FIN MODULES

// IMPORTATION USER CONTROLLERS
const userCtrl = require("../controllers/user");
// FIN IMPORTATION

// ROUTE
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.delete("/delete", userCtrl.delete);
router.get("/profile", userCtrl.profile);
// ROUTE

module.exports = router;