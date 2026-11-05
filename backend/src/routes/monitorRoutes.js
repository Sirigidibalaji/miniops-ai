const express = require("express");
const router = express.Router();

const {
    addWebsite,
    getWebsites,
    runMonitoring
} = require("../controllers/monitorController");

router.post("/websites", addWebsite);
router.get("/websites", getWebsites);
router.post("/monitor/run", runMonitoring);

module.exports = router;