const Incident = require("../models/Incident");

// Get all incidents
const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find()
            .populate("website", "name url status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: incidents.length,
            data: incidents
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getIncidents };