const express = require("express");
const {
    register,
    login,
    changePassword
} = require("../controllers/authController");
const {
    validateRegister,
    validateLogin,
    validateChangePassword
} = require("../validators/authValidator");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.put("/password", authenticate, validateChangePassword, changePassword);

module.exports = router;
