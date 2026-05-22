import { useEffect, useMemo, useState } from 'react';
import { fetchJSON } from '../api';

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
    <div style={{ padding: '1.5rem' }}>
      <div className="glass-panel" style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            People
          </p>
          <h1 style={{ margin: '0.25rem 0 0' }}>Crowley Associates, Scholars, and Followers</h1>
          <p style={{ margin: '0.5rem 0 0', lineHeight: 1.6 }}>
            Use this page to browse the people around Crowley by role: associates, rivals, disciples, scholars, saints,
            and Crowley himself. The cards are written to support both biography and interpretive context.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) auto', gap: '0.75rem', alignItems: 'end' }}>
          <label style={{ display: 'grid', gap: '0.4rem' }}>
            Search
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search by name, motto, or biography"
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

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {ROLE_FILTERS.map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{
                  padding: '0.7rem 0.9rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  background: roleFilter === role ? 'rgba(212, 175, 55, 0.14)' : 'rgba(0, 0, 0, 0.25)',
                  color: 'var(--text-parchment)',
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
        }}
      >
        {filteredPeople.map(person => {
          const yearRange =
            person.birth_year || person.death_year
              ? `${person.birth_year || 'Unknown'} - ${person.death_year || 'Present'}`
              : 'Dates unknown';

          return (
            <article key={person.id} className="glass-panel" style={{ display: 'grid', gap: '0.7rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.2rem' }}>{person.name}</h2>
                  {person.magical_motto && person.magical_motto !== 'Unknown' && (
                    <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--accent-gold)' }}>{person.magical_motto}</p>
                  )}
                </div>
                <span
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    fontSize: '0.78rem',
                    color: 'var(--text-parchment)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {person.role_category || 'Uncategorized'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <span>{yearRange}</span>
                <span>{eventCounts[person.id] || 0} linked events</span>
              </div>

              <p style={{ margin: 0, lineHeight: 1.55 }}>{person.biography}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default People;
