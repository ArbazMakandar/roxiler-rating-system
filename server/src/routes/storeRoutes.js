const express = require("express");

const {
    getStores,
    getStoreById
} = require("../controllers/storeController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

// Get all stores
router.get(
    "/",
    authenticate,
    authorize("ADMIN", "USER", "STORE_OWNER"),
    getStores
);

// Get a single store
router.get(
    "/:id",
    authenticate,
    authorize("ADMIN", "USER", "STORE_OWNER"),
    getStoreById
);

module.exports = router;