import { useState } from 'react';
import { dealTarotReading, SPREADS, type TarotReading } from '../tarotReadingsContent';

const Readings = () => {
  const [question, setQuestion] = useState('What is the next hidden movement in this matter?');
  const [spreadId, setSpreadId] = useState(SPREADS[0].id);
  const [reading, setReading] = useState<TarotReading>(() => dealTarotReading(SPREADS[0].id, question));

  function deal() {
    setReading(dealTarotReading(spreadId, question));
  }

  function resetToExample() {
    setQuestion('What is the next hidden movement in this matter?');
    setSpreadId(SPREADS[0].id);
    setReading(dealTarotReading(SPREADS[0].id, 'What is the next hidden movement in this matter?'));
  }

  return (
    <div className="page-shell readings-page">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Tarot reading generator</p>
          <h1>Crowley readings</h1>
          <p className="page-intro">
            Deal a reading with the Celtic Cross, Crowley&apos;s Significator method from *The Book of Thoth*, or a Golden Dawn spread. The generator keeps the historical names clear while making the layouts readable in the portal.
          </p>
        </div>
        <div className="page-stat">
          <span>Spreads</span>
          <strong>{SPREADS.length}</strong>
        </div>
      </section>

      <section className="glass-panel readings-controls">
        <label className="stacked-field">
          <span>Your question</span>
          <input value={question} onChange={event => setQuestion(event.target.value)} placeholder="Ask the cards something precise" />
        </label>

        <div className="readings-spreadlist">
          {SPREADS.map(spread => (
            <button
              key={spread.id}
              type="button"
              className={`readings-spread ${spread.id === spreadId ? 'is-active' : ''}`}
              onClick={() => setSpreadId(spread.id)}
              data-portal-track-click="true"
              data-portal-track-hover="true"
              data-portal-track-label={spread.title}
              data-portal-track-detail={spread.intro}
              data-portal-track-source="Tarot spread selector"
              data-portal-track-domain="readings"
            >
              <strong>{spread.title}</strong>
              <span>{spread.subtitle}</span>
            </button>
          ))}
        </div>

        <div className="readings-actions">
          <button
            type="button"
            className="tree-chip is-active"
            onClick={deal}
            data-portal-track-click="true"
            data-portal-track-hover="true"
            data-portal-track-label="Deal reading"
            data-portal-track-source="Tarot reading generator"
            data-portal-track-domain="readings"
          >
            Deal reading
          </button>
          <button type="button" className="tree-chip" onClick={resetToExample}>
            Reset example
          </button>
        </div>
      </section>

      <section className="glass-panel readings-intro">
        <h2>{reading.spread.title}</h2>
        <p className="page-intro">{reading.spread.intro}</p>
        <p className="readings-source">Source frame: {reading.spread.sourceLabel}</p>
      </section>

      <section className="glass-panel readings-overview">
        <div>
          <h2>Reading overview</h2>
          <p>{reading.overview}</p>
          <p>{reading.closing}</p>
        </div>
        <div className="readings-summary-card">
          <span>Question</span>
          <strong>{reading.question}</strong>
          <span>Cards drawn</span>
          <strong>{reading.cards.length}</strong>
        </div>
      </section>

      <div className={`readings-grid readings-grid--${reading.spread.id}`}>
        {reading.cards.map(draw => (
          <article
            key={`${reading.id}-${draw.position.index}`}
            className="glass-panel reading-card"
            data-portal-track-hover="true"
            data-portal-track-click="true"
            data-portal-track-label={draw.card.name}
            data-portal-track-detail={draw.interpretation}
            data-portal-track-source="Tarot reading"
            data-portal-track-domain="readings"
          >
            <div className="reading-card__head">
              <div>
                <p className="page-kicker">Position {draw.position.index}</p>
                <h3>{draw.position.label}</h3>
              </div>
              <span className="reading-card__badge">{draw.card.kind === 'major' ? 'Major' : draw.card.suit?.toUpperCase()}</span>
            </div>

            <div className="reading-card__face">
              <span className="reading-card__emoji">{draw.card.emoji}</span>
              <div>
                <strong>{draw.card.name}</strong>
                <p>{draw.card.keywords.join(' • ')}</p>
              </div>
            </div>

            <p className="reading-card__meaning">{draw.card.meaning}</p>
            <p>{draw.interpretation}</p>
          </article>
        ))}
      </div>

      <section className="glass-panel readings-notes">
        <h2>How the portal uses this page</h2>
        <p className="page-intro">
          The generator is designed as a study tool rather than a prediction machine. It keeps the spread name, the historical source frame, and the reading layout visible so the reader can compare popular tarot practice with Crowley&apos;s own method and the Golden Dawn tradition that shaped both.
        </p>
      </section>
    </div>
  );
};

export default Readings;
