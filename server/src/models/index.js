const sequelize = require("../config/database");

const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// User -> Ratings
User.hasMany(Rating, {
    foreignKey: "userId",
    as: "ratings",
    onDelete: "CASCADE"
});

Rating.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});

// Store -> Ratings
Store.hasMany(Rating, {
    foreignKey: "storeId",
    as: "ratings",
    onDelete: "CASCADE"
});

Rating.belongsTo(Store, {
    foreignKey: "storeId",
    as: "store"
});

// User -> Store (Store Owner)
User.hasOne(Store, {
    foreignKey: "ownerId",
    as: "store"
});

Store.belongsTo(User, {
    foreignKey: "ownerId",
    as: "owner",
    onDelete: "SET NULL"
});

module.exports = {
    sequelize,
    User,
    Store,
    Rating
};