import { useState, useEffect } from 'react';
import { fetchJSON } from '../api';
import { useLane } from '../App';

const Works = () => {
  const [works, setWorks] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const { currentLane } = useLane();

  useEffect(() => {
    fetchJSON('works').then(setWorks);
    fetchJSON('documents').then(setDocs);
  }, []);

  const getLaneForWork = (work: any) => {
    const doc = docs.find(d => d.id === work.document_id);
    return doc ? doc.evidentiary_lane : 'Unknown';
  };

  const filteredWorks = works.filter(w => {
    if (currentLane === 'All') return true;
    return getLaneForWork(w) === currentLane;
  }).filter(work => {
    const search = query.trim().toLowerCase();
    if (!search) return true;
    return [
      work.title,
      String(work.liber_number ?? ''),
      work.class,
      work.date_composed || '',
      work.location_composed || '',
      work.summary || '',
    ]
      .join(' ')
      .toLowerCase()
      .includes(search);
  }).sort((a, b) => {
    const left = a.liber_number ?? Number.POSITIVE_INFINITY;
    const right = b.liber_number ?? Number.POSITIVE_INFINITY;
    return left - right || a.title.localeCompare(b.title);
  });

  return (
    <div style={{ padding: '2rem' }}>
      <div className="glass-panel" style={{ marginBottom: '1rem', display: 'grid', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Works
          </p>
          <h1 style={{ margin: '0.25rem 0 0' }}>The Libri & Major Works</h1>
          <p style={{ margin: '0.5rem 0 0', lineHeight: 1.6 }}>
            These summaries are written as portal copy: concise, factual, and explicit about what each work does
            inside Crowley&apos;s system.
          </p>
        </div>

        <label style={{ display: 'grid', gap: '0.4rem', maxWidth: '520px' }}>
          Search works
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search title, liber number, location, or summary"
            style={{
              width: '100%',
              padding: '0.8rem 0.9rem',
              borderRadius: '10px',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              background: 'rgba(0, 0, 0, 0.25)',
              color: 'var(--text-parchment)',
            }}
          />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {filteredWorks.map((work, idx) => (
          <div key={idx} className="glass-panel" style={{ display: 'grid', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start' }}>
              <div>
                <h3 style={{ margin: '0 0 0.35rem 0' }}>{work.title}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {work.liber_number ? `Liber ${work.liber_number}` : 'No liber number'}
                </p>
              </div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  background: `var(--lane-${getLaneForWork(work).toLowerCase()})`,
                  color: '#fff',
                }}
              >
                Lane {getLaneForWork(work)}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Class {work.class}</span>
              <span>{work.date_composed}</span>
              <span>{work.location_composed}</span>
            </div>

            <p style={{ margin: 0, lineHeight: 1.58 }}>{work.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works;
