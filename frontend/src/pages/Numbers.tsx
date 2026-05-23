import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../api';
import { buildNumberCardCopy, buildNumberEntries, type GradeEntry, type PersonEntry, type TermEntry, type TreeEntry, type WorkEntry } from '../numbersContent';

type ViewMode = 'all' | 'tree' | 'signature';

const Numbers = () => {
  const [treeEntries, setTreeEntries] = useState<TreeEntry[]>([]);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [works, setWorks] = useState<WorkEntry[]>([]);
  const [terms, setTerms] = useState<TermEntry[]>([]);
  const [people, setPeople] = useState<PersonEntry[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('all');

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
    if (viewMode === 'tree') return entries.filter(entry => entry.kind !== 'signature');
    if (viewMode === 'signature') return entries.filter(entry => entry.kind === 'signature');
    return entries;
  }, [entries, viewMode]);

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

      <section className="glass-panel numbers-page__controls">
        <div className="numbers-page__chips">
          {(['all', 'tree', 'signature'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              type="button"
              className={`tree-chip ${viewMode === mode ? 'is-active' : ''}`}
              onClick={() => setViewMode(mode)}
              data-portal-track-click="true"
              data-portal-track-hover="true"
              data-portal-track-label={mode === 'all' ? 'All numbers' : mode === 'tree' ? 'Tree numbers' : 'Signature numbers'}
              data-portal-track-source="Numbers filter"
              data-portal-track-domain="numbers"
            >
              {mode === 'all' ? 'All numbers' : mode === 'tree' ? 'Tree numbers' : 'Signature numbers'}
            </button>
          ))}
        </div>
        <p className="page-intro">
          The Tree cards carry the 1-32 Qabalistic structure; the signature cards collect the numbers that Crowley
          kept turning into doctrine, joke, brand, and mnemonic.
        </p>
      </section>

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
    </div>
  );
};

export default Numbers;
