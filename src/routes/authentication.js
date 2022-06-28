const express = require("express");
const auth_controller = require("../controllers/authController");
const router = express.Router();

//Login
router.post("/login", auth_controller.user_login_post);

//Logout
router.get("/logout", auth_controller.user_logout_get);

//Refresh Token
router.post("/token", auth_controller.refresh_access_token);

module.exports = router;
