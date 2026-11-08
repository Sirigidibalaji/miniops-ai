function StatCard({ title, value, icon }) {
  const getCardType = () => {
    if (title.toLowerCase().includes("online")) return "online";
    if (title.toLowerCase().includes("offline")) return "offline";
    if (title.toLowerCase().includes("incident")) return "incident";
    return "total";
  };

  return (
    <div className={`stat-card ${getCardType()}`}>
      <div className="stat-card-info">
        <span className="stat-card-label">{title}</span>
        <p className="stat-card-value">{value}</p>
        <span className="stat-card-caption">Current status</span>
      </div>

      <div className="stat-card-icon">
        {icon}
      </div>
    </div>
  );
}

export default StatCard;