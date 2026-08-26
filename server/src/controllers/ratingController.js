const { Rating, Store } = require("../models");

// Create or update a rating
const submitRating = async (req, res) => {
    try {
        const { storeId, rating } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!storeId || rating === undefined) {
            return res.status(400).json({
                message: "Store ID and rating are required"
            });
        }

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                message: "Rating must be an integer between 1 and 5"
            });
        }

        // Check whether store exists
        const store = await Store.findByPk(storeId);

        if (!store) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        // Check if user has already rated this store
        const existingRating = await Rating.findOne({
            where: {
                userId,
                storeId
            }
        });

        if (existingRating) {
            // Update existing rating
            existingRating.rating = numericRating;
            await existingRating.save();

            return res.status(200).json({
                message: "Rating updated successfully",
                rating: existingRating
            });
        }

        // Create new rating
        const newRating = await Rating.create({
            userId,
            storeId,
            rating: numericRating
        });

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: newRating
        });
    } catch (error) {
        console.error("Submit rating error:", error);

        res.status(500).json({
            message: "Failed to submit rating"
        });
    }
};

// Get the current user's rating for a store
const getMyRating = async (req, res) => {
    try {
        const { storeId } = req.params;
        const userId = req.user.id;

        const rating = await Rating.findOne({
            where: {
                userId,
                storeId
            }
        });

        if (!rating) {
            return res.status(404).json({
                message: "You have not rated this store yet"
            });
        }

        res.status(200).json({
            rating
        });
    } catch (error) {
        console.error("Get rating error:", error);

        res.status(500).json({
            message: "Failed to fetch rating"
        });
    }
};

// Get all ratings for a store
const getStoreRatings = async (req, res) => {
    try {
        const { storeId } = req.params;

        const store = await Store.findByPk(storeId);

        if (!store) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        const ratings = await Rating.findAll({
            where: {
                storeId
            },
            order: [["createdAt", "DESC"]]
        });

        const totalRatings = ratings.length;

        const averageRating =
            totalRatings === 0
                ? 0
                : ratings.reduce((sum, item) => sum + item.rating, 0) /
                  totalRatings;

        res.status(200).json({
            storeId: Number(storeId),
            totalRatings,
            averageRating: Number(averageRating.toFixed(2)),
            ratings
        });
    } catch (error) {
        console.error("Get store ratings error:", error);

        res.status(500).json({
            message: "Failed to fetch store ratings"
        });
    }
};

module.exports = {
    submitRating,
    getMyRating,
    getStoreRatings
};