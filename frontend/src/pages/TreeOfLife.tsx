import { useEffect, useMemo, useState } from 'react';
import { fetchJSON } from '../api';
import TopicShelf from '../components/TopicShelf';
import { TOPIC_GROUPS } from '../topicGroups';

type NodeKey =
  | 'kether'
  | 'chokmah'
  | 'binah'
  | 'chesed'
  | 'geburah'
  | 'tiphareth'
  | 'netzach'
  | 'hod'
  | 'yesod'
  | 'malkuth';

type AttributionMode = 'tree' | 'tarot' | 'names' | 'colors' | 'angels';
type QuizDeck = 'letters' | 'trumps' | 'powers' | 'names' | 'angels' | 'swaps' | 'mixed';
type QuizFamily =
  | 'letter'
  | 'trump'
  | 'power'
  | 'sefirahName'
  | 'sefirahNumber'
  | 'divineName'
  | 'archangel'
  | 'angelOrder'
  | 'swap';

type TreeEntry = {
  path_number: number;
  name: string;
  hebrew_letter: string | null;
  astrological_attribution: string | null;
  thoth_tarot_card: string | null;
  gd_tarot_card: string | null;
  is_swapped: number;
  color_scale_king: string | null;
  color_scale_queen: string | null;
  color_scale_emperor: string | null;
  color_scale_empress: string | null;
  god_name: string | null;
  archangel: string | null;
  angel_choir: string | null;
  crowley_tweaks: string | null;
  description: string | null;
};

type TreeNode = TreeEntry & {
  kind: 'node';
  key: NodeKey;
  x: number;
  y: number;
  card: null;
};

type TreePath = TreeEntry & {
  kind: 'path';
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  from: NodeKey;
  to: NodeKey;
};

type TreeRegion = TreeNode | TreePath;

type QuizItem = {
  family: QuizFamily;
  label: string;
  detail: string;
  prompt: string;
  explanation: string;
  targetKind: 'node' | 'path';
  targetId: string;
  answerName: string;
  badge?: string;
};

type AnswerRecord = {
  label: string;
  result: string;
  correct: boolean;
  targetKind: 'node' | 'path';
  targetId: string;
  short: string;
};

type FeedbackLine = {
  text: string;
  correct: boolean;
};

const NODE_LAYOUT: Record<NodeKey, { x: number; y: number }> = {
  kether: { x: 250, y: 68 },
  chokmah: { x: 342, y: 154 },
  binah: { x: 158, y: 154 },
  chesed: { x: 342, y: 268 },
  geburah: { x: 158, y: 268 },
  tiphareth: { x: 250, y: 382 },
  netzach: { x: 342, y: 494 },
  hod: { x: 158, y: 494 },
  yesod: { x: 250, y: 606 },
  malkuth: { x: 250, y: 712 },
};

const NODE_KEY_BY_NUMBER: Record<number, NodeKey> = {
  1: 'kether',
  2: 'chokmah',
  3: 'binah',
  4: 'chesed',
  5: 'geburah',
  6: 'tiphareth',
  7: 'netzach',
  8: 'hod',
  9: 'yesod',
  10: 'malkuth',
};

const PATH_CONNECTIONS: Record<number, { from: NodeKey; to: NodeKey }> = {
  11: { from: 'kether', to: 'chokmah' },
  12: { from: 'kether', to: 'binah' },
  13: { from: 'kether', to: 'tiphareth' },
  14: { from: 'chokmah', to: 'binah' },
  15: { from: 'chokmah', to: 'tiphareth' },
  16: { from: 'chokmah', to: 'chesed' },
  17: { from: 'binah', to: 'tiphareth' },
  18: { from: 'binah', to: 'geburah' },
  19: { from: 'chesed', to: 'geburah' },
  20: { from: 'chesed', to: 'tiphareth' },
  21: { from: 'chesed', to: 'netzach' },
  22: { from: 'geburah', to: 'tiphareth' },
  23: { from: 'geburah', to: 'hod' },
  24: { from: 'tiphareth', to: 'netzach' },
  25: { from: 'tiphareth', to: 'yesod' },
  26: { from: 'tiphareth', to: 'hod' },
  27: { from: 'netzach', to: 'hod' },
  28: { from: 'netzach', to: 'yesod' },
  29: { from: 'netzach', to: 'malkuth' },
  30: { from: 'hod', to: 'yesod' },
  31: { from: 'hod', to: 'malkuth' },
  32: { from: 'yesod', to: 'malkuth' },
};

const DECKS: { id: QuizDeck; label: string; families: QuizFamily[] }[] = [
  { id: 'letters', label: 'Hebrew Letters', families: ['letter'] },
  { id: 'trumps', label: 'Tarot Trumps', families: ['trump'] },
  { id: 'powers', label: 'Astrological Powers', families: ['power'] },
  { id: 'names', label: 'Sefirot and Divine Names', families: ['sefirahName', 'sefirahNumber', 'divineName'] },
  { id: 'angels', label: 'Archangels and Choirs', families: ['archangel', 'angelOrder'] },
  { id: 'swaps', label: 'Crowley Swaps', families: ['swap'] },
  {
    id: 'mixed',
    label: 'Mixed Review',
    families: ['letter', 'trump', 'power', 'sefirahName', 'sefirahNumber', 'divineName', 'archangel', 'angelOrder', 'swap'],
  },
];

const ATTRIBUTION_MODES: { id: AttributionMode; label: string }[] = [
  { id: 'tree', label: 'Tree' },
  { id: 'tarot', label: 'Tarot' },
  { id: 'names', label: 'Names' },
  { id: 'colors', label: 'Colors' },
  { id: 'angels', label: 'Angels' },
];

function normalizeEntry(entry: TreeEntry): TreeRegion {
  if (entry.path_number <= 10) {
    const key = NODE_KEY_BY_NUMBER[entry.path_number];
    const position = NODE_LAYOUT[key];
    return {
      ...entry,
      kind: 'node',
      key,
      x: position.x,
      y: position.y,
      card: null,
    };
  }

  const link = PATH_CONNECTIONS[entry.path_number];
  const from = NODE_LAYOUT[link.from];
  const to = NODE_LAYOUT[link.to];
  return {
    ...entry,
    kind: 'path',
    key: `path-${entry.path_number}`,
    x1: from.x,
    y1: from.y,
    x2: to.x,
    y2: to.y,
    from: link.from,
    to: link.to,
  };
}

function pathMidpoint(path: TreePath) {
  return {
    x: (path.x1 + path.x2) / 2,
    y: (path.y1 + path.y2) / 2,
  };
}

function nodeLabel(node: TreeNode, mode: AttributionMode) {
  switch (mode) {
    case 'tree':
      return node.name;
    case 'tarot':
      return node.thoth_tarot_card || node.gd_tarot_card || node.name;
    case 'names':
      return node.god_name || node.name;
    case 'colors':
      return node.color_scale_king || node.name;
    case 'angels':
      return node.archangel || node.name;
    default:
      return node.name;
  }
}

function pathLabel(path: TreePath, mode: AttributionMode) {
  switch (mode) {
    case 'tree':
      return path.hebrew_letter || `Path ${path.path_number}`;
    case 'tarot':
      return path.thoth_tarot_card || path.gd_tarot_card || `Path ${path.path_number}`;
    case 'names':
      return path.astrological_attribution || `Path ${path.path_number}`;
    case 'colors':
      return path.color_scale_king || `Path ${path.path_number}`;
    case 'angels':
      return path.crowley_tweaks || `Path ${path.path_number}`;
    default:
      return `Path ${path.path_number}`;
  }
}

function buildQuizItems(entries: TreeRegion[]) {
  const items: QuizItem[] = [];
  const nodes = entries.filter((entry): entry is TreeNode => entry.kind === 'node');
  const paths = entries.filter((entry): entry is TreePath => entry.kind === 'path');

  for (const path of paths) {
    if (path.hebrew_letter) {
      items.push({
        family: 'letter',
        label: path.hebrew_letter,
        detail: `Path ${path.path_number}`,
        prompt: `Place the Hebrew letter ${path.hebrew_letter} on the Tree.`,
        explanation: `${path.hebrew_letter} belongs on path ${path.path_number} between ${path.from} and ${path.to}.`,
        targetKind: 'path',
        targetId: String(path.path_number),
        answerName: `Path ${path.path_number}`,
      });
    }

    if (path.thoth_tarot_card) {
      items.push({
        family: 'trump',
        label: path.thoth_tarot_card,
        detail: `Path ${path.path_number}`,
        prompt: `Place ${path.thoth_tarot_card}.`,
        explanation: `${path.thoth_tarot_card} is Crowley's trump attribution for path ${path.path_number}.`,
        targetKind: 'path',
        targetId: String(path.path_number),
        answerName: `Path ${path.path_number}`,
      });
    }

    if (path.astrological_attribution) {
      items.push({
        family: 'power',
        label: path.astrological_attribution,
        detail: `Path ${path.path_number}`,
        prompt: `Place ${path.astrological_attribution} on the Tree.`,
        explanation: `${path.astrological_attribution} is the power linked with path ${path.path_number}.`,
        targetKind: 'path',
        targetId: String(path.path_number),
        answerName: `Path ${path.path_number}`,
      });
    }

    if (path.is_swapped === 1 && path.hebrew_letter && path.thoth_tarot_card) {
      items.push({
        family: 'swap',
        label: `${path.hebrew_letter} / ${path.thoth_tarot_card}`,
        detail: 'Crowley swap',
        prompt: `Place Crowley's swap for ${path.hebrew_letter}.`,
        explanation: `Crowley places ${path.thoth_tarot_card} on path ${path.path_number}, which the Golden Dawn labels differently.`,
        targetKind: 'path',
        targetId: String(path.path_number),
        answerName: `Path ${path.path_number}`,
        badge: 'Swap',
      });
    }
  }

  for (const node of nodes) {
    const nodeId = String(node.path_number);
    items.push({
      family: 'sefirahName',
      label: node.name,
      detail: `Sefirah ${node.path_number}`,
      prompt: `Place the sefirah ${node.name}.`,
      explanation: `${node.name} is the sefirah at position ${node.path_number}.`,
      targetKind: 'node',
      targetId: nodeId,
      answerName: node.name,
    });

    items.push({
      family: 'sefirahNumber',
      label: String(node.path_number),
      detail: node.name,
      prompt: `Place sefirah number ${node.path_number}.`,
      explanation: `${node.path_number} is the number assigned to ${node.name}.`,
      targetKind: 'node',
      targetId: nodeId,
      answerName: node.name,
    });

    if (node.god_name) {
      items.push({
        family: 'divineName',
        label: node.god_name,
        detail: node.name,
        prompt: `Place the divine name ${node.god_name}.`,
        explanation: `${node.god_name} is the divine name shown for ${node.name}.`,
        targetKind: 'node',
        targetId: nodeId,
        answerName: node.name,
      });
    }

    if (node.archangel) {
      items.push({
        family: 'archangel',
        label: node.archangel,
        detail: node.name,
        prompt: `Place the archangel ${node.archangel}.`,
        explanation: `${node.archangel} is the archangel attribution for ${node.name}.`,
        targetKind: 'node',
        targetId: nodeId,
        answerName: node.name,
      });
    }

    if (node.angel_choir) {
      items.push({
        family: 'angelOrder',
        label: node.angel_choir,
        detail: node.name,
        prompt: `Place the angelic order ${node.angel_choir}.`,
        explanation: `${node.angel_choir} is the angelic choir shown for ${node.name}.`,
        targetKind: 'node',
        targetId: nodeId,
        answerName: node.name,
      });
    }
  }

  return items;
}

function uniqueLabel(item: QuizItem) {
  return `${item.family}:${item.label}`;
}

const TreeOfLife = () => {
  const [tree, setTree] = useState<TreeEntry[]>([]);
  const [hovered, setHovered] = useState<TreeRegion | null>(null);
  const [selected, setSelected] = useState<QuizItem | null>(null);
  const [quizDeck, setQuizDeck] = useState<QuizDeck>('mixed');
  const [attributionMode, setAttributionMode] = useState<AttributionMode>('tree');
  const [showMode, setShowMode] = useState<'study' | 'exam'>('study');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState<FeedbackLine[]>([]);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  useEffect(() => {
    fetchJSON('thelemic_tree').then((data: TreeEntry[]) => setTree(data));
  }, []);

  const regions = useMemo(() => tree.map(normalizeEntry), [tree]);
  const quizItems = useMemo(() => buildQuizItems(regions), [regions]);
  const deckQuestions = useMemo(() => {
    const deck = DECKS.find(item => item.id === quizDeck) ?? DECKS[0];
    return quizItems.filter(item => deck.families.includes(item.family));
  }, [quizDeck, quizItems]);

  const currentQuestion = useMemo(() => {
    if (!deckQuestions.length) return null;
    return deckQuestions[(round - 1) % deckQuestions.length];
  }, [deckQuestions, round]);

  const bank = useMemo(() => {
    if (!currentQuestion) return [];
    const decoys = quizItems
      .filter(item => item.family === currentQuestion.family && uniqueLabel(item) !== uniqueLabel(currentQuestion))
      .sort(() => Math.random() - 0.5);
    return [currentQuestion, ...decoys].slice(0, 12).sort(() => Math.random() - 0.5);
  }, [currentQuestion, quizItems]);

  const prompt = currentQuestion
    ? `${currentQuestion.prompt} ${currentQuestion.badge ? `(${currentQuestion.badge})` : ''}`
    : 'Loading the Tree of Life data...';

  const mastery = answers.length ? Math.round((answers.filter(item => item.correct).length / answers.length) * 100) : 0;

  function pushFeedback(text: string, correct: boolean) {
    setFeedback(prev => [{ text, correct }, ...prev].slice(0, 10));
  }

  function chooseToken(item: QuizItem) {
    setSelected(item);
    pushFeedback(`Selected ${item.label}. Tap the matching Tree region.`, true);
  }

  function advanceQuestion() {
    setSelected(null);
    setRound(prev => prev + 1);
  }

  function recordAnswer(correct: boolean, region: TreeRegion) {
    if (!currentQuestion) return;

    if (correct) {
      const points = 10 + Math.min(streak * 2, 20);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      pushFeedback(`Correct: ${currentQuestion.label} on ${currentQuestion.answerName}. ${currentQuestion.explanation} +${points}`, true);
    } else {
      setStreak(0);
      pushFeedback(`Not quite: ${currentQuestion.label} belongs on ${currentQuestion.answerName}. ${currentQuestion.explanation}`, false);
    }

    setAnswers(prev => [
      {
        label: currentQuestion.label,
        result: correct ? `Correct on ${currentQuestion.answerName}` : `Missed; belongs on ${currentQuestion.answerName}`,
        correct,
        targetKind: currentQuestion.targetKind,
        targetId: currentQuestion.targetId,
        short: currentQuestion.label.length > 7 ? currentQuestion.label.slice(0, 7) : currentQuestion.label,
      },
      ...prev,
    ]);

    setHovered(region);
    advanceQuestion();
  }

  function handleRegionTap(region: TreeRegion) {
    if (!selected || !currentQuestion) {
      pushFeedback('Choose a token first, then tap the Tree.', false);
      return;
    }

    const correct =
      selected.family === currentQuestion.family &&
      selected.label === currentQuestion.label &&
      currentQuestion.targetKind === region.kind &&
      currentQuestion.targetId === (region.kind === 'node' ? String(region.path_number) : String(region.path_number));

    recordAnswer(correct, region);
  }

  function resetRun() {
    setScore(0);
    setStreak(0);
    setRound(1);
    setSelected(null);
    setFeedback([]);
    setAnswers([]);
    if (regions.length) {
      setHovered(regions[0]);
    }
    pushFeedback('Run reset. Start again at the Crown.', true);
  }

  const hoverLabel = hovered
    ? hovered.kind === 'node'
      ? `${hovered.name} - ${hovered.description || ''}`.trim()
      : `${hovered.hebrew_letter || `Path ${hovered.path_number}`} - ${hovered.crowley_tweaks || hovered.description || ''}`.trim()
    : 'Hover a node or path to inspect its attribution set.';

  const detailRegion = hovered ?? regions.find(region => region.kind === 'node' && region.path_number === 6) ?? null;

  return (
    <div className="tree-of-life-page">
      <section className="glass-panel tree-hero">
        <div>
          <p className="tree-kicker">CrowleyDB Tree of Life</p>
          <h1>Thelemic Tree of Life Viewer</h1>
          <p className="tree-intro">
            This is the Crowley studies version of the Tree Tapper idea: a Tree viewer that exposes the
            Golden Dawn base layer, Crowley's changes, and a quiz loop that asks the reader to place attributions
            rather than merely read them.
          </p>
        </div>
        <div className="tree-stats">
          <div className="tree-stat">
            <span>Score</span>
            <strong>{score}</strong>
          </div>
          <div className="tree-stat">
            <span>Streak</span>
            <strong>{streak}</strong>
          </div>
          <div className="tree-stat">
            <span>Round</span>
            <strong>{round}</strong>
          </div>
          <div className="tree-stat">
            <span>Mastery</span>
            <strong>{mastery}%</strong>
          </div>
        </div>
      </section>

      <section className="tree-controls glass-panel">
        <label>
          Attribution view
          <select value={attributionMode} onChange={event => setAttributionMode(event.target.value as AttributionMode)}>
            {ATTRIBUTION_MODES.map(mode => (
              <option key={mode.id} value={mode.id}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Quiz deck
          <select value={quizDeck} onChange={event => setQuizDeck(event.target.value as QuizDeck)}>
            {DECKS.map(deck => (
              <option key={deck.id} value={deck.id}>
                {deck.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Reveal style
          <select value={showMode} onChange={event => setShowMode(event.target.value as 'study' | 'exam')}>
            <option value="study">Study: labels visible</option>
            <option value="exam">Exam: labels muted</option>
          </select>
        </label>
        <div className="tree-controls__buttons">
          <button onClick={advanceQuestion}>Next prompt</button>
          <button onClick={resetRun}>Reset run</button>
        </div>
      </section>

      <section className="tree-workbench">
        <aside className="glass-panel tree-sidebar">
          <h2>Prompt</h2>
          <p className="tree-prompt">{prompt}</p>
          <p className="tree-small">
            Selected token: {selected ? `${selected.label} (${selected.detail})` : 'none'}
          </p>
          <div className="tree-bank">
              {bank.map(item => (
                <button
                  key={`${item.family}:${item.label}`}
                  className={`tree-token ${selected && selected.family === item.family && selected.label === item.label ? 'is-selected' : ''}`}
                  onClick={() => chooseToken(item)}
                  data-portal-track-click="true"
                  data-portal-track-hover="true"
                  data-portal-track-label={item.label}
                  data-portal-track-detail={item.detail}
                  data-portal-track-source="Tree bank"
                  data-portal-track-domain="tree"
                >
                <span>{item.label}</span>
                <small>{item.detail}</small>
                {item.badge && <em>{item.badge}</em>}
              </button>
            ))}
          </div>

          <div className="tree-feedback">
            {feedback.length ? (
              feedback.map((line, index) => (
                <div key={`${line.text}-${index}`} className={`tree-log ${line.correct ? 'is-good' : 'is-bad'}`}>
                  {line.text}
                </div>
              ))
            ) : (
              <div className="tree-log">Pick a token, then tap the matching Tree region to check the attribution.</div>
            )}
          </div>
        </aside>

        <section className="glass-panel tree-board-panel">
          <div className="tree-board-header">
            <div>
              <h2>Tap the Tree</h2>
              <p>{hoverLabel}</p>
            </div>
            <div className="tree-mode-chips">
              {ATTRIBUTION_MODES.map(mode => (
                <button
                  key={mode.id}
                  className={`tree-chip ${attributionMode === mode.id ? 'is-active' : ''}`}
                  onClick={() => setAttributionMode(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <svg className={`tree-svg ${showMode === 'exam' ? 'is-exam' : ''}`} viewBox="80 20 340 720" role="img" aria-label="Thelemic Tree of Life quiz board">
            <g className="tree-connections">
              {regions
                .filter((region): region is TreePath => region.kind === 'path')
                .map(path => {
                  const midpoint = pathMidpoint(path);
                  const isTarget = currentQuestion?.targetKind === 'path' && currentQuestion.targetId === String(path.path_number);
                  return (
                    <g key={path.key}>
                      <line
                        className={`tree-path ${isTarget ? 'is-target' : ''} ${path.is_swapped === 1 ? 'is-swapped' : ''}`}
                        x1={path.x1}
                        y1={path.y1}
                        x2={path.x2}
                        y2={path.y2}
                        onMouseEnter={() => setHovered(path)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleRegionTap(path)}
                        data-portal-track-hover="true"
                        data-portal-track-click="true"
                        data-portal-track-label={path.hebrew_letter || `Path ${path.path_number}`}
                        data-portal-track-detail={path.crowley_tweaks || path.description || ''}
                        data-portal-track-source="Tree board"
                        data-portal-track-domain="tree"
                        data-portal-tree-number={String(path.path_number)}
                        data-portal-tree-kind="path"
                      />
                      <text className={`tree-path-label ${showMode === 'exam' ? 'is-muted' : ''}`} x={midpoint.x} y={midpoint.y}>
                        {pathLabel(path, attributionMode)}
                      </text>
                    </g>
                  );
                })}
            </g>

            <g className="tree-nodes">
              {regions
                .filter((region): region is TreeNode => region.kind === 'node')
                .map(node => {
                  const isTarget = currentQuestion?.targetKind === 'node' && currentQuestion.targetId === String(node.path_number);
                  return (
                    <g key={node.key}>
                      <circle
                        className={`tree-node ${isTarget ? 'is-target' : ''}`}
                        cx={node.x}
                        cy={node.y}
                        r={28}
                        onMouseEnter={() => setHovered(node)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleRegionTap(node)}
                        data-portal-track-hover="true"
                        data-portal-track-click="true"
                        data-portal-track-label={node.name}
                        data-portal-track-detail={node.description || ''}
                        data-portal-track-source="Tree board"
                        data-portal-track-domain="tree"
                        data-portal-tree-number={String(node.path_number)}
                        data-portal-tree-kind="sephirah"
                      />
                      <text className={`tree-node-number ${showMode === 'exam' ? 'is-muted' : ''}`} x={node.x} y={node.y - 7}>
                        {node.path_number}
                      </text>
                      <text className={`tree-node-label ${showMode === 'exam' ? 'is-muted' : ''}`} x={node.x} y={node.y + 12}>
                        {nodeLabel(node, attributionMode)}
                      </text>
                    </g>
                  );
                })}
            </g>

            <g className="tree-swaps">
              {regions
                .filter((region): region is TreePath => region.kind === 'path' && region.is_swapped === 1)
                .map(path => {
                  const midpoint = pathMidpoint(path);
                  return (
                    <text key={`${path.key}-swap`} className="tree-swap-tag" x={midpoint.x} y={midpoint.y + 18}>
                      Crowley swap
                    </text>
                  );
                })}
            </g>
          </svg>
        </section>

        <aside className="glass-panel tree-detail-panel">
          <h2>Attribution Detail</h2>
          {detailRegion && (
            <div className="tree-detail">
              <h3>{detailRegion.kind === 'node' ? detailRegion.name : `${detailRegion.hebrew_letter || `Path ${detailRegion.path_number}`}`}</h3>
              <p>{detailRegion.description}</p>

              {detailRegion.kind === 'node' ? (
                <div className="tree-detail-grid">
                  <div><span>God name</span><strong>{detailRegion.god_name || 'n/a'}</strong></div>
                  <div><span>Archangel</span><strong>{detailRegion.archangel || 'n/a'}</strong></div>
                  <div><span>Choir</span><strong>{detailRegion.angel_choir || 'n/a'}</strong></div>
                  <div><span>Colors</span><strong>{detailRegion.color_scale_king || 'n/a'}</strong></div>
                </div>
              ) : (
                <div className="tree-detail-grid">
                  <div><span>Hebrew letter</span><strong>{detailRegion.hebrew_letter || 'n/a'}</strong></div>
                  <div><span>Thoth card</span><strong>{detailRegion.thoth_tarot_card || 'n/a'}</strong></div>
                  <div><span>GD card</span><strong>{detailRegion.gd_tarot_card || 'n/a'}</strong></div>
                  <div><span>Astrology</span><strong>{detailRegion.astrological_attribution || 'n/a'}</strong></div>
                </div>
              )}

              <div className="tree-note">
                {detailRegion.crowley_tweaks || 'Hover over another region to inspect the source layer or Crowley-specific modification.'}
              </div>
            </div>
          )}

          <div className="tree-answer-list">
            <h3>Answered Items</h3>
            {answers.length ? (
              answers.slice(0, 8).map(item => (
                <div key={`${item.label}-${item.targetId}-${item.correct}`} className="tree-answer-row">
                  <strong>{item.label}</strong>
                  <span>{item.result}</span>
                </div>
              ))
            ) : (
              <p className="tree-small">No answers yet. Use the bank and the board to start a run.</p>
            )}
          </div>
        </aside>
      </section>

      <TopicShelf
        title="Key Tree topics"
        intro="These are the concepts a reader needs to navigate the Tree properly: the magical framework, the tarot layer, the curriculum, and the specific Crowley revisions that matter to the portal."
        slugs={TOPIC_GROUPS.tree}
      />
    </div>
  );
};

export default TreeOfLife;
