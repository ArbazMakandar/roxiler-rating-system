const express = require("express");

const {
    getMyStore,
    getMyStoreRatings,
    getOwnerDashboard
} = require("../controllers/ownerController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

// Store owner's dashboard
router.get(
    "/dashboard",
    authenticate,
    authorize("STORE_OWNER"),
    getOwnerDashboard
);

// Get owner's store
router.get(
    "/store",
    authenticate,
    authorize("STORE_OWNER"),
    getMyStore
);

// Get ratings received by owner's store
router.get(
    "/ratings",
    authenticate,
    authorize("STORE_OWNER"),
    getMyStoreRatings
);

module.exports = router;