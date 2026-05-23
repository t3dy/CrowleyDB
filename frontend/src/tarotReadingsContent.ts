export type TarotCardKind = 'major' | 'minor';

export type TarotCard = {
  id: string;
  name: string;
  kind: TarotCardKind;
  suit?: 'wands' | 'cups' | 'swords' | 'disks';
  rank?: string;
  emoji: string;
  keywords: string[];
  meaning: string;
};

export type SpreadPosition = {
  index: number;
  label: string;
  role: string;
  focus: string;
};

export type SpreadDefinition = {
  id: string;
  title: string;
  subtitle: string;
  sourceLabel: string;
  intro: string;
  positions: SpreadPosition[];
};

export type TarotDraw = {
  card: TarotCard;
  position: SpreadPosition;
  interpretation: string;
};

export type TarotReading = {
  id: string;
  spread: SpreadDefinition;
  question: string;
  cards: TarotDraw[];
  overview: string;
  closing: string;
};

export type TarotStudyArea = {
  id: 'career' | 'romance' | 'spirituality' | 'adventure' | 'self_improvement' | 'academics';
  label: string;
  prompt: string;
};

export type TarotCardStudy = {
  title: string;
  attributions: string[];
  overview: string;
  studyNotes: string[];
  areaNotes: Record<TarotStudyArea['id'], string>;
};

const suitProfiles = {
  wands: {
    emoji: '🔥',
    name: 'Wands',
    current: 'will, desire, initiation, force, and the spark that pushes outward',
  },
  cups: {
    emoji: '💧',
    name: 'Cups',
    current: 'feeling, attraction, receptivity, communion, and the waters of relation',
  },
  swords: {
    emoji: '⚔️',
    name: 'Swords',
    current: 'analysis, conflict, speech, discrimination, and the clean edge of mind',
  },
  disks: {
    emoji: '🜍',
    name: 'Disks',
    current: 'labor, matter, money, embodiment, and the slow intelligence of Earth',
  },
} as const;

const rankProfiles: Record<string, { name: string; meaning: string }> = {
  Ace: { name: 'Ace', meaning: 'the root spark that begins the suit as a concentrated seed of power' },
  Two: { name: 'Two', meaning: 'the first balancing act, where the force has to face its reflection' },
  Three: { name: 'Three', meaning: 'expansion, expression, and the first visible motion of the pattern' },
  Four: { name: 'Four', meaning: 'stability, structure, and the shape that lets the force endure' },
  Five: { name: 'Five', meaning: 'tension, disruption, contest, or the friction that forces change' },
  Six: { name: 'Six', meaning: 'coherence, success, and the moment the force begins to harmonize' },
  Seven: { name: 'Seven', meaning: 'challenge, testing, and the need to hold the pattern under pressure' },
  Eight: { name: 'Eight', meaning: 'skill, motion, and the application of force with greater control' },
  Nine: { name: 'Nine', meaning: "ripening, concentration, and the near-completion of the suit's theme" },
  Ten: { name: 'Ten', meaning: 'completion, burden, culmination, or the weight of the fully built pattern' },
  Knight: { name: 'Knight', meaning: 'the active agent of the suit, moving the current into events' },
  Queen: { name: 'Queen', meaning: 'the inward mastery of the suit, holding and shaping it from within' },
  Prince: { name: 'Prince', meaning: 'the intellect or strategy of the suit, making the force articulate' },
  Princess: { name: 'Princess', meaning: 'the material seed of the suit, where the current gathers form' },
};

const majorArcana: TarotCard[] = [
  { id: 'major-0', name: 'The Fool', kind: 'major', emoji: '🃏', keywords: ['Air', 'zero', 'new beginning'], meaning: 'The Fool brings open possibility, unforced motion, and the willingness to step before the map is finished.' },
  { id: 'major-1', name: 'The Magus', kind: 'major', emoji: '🪄', keywords: ['Mercury', 'skill', 'language'], meaning: 'The Magus is the shaping mind, the card that turns data, speech, and trickery into a workable instrument.' },
  { id: 'major-2', name: 'The Priestess', kind: 'major', emoji: '🌙', keywords: ['Moon', 'receptivity', 'mystery'], meaning: 'The Priestess keeps the doorway closed enough to remain alive, and open enough to teach through silence.' },
  { id: 'major-3', name: 'The Empress', kind: 'major', emoji: '👑', keywords: ['Venus', 'fertility', 'abundance'], meaning: 'The Empress is the power that makes form fruitful, generous, and visibly alive.' },
  { id: 'major-4', name: 'The Emperor', kind: 'major', emoji: '🏛️', keywords: ['Aries', 'authority', 'structure'], meaning: 'The Emperor is the force of command, boundary, and ordered action that can hold the field together.' },
  { id: 'major-5', name: 'The Hierophant', kind: 'major', emoji: '📿', keywords: ['Taurus', 'tradition', 'instruction'], meaning: 'The Hierophant transmits a living tradition and tests whether the student can receive it without flattening it.' },
  { id: 'major-6', name: 'The Lovers', kind: 'major', emoji: '💞', keywords: ['Gemini', 'union', 'choice'], meaning: 'The Lovers is choice under voltage, where relation becomes fate because the will has to take a side.' },
  { id: 'major-7', name: 'The Chariot', kind: 'major', emoji: '🛡️', keywords: ['Cancer', 'direction', 'conquest'], meaning: 'The Chariot is disciplined momentum, the ability to keep many forces moving as one vehicle.' },
  { id: 'major-8', name: 'Adjustment', kind: 'major', emoji: '⚖️', keywords: ['Libra', 'balance', 'justice'], meaning: 'Adjustment is the exacting intelligence that corrects the curve until the whole pattern can stand upright.' },
  { id: 'major-9', name: 'The Hermit', kind: 'major', emoji: '🕯️', keywords: ['Virgo', 'solitude', 'search'], meaning: 'The Hermit is the light carried inward, a search that proceeds by refinement rather than noise.' },
  { id: 'major-10', name: 'Fortune', kind: 'major', emoji: '🎡', keywords: ['Jupiter', 'cycle', 'change'], meaning: 'Fortune marks the wheel itself, reminding the reading that motion, not permanence, is the rule.' },
  { id: 'major-11', name: 'Lust', kind: 'major', emoji: '🦁', keywords: ['Leo', 'radiance', 'force'], meaning: 'Lust is not mere appetite but a fierce solar intensity that turns desire into consecrated power.' },
  { id: 'major-12', name: 'The Hanged Man', kind: 'major', emoji: '🪢', keywords: ['Water', 'suspension', 'reversal'], meaning: 'The Hanged Man is the reversal that teaches by suspension, making ordinary priority look temporarily foolish.' },
  { id: 'major-13', name: 'Death', kind: 'major', emoji: '☠️', keywords: ['Scorpio', 'transformation', 'ending'], meaning: 'Death is the necessary cutting away that permits a new arrangement of life to arrive.' },
  { id: 'major-14', name: 'Art', kind: 'major', emoji: '⚗️', keywords: ['Sagittarius', 'alchemy', 'mixture'], meaning: 'Art is the deliberate blending of opposites until a third thing is born that could not have been forced directly.' },
  { id: 'major-15', name: 'The Devil', kind: 'major', emoji: '🐐', keywords: ['Capricorn', 'bondage', 'desire'], meaning: 'The Devil reveals the binding power of desire, especially where the self mistakes attachment for identity.' },
  { id: 'major-16', name: 'The Tower', kind: 'major', emoji: '🗼', keywords: ['Mars', 'rupture', 'illumination'], meaning: 'The Tower is the strike that breaks the false structure and makes a more honest arrangement possible.' },
  { id: 'major-17', name: 'The Star', kind: 'major', emoji: '⭐', keywords: ['Aquarius', 'clarity', 'guidance'], meaning: 'The Star opens a lucid sky after breakdown, making direction visible again without demanding certainty.' },
  { id: 'major-18', name: 'The Moon', kind: 'major', emoji: '🌒', keywords: ['Pisces', 'dream', 'illusion'], meaning: 'The Moon is the unstable chamber of images where intuition and confusion arrive in the same envelope.' },
  { id: 'major-19', name: 'The Sun', kind: 'major', emoji: '☀️', keywords: ['Sun', 'success', 'life'], meaning: 'The Sun is successful visibility, the card where things stand in their own light and do not need apology.' },
  { id: 'major-20', name: 'The Aeon', kind: 'major', emoji: '🌅', keywords: ['Fire', 'judgment', 'new era'], meaning: 'The Aeon announces a historical and spiritual threshold, the kind that changes the grammar of the whole deck.' },
  { id: 'major-21', name: 'The Universe', kind: 'major', emoji: '🌍', keywords: ['Saturn', 'completion', 'wholeness'], meaning: 'The Universe closes the cycle by showing that completion is also a form of continuing order.' },
];

const minorRankOrder = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Knight', 'Queen', 'Prince', 'Princess'] as const;
const minorSuitOrder = ['wands', 'cups', 'swords', 'disks'] as const;

function buildMinorMeaning(suit: keyof typeof suitProfiles, rank: string) {
  const suitProfile = suitProfiles[suit];
  const rankProfile = rankProfiles[rank];
  return `${rankProfile.name} speaks to ${rankProfile.meaning}. Within ${suitProfile.name}, this card carries ${suitProfile.current}.`;
}

function buildMinorKeywords(suit: keyof typeof suitProfiles, rank: string) {
  const suitKeywords =
    suit === 'wands' ? ['will', 'initiative', 'heat'] :
    suit === 'cups' ? ['emotion', 'relationship', 'receptivity'] :
    suit === 'swords' ? ['thought', 'speech', 'conflict'] :
    ['matter', 'craft', 'resources'];

  const rankKeyword =
    rank === 'Ace' ? 'origin' :
    rank === 'Two' ? 'balance' :
    rank === 'Three' ? 'growth' :
    rank === 'Four' ? 'stability' :
    rank === 'Five' ? 'friction' :
    rank === 'Six' ? 'success' :
    rank === 'Seven' ? 'testing' :
    rank === 'Eight' ? 'skill' :
    rank === 'Nine' ? 'ripening' :
    rank === 'Ten' ? 'completion' :
    rank.toLowerCase();

  return [...suitKeywords, rankKeyword];
}

function buildMinorCards() {
  const cards: TarotCard[] = [];

  for (const suit of minorSuitOrder) {
    const profile = suitProfiles[suit];
    for (const rank of minorRankOrder) {
      const rankKey = rank as keyof typeof rankProfiles;
      cards.push({
        id: `minor-${suit}-${rank.toLowerCase()}`,
        name: `${rank} of ${profile.name}`,
        kind: 'minor',
        suit,
        rank,
        emoji: profile.emoji,
        keywords: buildMinorKeywords(suit, rank),
        meaning: buildMinorMeaning(suit, rankKey),
      });
    }
  }

  return cards;
}

export const TAROT_DECK: TarotCard[] = [...majorArcana, ...buildMinorCards()];
const TAROT_CARD_BY_ID = new Map(TAROT_DECK.map(card => [card.id, card]));

export const TAROT_STUDY_AREAS: TarotStudyArea[] = [
  { id: 'career', label: 'Career', prompt: 'work, status, leadership, and practical responsibility' },
  { id: 'romance', label: 'Romance', prompt: 'attraction, attachment, and emotional exchange' },
  { id: 'spirituality', label: 'Spirituality', prompt: 'practice, thresholds, and the inner demand of the card' },
  { id: 'adventure', label: 'Adventure', prompt: 'risk, movement, travel, and the urge to explore' },
  { id: 'self_improvement', label: 'Self Improvement', prompt: 'discipline, correction, and internal work' },
  { id: 'academics', label: 'Academics', prompt: 'study, research, analysis, and the shaping of ideas' },
];

export function getTarotCardById(cardId: string | null | undefined) {
  if (!cardId) return null;
  return TAROT_CARD_BY_ID.get(cardId) ?? null;
}

function normalizeQuestion(question: string) {
  const trimmed = question.trim();
  return trimmed || 'the question that was asked';
}

function buildAreaNotes(card: TarotCard, spread: SpreadDefinition | undefined, position: SpreadPosition | undefined) {
  const scope = spread ? `${spread.title}` : 'the reading';
  const positionNote = position ? ` in ${position.label}` : '';

  const base =
    card.kind === 'major'
      ? `${card.name} acts as a governing pattern${positionNote} in ${scope}, so`
      : `${card.name} behaves as a situational expression${positionNote} in ${scope}, so`;

  return {
    career: `${base} it points to the kind of work, rank, or public posture that needs to be claimed or revised.`,
    romance: `${base} it shows the emotional pattern that governs attraction, attachment, and what the reading will tolerate in intimacy.`,
    spirituality: `${base} it suggests the practice lesson, inner threshold, or ritual demand that sits closest to the card.`,
    adventure: `${base} it describes the risk appetite, movement, and sense of pursuit that will color the path forward.`,
    self_improvement: `${base} it indicates the habit, discipline, or correction that the querent may need to strengthen.`,
    academics: `${base} it favors the kind of study, reading, synthesis, or critical method that fits the card's mode of intelligence.`,
  } satisfies Record<TarotStudyArea['id'], string>;
}

export function buildTarotCardStudy(card: TarotCard, spread?: SpreadDefinition, position?: SpreadPosition): TarotCardStudy {
  return {
    title: card.name,
    attributions:
      card.kind === 'major'
        ? [`Major arcana`, `Keywords: ${card.keywords.join(', ')}`]
        : [`Suit: ${suitProfiles[card.suit || 'wands'].name}`, `Rank: ${card.rank || 'n/a'}`, `Keywords: ${card.keywords.join(', ')}`],
    overview:
      card.kind === 'major'
        ? `${card.name} works as a governing image in the portal: it is a symbolic principle rather than a local event.`
        : `${card.name} belongs to the suit-and-rank machinery that Crowley inherited, revised, and used to tune specific conditions.`,
    studyNotes:
      card.kind === 'major'
        ? [
            `${card.meaning} In Crowley's system, major cards often read as the larger atmosphere of a situation.`,
            position ? `In ${position.label}, the card behaves as ${position.role}, which gives the spread a strong directional note.` : 'When studied on its own, the card is best read as a symbolic principle rather than a prediction.',
          ]
        : [
            `${card.meaning} The suit gives the card its elemental weather, while the rank tells you where the force is in its development.`,
            position ? `In ${position.label}, the card acts as ${position.role}, so its suit pressure is being translated into a specific reading function.` : 'On its own, the card is best studied as an instance of suit-energy working through rank.',
          ],
    areaNotes: buildAreaNotes(card, spread, position),
  };
}

function buildCardInterpretation(card: TarotCard, position: SpreadPosition, question: string, spread: SpreadDefinition) {
  const study = buildTarotCardStudy(card, spread, position);
  const spreadText =
    spread.id === 'crowley-significator'
      ? "Crowley's method turns the reading into a story rather than a mere list of symbols."
      : spread.id === 'opening-by-key'
        ? 'The Golden Dawn key opens the meaning by treating each card as a controlled step in the reading.'
        : spread.id === 'gd-house-wheel'
          ? 'The house wheel makes the spread feel astrological and situational at the same time.'
          : 'The Celtic Cross works by staging the present matter against surrounding pressures.';

  return `${card.name} lands in ${position.label}. ${study.overview} ${study.studyNotes[0]} ${position.label} asks about ${position.focus}. For ${normalizeQuestion(question)}, that makes the card read as ${position.role}. ${spreadText}`;
}

export const SPREADS: SpreadDefinition[] = [
  {
    id: 'celtic-cross',
    title: 'Celtic Cross',
    subtitle: 'Popular ten-card reading',
    sourceLabel: 'Popular tarot',
    intro: 'The familiar ten-card structure is the easiest place to start: it places the present matter at the center and lets surrounding forces speak around it.',
    positions: [
      { index: 1, label: 'Present', role: 'the core issue', focus: 'what is active now' },
      { index: 2, label: 'Crossing', role: 'the pressure or aid meeting the matter', focus: 'what presses from the side' },
      { index: 3, label: 'Above', role: 'the conscious aim or stated concern', focus: 'what the querent says they want' },
      { index: 4, label: 'Below', role: 'the root or unconscious basis', focus: 'what sits underneath the surface' },
      { index: 5, label: 'Past', role: 'the recent foundation', focus: 'what brought the issue here' },
      { index: 6, label: 'Future', role: 'the next development', focus: 'what is likely to unfold next' },
      { index: 7, label: 'Self', role: "the querent's own stance", focus: 'how the matter feels from inside' },
      { index: 8, label: 'Environment', role: 'the outside world or public field', focus: 'how the world around it reacts' },
      { index: 9, label: 'Hopes / Fears', role: 'the charged emotional layer', focus: 'what is most hoped for or dreaded' },
      { index: 10, label: 'Outcome', role: 'the likely direction if the pattern holds', focus: 'where the motion is headed' },
    ],
  },
  {
    id: 'crowley-significator',
    title: 'Crowley Significator Method',
    subtitle: 'Crowley divination by signifier and story',
    sourceLabel: 'Aleister Crowley',
    intro: "Crowley's *Book of Thoth* presents a divinatory method centered on the Significator, the story cards, and the pairing of adjacent cards to build a coherent narrative.",
    positions: [
      { index: 1, label: 'Significator', role: 'the querent or central image', focus: 'who the reading is about' },
      { index: 2, label: 'What comes for', role: 'the question itself', focus: 'what the querent brought to the deck' },
      { index: 3, label: 'Beginning', role: 'the opening move', focus: 'how the situation starts to tell its story' },
      { index: 4, label: 'Crossing', role: 'the paired interference', focus: 'what modifies the opening line' },
      { index: 5, label: 'Foundation', role: 'the deep support or obstacle', focus: 'what holds the matter from below' },
      { index: 6, label: 'Crown', role: 'the higher frame', focus: 'what the matter is trying to become' },
      { index: 7, label: 'Outcome', role: 'the story’s present direction', focus: 'where the reading settles if nothing changes' },
    ],
  },
  {
    id: 'opening-by-key',
    title: 'Golden Dawn Opening by Key',
    subtitle: 'Golden Dawn divinatory method',
    sourceLabel: 'Golden Dawn',
    intro: 'The Golden Dawn’s complex “Opening by Key” reading is represented here as a 12-part wheel so the portal can show the method as an intelligible, browsable layout.',
    positions: [
      { index: 1, label: 'Key 1', role: 'opening the issue', focus: 'what unlocks the reading' },
      { index: 2, label: 'Key 2', role: 'supporting force', focus: 'what strengthens the opening' },
      { index: 3, label: 'Key 3', role: 'latent obstacle', focus: 'what complicates the answer' },
      { index: 4, label: 'Key 4', role: 'clear expression', focus: 'what becomes visible' },
      { index: 5, label: 'Key 5', role: 'hidden motion', focus: 'what moves below the surface' },
      { index: 6, label: 'Key 6', role: 'near-term weather', focus: 'what is about to happen' },
      { index: 7, label: 'Key 7', role: 'outer influence', focus: 'what is acting from the environment' },
      { index: 8, label: 'Key 8', role: 'inner influence', focus: 'what is acting from within' },
      { index: 9, label: 'Key 9', role: 'direction of ascent', focus: 'what the reading climbs toward' },
      { index: 10, label: 'Key 10', role: 'ground of manifestation', focus: 'what must be made practical' },
      { index: 11, label: 'Key 11', role: 'resolved tension', focus: 'what can be integrated' },
      { index: 12, label: 'Key 12', role: 'closing seal', focus: 'what seals the whole pattern' },
    ],
  },
  {
    id: 'gd-house-wheel',
    title: 'Golden Dawn House Wheel',
    subtitle: 'Astrological wheel inspired by Golden Dawn practice',
    sourceLabel: 'Golden Dawn-inspired reconstruction',
    intro: 'This wheel uses the twelve zodiacal houses as a readable tarot map. It is a portal reconstruction inspired by Golden Dawn astrology rather than a single canonical historical diagram.',
    positions: [
      { index: 1, label: 'Aries', role: 'self and initiation', focus: 'the first act of will' },
      { index: 2, label: 'Taurus', role: 'resources and embodiment', focus: 'what can be held and used' },
      { index: 3, label: 'Gemini', role: 'speech and exchange', focus: 'what is said or carried' },
      { index: 4, label: 'Cancer', role: 'roots and belonging', focus: 'what shelters the matter' },
      { index: 5, label: 'Leo', role: 'creativity and display', focus: 'what shines out' },
      { index: 6, label: 'Virgo', role: 'work and refinement', focus: 'what must be tuned or repaired' },
      { index: 7, label: 'Libra', role: 'partnership and balance', focus: 'what must be weighed against another force' },
      { index: 8, label: 'Scorpio', role: 'descent and transformation', focus: 'what must die or deepen' },
      { index: 9, label: 'Sagittarius', role: 'meaning and quest', focus: 'what direction gives the reading scope' },
      { index: 10, label: 'Capricorn', role: 'form and authority', focus: 'what becomes durable' },
      { index: 11, label: 'Aquarius', role: 'collective vision', focus: 'what reaches beyond the personal frame' },
      { index: 12, label: 'Pisces', role: 'dream and surrender', focus: 'what dissolves into the larger current' },
    ],
  },
];

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

export function dealTarotReading(spreadId: string, question: string) {
  const spread = SPREADS.find(entry => entry.id === spreadId) ?? SPREADS[0];
  const deck = shuffle(TAROT_DECK);
  const cards = spread.positions.map((position, index) => {
    const card = deck[index];
    return {
      card,
      position,
      interpretation: buildCardInterpretation(card, position, question, spread),
    } satisfies TarotDraw;
  });

  const majors = cards.filter(draw => draw.card.kind === 'major').slice(0, 3).map(draw => draw.card.name);
  const suits = cards
    .filter(draw => draw.card.kind === 'minor')
    .map(draw => draw.card.suit)
    .filter(Boolean) as NonNullable<TarotCard['suit']>[];
  const dominantSuit = suits.length
    ? suits.reduce((acc, suit) => {
        acc[suit] = (acc[suit] || 0) + 1;
        return acc;
      }, {} as Record<NonNullable<TarotCard['suit']>, number>)
    : null;

  const topSuit = dominantSuit ? Object.entries(dominantSuit).sort((left, right) => right[1] - left[1])[0]?.[0] : null;
  const overview = `This ${spread.title} reading begins with ${cards[0].card.name} and closes with ${cards[cards.length - 1].card.name}. ${majors.length ? `The major arcana in the spread lean on ${majors.join(', ')}. ` : ''}${topSuit ? `The minor cards cluster around ${suitProfiles[topSuit as keyof typeof suitProfiles].name}, which colors the whole reading with that suit's current.` : 'The draw stays broadly distributed across the deck.'}`;
  const closing =
    spread.id === 'crowley-significator'
      ? "Crowley's method wants the reader to convert the cards into a coherent story, so the reading should be read as a sequence rather than a pile of isolated meanings."
      : spread.id === 'opening-by-key'
        ? 'The Golden Dawn opening works best when the cards are read as a controlled sequence of openings and seals rather than as isolated predictions.'
        : spread.id === 'gd-house-wheel'
          ? 'The house wheel invites you to read the spread like a horoscope: each sector speaks in relation to the whole sky of the question.'
          : 'The Celtic Cross closes by showing how the present matter, its cross, and its outcome belong to the same moving situation.';

  return {
    id: `${spread.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    spread,
    question: normalizeQuestion(question),
    cards,
    overview,
    closing,
  } satisfies TarotReading;
}

export function buildManualReading(spreadId: string, question: string, cardIds: Array<string | null>) {
  const spread = SPREADS.find(entry => entry.id === spreadId) ?? SPREADS[0];
  const cards = spread.positions.map((position, index) => {
    const card = getTarotCardById(cardIds[index]);
    if (!card) {
      return {
        card: {
          id: `empty-${index}`,
          name: 'Choose a card',
          kind: 'minor' as const,
          suit: 'cups' as const,
          rank: 'Ace',
          emoji: '⬚',
          keywords: ['awaiting selection'],
          meaning: 'This position is still open, waiting for the player to choose a card for it.',
        },
        position,
        interpretation: `Position ${position.index} is still empty. Use the deck panel to place a card here.`,
      } satisfies TarotDraw;
    }

    return {
      card,
      position,
      interpretation: buildCardInterpretation(card, position, question, spread),
    } satisfies TarotDraw;
  });

  const filledCount = cards.filter(draw => !draw.card.id.startsWith('empty-')).length;

  return {
    id: `${spread.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    spread,
    question: normalizeQuestion(question),
    cards,
    overview: filledCount
      ? `The manual layout currently has ${filledCount} chosen card${filledCount === 1 ? '' : 's'} in place.`
      : 'No cards have been assigned yet, so the spread is waiting for the player to build it by hand.',
    closing: 'Manual mode lets the reader stage the spread card by card, which is useful for study, comparison, and deliberate deck selection.',
  } satisfies TarotReading;
}

