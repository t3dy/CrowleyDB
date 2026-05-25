import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchJSON } from '../api';
import QuoteCallout from '../components/QuoteCallout';
import { getDocumentQuote } from '../crowleyQuotes';

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
  liber_number: number | null;
  document_id: string | null;
  summary: string | null;
};

const DocumentPage = () => {
  const { id } = useParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [works, setWorks] = useState<Work[]>([]);

  useEffect(() => {
    Promise.all([fetchJSON('documents'), fetchJSON('works')]).then(([documentData, workData]) => {
      setDocuments(documentData);
      setWorks(workData);
    });
  }, []);

  const document = useMemo(() => documents.find(entry => entry.id === id), [documents, id]);

  const relatedWorks = useMemo(() => {
    if (!document) return [];
    return works
      .filter(work => work.document_id === document.id)
      .sort((left, right) => (left.liber_number ?? Number.POSITIVE_INFINITY) - (right.liber_number ?? Number.POSITIVE_INFINITY));
  }, [document, works]);

  const documentQuote = useMemo(
    () => getDocumentQuote(document, relatedWorks.map(work => work.title)),
    [document, relatedWorks],
  );

  if (!document) {
    return (
      <div className="page-shell">
        <section className="glass-panel page-hero">
          <div>
            <p className="page-kicker">Texts &amp; Commentaries</p>
            <h1>{id ? 'Document not found' : 'Loading document entry'}</h1>
            <p className="page-intro">
              {id
                ? 'That document id is not in the encyclopedia yet. Try another card from the documents index.'
                : 'The document data is still loading.'}
            </p>
          </div>
          {id && (
            <div className="page-stat">
              <span>Document</span>
              <strong>{id}</strong>
            </div>
          )}
        </section>
        {id && (
          <section className="glass-panel">
            <Link to="/documents" className="tree-chip is-active">
              Back to documents
            </Link>
          </section>
        )}
      </div>
    );
  }

  const quoteContext = `The citation block below keeps ${document.title} in Crowley's own wording, which is the quickest way to preserve a document page as evidence rather than metadata.`;

  const paragraphs = [
    quoteContext,
    document.description || `${document.title} remains part of the archive's documentary shelf.`,
    `This source entry keeps the text visible as evidence, not merely as an attachment. That means the page records who authored it, when it appeared, and why the archive thinks it matters.`,
    relatedWorks.length
      ? `The document points back to works such as ${relatedWorks.slice(0, 4).map(work => work.title).join(', ')}, which makes it useful as a companion source as well as a standalone entry.`
      : `No authored work has been linked yet, so the page keeps the source description and publication data in the foreground.`,
    `The portal treats this document as a reading node that helps move between authorship, commentary, and archive structure, so even a short companion note can carry interpretive weight.`
  ];

  return (
    <div className="page-shell entry-page">
      <section className="glass-panel page-hero entry-page__hero">
        <div>
          <p className="page-kicker">Texts &amp; Commentaries</p>
          <h1>{document.title}</h1>
          <p className="page-intro">
            {document.author || 'Unknown author'} {document.publication_year ? `· ${document.publication_year}` : ''}
          </p>
        </div>
        <div className="page-stat">
          <span>Lane</span>
          <strong>{document.evidentiary_lane}</strong>
        </div>
      </section>

      <QuoteCallout quote={documentQuote} />

      <section className="glass-panel entry-page__entry">
        {paragraphs.map((paragraph, index) => (
          <p key={`${document.id}-${index}`}>{paragraph}</p>
        ))}
      </section>

      <section className="entry-page__related">
        <div className="entry-page__rail">
          <div className="glass-panel">
            <h2>Linked works</h2>
            <p className="page-intro">
              These authored works are the main places where this source text feeds into the archive&apos;s reading paths.
            </p>
          </div>

          <div className="page-grid page-grid--cards">
            {relatedWorks.map(work => (
              <article key={work.id} className="glass-panel entry-related-card">
                <h3>{work.title}</h3>
                <p className="entry-related-card__meta">
                  {work.liber_number ? `Liber ${work.liber_number}` : 'No liber number'}
                </p>
                <p>{work.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="glass-panel entry-page__sidebar">
          <h2>Source context</h2>
          <div className="entry-page__mini">
            <span>Author</span>
            <p>{document.author || 'Unknown author'}</p>
          </div>
          <div className="entry-page__mini">
            <span>Publication year</span>
            <p>{document.publication_year || 'Unknown'}</p>
          </div>
          <div className="entry-page__mini">
            <span>Linked works</span>
            <p>{relatedWorks.length ? relatedWorks.map(work => work.title).join(', ') : 'No linked works yet'}</p>
          </div>
          <div className="entry-page__mini">
            <span>Source lane</span>
            <p>The archive keeps this as a documentary companion rather than a primary doctrinal text.</p>
          </div>
          <div className="entry-page__backlink">
            <Link to="/documents" className="tree-chip is-active">
              Back to documents
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default DocumentPage;
