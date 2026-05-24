import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchJSON } from '../api';
import QuoteCallout from '../components/QuoteCallout';
import { getNumberQuote } from '../crowleyQuotes';
import {
  buildNumberArticleParagraphs,
  buildNumberEntries,
  type GradeEntry,
  type NumberEntry,
  type PersonEntry,
  type TermEntry,
  type TreeEntry,
  type WorkEntry,
} from '../numbersContent';

const NumberPage = () => {
  const { slug } = useParams();
  const [treeEntries, setTreeEntries] = useState<TreeEntry[]>([]);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [works, setWorks] = useState<WorkEntry[]>([]);
  const [terms, setTerms] = useState<TermEntry[]>([]);
  const [people, setPeople] = useState<PersonEntry[]>([]);

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
  const entry = useMemo<NumberEntry | undefined>(() => entries.find(item => item.slug === slug), [entries, slug]);

  if (!entry) {
    return (
      <div className="page-shell">
        <section className="glass-panel page-hero">
          <div>
            <p className="page-kicker">Number encyclopedia</p>
            <h1>{slug ? 'Number not found' : 'Loading number entry'}</h1>
            <p className="page-intro">
              {slug
                ? 'That number slug is not in the encyclopedia yet. Try another card from the numbers index.'
                : 'The number data is still loading.'}
            </p>
          </div>
          {slug && (
            <div className="page-stat">
              <span>Number</span>
              <strong>{slug}</strong>
            </div>
          )}
        </section>
        {slug && (
          <section className="glass-panel">
            <Link to="/numbers" className="tree-chip is-active">
              Back to numbers
            </Link>
          </section>
        )}
      </div>
    );
  }

  const paragraphs = buildNumberArticleParagraphs(entry);
  const tree = entry.treeEntry;
  const relatedWorks = entry.relatedWorks;
  const relatedTerms = entry.relatedTerms;
  const relatedPeople = entry.relatedPeople;
  const grade = entry.grade;
  const numberQuote = useMemo(() => getNumberQuote(entry, relatedWorks), [entry, relatedWorks]);

  return (
    <div className="page-shell number-page">
      <section className="glass-panel page-hero number-page__hero">
        <div>
          <p className="page-kicker">Number encyclopedia</p>
          <h1>
            {entry.number} {entry.title}
          </h1>
          <p className="page-intro">{entry.summary}</p>
          <div className="number-page__glyphs">
            {entry.glyphs.map(glyph => (
              <span key={glyph}>{glyph}</span>
            ))}
          </div>
        </div>
        <div className="page-stat">
          <span>Type</span>
          <strong>{entry.kind === 'signature' ? 'Signature' : entry.kind === 'sephirah' ? 'Sephirah' : 'Path'}</strong>
        </div>
      </section>

      <section className="glass-panel number-page__entry">
        {paragraphs.map((paragraph, index) => (
          <p key={`${entry.slug}-${index}`}>{paragraph}</p>
        ))}
      </section>

      <QuoteCallout quote={numberQuote} />

      <section className="topic-page__related">
        <div className="topic-page__rail">
          <div className="glass-panel">
            <h2>Number logic</h2>
            <p className="page-intro">
              {entry.kind === 'signature'
                ? 'These are the Crowley numbers that behave like mnemonics, slogans, or doctrinal shortcuts.'
                : 'These fields show how the number stays anchored in the Tree, the tarot, and the order system at the same time.'}
            </p>
          </div>

          {tree ? (
            <div
              className="glass-panel number-related-card"
              data-portal-track-hover="true"
              data-portal-track-click="true"
              data-portal-track-label={tree.name}
              data-portal-track-detail={tree.description || tree.crowley_tweaks || ''}
              data-portal-track-source="Number related tree"
              data-portal-track-domain="number"
              data-portal-tree-number={String(tree.path_number)}
              data-portal-tree-kind={tree.path_number <= 10 ? 'sephirah' : 'path'}
            >
              <h3>{tree.name}</h3>
              <p className="number-related-card__meta">
                {tree.path_number <= 10
                  ? `Station ${tree.path_number}`
                  : `${tree.hebrew_letter || 'n/a'} · ${tree.astrological_attribution || 'n/a'}`}
              </p>
              <p>{tree.path_number <= 10 ? tree.description : tree.crowley_tweaks || tree.description}</p>
            </div>
          ) : null}

          {grade ? (
            <div
              className="glass-panel number-related-card"
              data-portal-track-hover="true"
              data-portal-track-click="true"
              data-portal-track-label={grade.name}
              data-portal-track-detail={grade.description}
              data-portal-track-source="Number related grade"
              data-portal-track-domain="number"
              data-portal-tree-number={String(grade.tree_path_number)}
              data-portal-tree-kind={grade.tree_path_number <= 10 ? 'sephirah' : 'path'}
            >
              <h3>{grade.name}</h3>
              <p className="number-related-card__meta">{grade.system}</p>
              <p>{grade.description}</p>
            </div>
          ) : null}
        </div>

        <aside className="glass-panel number-page__sidebar">
          <h2>Cross references</h2>
          <div className="number-page__mini">
            <span>Works</span>
            <p>{relatedWorks.length ? relatedWorks.join(', ') : 'No direct works listed yet.'}</p>
          </div>
          <div className="number-page__mini">
            <span>Terms</span>
            <p>{relatedTerms.length ? relatedTerms.join(', ') : 'No direct terms listed yet.'}</p>
          </div>
          <div className="number-page__mini">
            <span>People</span>
            <p>{relatedPeople.length ? relatedPeople.join(', ') : 'No direct people listed yet.'}</p>
          </div>
          <div className="number-page__mini">
            <span>Precursor layer</span>
            <p>
              For the older number philosophies behind Crowley&apos;s revision, see the <Link to="/precursors">Precursors</Link> section.
            </p>
          </div>
          <div className="number-page__backlink">
            <Link to="/numbers" className="tree-chip is-active">
              Back to numbers
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default NumberPage;
