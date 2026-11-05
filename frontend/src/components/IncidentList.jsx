function IncidentList({ incidents = [] }) {
  return (
    <section className="incident-container">
      <h2>🚨 Recent Incidents</h2>

      {incidents.length === 0 ? (
        <p className="no-incidents">
          No incidents detected. All systems look good!
        </p>
      ) : (
        incidents.map((incident) => (
          <div className="incident-card" key={incident._id}>
            <div>
              <h3>{incident.website?.name || "Unknown Website"}</h3>
              <p>{incident.message || "No incident details available"}</p>
              <small>
                {incident.startedAt
                  ? new Date(incident.startedAt).toLocaleString()
                  : "Date unavailable"}
              </small>
            </div>

            <span className={`incident-status ${incident.status?.toLowerCase()}`}>
              {incident.status}
            </span>
          </div>
        ))
      )}
    </section>
  );
}

export default IncidentList;