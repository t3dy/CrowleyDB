import { useEffect, useMemo, useState } from 'react';
import { fetchJSON } from '../api';
import { useLane } from '../App';

type SourceRow = {
  id: string;
  source_kind: string;
  source_ref: string;
  title: string;
  author?: string | null;
  priority_score: number;
  focus?: string | null;
  why_key?: string | null;
  evidence_lane?: string | null;
  file_path?: string | null;
  search_terms?: string | string[] | null;
  notes?: string | null;
};

type ClaimRow = {
  id?: string;
  source_id: string;
  claim_type: string;
  symbol: string;
  symbol_value?: string | null;
  related_symbol?: string | null;
  claim_text: string;
  evidence_locator?: string | null;
  evidence_excerpt?: string | null;
  confidence?: number;
  priority_score?: number;
  notes?: string | null;
};

const toSearchString = (value: string | string[] | null | undefined) => {
  if (!value) return '';
  return Array.isArray(value) ? value.join(' ') : value;
};

const Corpus = () => {
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const { currentLane } = useLane();

  useEffect(() => {
    fetchJSON('corpus_sources').then((data: SourceRow[]) => setSources(data || []));
    fetchJSON('symbol_claims').then((data: ClaimRow[]) => setClaims(data || []));
  }, []);

  const claimCounts = useMemo(() => {
    return claims.reduce((acc: Record<string, number>, claim) => {
      acc[claim.source_id] = (acc[claim.source_id] || 0) + 1;
      return acc;
    }, {});
  }, [claims]);

  const filteredSources = useMemo(() => {
    const search = query.trim().toLowerCase();
    return sources
      .filter(source => (kind === 'all' ? true : source.source_kind === kind))
      .filter(source => {
        if (currentLane !== 'All' && source.evidence_lane && source.evidence_lane !== currentLane) {
          return false;
        }
        if (!search) return true;
        return [
          source.title,
          source.author || '',
          source.source_kind,
          source.focus || '',
          source.why_key || '',
          source.notes || '',
          toSearchString(source.search_terms),
        ]
          .join(' ')
          .toLowerCase()
          .includes(search);
      })
      .sort((left, right) => right.priority_score - left.priority_score || left.title.localeCompare(right.title));
  }, [sources, query, kind, currentLane]);

  useEffect(() => {
    if (!selectedSourceId && filteredSources[0]) {
      setSelectedSourceId(filteredSources[0].id);
    }
    if (selectedSourceId && !filteredSources.find(source => source.id === selectedSourceId) && filteredSources[0]) {
      setSelectedSourceId(filteredSources[0].id);
    }
  }, [filteredSources, selectedSourceId]);

  const selectedSource = sources.find(source => source.id === selectedSourceId) || filteredSources[0] || null;
  const selectedClaims = useMemo(() => {
    if (!selectedSource) return [];
    return claims
      .filter(claim => claim.source_id === selectedSource.id)
      .sort((left, right) => (right.priority_score || 0) - (left.priority_score || 0) || left.claim_type.localeCompare(right.claim_type));
  }, [claims, selectedSource]);

  const kinds = useMemo(
    () => ['all', ...Array.from(new Set(sources.map(source => source.source_kind))).sort()],
    [sources],
  );

  return (
    <div className="page-shell page-shell--fullbleed corpus-page">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Initiatory corpus</p>
          <h1>Key Texts and Symbol Claims</h1>
          <p className="page-intro">
            Browse the ranked source catalog for Crowley&apos;s number, grade, and correspondence claims. The left
            side surfaces the most important works and companion texts; the right side shows the structured claims
            extracted from each source.
          </p>
          <div className="corpus-filters">
            <label className="stacked-field">
              <span>Search sources</span>
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search title, focus, claim type, or symbol"
              />
            </label>
            <label className="stacked-field">
              <span>Source kind</span>
              <select value={kind} onChange={event => setKind(event.target.value)}>
                {kinds.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All kinds' : option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="page-stat">
          <span>Sources / claims</span>
          <strong>
            {filteredSources.length} / {claims.length}
          </strong>
        </div>
      </section>

      <div className="corpus-layout">
        <aside className="glass-panel corpus-layout__sidebar">
          <div className="corpus-sidebar__head">
            <h2>Catalog</h2>
            <span>{filteredSources.length} sources</span>
          </div>
          <div className="corpus-source-list">
            {filteredSources.map(source => (
              <button
                key={source.id}
                type="button"
                className={`glass-panel corpus-source-card ${selectedSourceId === source.id ? 'corpus-source-card--active' : ''}`}
                onClick={() => setSelectedSourceId(source.id)}
                data-portal-track-hover="true"
                data-portal-track-click="true"
                data-portal-track-label={source.title}
                data-portal-track-detail={source.why_key || source.focus}
                data-portal-track-source="Corpus"
                data-portal-track-domain="corpus"
              >
                <div className="corpus-source-card__head">
                  <div>
                    <p className="corpus-source-card__kind">{source.source_kind}</p>
                    <h3>{source.title}</h3>
                  </div>
                  <span className="corpus-source-card__score">{source.priority_score}</span>
                </div>
                <p className="corpus-source-card__meta">
                  {source.author ? source.author : 'Derived record'} {source.evidence_lane ? `• Lane ${source.evidence_lane}` : ''}
                </p>
                <p className="corpus-source-card__focus">{source.focus}</p>
                <div className="topic-chip-row">
                  {toSearchString(source.search_terms)
                    .split(/[,|]/)
                    .map(term => term.trim())
                    .filter(Boolean)
                    .slice(0, 4)
                    .map(term => (
                      <span key={term} className="topic-chip">
                        {term}
                      </span>
                    ))}
                </div>
                <p className="corpus-source-card__claims">{claimCounts[source.id] || 0} claims</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="glass-panel corpus-layout__detail">
          {selectedSource ? (
            <>
              <div className="corpus-detail__head">
                <div>
                  <p className="page-kicker">Selected source</p>
                  <h2>{selectedSource.title}</h2>
                  <p className="corpus-detail__author">
                    {selectedSource.author || 'Derived record'} • {selectedSource.source_kind}
                  </p>
                </div>
                <div className="page-stat">
                  <span>Claim count</span>
                  <strong>{selectedClaims.length}</strong>
                </div>
              </div>

              <div className="corpus-detail__notes">
                <article className="glass-panel corpus-note">
                  <h3>Why this text matters</h3>
                  <p>{selectedSource.why_key || selectedSource.focus || 'No note available.'}</p>
                </article>
                <article className="glass-panel corpus-note">
                  <h3>Reading focus</h3>
                  <p>{selectedSource.focus || 'No focus statement available.'}</p>
                </article>
                <article className="glass-panel corpus-note">
                  <h3>Source metadata</h3>
                  <p>
                    {selectedSource.evidence_lane ? `Lane ${selectedSource.evidence_lane}. ` : ''}
                    {selectedSource.file_path ? `File: ${selectedSource.file_path}. ` : ''}
                    {selectedSource.notes || 'No extra notes available.'}
                  </p>
                </article>
              </div>

              <div className="corpus-claims">
                {selectedClaims.map(claim => (
                  <article
                    key={claim.id || `${claim.source_id}-${claim.claim_type}-${claim.symbol}`}
                    className="glass-panel corpus-claim"
                    data-portal-track-hover="true"
                    data-portal-track-click="true"
                    data-portal-track-label={claim.symbol}
                    data-portal-track-detail={claim.claim_text}
                    data-portal-track-source="Corpus Claims"
                    data-portal-track-domain="corpus"
                  >
                    <div className="corpus-claim__head">
                      <span className="topic-chip">{claim.claim_type}</span>
                      <strong>{claim.symbol}</strong>
                    </div>
                    <p>{claim.claim_text}</p>
                    <div className="corpus-claim__meta">
                      <span>{claim.evidence_locator}</span>
                      {claim.related_symbol ? <span>Related: {claim.related_symbol}</span> : null}
                      {claim.symbol_value ? <span>Value: {claim.symbol_value}</span> : null}
                      {claim.confidence ? <span>Confidence: {claim.confidence.toFixed(2)}</span> : null}
                    </div>
                    {claim.evidence_excerpt ? <p className="corpus-claim__excerpt">{claim.evidence_excerpt}</p> : null}
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p>No source selected.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Corpus;
