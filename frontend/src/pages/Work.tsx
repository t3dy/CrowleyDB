import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchJSON } from '../api';
import QuoteCallout from '../components/QuoteCallout';
import { getWorkQuote } from '../crowleyQuotes';

type Work = {
  id: string;
  liber_number: number | null;
  title: string;
  class: string;
  date_composed: string;
  location_composed: string | null;
  summary: string | null;
  document_id: string | null;
};

type Document = {
  id: string;
  title: string;
  author: string | null;
  publication_year: number | null;
  description: string | null;
};

type Term = {
  id: string;
  term: string;
  thelemic_significance: string | null;
};

type TermWork = {
  term_id: string;
  work_id: string;
};

type Person = {
  id: string;
  name: string;
};

type PersonEvent = {
  person_id: string;
  event_id: string;
};

type Event = {
  id: string;
  date_start: string;
  date_end: string | null;
  title: string;
  description: string;
  document_id: string | null;
};

type Claim = {
  source_id: string;
  claim_type: string;
  symbol: string;
  claim_text: string;
  priority_score: number;
};

const WorkPage = () => {
  const { id } = useParams();
  const [works, setWorks] = useState<Work[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [termWorks, setTermWorks] = useState<TermWork[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [personEvents, setPersonEvents] = useState<PersonEvent[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    Promise.all([
      fetchJSON('works'),
      fetchJSON('documents'),
      fetchJSON('terms'),
      fetchJSON('term_works'),
      fetchJSON('persons'),
      fetchJSON('person_events'),
      fetchJSON('events'),
      fetchJSON('symbol_claims'),
    ]).then(([workData, documentData, termData, termWorkData, personData, personEventData, eventData, claimData]) => {
      setWorks(workData);
      setDocuments(documentData);
      setTerms(termData);
      setTermWorks(termWorkData);
      setPeople(personData);
      setPersonEvents(personEventData);
      setEvents(eventData);
      setClaims(claimData);
    });
  }, []);

  const work = useMemo(() => works.find(entry => entry.id === id), [works, id]);

  const document = useMemo(() => {
    if (!work?.document_id) return undefined;
    return documents.find(entry => entry.id === work.document_id);
  }, [documents, work]);

  const relatedTerms = useMemo(() => {
    if (!work) return [];
    const termIds = new Set(termWorks.filter(link => link.work_id === work.id).map(link => link.term_id));
    return terms.filter(term => termIds.has(term.id));
  }, [work, termWorks, terms]);

  const relatedEvents = useMemo(() => {
    if (!document) return [];
    return events.filter(event => event.document_id === document.id).sort((left, right) => left.date_start.localeCompare(right.date_start));
  }, [document, events]);

  const relatedPeople = useMemo(() => {
    if (!relatedEvents.length) return [];
    const personIds = new Set(
      personEvents
        .filter(link => relatedEvents.some(event => event.id === link.event_id))
        .map(link => link.person_id),
    );
    return people.filter(person => personIds.has(person.id));
  }, [relatedEvents, personEvents, people]);

  const workClaims = useMemo(() => {
    if (!work) return [];
    return claims
      .filter(claim => claim.source_id === `SRC_WORK_${work.id}`)
      .sort((left, right) => right.priority_score - left.priority_score)
      .slice(0, 8);
  }, [claims, work]);

  const workQuote = useMemo(() => getWorkQuote(work), [work]);

  if (!work) {
    return (
      <div className="page-shell">
        <section className="glass-panel page-hero">
          <div>
            <p className="page-kicker">Works encyclopedia</p>
            <h1>{id ? 'Work not found' : 'Loading work entry'}</h1>
            <p className="page-intro">
              {id
                ? 'That work id is not in the encyclopedia yet. Try another card from the works index.'
                : 'The work data is still loading.'}
            </p>
          </div>
          {id && (
            <div className="page-stat">
              <span>Work</span>
              <strong>{id}</strong>
            </div>
          )}
        </section>
        {id && (
          <section className="glass-panel">
            <Link to="/works" className="tree-chip is-active">
              Back to works
            </Link>
          </section>
        )}
      </div>
    );
  }

  const mainParagraphs = [
    work.summary || `${work.title} remains one of the archive's primary texts.`,
    document
      ? `The source companion is ${document.title}${document.publication_year ? ` (${document.publication_year})` : ''}, and its description keeps the documentary lane explicit: ${document.description || 'no description available yet'}.`
      : `No companion document has been linked yet, so the page reads directly from the work record and its symbolic claims.`,
    relatedTerms.length
      ? `The linked terms include ${relatedTerms.slice(0, 6).map(term => term.term).join(', ')}, which shows how the text participates in the wider vocabulary of the archive.`
      : `No direct term links have been attached yet, so the page leans on the work summary and corpus claims as the main interpretive map.`,
    relatedPeople.length
      ? `The same documentary trail reaches people such as ${relatedPeople.slice(0, 5).map(person => person.name).join(', ')}, which helps the work stay connected to the people and scenes around it.`
      : `No person links have been attached through the current event trail, but the work still stands as a key text in the archive.`,
    workClaims.length
      ? `The corpus treats this text through claims about ${workClaims.slice(0, 4).map(claim => claim.claim_type.replace(/_/g, ' ')).join(', ')}, so the title and the number logic can be read as part of the work itself.`
      : `The corpus has not yet extracted claim lines for this text, but the work summary still acts as the site's primary prose entry.`
  ];

  return (
    <div className="page-shell entry-page">
      <section className="glass-panel page-hero entry-page__hero">
        <div>
          <p className="page-kicker">Works encyclopedia</p>
          <h1>{work.title}</h1>
          <p className="page-intro">
            {work.liber_number ? `Liber ${work.liber_number}` : 'Unnumbered text'} {document?.author ? `· ${document.author}` : ''}
          </p>
        </div>
        <div className="page-stat">
          <span>Class</span>
          <strong>{work.class}</strong>
        </div>
      </section>

      <QuoteCallout quote={workQuote} />

      <section className="glass-panel entry-page__entry">
        {mainParagraphs.map((paragraph, index) => (
          <p key={`${work.id}-${index}`}>{paragraph}</p>
        ))}
      </section>

      <section className="entry-page__related">
        <div className="entry-page__rail">
          <div className="glass-panel">
            <h2>Corpus notes</h2>
            <p className="page-intro">
              These notes collect the title symbolism, number logic, and symbolic role claims that the corpus now uses to read this text.
            </p>
          </div>

          <div className="page-grid page-grid--cards">
            {workClaims.map(claim => (
              <article key={`${claim.source_id}-${claim.claim_type}-${claim.symbol}`} className="glass-panel entry-related-card">
                <h3>{claim.claim_type.replace(/_/g, ' ')}</h3>
                <p className="entry-related-card__meta">{claim.symbol}</p>
                <p>{claim.claim_text}</p>
              </article>
            ))}
          </div>

          <div className="page-grid page-grid--cards">
            {relatedEvents.slice(0, 4).map(event => (
              <article key={event.id} className="glass-panel entry-related-card">
                <h3>{event.title}</h3>
                <p className="entry-related-card__meta">
                  {event.date_start}
                  {event.date_end ? ` - ${event.date_end}` : ''}
                </p>
                <p>{event.description}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="glass-panel entry-page__sidebar">
          <h2>Text context</h2>
          <div className="entry-page__mini">
            <span>Document lane</span>
            <p>{document ? `${document.title}${document.publication_year ? `, ${document.publication_year}` : ''}` : 'No companion document yet'}</p>
          </div>
          <div className="entry-page__mini">
            <span>Related terms</span>
            <p>{relatedTerms.length ? relatedTerms.slice(0, 6).map(term => term.term).join(', ') : 'No related terms yet'}</p>
          </div>
          <div className="entry-page__mini">
            <span>Related people</span>
            <p>{relatedPeople.length ? relatedPeople.slice(0, 5).map(person => person.name).join(', ') : 'No linked people yet'}</p>
          </div>
          <div className="entry-page__mini">
            <span>Corpus claim count</span>
            <p>{workClaims.length} extracted notes are attached to this work record.</p>
          </div>
          <div className="entry-page__mini">
            <span>Back to list</span>
            <p>
              The work index cards live in <Link to="/works">Works</Link>, where the browse view stays compact and the full page carries the extra prose.
            </p>
          </div>
          <div className="entry-page__backlink">
            <Link to="/works" className="tree-chip is-active">
              Back to works
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default WorkPage;
