import { useState, useEffect } from 'react';
import { fetchJSON } from '../api';
import TopicShelf from '../components/TopicShelf';
import { TOPIC_GROUPS } from '../topicGroups';

const Saints = () => {
  const [saints, setSaints] = useState<any[]>([]);

  useEffect(() => {
    fetchJSON('persons').then(data => {
      setSaints(data.filter((p: any) => p.role_category === 'Thelemic Saint'));
    });
  }, []);

  return (
    <div className="page-shell">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Saints</p>
          <h1>The Thelemic Saints</h1>
          <p className="page-intro">
            The Gnostic Saints invoked in Liber XV, The Gnostic Mass, and honored in the Thelemic tradition.
          </p>
        </div>
        <div className="page-stat">
          <span>Figures</span>
          <strong>{saints.length}</strong>
        </div>
      </section>

      <div className="page-grid page-grid--cards">
        {saints.map(saint => (
          <article key={saint.id} className="glass-panel term-card">
            <h3>{saint.name}</h3>
            {saint.magical_motto !== 'Unknown' && (
              <p className="term-card__etymology">
                {saint.magical_motto}
              </p>
            )}
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {saint.birth_year ? `${saint.birth_year} - ` : ''}{saint.death_year || 'Unknown'}
            </p>
            
            <p>
              {saint.biography}
            </p>
          </article>
        ))}
      </div>

      <TopicShelf
        title="Key saint topics"
        intro="These cards show why the saints remain in the portal: they connect Crowley to older magical lineages, later reception, and the broader culture that carried those names forward."
        slugs={TOPIC_GROUPS.saints}
      />
    </div>
  );
};

export default Saints;
