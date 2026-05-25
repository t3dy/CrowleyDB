import { useState, useEffect, useMemo } from 'react';
import { fetchJSON } from '../api';
import EmptyResults from '../components/EmptyResults';
import ResearchToolbar from '../components/ResearchToolbar';
import TopicShelf from '../components/TopicShelf';
import { TOPIC_GROUPS } from '../topicGroups';

type Grade = {
  id: string;
  name: string;
  system: string;
  tree_path_number: number;
  description: string;
};

const Grades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string>('A.\'.A.\'.');
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState('descent');

  useEffect(() => {
    fetchJSON('grades').then(data => {
      // Sort grades by path number (Kether=1 to Malkuth=10, inverted for grades sometimes, but Kether is usually 1)
      setGrades((data as Grade[]).sort((a, b) => b.tree_path_number - a.tree_path_number));
    });
  }, []);

  const systems = useMemo(() => Array.from(new Set(grades.map(g => g.system))).sort(), [grades]);

  const filteredGrades = useMemo(() => {
    const search = query.trim().toLowerCase();
    return [...grades]
      .filter(grade => {
        if (selectedSystem !== 'All' && grade.system !== selectedSystem) return false;
        if (!search) return true;
        return [grade.name, grade.system, String(grade.tree_path_number), grade.description]
          .join(' ')
          .toLowerCase()
          .includes(search);
      })
      .sort((left, right) => {
        if (sortMode === 'ascent') return left.tree_path_number - right.tree_path_number || left.name.localeCompare(right.name);
        if (sortMode === 'name') return left.name.localeCompare(right.name);
        if (sortMode === 'system') return left.system.localeCompare(right.system) || right.tree_path_number - left.tree_path_number;
        return right.tree_path_number - left.tree_path_number || left.name.localeCompare(right.name);
      });
  }, [grades, selectedSystem, query, sortMode]);

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

      <ResearchToolbar
        query={query}
        onQueryChange={setQuery}
        searchLabel="Search grades"
        searchPlaceholder="Grade, order, Tree number, or description"
        countLabel="Grades"
        count={filteredGrades.length}
        filters={[
          {
            id: 'system',
            label: 'System',
            value: selectedSystem,
            options: ['All', ...systems].map(value => ({ value, label: value === 'All' ? 'All systems' : value })),
            onChange: setSelectedSystem,
          },
        ]}
        sort={{
          label: 'Sort',
          value: sortMode,
          options: [
            { value: 'descent', label: 'Tree descent' },
            { value: 'ascent', label: 'Tree ascent' },
            { value: 'name', label: 'Name' },
            { value: 'system', label: 'System' },
          ],
          onChange: setSortMode,
        }}
        onReset={() => {
          setQuery('');
          setSelectedSystem('A.\'.A.\'.');
          setSortMode('descent');
        }}
      />

      {filteredGrades.length === 0 ? (
        <EmptyResults message="Try another order, Tree number, grade name, or a broader initiatory keyword." />
      ) : (
        <div className="timeline-stack">
          {filteredGrades.map(grade => (
            <article
              key={grade.id}
              className="glass-panel timeline-card"
              data-portal-track-hover="true"
              data-portal-track-click="true"
              data-portal-track-label={grade.name}
              data-portal-track-detail={grade.description}
              data-portal-track-source="Grades"
              data-portal-track-domain="grades"
              data-portal-tree-number={String(grade.tree_path_number)}
              data-portal-tree-kind={grade.tree_path_number <= 10 ? 'sephirah' : 'path'}
            >
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
      )}

      <TopicShelf
        title="Key grades topics"
        intro="These topics explain the structural side of the initiatory system: grades, discipline, organization, curriculum, and the logic that links the orders to the Tree of Life."
        slugs={TOPIC_GROUPS.grades}
      />
    </div>
  );
};

export default Grades;
