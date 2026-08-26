const express = require("express");

const {
    createStore,
    getUsers,
    createUser,
    getDashboardStats
} = require("../controllers/adminController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

// Admin dashboard statistics
router.get(
    "/dashboard",
    authenticate,
    authorize("ADMIN"),
    getDashboardStats
);

// Create a new user
router.post(
    "/users",
    authenticate,
    authorize("ADMIN"),
    createUser
);

// Get users
router.get(
    "/users",
    authenticate,
    authorize("ADMIN"),
    getUsers
);

// Create a new store
router.post(
    "/stores",
    authenticate,
    authorize("ADMIN"),
    createStore
);

module.exports = router;