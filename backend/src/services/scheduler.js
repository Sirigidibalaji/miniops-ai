const cron = require("node-cron");

const {
    checkAllWebsites
} = require("./monitorService");

const startMonitoringScheduler = () => {

    // Run monitoring every minute
    cron.schedule("* * * * *", async () => {

        console.log("Starting automatic website monitoring...");

        try {
            await checkAllWebsites();

            console.log("Automatic monitoring completed!");

        } catch (error) {
            console.error("Scheduler error:", error.message);
        }

    });

    console.log("Monitoring scheduler started!");
};

module.exports = startMonitoringScheduler;