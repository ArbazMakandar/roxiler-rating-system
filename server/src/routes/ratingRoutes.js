const express = require("express");

const {
    submitRating,
    getMyRating,
    getStoreRatings
} = require("../controllers/ratingController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

// Submit or update a rating
router.post(
    "/",
    authenticate,
    authorize("USER", "STORE_OWNER"),
    submitRating
);

// Get current user's rating for a store
router.get(
    "/my/:storeId",
    authenticate,
    authorize("USER", "STORE_OWNER"),
    getMyRating
);

// Get all ratings for a store
router.get(
    "/store/:storeId",
    authenticate,
    authorize("ADMIN", "USER", "STORE_OWNER"),
    getStoreRatings
);

module.exports = router;