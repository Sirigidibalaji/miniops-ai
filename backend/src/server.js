// 1. Load environment variables
require("dotenv").config();

// 2. Import Express application
const app = require("./app");

// 3. Import Winston logger
const logger = require("./utils/logger");
// Temporary Winston logging test


// 4. Import MongoDB connection
const connectDB = require("./config/db");

// 5. Import monitoring scheduler
const startMonitoringScheduler = require("./services/scheduler");

// 6. Define server port
const PORT = process.env.PORT || 5000;

// 7. Start backend server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        logger.info("MongoDB connected successfully");

        // Start automatic monitoring
        startMonitoringScheduler();

        // Start Express server
        const server = app.listen(PORT, () => {
            console.log("==================================");
            console.log("       MINI OPS AI SERVER");
            console.log("==================================");
            console.log(`Server: http://localhost:${PORT}`);
            console.log(`Health: http://localhost:${PORT}/api/health`);
            console.log("Status: RUNNING");
            console.log("==================================");

            logger.info("MiniOps AI server started", {
                port: PORT
            });
        });

        // Handle server errors
        server.on("error", (error) => {
            logger.error("Server error", {
                error: error.message
            });

            console.error("Server error:", error.message);
        });

    } catch (error) {
        logger.error("Server startup failed", {
            error: error.message
        });

        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

// Start application
startServer();