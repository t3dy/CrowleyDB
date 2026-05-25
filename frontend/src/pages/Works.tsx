import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../api';
import { useLane } from '../App';
import EmptyResults from '../components/EmptyResults';
import ResearchToolbar from '../components/ResearchToolbar';
import TopicShelf from '../components/TopicShelf';
import { TOPIC_GROUPS } from '../topicGroups';

type WorkEntry = {
  id: string;
  document_id: string | null;
  title: string;
  liber_number: number | null;
  class: string | null;
  date_composed: string | null;
  location_composed: string | null;
  summary: string | null;
};

type SourceDocument = {
  id: string;
  evidentiary_lane: string;
};

const Works = () => {
  const [works, setWorks] = useState<WorkEntry[]>([]);
  const [docs, setDocs] = useState<SourceDocument[]>([]);
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [sortMode, setSortMode] = useState('liber');
  const { currentLane } = useLane();

  useEffect(() => {
    fetchJSON('works').then(setWorks);
    fetchJSON('documents').then(setDocs);
  }, []);

  const laneByDocumentId = useMemo(() => Object.fromEntries(docs.map(doc => [doc.id, doc.evidentiary_lane])), [docs]);

  const laneByWorkId = useMemo(
    () => Object.fromEntries(works.map(work => [work.id, work.document_id ? laneByDocumentId[work.document_id] || 'Unknown' : 'Unknown'])),
    [works, laneByDocumentId],
  );

  const classes = useMemo(
    () => ['All', ...Array.from(new Set(works.flatMap(work => (work.class ? [work.class] : [])))).sort()],
    [works],
  );

  const filteredWorks = useMemo(() => {
    const search = query.trim().toLowerCase();
    return [...works]
      .filter(work => {
        const lane = laneByWorkId[work.id] || 'Unknown';
        if (currentLane !== 'All' && lane !== currentLane) return false;
        if (classFilter !== 'All' && work.class !== classFilter) return false;
        if (!search) return true;
        return [
          work.title,
          String(work.liber_number ?? ''),
          work.class || '',
          lane,
          work.date_composed || '',
          work.location_composed || '',
          work.summary || '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(search);
      })
      .sort((a, b) => {
        if (sortMode === 'title') return a.title.localeCompare(b.title);
        if (sortMode === 'date') return String(a.date_composed || '9999').localeCompare(String(b.date_composed || '9999')) || a.title.localeCompare(b.title);
        if (sortMode === 'class') return String(a.class || '').localeCompare(String(b.class || '')) || a.title.localeCompare(b.title);
        if (sortMode === 'lane') return (laneByWorkId[a.id] || 'Unknown').localeCompare(laneByWorkId[b.id] || 'Unknown') || a.title.localeCompare(b.title);
        const left = a.liber_number ?? Number.POSITIVE_INFINITY;
        const right = b.liber_number ?? Number.POSITIVE_INFINITY;
        return left - right || a.title.localeCompare(b.title);
      });
  }, [works, query, currentLane, classFilter, sortMode, laneByWorkId]);

  return (
    <div className="page-shell">
      <div className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Works</p>
          <h1>The Libri &amp; Major Works</h1>
          <p className="page-intro">
            These summaries are written as portal copy: concise, factual, and explicit about what each work does
            inside Crowley&apos;s system.
          </p>
        </div>
        <div className="page-stat">
          <span>Works shown</span>
          <strong>{filteredWorks.length}</strong>
        </div>
      </div>

      <ResearchToolbar
        query={query}
        onQueryChange={setQuery}
        searchLabel="Search works"
        searchPlaceholder="Title, liber number, class, lane, place, or summary"
        countLabel="Works"
        count={filteredWorks.length}
        filters={[
          {
            id: 'class',
            label: 'Class',
            value: classFilter,
            options: classes.map(value => ({ value, label: value === 'All' ? 'All classes' : `Class ${value}` })),
            onChange: setClassFilter,
          },
        ]}
        sort={{
          label: 'Sort',
          value: sortMode,
          options: [
            { value: 'liber', label: 'Liber number' },
            { value: 'title', label: 'Title' },
            { value: 'date', label: 'Composition date' },
            { value: 'class', label: 'Class' },
            { value: 'lane', label: 'Evidence lane' },
          ],
          onChange: setSortMode,
        }}
        onReset={() => {
          setQuery('');
          setClassFilter('All');
          setSortMode('liber');
        }}
      />

      {filteredWorks.length === 0 ? (
        <EmptyResults message="Try clearing the class filter, changing the evidence lane, or searching for a broader title, place, or Liber number." />
      ) : (
        <div className="page-grid page-grid--cards">
          {filteredWorks.map((work, idx) => (
            <Link
              key={work.id || idx}
              to={`/works/${work.id}`}
              className="entry-card-link"
              data-portal-track-hover="true"
              data-portal-track-click="true"
              data-portal-track-label={work.title}
              data-portal-track-detail={work.summary || ''}
              data-portal-track-source="Works"
              data-portal-track-domain="works"
              data-portal-tree-number={work.liber_number ? String(work.liber_number) : undefined}
              data-portal-tree-kind={work.liber_number ? (work.liber_number <= 10 ? 'sephirah' : 'signature') : undefined}
            >
              <article className="glass-panel term-card">
                <div className="timeline-card__meta">
                  <div>
                    <h3>{work.title}</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      {work.liber_number ? `Liber ${work.liber_number}` : 'No liber number'}
                    </p>
                  </div>
                  <span className={`lane-pill lane-pill--${(laneByWorkId[work.id] || 'Unknown').toLowerCase()}`}>
                    Lane {laneByWorkId[work.id] || 'Unknown'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Class {work.class || 'Unclassed'}</span>
                  <span>{work.date_composed || 'Date unknown'}</span>
                  <span>{work.location_composed || 'Place unknown'}</span>
                </div>

                <p>{work.summary}</p>
              </article>
            </Link>
          ))}
        </div>
      )}

      <TopicShelf
        title="Key work topics"
        intro="These topic cards capture the editorial frame for the library: publication, instruction, commentary, revision, and the forms of writing Crowley used to build the system."
        slugs={TOPIC_GROUPS.works}
      />
    </div>
  );
};

export default Works;
