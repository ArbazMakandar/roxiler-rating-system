require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const storeRoutes = require("./src/routes/storeRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const ratingRoutes = require("./src/routes/ratingRoutes");
const ownerRoutes = require("./src/routes/ownerRoutes");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/owner", ownerRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});