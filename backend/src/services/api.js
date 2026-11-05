import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getWebsites = () => API.get("/websites");

export const getIncidents = () => API.get("/incidents");

export const runMonitoring = () => API.post("/monitor/run");

export const analyzeLogs = () => API.post("/ai/analyze");

export default API;