function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">M</div>

        <div className="navbar-title">
          <h2>MiniOps <span>AI</span></h2>
          <p>Intelligent DevOps Platform</p>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-live">
          <span className="live-dot"></span>
          System Monitoring
        </div>

        <div className="navbar-version">
          v1.0
        </div>
      </div>
    </nav>
  );
}

export default Navbar;