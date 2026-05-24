import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchJSON } from '../api';
import QuoteCallout from '../components/QuoteCallout';
import { getPersonQuote } from '../crowleyQuotes';

type Person = {
  id: string;
  name: string;
  magical_motto: string | null;
  role_category: string | null;
  birth_year: number | null;
  death_year: number | null;
  biography: string | null;
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
  location_id: string | null;
  evidentiary_lane: string;
  document_id: string | null;
};

type Document = {
  id: string;
  title: string;
  description: string;
  publication_year: number | null;
};

type Work = {
  id: string;
  title: string;
  summary: string | null;
  document_id: string | null;
  liber_number: number | null;
};

type Topic = {
  id: string;
  label: string;
};

type EventTopic = {
  event_id: string;
  topic_id: string;
};

const PersonPage = () => {
  const { id } = useParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [links, setLinks] = useState<PersonEvent[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [eventTopics, setEventTopics] = useState<EventTopic[]>([]);

  useEffect(() => {
    Promise.all([
      fetchJSON('persons'),
      fetchJSON('events'),
      fetchJSON('person_events'),
      fetchJSON('documents'),
      fetchJSON('works'),
      fetchJSON('topics'),
      fetchJSON('event_topics'),
    ]).then(([personData, eventData, linkData, documentData, workData, topicData, eventTopicData]) => {
      setPeople(personData);
      setEvents(eventData);
      setLinks(linkData);
      setDocuments(documentData);
      setWorks(workData);
      setTopics(topicData);
      setEventTopics(eventTopicData);
    });
  }, []);

  const person = useMemo(() => people.find(entry => entry.id === id), [people, id]);

  const relatedEvents = useMemo(() => {
    if (!person) return [];
    const eventIds = new Set(links.filter(link => link.person_id === person.id).map(link => link.event_id));
    return events
      .filter(event => eventIds.has(event.id))
      .sort((left, right) => left.date_start.localeCompare(right.date_start));
  }, [person, links, events]);

  const topicById = useMemo(() => Object.fromEntries(topics.map(topic => [topic.id, topic])), [topics]);
  const topicsByEventId = useMemo(
    () =>
      eventTopics.reduce<Record<string, string[]>>((acc, link) => {
        const topic = topicById[link.topic_id];
        if (!topic) return acc;
        acc[link.event_id] = acc[link.event_id] || [];
        acc[link.event_id].push(topic.label);
        return acc;
      }, {}),
    [eventTopics, topicById],
  );

  const relatedWorks = useMemo(() => {
    const documentIds = new Set(
      relatedEvents
        .map(event => event.document_id)
        .filter((value): value is string => Boolean(value)),
    );
    const relatedDocumentTitles = documents
      .filter(document => documentIds.has(document.id))
      .map(document => document.title);
    const workTitles = works
      .filter(work => work.document_id && documentIds.has(work.document_id))
      .map(work => work.title);
    return Array.from(new Set([...relatedDocumentTitles, ...workTitles]));
  }, [relatedEvents, documents, works]);

  const topicCounts = useMemo(() => {
    return relatedEvents.reduce<Record<string, number>>((acc, event) => {
      for (const topic of topicsByEventId[event.id] || []) {
        acc[topic] = (acc[topic] || 0) + 1;
      }
      return acc;
    }, {});
  }, [relatedEvents, topicsByEventId]);

  if (!person) {
    return (
      <div className="page-shell">
        <section className="glass-panel page-hero">
          <div>
            <p className="page-kicker">People encyclopedia</p>
            <h1>{id ? 'Person not found' : 'Loading person entry'}</h1>
            <p className="page-intro">
              {id
                ? 'That person id is not in the encyclopedia yet. Try another card from the people index.'
                : 'The people data is still loading.'}
            </p>
          </div>
          {id && (
            <div className="page-stat">
              <span>Person</span>
              <strong>{id}</strong>
            </div>
          )}
        </section>
        {id && (
          <section className="glass-panel">
            <Link to="/people" className="tree-chip is-active">
              Back to people
            </Link>
          </section>
        )}
      </div>
    );
  }

  const yearRange =
    person.birth_year || person.death_year
      ? `${person.birth_year || 'Unknown'} - ${person.death_year || 'Present'}`
      : 'Dates unknown';
  const topTopics = Object.entries(topicCounts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 4)
    .map(([label]) => label);

  const personQuote = useMemo(() => getPersonQuote(person, relatedWorks), [person, relatedWorks]);

  const entryParagraphs = [
    person.biography || `${person.name} remains one of the archive's indexed figures.`,
    `The portal keeps ${person.name} in the ${person.role_category || 'uncategorized'} lane so the biography stays linked to the surrounding archive rather than isolated as a single name.`,
    relatedEvents.length
      ? `The documentary trail includes ${relatedEvents.length} linked events, with the clearest sequence running from ${relatedEvents[0].date_start} to ${relatedEvents[relatedEvents.length - 1].date_start}.`
      : `No linked events have been attached yet, so the page leans on the biography and motto as the primary interpretive surfaces.`,
    topTopics.length
      ? `The recurring topics around the linked events are ${topTopics.join(', ')}, which is usually the quickest way to see where this figure matters in Crowley's orbit.`
      : `No topic clustering has been attached yet, so the page keeps the role category and the linked event record in view instead.`,
    relatedWorks.length
      ? `The same event chain points back to works and documents such as ${relatedWorks.slice(0, 4).join(', ')}, which turns the biography into a reading route through the library as well as the chronology.`
      : `The page still has room to grow into a wider publication trail, but the biography itself remains a stable index card for the person.`
  ];

  return (
    <div className="page-shell entry-page">
      <section className="glass-panel page-hero entry-page__hero">
        <div>
          <p className="page-kicker">People encyclopedia</p>
          <h1>{person.name}</h1>
          <p className="page-intro">
            {person.magical_motto && person.magical_motto !== 'Unknown' ? person.magical_motto : person.role_category || 'Major Associate'}
          </p>
        </div>
        <div className="page-stat">
          <span>Life</span>
          <strong>{yearRange}</strong>
        </div>
      </section>

      <QuoteCallout quote={personQuote} />

      <section className="glass-panel entry-page__entry">
        {entryParagraphs.map((paragraph, index) => (
          <p key={`${person.id}-${index}`}>{paragraph}</p>
        ))}
      </section>

      <section className="entry-page__related">
        <div className="entry-page__rail">
          <div className="glass-panel">
            <h2>Linked events</h2>
            <p className="page-intro">
              These events are the clearest documentary scenes attached to this person, and they are the fastest route from biography into the archive.
            </p>
          </div>

          <div className="page-grid page-grid--cards">
            {relatedEvents.slice(0, 6).map(event => (
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
          <h2>Archive context</h2>
          <div className="entry-page__mini">
            <span>Motto</span>
            <p>{person.magical_motto || 'Unknown'}</p>
          </div>
          <div className="entry-page__mini">
            <span>Role</span>
            <p>{person.role_category || 'Uncategorized'}</p>
          </div>
          <div className="entry-page__mini">
            <span>Linked works and texts</span>
            <p>{relatedWorks.length ? relatedWorks.join(', ') : 'No related works have been indexed yet.'}</p>
          </div>
          <div className="entry-page__mini">
            <span>Related topics</span>
            <p>{topTopics.length ? topTopics.join(', ') : 'No topic cluster has been attached yet.'}</p>
          </div>
          <div className="entry-page__mini">
            <span>Biography note</span>
            <p>
              The biography text on the index card stays short by design, but the full page expands that card into the events,
              works, and topics that make the person legible in the portal.
            </p>
          </div>
          <div className="entry-page__backlink">
            <Link to="/people" className="tree-chip is-active">
              Back to people
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default PersonPage;
