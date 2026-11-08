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

        <header className="dashboard-header">
          <div>
            <span className="eyebrow">INFRASTRUCTURE OVERVIEW</span>
            <h1>Command Center</h1>
            <p>
              Monitor your infrastructure and resolve incidents
              intelligently with MiniOps AI.
            </p>
          </div>

          <div className="system-status">
            <span className="status-indicator"></span>
            Monitoring Dashboard
          </div>
        </header>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <section className="stats-grid">
          <StatCard
            title="Total Websites"
            value={totalWebsites}
            icon="🌐"
          />

          <StatCard
            title="Websites Online"
            value={upWebsites}
            icon="✓"
          />

          <StatCard
            title="Websites Offline"
            value={downWebsites}
            icon="!"
          />

          <StatCard
            title="Open Incidents"
            value={openIncidents}
            icon="⚠"
          />
        </section>

        <section className="dashboard-actions">
          <div>
            <h2>Quick Actions</h2>
            <p>Manage your infrastructure operations.</p>
          </div>

          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={handleMonitoring}
              disabled={loading}
            >
              {loading ? "Processing..." : "▶ Run Monitoring"}
            </button>

            <button
              className="btn-ai"
              onClick={handleAIAnalysis}
              disabled={loading}
            >
              ✦ Analyze with AI
            </button>

            <button
              className="btn-secondary"
              onClick={fetchDashboardData}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>
        </section>

        <section className="dashboard-panel">
          <WebsiteTable
            websites={websites}
            onRefresh={fetchDashboardData}
          />
        </section>

        <section className="dashboard-panel">
          <IncidentList incidents={incidents} />
        </section>

        {aiAnalysis && (
          <section className="ai-analysis">
            <div className="ai-heading">
              <span>✦</span>
              <div>
                <h2>Gemini AI Analysis</h2>
                <p>Intelligent incident insights</p>
              </div>
            </div>

            <pre>{aiAnalysis}</pre>
          </section>
        )}

        <footer className="dashboard-footer">
          <span>MiniOps AI</span>
          <span>Intelligent DevOps Monitoring Platform</span>
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;