import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../api';
import { usePortalIdentity } from '../portalIdentity';

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

function getRouteLabel(route: string) {
  const match = route.replace(/^\//, '');
  if (!match) return 'Home';
  return match.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

const Character = () => {
  const [treeEntries, setTreeEntries] = useState<TreeEntry[]>([]);
  const { profile, traces, accomplishments, clearProfile } = usePortalIdentity();

  useEffect(() => {
    fetchJSON('thelemic_tree').then(setTreeEntries);
  }, []);

  const tree = useMemo(() => {
    return treeEntries.slice().sort((a, b) => a.path_number - b.path_number);
  }, [treeEntries]);

  const focusList = useMemo(() => {
    return Object.values(accomplishments)
      .slice()
      .sort((left, right) => right.traceCount - left.traceCount || left.number - right.number);
  }, [accomplishments]);

  const recentTraces = traces.slice(0, 10);
  const totalSignals = traces.length;
  const uniqueFocuses = focusList.length;

  return (
    <div className="page-shell character-page">
      <section className="glass-panel page-hero character-page__hero">
        <div>
          <p className="page-kicker">Initiatory record</p>
          <h1>{profile?.initiatoryName || 'Unsealed aspirant'}</h1>
          <p className="page-intro">
            {profile
              ? `${profile.mundaneName} entered the lodge as ${profile.initiatoryName}. The sheet below fills in as the portal is explored.`
              : 'Create an initiatory name first, then come back here as the sheet begins to grow from your clicks and hovers.'}
          </p>
        </div>
        <div className="page-stat">
          <span>Signals</span>
          <strong>{totalSignals}</strong>
        </div>
      </section>

      <section className="glass-panel character-page__profile">
        <div>
          <h2>Temple profile</h2>
          <p className="character-page__motto">{profile?.magicalMotto || 'No motto sealed yet.'}</p>
          <p className="page-intro">
            {profile
              ? `${profile.lineage} · ${profile.style}`
              : 'The profile remains open until the initiation dialogue is finished.'}
          </p>
        </div>
        <div className="character-page__profile-actions">
          <Link to="/initiation" className="tree-chip is-active">
            {profile ? 'Revise initiatory name' : 'Enter the lodge'}
          </Link>
          <button type="button" className="tree-chip is-active" onClick={clearProfile}>
            Clear profile
          </button>
        </div>
      </section>

      <section className="character-layout">
        <section className="glass-panel character-tree">
          <div className="tree-board-header">
            <div>
              <h2>Tree of Life character sheet</h2>
              <p>
                Hover and click around the portal to fill these nodes with spiritual traces. Each focus increments the
                Tree position that best matches the page you were exploring.
              </p>
            </div>
            <div className="tree-mode-chips">
              <span className="tree-chip is-active">Improved TreeTapper</span>
            </div>
          </div>

          <svg className="tree-svg character-tree__svg" viewBox="80 20 340 720" role="img" aria-label="Character sheet Tree of Life">
            <g className="tree-connections">
              {Object.entries(PATH_CONNECTIONS).map(([pathNumber, connection]) => {
                const num = Number(pathNumber);
                const from = NODE_LAYOUT[connection.from];
                const to = NODE_LAYOUT[connection.to];
                const accomplishment = accomplishments[pathNumber];
                return (
                  <g key={`character-path-${pathNumber}`}>
                    <line
                      className={`tree-path ${accomplishment ? 'is-target' : ''}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      data-portal-track-hover="true"
                      data-portal-track-click="true"
                      data-portal-tree-number={String(num)}
                      data-portal-tree-kind="path"
                      data-portal-track-label={`Path ${num}`}
                      data-portal-track-source="Character sheet"
                      data-portal-track-domain="character"
                    />
                    {accomplishment ? (
                      <text className="character-tree__count" x={(from.x + to.x) / 2} y={(from.y + to.y) / 2}>
                        {accomplishment.traceCount}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </g>

            <g className="tree-nodes">
              {tree
                .filter(entry => entry.path_number <= 10)
                .map(entry => {
                  const key = NODE_KEY_BY_NUMBER[entry.path_number];
                  const position = NODE_LAYOUT[key];
                  const accomplishment = accomplishments[String(entry.path_number)];
                  return (
                    <g key={`character-node-${entry.path_number}`}>
                      <circle
                        className={`tree-node ${accomplishment ? 'is-target' : ''}`}
                        cx={position.x}
                        cy={position.y}
                        r={28}
                        data-portal-track-hover="true"
                        data-portal-track-click="true"
                        data-portal-tree-number={String(entry.path_number)}
                        data-portal-tree-kind="sephirah"
                        data-portal-track-label={entry.name}
                        data-portal-track-detail={entry.description || ''}
                        data-portal-track-source="Character sheet"
                        data-portal-track-domain="character"
                      />
                      <text className="tree-node-number" x={position.x} y={position.y - 7}>
                        {entry.path_number}
                      </text>
                      <text className="tree-node-label" x={position.x} y={position.y + 12}>
                        {entry.name}
                      </text>
                      {accomplishment ? (
                        <text className="character-tree__count" x={position.x} y={position.y + 42}>
                          {accomplishment.traceCount}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
            </g>
          </svg>
        </section>

        <aside className="character-sidebar">
          <section className="glass-panel character-sidebar__card">
            <h2>Accomplishments</h2>
            <div className="character-ledger">
              {focusList.length ? (
                focusList.map(item => (
                  <article key={item.number} className="character-ledger__row">
                    <strong>
                      {item.number} {item.label}
                    </strong>
                    <span>
                      {item.traceCount} traces · {item.clickCount} clicks · {item.hoverCount} hovers
                    </span>
                  </article>
                ))
              ) : (
                <p className="page-intro">No accomplishments recorded yet. Start exploring the portal to populate the sheet.</p>
              )}
            </div>
          </section>

          <section className="glass-panel character-sidebar__card">
            <h2>Recent traces</h2>
            <div className="character-trace-list">
              {recentTraces.length ? (
                recentTraces.map(trace => (
                  <article key={trace.id} className="character-trace">
                    <div className="character-trace__head">
                      <strong>{trace.kind}</strong>
                      <span>{new Date(trace.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p>{trace.label}</p>
                    <small>
                      {getRouteLabel(trace.route)} · {trace.source}
                    </small>
                  </article>
                ))
              ) : (
                <p className="page-intro">The trace book is empty until you move through the site.</p>
              )}
            </div>
          </section>

          <section className="glass-panel character-sidebar__card">
            <h2>Summary</h2>
            <div className="character-summary-grid">
              <div>
                <span>Unique focuses</span>
                <strong>{uniqueFocuses}</strong>
              </div>
              <div>
                <span>Last route</span>
                <strong>{recentTraces[0] ? getRouteLabel(recentTraces[0].route) : 'None'}</strong>
              </div>
              <div>
                <span>Primary current</span>
                <strong>{profile?.currentTitle || 'Unassigned'}</strong>
              </div>
              <div>
                <span>Tree state</span>
                <strong>{focusList.some(item => item.kind === 'path') ? 'Bridging' : 'Concentrating'}</strong>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
};

export default Character;
