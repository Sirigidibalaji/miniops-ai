const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        url: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["UP", "DOWN", "UNKNOWN"],
            default: "UNKNOWN"
        },

        responseTime: {
            type: Number,
            default: 0
        },

        lastChecked: {
            type: Date,
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Website", websiteSchema);