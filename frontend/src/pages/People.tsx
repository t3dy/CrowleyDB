import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../api';
import TopicShelf from '../components/TopicShelf';
import { TOPIC_GROUPS } from '../topicGroups';

type Person = {
  id: string;
  name: string;
  magical_motto: string | null;
  role_category: string | null;
  birth_year: number | null;
  death_year: number | null;
  biography: string | null;
};

type PersonEvent = {
  person_id: string;
  event_id: string;
};

const ROLE_FILTERS = [
  'All',
  'Self',
  'Major Associate',
  'Minor Associate',
  'Scholar',
  'Disciple',
  'Rival',
  'Thelemic Saint',
];

const People = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [links, setLinks] = useState<PersonEvent[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fetchJSON('persons').then(setPeople);
    fetchJSON('person_events').then(setLinks);
  }, []);

  const eventCounts = useMemo(() => {
    return links.reduce<Record<string, number>>((acc, link) => {
      acc[link.person_id] = (acc[link.person_id] || 0) + 1;
      return acc;
    }, {});
  }, [links]);

  const filteredPeople = useMemo(() => {
    const search = query.trim().toLowerCase();
    return [...people]
      .filter(person => {
        if (roleFilter !== 'All' && person.role_category !== roleFilter) return false;
        if (!search) return true;
        return [
          person.name,
          person.magical_motto || '',
          person.role_category || '',
          person.biography || '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(search);
      })
      .sort((a, b) => {
        const roleCompare = (a.role_category || '').localeCompare(b.role_category || '');
        return roleCompare !== 0 ? roleCompare : a.name.localeCompare(b.name);
      });
  }, [people, query, roleFilter]);

  return (
    <div className="page-shell">
      <div className="glass-panel page-hero">
        <div>
          <p className="page-kicker">People</p>
          <h1>Crowley Associates, Scholars, and Followers</h1>
          <p className="page-intro">
            Use this page to browse the people around Crowley by role: associates, rivals, disciples, scholars, saints,
            and Crowley himself. The cards are written to support both biography and interpretive context.
          </p>
        </div>

        <div className="page-stat">
          <span>Profiles</span>
          <strong>{filteredPeople.length}</strong>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) auto', gap: '0.75rem', alignItems: 'end', gridColumn: '1 / -1' }}>
          <label className="stacked-field">
            <span>Search</span>
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search by name, motto, or biography"
            />
          </label>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {ROLE_FILTERS.map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={roleFilter === role ? 'tree-chip is-active' : 'tree-chip'}
                data-portal-track-click="true"
                data-portal-track-hover="true"
                data-portal-track-label={role}
                data-portal-track-source="People filter"
                data-portal-track-domain="people"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-grid page-grid--cards">
        {filteredPeople.map(person => {
          const yearRange =
            person.birth_year || person.death_year
              ? `${person.birth_year || 'Unknown'} - ${person.death_year || 'Present'}`
              : 'Dates unknown';

          return (
            <Link
              key={person.id}
              to={`/people/${person.id}`}
              className="entry-card-link"
              data-portal-track-hover="true"
              data-portal-track-click="true"
              data-portal-track-label={person.name}
              data-portal-track-detail={person.biography || ''}
              data-portal-track-source="People"
              data-portal-track-domain="people"
            >
              <article className="glass-panel term-card">
                <div className="timeline-card__meta">
                  <div>
                    <h3>{person.name}</h3>
                    {person.magical_motto && person.magical_motto !== 'Unknown' && (
                      <p className="term-card__etymology">{person.magical_motto}</p>
                    )}
                  </div>
                  <span className="lane-pill lane-pill--e" style={{ whiteSpace: 'nowrap' }}>
                    {person.role_category || 'Uncategorized'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  <span>{yearRange}</span>
                  <span>{eventCounts[person.id] || 0} linked events</span>
                </div>

                <p>{person.biography}</p>
              </article>
            </Link>
          );
        })}
      </div>

      <TopicShelf
        title="Key people topics"
        intro="These topics map the social world around Crowley: partners, rivals, disciples, scholars, testimony, and the afterlives of those relationships."
        slugs={TOPIC_GROUPS.people}
      />
    </div>
  );
};

export default People;
