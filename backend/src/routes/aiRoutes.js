const express = require("express");
const router = express.Router();

const {
    analyzeIncident
} = require("../controllers/aiController");

router.post("/analyze", analyzeIncident);

module.exports = router;
