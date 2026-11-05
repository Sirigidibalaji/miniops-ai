import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import WebsiteTable from "../components/WebsiteTable";
import IncidentList from "../components/IncidentList";

import {
  getWebsites,
  getIncidents,
  runMonitoring,
  analyzeLogs,
} from "../services/api";

function Dashboard() {
  const [websites, setWebsites] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setError("");

      const websiteResponse = await getWebsites();
      const incidentResponse = await getIncidents();

      setWebsites(websiteResponse.data.data || []);
      setIncidents(incidentResponse.data.data || []);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Unable to fetch dashboard data.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMonitoring = async () => {
    try {
      setLoading(true);
      await runMonitoring();
      await fetchDashboardData();
      alert("Monitoring completed!");
    } catch (err) {
      alert("Monitoring failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIAnalysis = async () => {
    try {
      setLoading(true);

      const response = await analyzeLogs();

      setAiAnalysis(
        response.data.analysis || "No AI analysis available."
      );
    } catch (err) {
      alert("AI analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalWebsites = websites.length;

  const upWebsites = websites.filter(
    (website) => website.status === "UP"
  ).length;

  const downWebsites = websites.filter(
    (website) => website.status === "DOWN"
  ).length;

  const openIncidents = incidents.filter(
    (incident) => incident.status === "OPEN"
  ).length;

  return (
    <div className="dashboard">

      <Navbar />

      <main className="dashboard-content">

        <h1>DevOps Monitoring Dashboard</h1>

        <p>
          Monitor your infrastructure intelligently with MiniOps AI.
        </p>

        {error && (
          <p style={{ color: "#f87171" }}>{error}</p>
        )}

        <div className="stats-grid">

          <StatCard
            title="Total Websites"
            value={totalWebsites}
            icon="🌐"
          />

          <StatCard
            title="Websites UP"
            value={upWebsites}
            icon="✅"
          />

          <StatCard
            title="Websites DOWN"
            value={downWebsites}
            icon="🔴"
          />

          <StatCard
            title="Open Incidents"
            value={openIncidents}
            icon="🚨"
          />

        </div>

        <div className="action-buttons">

          <button onClick={handleMonitoring} disabled={loading}>
            {loading ? "Processing..." : "Run Monitoring"}
          </button>

          <button onClick={handleAIAnalysis} disabled={loading}>
            Analyze Logs with AI
          </button>

          <button onClick={fetchDashboardData} disabled={loading}>
            Refresh Dashboard
          </button>

        </div>

        <WebsiteTable
          websites={websites}
          onRefresh={fetchDashboardData}
        />

        <IncidentList incidents={incidents} />

        {aiAnalysis && (
          <section className="ai-analysis">
            <h2>🤖 Gemini AI Incident Analysis</h2>
            <pre>{aiAnalysis}</pre>
          </section>
        )}

      </main>
    </div>
  );
}

export default Dashboard;