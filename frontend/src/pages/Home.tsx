const Home = () => {
  return (
    <div className="page-shell">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">CrowleyDB</p>
          <h1>Welcome to the Crowley Knowledge Portal</h1>
          <p className="page-intro">
            An interdisciplinary scholarly and practitioner resource for the works, life, and occult system of
            Aleister Crowley.
          </p>
        </div>
        <div className="page-stat">
          <span>Evidence model</span>
          <strong>5 lanes</strong>
        </div>
      </section>

      <section className="glass-panel">
        <h2>System Architecture</h2>
        <p>This portal utilizes a 5-lane evidentiary system to separate self-mythology from objective history.</p>
      </section>
    </div>
  );
};

export default Home;
