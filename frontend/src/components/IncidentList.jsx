function IncidentList({ incidents = [] }) {
  return (
    <section className="incident-container">
      <div className="incident-header">
        <div>
          <span className="incident-eyebrow">SYSTEM ALERTS</span>
          <h2>Recent Incidents</h2>
          <p>Track and review infrastructure incidents.</p>
        </div>

        <div className="incident-count">
          {incidents.length} Total
        </div>
      </div>

      {incidents.length === 0 ? (
        <div className="no-incidents">
          <div className="success-icon">✓</div>
          <h3>All Systems Operational</h3>
          <p>No incidents detected. Your monitored websites look healthy.</p>
        </div>
      ) : (
        <div className="incident-list">
          {incidents.map((incident) => (
            <div className="incident-card" key={incident._id}>
              <div className="incident-main">
                <div className="incident-icon">⚠</div>

                <div className="incident-details">
                  <h3>{incident.website?.name || "Unknown Website"}</h3>

                  <p>
                    {incident.message || "No incident details available"}
                  </p>

                  <small>
                    {incident.startedAt
                      ? new Date(incident.startedAt).toLocaleString()
                      : "Date unavailable"}
                  </small>
                </div>
              </div>

              <span
                className={`incident-status ${
                  incident.status?.toLowerCase() || "unknown"
                }`}
              >
                {incident.status || "UNKNOWN"}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default IncidentList;