import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../api';
import EmptyResults from '../components/EmptyResults';
import ResearchToolbar from '../components/ResearchToolbar';
import TopicShelf from '../components/TopicShelf';
import { TOPIC_GROUPS } from '../topicGroups';

type Saint = {
  id: string;
  name: string;
  magical_motto: string | null;
  role_category: string | null;
  birth_year: number | null;
  death_year: number | null;
  biography: string | null;
};

const Saints = () => {
  const [saints, setSaints] = useState<Saint[]>([]);
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState('name');

  useEffect(() => {
    fetchJSON('persons').then(data => {
      setSaints((data as Saint[]).filter(person => person.role_category === 'Thelemic Saint'));
    });
  }, []);

  const filteredSaints = useMemo(() => {
    const search = query.trim().toLowerCase();
    return [...saints]
      .filter(saint => {
        if (!search) return true;
        return [
          saint.name,
          saint.magical_motto || '',
          String(saint.birth_year || ''),
          String(saint.death_year || ''),
          saint.biography || '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(search);
      })
      .sort((left, right) => {
        if (sortMode === 'birth') return (left.birth_year ?? Number.POSITIVE_INFINITY) - (right.birth_year ?? Number.POSITIVE_INFINITY) || left.name.localeCompare(right.name);
        if (sortMode === 'death') return (left.death_year ?? Number.POSITIVE_INFINITY) - (right.death_year ?? Number.POSITIVE_INFINITY) || left.name.localeCompare(right.name);
        return left.name.localeCompare(right.name);
      });
  }, [saints, query, sortMode]);

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
          <strong>{filteredSaints.length}</strong>
        </div>
      </section>

      <ResearchToolbar
        query={query}
        onQueryChange={setQuery}
        searchLabel="Search saints"
        searchPlaceholder="Name, motto, dates, or biography"
        countLabel="Figures"
        count={filteredSaints.length}
        sort={{
          label: 'Sort',
          value: sortMode,
          options: [
            { value: 'name', label: 'Name' },
            { value: 'birth', label: 'Birth year' },
            { value: 'death', label: 'Death year' },
          ],
          onChange: setSortMode,
        }}
        onReset={() => {
          setQuery('');
          setSortMode('name');
        }}
      />

      {filteredSaints.length === 0 ? (
        <EmptyResults message="Try another name, motto, date, or lineage term from the Gnostic Saints tradition." />
      ) : (
        <div className="page-grid page-grid--cards">
          {filteredSaints.map(saint => (
            <Link
              key={saint.id}
              to={`/people/${saint.id}`}
              className="entry-card-link"
              data-portal-track-hover="true"
              data-portal-track-click="true"
              data-portal-track-label={saint.name}
              data-portal-track-detail={saint.biography || ''}
              data-portal-track-source="Saints"
              data-portal-track-domain="saints"
            >
              <article className="glass-panel term-card">
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
            </Link>
          ))}
        </div>
      )}

      <TopicShelf
        title="Key saint topics"
        intro="These cards show why the saints remain in the portal: they connect Crowley to older magical lineages, later reception, and the broader culture that carried those names forward."
        slugs={TOPIC_GROUPS.saints}
      />
    </div>
  );
};

export default Saints;
