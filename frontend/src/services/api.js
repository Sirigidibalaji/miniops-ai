import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Get all monitored websites
export const getWebsites = () => {
  return API.get("/websites");
};

// Get all incidents
export const getIncidents = () => {
  return API.get("/incidents");
};

// Run website monitoring
export const runMonitoring = () => {
  return API.post("/monitor/run");
};

// Analyze application logs using Gemini AI
export const analyzeLogs = () => {
  return API.post("/ai/analyze");
};

export default API;
