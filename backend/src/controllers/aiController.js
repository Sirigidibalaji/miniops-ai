const { analyzeLogs } = require("../services/aiService");

const analyzeIncident = async (req, res) => {
    try {
        const analysis = await analyzeLogs();

        res.status(200).json({
            success: true,
            message: "AI log analysis completed",
            analysis
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "AI analysis failed",
            error: error.message
        });
    }
};

module.exports = { analyzeIncident };