const { sequelize } = require("./models");

async function syncDatabase() {
    try {
        await sequelize.sync();
        console.log("Database tables created successfully!");
    } catch (error) {
        console.error("Database synchronization failed:", error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();