const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const incidentRoutes = require("./routes/incidentRoutes");
const monitorRoutes = require("./routes/monitorRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/incidents", incidentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", monitorRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to MiniOps AI Backend!");
});

// Health check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "MiniOps AI Backend Running",
        status: "Healthy"
    });
});

module.exports = app;