function WebsiteTable({ websites = [], onRefresh }) {
  return (
    <section className="table-container">
      <h2>🌐 Website Monitoring</h2>

      <table>
        <thead>
          <tr>
            <th>Website Name</th>
            <th>URL</th>
            <th>Status</th>
            <th>Response Time</th>
          </tr>
        </thead>

        <tbody>
          {websites.length === 0 ? (
            <tr>
              <td colSpan="4">No websites available.</td>
            </tr>
          ) : (
            websites.map((website) => (
              <tr key={website._id}>
                <td>{website.name}</td>
                <td>{website.url}</td>
                <td>
                  <span className={`status ${website.status?.toLowerCase()}`}>
                    {website.status || "UNKNOWN"}
                  </span>
                </td>
                <td>
                  {website.responseTime != null
                    ? `${website.responseTime} ms`
                    : "N/A"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button onClick={onRefresh}>Refresh Websites</button>
    </section>
  );
}

export default WebsiteTable;