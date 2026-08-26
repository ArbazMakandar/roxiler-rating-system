const { Op, fn, col } = require("sequelize");
const { Store, Rating, User } = require("../models");

// Get the store owned by the logged-in store owner
const getMyStore = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const store = await Store.findOne({
            where: {
                ownerId
            }
        });

        if (!store) {
            return res.status(404).json({
                message: "No store is assigned to your account"
            });
        }

        const ratings = await Rating.findAll({
            where: {
                storeId: store.id
            }
        });

        const totalRatings = ratings.length;

        const averageRating =
            totalRatings === 0
                ? 0
                : ratings.reduce(
                    (sum, item) => sum + item.rating,
                    0
                ) / totalRatings;

        res.status(200).json({
            store: {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address
            },
            totalRatings,
            averageRating: Number(
                averageRating.toFixed(2)
            )
        });

    } catch (error) {
        console.error("Get my store error:", error);

        res.status(500).json({
            message: "Failed to fetch your store"
        });
    }
};

// Get ratings received by the logged-in store owner
const getMyStoreRatings = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const store = await Store.findOne({
            where: {
                ownerId
            }
        });

        if (!store) {
            return res.status(404).json({
                message: "No store is assigned to your account"
            });
        }

        const ratings = await Rating.findAll({
            where: {
                storeId: store.id
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "name",
                        "email",
                        "address"
                    ]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        const totalRatings = ratings.length;

        const averageRating =
            totalRatings === 0
                ? 0
                : ratings.reduce(
                      (sum, item) => sum + item.rating,
                      0
                  ) / totalRatings;

        res.status(200).json({
            store: {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address
            },
            totalRatings,
            averageRating: Number(averageRating.toFixed(2)),
            ratings
        });
    } catch (error) {
        console.error("Get my store ratings error:", error);

        res.status(500).json({
            message: "Failed to fetch store ratings"
        });
    }
};

// Get dashboard statistics for the store owner
const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const store = await Store.findOne({
            where: {
                ownerId
            }
        });

        if (!store) {
            return res.status(404).json({
                message: "No store is assigned to your account"
            });
        }

        const ratings = await Rating.findAll({
            where: {
                storeId: store.id
            }
        });

        const totalRatings = ratings.length;

        const averageRating =
            totalRatings === 0
                ? 0
                : ratings.reduce(
                      (sum, item) => sum + item.rating,
                      0
                  ) / totalRatings;

        res.status(200).json({
            storeId: store.id,
            storeName: store.name,
            totalRatings,
            averageRating: Number(averageRating.toFixed(2))
        });
    } catch (error) {
        console.error("Owner dashboard error:", error);

        res.status(500).json({
            message: "Failed to fetch owner dashboard"
        });
    }
};

module.exports = {
    getMyStore,
    getMyStoreRatings,
    getOwnerDashboard
};