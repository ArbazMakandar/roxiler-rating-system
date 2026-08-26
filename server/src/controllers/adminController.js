const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { User, Store, Rating } = require("../models");

// Create a new store
const createStore = async (req, res) => {
    try {
        const { name, email, address, ownerId } = req.body;

        if (!name || !email || !address) {
            return res.status(400).json({
                message: "Name, email and address are required"
            });
        }

        // If ownerId is provided, verify that the owner exists
        if (ownerId !== undefined && ownerId !== null) {
            const owner = await User.findOne({
                where: {
                    id: ownerId,
                    role: "STORE_OWNER"
                }
            });

            if (!owner) {
                return res.status(400).json({
                    message: "Invalid store owner"
                });
            }
        }

        const store = await Store.create({
            name,
            email,
            address,
            ownerId: ownerId || null
        });

        res.status(201).json({
            message: "Store created successfully",
            store
        });
    } catch (error) {
        console.error("Create store error:", error);

        res.status(500).json({
            message: "Failed to create store"
        });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const {
            search = "",
            role,
            sortBy = "name",
            order = "asc"
        } = req.query;

        const where = {};

        if (search.trim()) {
            where[Op.or] = [
                {
                    name: {
                        [Op.like]: `%${search.trim()}%`
                    }
                },
                {
                    email: {
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

        if (role) {
            where.role = role;
        }

        const allowedSortFields = [
            "id",
            "name",
            "email",
            "address",
            "role",
            "createdAt"
        ];

        const selectedSortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "name";

        const selectedOrder =
            order.toLowerCase() === "desc" ? "DESC" : "ASC";

        const users = await User.findAll({
            where,
            attributes: {
                exclude: ["password"]
            },
            order: [[selectedSortField, selectedOrder]]
        });

        res.status(200).json({
            users
        });
    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};

// Create a user
const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            address,
            role
        } = req.body;

        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({
                message: "Name, email, password, address and role are required"
            });
        }

        const allowedRoles = ["ADMIN", "USER", "STORE_OWNER"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Create user error:", error);

        res.status(500).json({
            message: "Failed to create user"
        });
    }
};

// Admin dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();

        const totalStores = await Store.count();

        const totalRatings = await Rating.count();

        res.status(200).json({
            totalUsers,
            totalStores,
            totalRatings
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);

        res.status(500).json({
            message: "Failed to fetch dashboard statistics"
        });
    }
};

module.exports = {
    createStore,
    getUsers,
    createUser,
    getDashboardStats
};