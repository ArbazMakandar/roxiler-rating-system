const { Op, fn, col, literal } = require("sequelize");
const { Store, Rating } = require("../models");

const getStores = async (req, res) => {
    try {
        const {
            search = "",
            name = "",
            address = "",
            sortBy = "name",
            order = "asc",
            page = 1,
            limit = 10
        } = req.query;

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const limitNumber = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
        const offset = (pageNumber - 1) * limitNumber;

        const where = {};

        // General search
        if (search.trim()) {
            where[Op.or] = [
                {
                    name: {
                        [Op.like]: `%${search.trim()}%`
                    }
                },
                {
                    address: {
                        [Op.like]: `%${search.trim()}%`
                    }
                }
            ];
        }

        // Separate name filter
        if (name.trim()) {
            where.name = {
                [Op.like]: `%${name.trim()}%`
            };
        }

        // Separate address filter
        if (address.trim()) {
            where.address = {
                [Op.like]: `%${address.trim()}%`
            };
        }

        const allowedSortFields = ["id", "name", "email", "address", "createdAt"];

        const selectedSortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "name";

        const selectedOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

        const { count, rows } = await Store.findAndCountAll({
            where,
            attributes: {
                include: [
                    [
                        fn("COALESCE", fn("AVG", col("ratings.rating")), 0),
                        "overallRating"
                    ]
                ]
            },
            include: [
                {
                    model: Rating,
                    as: "ratings",
                    attributes: []
                }
            ],
            group: ["Store.id"],
            order: [[selectedSortField, selectedOrder]],
            limit: limitNumber,
            offset,
            subQuery: false
        });

        const totalStores = Array.isArray(count)
            ? count.length
            : count;

        res.status(200).json({
            stores: rows,
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalStores,
                totalPages: Math.ceil(totalStores / limitNumber)
            }
        });
    } catch (error) {
        console.error("Get stores error:", error);

        res.status(500).json({
            message: "Failed to fetch stores"
        });
    }
};

const getStoreById = async (req, res) => {
    try {
        const { id } = req.params;

        const store = await Store.findByPk(id, {
            attributes: {
                include: [
                    [
                        fn("COALESCE", fn("AVG", col("ratings.rating")), 0),
                        "overallRating"
                    ]
                ]
            },
            include: [
                {
                    model: Rating,
                    as: "ratings",
                    attributes: []
                }
            ],
            group: ["Store.id"]
        });

        if (!store) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        res.status(200).json({
            store
        });
    } catch (error) {
        console.error("Get store error:", error);

        res.status(500).json({
            message: "Failed to fetch store"
        });
    }
};

module.exports = {
    getStores,
    getStoreById
};