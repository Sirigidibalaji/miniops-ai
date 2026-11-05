const Website = require("../models/Website");

const {
    checkAllWebsites
} = require("../services/monitorService");

// 1. Register a website
const addWebsite = async (req, res) => {
    try {
        const { name, url } = req.body;

        if (!name || !url) {
            return res.status(400).json({
                success: false,
                message: "Name and URL are required"
            });
        }

        let parsedUrl;

        try {
            parsedUrl = new URL(url);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid website URL"
            });
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({
                success: false,
                message: "Only HTTP and HTTPS URLs are allowed"
            });
        }

        const website = await Website.create({
            name,
            url: parsedUrl.toString()
        });

        res.status(201).json({
            success: true,
            message: "Website registered successfully",
            data: website
        });

    } catch (error) {
        console.error("Website registration error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to register website"
        });
    }
};

// 2. Get all websites
const getWebsites = async (req, res) => {
    try {
        const websites = await Website.find().sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: websites.length,
            data: websites
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch websites"
        });
    }
};

// 3. Run website monitoring manually
const runMonitoring = async (req, res) => {
    try {
        const checkedCount = await checkAllWebsites();

        res.status(200).json({
            success: true,
            message: "Website monitoring completed",
            checkedCount
        });

    } catch (error) {
        console.error("Monitoring error:", error.message);

        res.status(500).json({
            success: false,
            message: "Monitoring failed"
        });
    }
};

// Export controllers
module.exports = {
    addWebsite,
    getWebsites,
    runMonitoring
};