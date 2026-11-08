function WebsiteTable({ websites = [], onRefresh }) {
  return (
    <section className="table-container">
      <div className="table-header">
        <div>
          <span className="table-eyebrow">INFRASTRUCTURE</span>
          <h2>Website Monitoring</h2>
          <p>Monitor the availability and performance of your websites.</p>
        </div>

        <button className="table-refresh-btn" onClick={onRefresh}>
          ↻ Refresh Websites
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>WEBSITE</th>
              <th>URL</th>
              <th>STATUS</th>
              <th>RESPONSE TIME</th>
            </tr>
          </thead>

          <tbody>
            {websites.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-table">
                  No websites available.
                </td>
              </tr>
            ) : (
              websites.map((website) => (
                <tr key={website._id}>
                  <td>
                    <div className="website-name">
                      <span className="website-icon">🌐</span>
                      <strong>{website.name}</strong>
                    </div>
                  </td>

                  <td className="website-url">
                    {website.url}
                  </td>

                  <td>
                    <span
                      className={`status ${
                        website.status?.toLowerCase() || "unknown"
                      }`}
                    >
                      <span className="status-dot"></span>
                      {website.status || "UNKNOWN"}
                    </span>
                  </td>

                  <td className="response-time">
                    {website.responseTime != null
                      ? `${website.responseTime} ms`
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default WebsiteTable;