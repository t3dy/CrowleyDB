import TopicShelf from '../components/TopicShelf';
import { TOPIC_GROUPS } from '../topicGroups';

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

      <TopicShelf
        title="Portal-wide orientation"
        intro="These are the most important entry topics for the whole site: the ones that explain what the portal is about before the reader starts drilling into the sections."
        slugs={TOPIC_GROUPS.home}
      />
    </div>
  );
};

export default Home;
