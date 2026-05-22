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
    <div className="page-shell">
      <div className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Works</p>
          <h1>The Libri &amp; Major Works</h1>
          <p className="page-intro">
            These summaries are written as portal copy: concise, factual, and explicit about what each work does
            inside Crowley&apos;s system.
          </p>
          <label className="stacked-field" style={{ marginTop: '1rem' }}>
            <span>Search works</span>
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search title, liber number, location, or summary"
            />
          </label>
        </div>
        <div className="page-stat">
          <span>Works shown</span>
          <strong>{filteredWorks.length}</strong>
        </div>
      </div>

      <div className="page-grid page-grid--cards">
        {filteredWorks.map((work, idx) => (
          <article key={idx} className="glass-panel term-card">
            <div className="timeline-card__meta">
              <div>
                <h3>{work.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {work.liber_number ? `Liber ${work.liber_number}` : 'No liber number'}
                </p>
              </div>
              <span className={`lane-pill lane-pill--${getLaneForWork(work).toLowerCase()}`}>Lane {getLaneForWork(work)}</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Class {work.class}</span>
              <span>{work.date_composed}</span>
              <span>{work.location_composed}</span>
            </div>

            <p>{work.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Works;
