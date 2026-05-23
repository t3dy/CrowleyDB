import { Link } from 'react-router-dom';
import { buildPrecursorCardCopy, buildPrecursorEntries } from '../precursorsContent';

const Precursors = () => {
  const entries = buildPrecursorEntries();

  return (
    <div className="page-shell precursors-page">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Number precursors</p>
          <h1>Earlier number systems</h1>
          <p className="page-intro">
            This section keeps Agrippa, Pythagorean number, Neoplatonic ascent, Hermetic correspondence, and the Golden Dawn tables separate from Crowley&apos;s own revisions. It is the genealogy behind the archive&apos;s number logic, not a duplicate of the Crowley number page.
          </p>
        </div>
        <div className="page-stat">
          <span>Cards</span>
          <strong>{entries.length}</strong>
        </div>
      </section>

      <section className="glass-panel">
        <p className="page-intro">
          Read these as the older grammar of number: unity, proportion, ascent, correspondence, and ritual bookkeeping. Crowley enters later as a reviser, an editor, and a publisher who keeps making the title itself part of the symbol.
        </p>
      </section>

      <div className="page-grid page-grid--cards precursor-grid">
        {entries.map(entry => (
          <Link
            key={entry.slug}
            to={`/precursors/${entry.slug}`}
            className="glass-panel precursor-card precursor-card--link"
            data-portal-track-hover="true"
            data-portal-track-click="true"
            data-portal-track-label={entry.title}
            data-portal-track-detail={entry.summary}
            data-portal-track-source="Precursors"
            data-portal-track-domain="precursors"
          >
            <div className="number-card__head">
              <div>
                <span className="number-card__kicker">Precursor layer</span>
                <h2>{entry.title}</h2>
              </div>
              <span className="number-card__badge">P</span>
            </div>
            <div className="number-card__glyphs" aria-label={`Symbols for ${entry.title}`}>
              {entry.glyphs.map(glyph => (
                <span key={glyph}>{glyph}</span>
              ))}
            </div>
            <p>{buildPrecursorCardCopy(entry)}</p>
            <p className="number-card__meta">{entry.subtitle}</p>
            <span className="number-card__cta">Open precursor entry</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Precursors;

