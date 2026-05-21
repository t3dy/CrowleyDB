import React, { useState, useEffect } from 'react';
import { fetchJSON } from '../api';

const Grades = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string>('A.\'.A.\'.');

  useEffect(() => {
    fetchJSON('grades').then(data => {
      // Sort grades by path number (Kether=1 to Malkuth=10, inverted for grades sometimes, but Kether is usually 1)
      setGrades(data.sort((a: any, b: any) => b.tree_path_number - a.tree_path_number));
    });
  }, []);

  const systems = Array.from(new Set(grades.map(g => g.system)));

  const filteredGrades = grades.filter(g => g.system === selectedSystem);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Magical Grades & Initiations</h1>
      <p>Initiatory systems mapped onto the Tree of Life.</p>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        {systems.map(system => (
          <button 
            key={system}
            onClick={() => setSelectedSystem(system)} 
            style={{ 
              padding: '0.5rem 1rem', 
              background: selectedSystem === system ? 'var(--accent-gold)' : 'var(--bg-obsidian)', 
              color: selectedSystem === system ? '#000' : 'var(--text-parchment)', 
              cursor: 'pointer',
              border: '1px solid var(--accent-gold)'
            }}
          >
            {system}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredGrades.map(grade => (
          <div key={grade.id} className="glass-panel" style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
            <div style={{ 
              width: '100px', 
              textAlign: 'center', 
              background: 'var(--bg-obsidian)', 
              padding: '1rem', 
              border: '1px solid var(--accent-gold)', 
              borderRadius: '8px' 
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Path</div>
              <div style={{ fontSize: '2rem', color: 'var(--accent-gold)' }}>{grade.tree_path_number}</div>
            </div>
            
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0' }}>{grade.name}</h2>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6 }}>{grade.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grades;
