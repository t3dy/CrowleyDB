import { Link, useParams } from 'react-router-dom';
import { buildPrecursorArticleParagraphs, buildPrecursorEntries, getPrecursorEntryBySlug } from '../precursorsContent';

const PrecursorPage = () => {
  const { slug } = useParams();
  const entries = buildPrecursorEntries();
  const entry = getPrecursorEntryBySlug(entries, slug);

  if (!entry) {
    return (
      <div className="page-shell">
        <section className="glass-panel page-hero">
          <div>
            <p className="page-kicker">Number precursors</p>
            <h1>{slug ? 'Precursor not found' : 'Loading precursor entry'}</h1>
            <p className="page-intro">
              {slug
                ? 'That precursor slug is not in the encyclopedia yet. Try another card from the precursor index.'
                : 'The precursor data is still loading.'}
            </p>
          </div>
          {slug && (
            <div className="page-stat">
              <span>Entry</span>
              <strong>{slug}</strong>
            </div>
          )}
        </section>
        {slug && (
          <section className="glass-panel">
            <Link to="/precursors" className="tree-chip is-active">
              Back to precursors
            </Link>
          </section>
        )}
      </div>
    );
  }

  const paragraphs = buildPrecursorArticleParagraphs(entry);

  return (
    <div className="page-shell precursor-page">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Number precursors</p>
          <h1>{entry.title}</h1>
          <p className="page-intro">{entry.summary}</p>
          <div className="number-page__glyphs">
            {entry.glyphs.map(glyph => (
              <span key={glyph}>{glyph}</span>
            ))}
          </div>
        </div>
        <div className="page-stat">
          <span>Layer</span>
          <strong>Precursor</strong>
        </div>
      </section>

      <section className="glass-panel precursor-page__entry">
        {paragraphs.map((paragraph, index) => (
          <p key={`${entry.slug}-${index}`}>{paragraph}</p>
        ))}
      </section>

      <section className="topic-page__related">
        <div className="topic-page__rail">
          <div className="glass-panel">
            <h2>What this layer contributes</h2>
            <p className="page-intro">
              This is the older grammar Crowley inherits and then rewrites. The cards here show how number becomes metaphysics, correspondence, and ritual practice before it becomes a Crowley signature.
            </p>
          </div>

          <div className="page-grid page-grid--cards">
            {entry.relatedCrowleyWorks.map(work => (
              <article key={work} className="glass-panel precursor-related-card">
                <h3>{work}</h3>
                <p>
                  This Crowley work is one of the places where the precursor layer gets re-edited, re-titled, or turned into a more explicit magical argument.
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="glass-panel number-page__sidebar">
          <h2>Lineage</h2>
          <div className="number-page__mini">
            <span>Source lineage</span>
            <p>{entry.sourceLineage}</p>
          </div>
          <div className="number-page__mini">
            <span>Symbolic mode</span>
            <p>{entry.symbolicMode}</p>
          </div>
          <div className="number-page__mini">
            <span>Inheritance note</span>
            <p>{entry.inheritanceNote}</p>
          </div>
          <div className="number-page__mini">
            <span>Title signal</span>
            <p>{entry.titleSignal}</p>
          </div>
          <div className="number-page__mini">
            <span>Related Crowley numbers</span>
            <p>{entry.relatedCrowleyNumbers.join(', ')}</p>
          </div>
          <div className="number-page__mini">
            <span>Related concepts</span>
            <p>{entry.relatedConcepts.join(', ')}</p>
          </div>
          <div className="number-page__mini">
            <span>Crowley layer</span>
            <p>
              The revising number system lives in <Link to="/numbers">Numbers</Link>, where these older ideas become Crowley-specific cards and publication titles.
            </p>
          </div>
          <div className="number-page__backlink">
            <Link to="/precursors" className="tree-chip is-active">
              Back to precursors
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default PrecursorPage;
