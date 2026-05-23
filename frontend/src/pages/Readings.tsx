import { useEffect, useMemo, useState } from 'react';
import {
  buildManualReading,
  buildTarotCardStudy,
  dealTarotReading,
  getTarotCardById,
  SPREADS,
  TAROT_DECK,
  TAROT_STUDY_AREAS,
  type TarotCard,
  type TarotReading,
} from '../tarotReadingsContent';

type ReadingMode = 'random' | 'manual';

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

const Readings = () => {
  const [question, setQuestion] = useState('What is the next hidden movement in this matter?');
  const [spreadId, setSpreadId] = useState(SPREADS[0].id);
  const [mode, setMode] = useState<ReadingMode>('random');
  const [manualCards, setManualCards] = useState<(string | null)[]>(() => Array(SPREADS[0].positions.length).fill(null));
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [activePositionIndex, setActivePositionIndex] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [hoveredPositionIndex, setHoveredPositionIndex] = useState<number | null>(null);
  const [reading, setReading] = useState<TarotReading>(() => dealTarotReading(SPREADS[0].id, question));

  const selectedSpread = useMemo(() => SPREADS.find(entry => entry.id === spreadId) ?? SPREADS[0], [spreadId]);

  useEffect(() => {
    setManualCards(Array(selectedSpread.positions.length).fill(null));
    setSelectedCardId(null);
    setActivePositionIndex(0);
    setHoveredCardId(null);
    setHoveredPositionIndex(null);
  }, [selectedSpread]);

  useEffect(() => {
    if (mode === 'random') {
      setReading(dealTarotReading(spreadId, question));
      return;
    }
    setReading(buildManualReading(spreadId, question, manualCards));
  }, [mode, spreadId, question, manualCards]);

  const focusCard =
    getTarotCardById(hoveredCardId) ||
    getTarotCardById(selectedCardId) ||
    getTarotCardById(manualCards[activePositionIndex] || undefined) ||
    reading.cards.find(draw => draw.position.index === activePositionIndex + 1)?.card ||
    reading.cards.find(draw => !draw.card.id.startsWith('empty-'))?.card ||
    TAROT_DECK[0];

  const focusPosition =
    selectedSpread.positions[hoveredPositionIndex ?? activePositionIndex] ||
    selectedSpread.positions[0];

  const focusStudy = buildTarotCardStudy(focusCard, selectedSpread, focusPosition);

  const deckChoices = useMemo(() => {
    if (mode !== 'manual') return TAROT_DECK;
    return TAROT_DECK;
  }, [mode]);

  function startRandomReading() {
    setMode('random');
    setSelectedCardId(null);
    setHoveredCardId(null);
    setHoveredPositionIndex(null);
    setReading(dealTarotReading(spreadId, question));
  }

  function switchToManual() {
    setMode('manual');
    setHoveredCardId(null);
    setHoveredPositionIndex(null);
    setReading(buildManualReading(spreadId, question, manualCards));
  }

  function clearManual() {
    const cleared = Array(selectedSpread.positions.length).fill(null);
    setMode('manual');
    setManualCards(cleared);
    setSelectedCardId(null);
    setActivePositionIndex(0);
    setHoveredCardId(null);
    setHoveredPositionIndex(null);
    setReading(buildManualReading(spreadId, question, cleared));
  }

  function autofillRemaining() {
    const used = new Set(manualCards.filter(Boolean) as string[]);
    const remaining = shuffle(TAROT_DECK.filter(card => !used.has(card.id)));
    const next = [...manualCards];
    let cursor = 0;
    for (let index = 0; index < next.length; index += 1) {
      if (!next[index]) {
        next[index] = remaining[cursor]?.id ?? null;
        cursor += 1;
      }
    }
    setMode('manual');
    setManualCards(next);
    setReading(buildManualReading(spreadId, question, next));
  }

  function assignCardToPosition(cardId: string, positionIndex: number) {
    setMode('manual');
    setSelectedCardId(cardId);
    setActivePositionIndex(positionIndex);
    setHoveredCardId(cardId);
    setHoveredPositionIndex(positionIndex);

    const next = manualCards.map(id => (id === cardId ? null : id));
    next[positionIndex] = cardId;
    setManualCards(next);
    setReading(buildManualReading(spreadId, question, next));
  }

  function chooseCard(card: TarotCard) {
    if (mode !== 'manual') {
      setHoveredCardId(card.id);
      return;
    }

    if (activePositionIndex >= 0 && activePositionIndex < selectedSpread.positions.length) {
      assignCardToPosition(card.id, activePositionIndex);
      return;
    }

    setSelectedCardId(card.id);
    setHoveredCardId(card.id);
  }

  function choosePosition(index: number) {
    setMode('manual');
    setActivePositionIndex(index);
    setHoveredPositionIndex(index);

    if (selectedCardId) {
      assignCardToPosition(selectedCardId, index);
      return;
    }

    setReading(buildManualReading(spreadId, question, manualCards));
  }

  return (
    <div className="page-shell readings-page">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Tarot reading generator</p>
          <h1>Crowley readings</h1>
          <p className="page-intro">
            Deal a reading with the Celtic Cross, Crowley&apos;s Significator method from <em>The Book of Thoth</em>, or a Golden Dawn spread. The generator now supports random deals, manual card selection, and a live study rail for attributions and interpretations.
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
          <input
            value={question}
            onChange={event => setQuestion(event.target.value)}
            placeholder="Ask the cards something precise"
          />
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
            className={`tree-chip ${mode === 'random' ? 'is-active' : ''}`}
            onClick={startRandomReading}
            data-portal-track-click="true"
            data-portal-track-hover="true"
            data-portal-track-label="Deal reading"
            data-portal-track-source="Tarot reading generator"
            data-portal-track-domain="readings"
          >
            Deal random
          </button>
          <button
            type="button"
            className={`tree-chip ${mode === 'manual' ? 'is-active' : ''}`}
            onClick={switchToManual}
          >
            Choose cards
          </button>
          <button type="button" className="tree-chip" onClick={autofillRemaining}>
            Autofill remaining
          </button>
          <button type="button" className="tree-chip" onClick={clearManual}>
            Clear manual spread
          </button>
        </div>
      </section>

      <section className="glass-panel readings-intro">
        <h2>{selectedSpread.title}</h2>
        <p className="page-intro">{selectedSpread.intro}</p>
        <p className="readings-source">Source frame: {selectedSpread.sourceLabel}</p>
      </section>

      <div className="readings-workbench">
        <aside className="glass-panel readings-sidebar readings-sidebar--deck">
          <div className="readings-sidebar__head">
            <div>
              <p className="page-kicker">Deck study</p>
              <h2>Choose from the deck</h2>
            </div>
            <span className="readings-sidebar__badge">{mode === 'manual' ? 'Manual' : 'Hover only'}</span>
          </div>

          <p className="page-intro">
            Hover any card to inspect it. In manual mode, click a position in the spread first and then click a card to place it there.
          </p>

          <div className="readings-deck">
            {deckChoices.map(card => {
              const isSelected = selectedCardId === card.id;
              const isHover = hoveredCardId === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  className={`reading-deck-card ${isSelected ? 'is-selected' : ''} ${isHover ? 'is-hovered' : ''}`}
                  onClick={() => chooseCard(card)}
                  onMouseEnter={() => setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  data-portal-track-click="true"
                  data-portal-track-hover="true"
                  data-portal-track-label={card.name}
                  data-portal-track-detail={card.meaning}
                  data-portal-track-source="Tarot deck"
                  data-portal-track-domain="readings"
                >
                  <span className="reading-deck-card__emoji">{card.emoji}</span>
                  <strong>{card.name}</strong>
                  <small>{card.kind === 'major' ? 'Major arcana' : `${card.suit?.toUpperCase()} · ${card.rank}`}</small>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="glass-panel readings-board">
          <div className="readings-board__head">
            <div>
              <p className="page-kicker">Reading layout</p>
              <h2>{selectedSpread.title}</h2>
            </div>
            <div className="readings-board__stat">
              <span>Filled positions</span>
              <strong>{reading.cards.filter(draw => !draw.card.id.startsWith('empty-')).length}/{reading.cards.length}</strong>
            </div>
          </div>

          <div className={`readings-grid readings-grid--${reading.spread.id}`}>
            {reading.cards.map(draw => {
              const isActivePosition = activePositionIndex === draw.position.index - 1;
              const hasCard = !draw.card.id.startsWith('empty-');
              return (
                <article
                  key={`${reading.id}-${draw.position.index}`}
                  className={`glass-panel reading-slot ${isActivePosition ? 'is-active' : ''} ${hasCard ? 'has-card' : 'is-empty'}`}
                  onClick={() => choosePosition(draw.position.index - 1)}
                  onMouseEnter={() => {
                    setHoveredPositionIndex(draw.position.index - 1);
                    if (hasCard) setHoveredCardId(draw.card.id);
                  }}
                  onMouseLeave={() => {
                    setHoveredPositionIndex(null);
                    setHoveredCardId(null);
                  }}
                  data-portal-track-hover="true"
                  data-portal-track-click="true"
                  data-portal-track-label={draw.position.label}
                  data-portal-track-detail={draw.interpretation}
                  data-portal-track-source="Tarot reading"
                  data-portal-track-domain="readings"
                >
                  <div className="reading-slot__head">
                    <div>
                      <p className="page-kicker">Position {draw.position.index}</p>
                      <h3>{draw.position.label}</h3>
                    </div>
                    <span className="reading-slot__badge">{hasCard ? (draw.card.kind === 'major' ? 'Major' : draw.card.suit?.toUpperCase()) : 'Open'}</span>
                  </div>

                  {hasCard ? (
                    <>
                      <div className="reading-slot__face">
                        <span className="reading-slot__emoji">{draw.card.emoji}</span>
                        <div>
                          <strong>{draw.card.name}</strong>
                          <p>{draw.card.keywords.join(' • ')}</p>
                        </div>
                      </div>
                      <p className="reading-slot__meaning">{draw.card.meaning}</p>
                    </>
                  ) : (
                    <div className="reading-slot__empty">
                      <strong>Choose a card for this position.</strong>
                      <p>{draw.position.focus}</p>
                    </div>
                  )}

                  <p>{draw.interpretation}</p>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="glass-panel readings-sidebar readings-sidebar--study">
          <div className="readings-sidebar__head">
            <div>
              <p className="page-kicker">Study rail</p>
              <h2>Attributions and meanings</h2>
            </div>
          </div>

          <div className="reading-study">
            <div className="reading-study__card">
              <span>Focus card</span>
              <strong>{focusCard.name}</strong>
              <p>{focusPosition.label}</p>
            </div>

            <div className="reading-study__meta">
              {focusStudy.attributions.map(line => (
                <div key={line} className="reading-study__row">
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <div className="reading-study__copy">
              <p>{focusStudy.overview}</p>
              {focusStudy.studyNotes.map(note => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>

          <div className="reading-areas">
            <h3>Suggested interpretations</h3>
            {TAROT_STUDY_AREAS.map(area => (
              <article key={area.id} className="reading-area-card">
                <strong>{area.label}</strong>
                <p>{focusStudy.areaNotes[area.id]}</p>
              </article>
            ))}
          </div>

          <div className="reading-study__foot">
            <p className="page-intro">
              The study rail keeps the card in view while the spread changes, so the user can read each card as a symbol, a placement, and a life-area suggestion at the same time.
            </p>
          </div>
        </aside>
      </div>

      <section className="glass-panel readings-summary">
        <div>
          <h2>Reading overview</h2>
          <p>{reading.overview}</p>
          <p>{reading.closing}</p>
        </div>
        <div className="readings-summary-card">
          <span>Question</span>
          <strong>{reading.question}</strong>
          <span>Mode</span>
          <strong>{mode === 'random' ? 'Random deal' : 'Manual selection'}</strong>
        </div>
      </section>
    </div>
  );
};

export default Readings;
