import { useState, useEffect } from 'react';
import { fetchJSON } from '../api';

const Saints = () => {
  const [saints, setSaints] = useState<any[]>([]);

  useEffect(() => {
    fetchJSON('persons').then(data => {
      setSaints(data.filter((p: any) => p.role_category === 'Thelemic Saint'));
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>The Thelemic Saints</h1>
      <p>The Gnostic Saints invoked in Liber XV, The Gnostic Mass, and honored in the Thelemic tradition.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {saints.map(saint => (
          <div key={saint.id} className="glass-panel">
            <h2 style={{ margin: '0 0 0.5rem 0' }}>{saint.name}</h2>
            {saint.magical_motto !== 'Unknown' && (
              <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--accent-gold)' }}>
                {saint.magical_motto}
              </p>
            )}
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {saint.birth_year ? `${saint.birth_year} - ` : ''}{saint.death_year || 'Unknown'}
            </p>
            
            <p style={{ marginTop: '1rem', lineHeight: 1.5 }}>
              {saint.biography}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saints;
