const express = require("express");
const {
  validateSignup,
  validateLogin,
} = require("../middlewares/validate.middleware");
const {
  signup,
  login,
  getMe,
  logout,
} = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/me", auth(["user", "admin"]), getMe);
router.post("/logout", auth(["user", "admin"]), logout);

module.exports = router;
