const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
    {
        website: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Website",
            required: true
        },

        message: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["OPEN", "RESOLVED"],
            default: "OPEN"
        },

        startedAt: {
            type: Date,
            default: Date.now
        },

        resolvedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Incident", incidentSchema);