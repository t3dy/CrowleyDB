import React, { useState, useEffect } from 'react';
import { fetchJSON } from '../api';
import { useLane } from '../App';

const Works = () => {
  const [works, setWorks] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
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
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>The Libri & Works</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {filteredWorks.map((work, idx) => (
          <div key={idx} className="glass-panel">
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{work.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Class: {work.class}</p>
            <span style={{ 
              display: 'inline-block', 
              padding: '0.2rem 0.5rem', 
              borderRadius: '4px',
              fontSize: '0.8rem',
              background: `var(--lane-${getLaneForWork(work).toLowerCase()})`,
              color: '#fff'
            }}>
              Lane {getLaneForWork(work)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works;
