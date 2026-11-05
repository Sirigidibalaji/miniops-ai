const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Read application logs
const readLogs = () => {
    const logPath = path.join(
        __dirname,
        "../../logs/combined.log"
    );

    if (!fs.existsSync(logPath)) {
        throw new Error("Log file not found");
    }

    const logs = fs.readFileSync(logPath, "utf8");

    if (!logs.trim()) {
        throw new Error("Log file is empty");
    }

    // Analyze only the latest 15,000 characters
    return logs.slice(-15000);
};

// Analyze logs using Gemini
const analyzeLogs = async () => {
    try {
        const logs = readLogs();

        const prompt = `
You are an experienced DevOps engineer.

Analyze these application logs.

Provide:

1. Incident Summary
2. Possible Cause
3. Recommended Solution
4. Prevention Steps

Rules:
- Use simple technical English.
- Base your analysis only on the provided logs.
- Do not invent facts.
- Clearly mention when evidence is insufficient.

Application Logs:
${logs}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        return response.text;

    } catch (error) {
        console.error("AI Analysis Error:", error.message);
        throw error;
    }
};

module.exports = { analyzeLogs };