const axios = require("axios");
const Website = require("../models/Website");
const Incident = require("../models/Incident");

// Create an incident when a website goes DOWN
const createIncident = async (website) => {
    const existingIncident = await Incident.findOne({
        website: website._id,
        status: "OPEN"
    });

    // Avoid duplicate incidents
    if (!existingIncident) {
        await Incident.create({
            website: website._id,
            message: `${website.name} is DOWN`,
            status: "OPEN",
            startedAt: new Date()
        });

        console.log(`🚨 Incident created: ${website.name}`);
    }
};

// Resolve an incident when a website comes UP
const resolveIncident = async (website) => {
    const incident = await Incident.findOne({
        website: website._id,
        status: "OPEN"
    });

    if (incident) {
        incident.status = "RESOLVED";
        incident.resolvedAt = new Date();

        await incident.save();

        console.log(`✅ Incident resolved: ${website.name}`);
    }
};

// Check individual website health
const checkWebsite = async (website) => {
    const startTime = Date.now();

    try {
        const response = await axios.get(website.url, {
            timeout: 10000,
            maxRedirects: 5
        });

        const responseTime = Date.now() - startTime;

        const isUp =
            response.status >= 200 &&
            response.status < 400;

        website.status = isUp ? "UP" : "DOWN";
        website.responseTime = responseTime;
        website.lastChecked = new Date();

        await website.save();

        // Resolve or create incidents
        if (isUp) {
            await resolveIncident(website);
        } else {
            await createIncident(website);
        }

        console.log(
            `${website.name} | ${website.status} | ${responseTime} ms`
        );

        return {
            success: true,
            name: website.name,
            status: website.status,
            responseTime
        };

    } catch (error) {
        const responseTime = Date.now() - startTime;

        website.status = "DOWN";
        website.responseTime = responseTime;
        website.lastChecked = new Date();

        await website.save();

        // Create an incident for website failure
        await createIncident(website);

        console.log(
            `${website.name} | DOWN | ${error.message}`
        );

        return {
            success: false,
            name: website.name,
            status: "DOWN",
            responseTime,
            error: error.message
        };
    }
};

// Check all active registered websites
const checkAllWebsites = async () => {
    try {
        const websites = await Website.find({
            isActive: true
        });

        for (const website of websites) {
            await checkWebsite(website);
        }

        return websites.length;

    } catch (error) {
        console.error(
            "Monitoring error:",
            error.message
        );

        throw error;
    }
};

module.exports = {
    checkWebsite,
    checkAllWebsites
};