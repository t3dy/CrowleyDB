import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../api';
import EmptyResults from '../components/EmptyResults';
import ResearchToolbar from '../components/ResearchToolbar';
import { buildNumberCardCopy, buildNumberEntries, type GradeEntry, type PersonEntry, type TermEntry, type TreeEntry, type WorkEntry } from '../numbersContent';

type ViewMode = 'all' | 'tree' | 'signature';

const Numbers = () => {
  const [treeEntries, setTreeEntries] = useState<TreeEntry[]>([]);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [works, setWorks] = useState<WorkEntry[]>([]);
  const [terms, setTerms] = useState<TermEntry[]>([]);
  const [people, setPeople] = useState<PersonEntry[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState('number');

  useEffect(() => {
    Promise.all([
      fetchJSON('thelemic_tree'),
      fetchJSON('grades'),
      fetchJSON('works'),
      fetchJSON('terms'),
      fetchJSON('persons'),
    ]).then(([treeData, gradeData, workData, termData, personData]) => {
      setTreeEntries(treeData);
      setGrades(gradeData);
      setWorks(workData);
      setTerms(termData);
      setPeople(personData);
    });
  }, []);

  const entries = useMemo(() => buildNumberEntries(treeEntries, grades, works, terms, people), [treeEntries, grades, works, terms, people]);

  const filteredEntries = useMemo(() => {
    const search = query.trim().toLowerCase();
    return entries
      .filter(entry => {
        if (viewMode === 'tree' && entry.kind === 'signature') return false;
        if (viewMode === 'signature' && entry.kind !== 'signature') return false;
        if (!search) return true;
        return [
          entry.title,
          entry.subtitle,
          entry.summary,
          entry.teaser,
          String(entry.number),
          entry.kind,
          entry.relatedWorks.join(' '),
          entry.relatedTerms.join(' '),
          entry.relatedPeople.join(' '),
        ]
          .join(' ')
          .toLowerCase()
          .includes(search);
      })
      .sort((left, right) => {
        if (sortMode === 'title') return left.title.localeCompare(right.title);
        if (sortMode === 'kind') return left.kind.localeCompare(right.kind) || left.number - right.number;
        if (sortMode === 'works') return right.relatedWorks.length - left.relatedWorks.length || left.number - right.number;
        return left.number - right.number;
      });
  }, [entries, viewMode, query, sortMode]);

  return (
    <div className="page-shell numbers-page">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Crowley on numbers</p>
          <h1>Numbers</h1>
          <p className="page-intro">
            A browsable number index for Crowley&apos;s Qabalistic system: the Tree stations, the tarot paths,
            and the signature numbers that keep turning up in the books, the rituals, and the legend. For the
            older number philosophies behind this system, see the separate <Link to="/precursors">Precursors</Link> section.
          </p>
        </div>
        <div className="page-stat">
          <span>Cards</span>
          <strong>{filteredEntries.length}</strong>
        </div>
      </section>

      <ResearchToolbar
        query={query}
        onQueryChange={setQuery}
        searchLabel="Search numbers"
        searchPlaceholder="Number, title, attribution, related work, term, or person"
        countLabel="Cards"
        count={filteredEntries.length}
        filters={[
          {
            id: 'type',
            label: 'Type',
            value: viewMode,
            options: [
              { value: 'all', label: 'All numbers' },
              { value: 'tree', label: 'Tree numbers' },
              { value: 'signature', label: 'Signature numbers' },
            ],
            onChange: value => setViewMode(value as ViewMode),
          },
        ]}
        sort={{
          label: 'Sort',
          value: sortMode,
          options: [
            { value: 'number', label: 'Number' },
            { value: 'title', label: 'Title' },
            { value: 'kind', label: 'Type' },
            { value: 'works', label: 'Related works' },
          ],
          onChange: setSortMode,
        }}
        onReset={() => {
          setQuery('');
          setViewMode('all');
          setSortMode('number');
        }}
      />

      {filteredEntries.length === 0 ? (
        <EmptyResults message="Try a number, a related work title, an attribution, or switch between Tree numbers and signature numbers." />
      ) : (
        <div className="page-grid page-grid--cards numbers-grid">
          {filteredEntries.map(entry => (
            <Link
              key={entry.slug}
              to={`/numbers/${entry.slug}`}
              className="glass-panel number-card number-card--link"
              data-portal-track-hover="true"
              data-portal-track-click="true"
              data-portal-track-label={entry.title}
              data-portal-track-detail={entry.summary}
              data-portal-track-source="Numbers"
              data-portal-track-domain="numbers"
              data-portal-tree-number={String(entry.number)}
              data-portal-tree-kind={entry.kind}
            >
              <div className="number-card__head">
                <div>
                  <span className="number-card__kicker">{entry.kind === 'signature' ? 'Signature number' : entry.kind === 'sephirah' ? 'Sephirah' : 'Path'}</span>
                  <h2>{entry.title}</h2>
                </div>
                <span className="number-card__badge">{entry.number}</span>
              </div>
              <div className="number-card__glyphs" aria-label={`Symbols for ${entry.title}`}>
                {entry.glyphs.map(glyph => (
                  <span key={glyph}>{glyph}</span>
                ))}
              </div>
              <p>{buildNumberCardCopy(entry)}</p>
              <p className="number-card__meta">{entry.subtitle}</p>
              <span className="number-card__cta">Open number entry</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Numbers;
