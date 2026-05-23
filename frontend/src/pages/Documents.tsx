import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../api';

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
        const leftYear = left.publication_year ?? Number.POSITIVE_INFINITY;
        const rightYear = right.publication_year ?? Number.POSITIVE_INFINITY;
        return leftYear - rightYear || left.title.localeCompare(right.title);
      });
  }, [documents, query]);

  return (
    <div className="page-shell">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Texts &amp; Commentaries</p>
          <h1>Source Documents</h1>
          <p className="page-intro">
            These are the companion texts, commentaries, and documentary sources that the archive uses to keep Crowley&apos;s writings in context.
          </p>
          <label className="stacked-field" style={{ marginTop: '1rem' }}>
            <span>Search documents</span>
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search title, author, lane, or description"
            />
          </label>
        </div>
        <div className="page-stat">
          <span>Documents shown</span>
          <strong>{filteredDocuments.length}</strong>
        </div>
      </section>

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
    </div>
  );
};

export default DocumentsPage;
