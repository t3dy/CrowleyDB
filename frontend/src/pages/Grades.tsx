import { useState, useEffect } from 'react';
import { fetchJSON } from '../api';
import TopicShelf from '../components/TopicShelf';
import { TOPIC_GROUPS } from '../topicGroups';

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
    <div className="page-shell">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Grades</p>
          <h1>Magical Grades &amp; Initiations</h1>
          <p className="page-intro">Initiatory systems mapped onto the Tree of Life.</p>
        </div>
        <div className="page-stat">
          <span>Systems</span>
          <strong>{systems.length}</strong>
        </div>
      </section>

      <div style={{ marginBottom: '0.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {systems.map(system => (
          <button 
            key={system}
            onClick={() => setSelectedSystem(system)} 
            className={selectedSystem === system ? 'tree-chip is-active' : 'tree-chip'}
          >
            {system}
          </button>
        ))}
      </div>

      <div className="timeline-stack">
        {filteredGrades.map(grade => (
          <article key={grade.id} className="glass-panel timeline-card">
            <div className="page-stat" style={{ minWidth: '120px' }}>
              <span>Path</span>
              <strong>{grade.tree_path_number}</strong>
            </div>
            
            <div>
              <h3>{grade.name}</h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>{grade.description}</p>
            </div>
          </article>
        ))}
      </div>

      <TopicShelf
        title="Key grades topics"
        intro="These topics explain the structural side of the initiatory system: grades, discipline, organization, curriculum, and the logic that links the orders to the Tree of Life."
        slugs={TOPIC_GROUPS.grades}
      />
    </div>
  );
};

export default Grades;
