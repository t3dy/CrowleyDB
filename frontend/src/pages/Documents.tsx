import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../api';
import EmptyResults from '../components/EmptyResults';
import ResearchToolbar from '../components/ResearchToolbar';

type Document = {
  id: string;
  title: string;
  author: string | null;
  publication_year: number | null;
  evidentiary_lane: string;
  file_path: string | null;
  description: string | null;
};

type Work = {
  id: string;
  title: string;
  document_id: string | null;
  liber_number: number | null;
};

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [query, setQuery] = useState('');
  const [laneFilter, setLaneFilter] = useState('All');
  const [authorFilter, setAuthorFilter] = useState('All');
  const [sortMode, setSortMode] = useState('year');

  useEffect(() => {
    Promise.all([fetchJSON('documents'), fetchJSON('works')]).then(([documentData, workData]) => {
      setDocuments(documentData);
      setWorks(workData);
    });
  }, []);

  const relatedWorkCounts = useMemo(() => {
    return works.reduce<Record<string, number>>((acc, work) => {
      if (!work.document_id) return acc;
      acc[work.document_id] = (acc[work.document_id] || 0) + 1;
      return acc;
    }, {});
  }, [works]);

  const filteredDocuments = useMemo(() => {
    const search = query.trim().toLowerCase();
    return [...documents]
      .filter(document => {
        if (laneFilter !== 'All' && document.evidentiary_lane !== laneFilter) return false;
        if (authorFilter !== 'All' && (document.author || 'Unknown author') !== authorFilter) return false;
        if (!search) return true;
        return [
          document.title,
          document.author || '',
          String(document.publication_year || ''),
          document.description || '',
          document.evidentiary_lane || '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(search);
      })
      .sort((left, right) => {
        if (sortMode === 'title') return left.title.localeCompare(right.title);
        if (sortMode === 'lane') return left.evidentiary_lane.localeCompare(right.evidentiary_lane) || left.title.localeCompare(right.title);
        if (sortMode === 'linked') return (relatedWorkCounts[right.id] || 0) - (relatedWorkCounts[left.id] || 0) || left.title.localeCompare(right.title);
        const leftYear = left.publication_year ?? Number.POSITIVE_INFINITY;
        const rightYear = right.publication_year ?? Number.POSITIVE_INFINITY;
        return leftYear - rightYear || left.title.localeCompare(right.title);
      });
  }, [documents, query, laneFilter, authorFilter, sortMode, relatedWorkCounts]);

  const authors = useMemo(
    () => ['All', ...Array.from(new Set(documents.map(document => document.author || 'Unknown author'))).sort()],
    [documents],
  );

  return (
    <div className="page-shell">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Texts &amp; Commentaries</p>
          <h1>Source Documents</h1>
          <p className="page-intro">
            These are the companion texts, commentaries, and documentary sources that the archive uses to keep Crowley&apos;s writings in context.
          </p>
        </div>
        <div className="page-stat">
          <span>Documents shown</span>
          <strong>{filteredDocuments.length}</strong>
        </div>
      </section>

      <ResearchToolbar
        query={query}
        onQueryChange={setQuery}
        searchLabel="Search texts"
        searchPlaceholder="Title, author, lane, year, or description"
        countLabel="Texts"
        count={filteredDocuments.length}
        filters={[
          {
            id: 'lane',
            label: 'Lane',
            value: laneFilter,
            options: ['All', 'A', 'B', 'C', 'D', 'E'].map(value => ({ value, label: value === 'All' ? 'All lanes' : `Lane ${value}` })),
            onChange: setLaneFilter,
          },
          {
            id: 'author',
            label: 'Author',
            value: authorFilter,
            options: authors.map(value => ({ value, label: value === 'All' ? 'All authors' : value })),
            onChange: setAuthorFilter,
          },
        ]}
        sort={{
          label: 'Sort',
          value: sortMode,
          options: [
            { value: 'year', label: 'Publication year' },
            { value: 'title', label: 'Title' },
            { value: 'lane', label: 'Evidence lane' },
            { value: 'linked', label: 'Linked works' },
          ],
          onChange: setSortMode,
        }}
        onReset={() => {
          setQuery('');
          setLaneFilter('All');
          setAuthorFilter('All');
          setSortMode('year');
        }}
      />

      {filteredDocuments.length === 0 ? (
        <EmptyResults message="Try another author, clear the evidence-lane filter, or search for a broader title, year, or source description." />
      ) : (
        <div className="page-grid page-grid--cards">
          {filteredDocuments.map(document => (
            <Link
              key={document.id}
              to={`/documents/${document.id}`}
              className="entry-card-link"
              data-portal-track-hover="true"
              data-portal-track-click="true"
              data-portal-track-label={document.title}
              data-portal-track-detail={document.description || ''}
              data-portal-track-source="Documents"
              data-portal-track-domain="documents"
            >
              <article className="glass-panel term-card">
                <div className="timeline-card__meta">
                  <div>
                    <h3>{document.title}</h3>
                    <p className="term-card__etymology">{document.author || 'Unknown author'}</p>
                  </div>
                  <span className={`lane-pill lane-pill--${document.evidentiary_lane.toLowerCase()}`}>
                    Lane {document.evidentiary_lane}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>{document.publication_year || 'Date unknown'}</span>
                  <span>{relatedWorkCounts[document.id] || 0} linked works</span>
                </div>

                <p>{document.description}</p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
