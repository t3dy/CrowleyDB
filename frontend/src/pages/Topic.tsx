import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchJSON } from '../api';
import { buildTopicArticleParagraphs, buildTopicSummary, summaryText } from '../topicContent';

type Topic = {
  id: string;
  slug: string;
  label: string;
  description: string;
  sort_order?: number;
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

type EventTopic = {
  event_id: string;
  topic_id: string;
};

type Location = {
  id: string;
  name: string;
  significance: string;
};

const TopicPage = () => {
  const { slug } = useParams();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTopics, setEventTopics] = useState<EventTopic[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetchJSON('topics').then(setTopics);
    fetchJSON('events').then(setEvents);
    fetchJSON('event_topics').then(setEventTopics);
    fetchJSON('locations').then(setLocations);
  }, []);

  const topic = useMemo(() => topics.find(entry => entry.slug === slug), [topics, slug]);
  const summary = useMemo(() => {
    if (!topic) return null;
    return buildTopicSummary(topic, events, eventTopics, locations);
  }, [topic, events, eventTopics, locations]);

  if (!topic || !summary) {
    return (
      <div className="page-shell">
        <section className="glass-panel page-hero">
          <div>
            <p className="page-kicker">Topic encyclopedia</p>
            <h1>{slug ? 'Topic not found' : 'Loading topic entry'}</h1>
            <p className="page-intro">
              {slug
                ? 'That topic slug is not in the encyclopedia yet. Try another entry from the index cards.'
                : 'The topic data is still loading.'}
            </p>
          </div>
          {slug && (
            <div className="page-stat">
              <span>Topic</span>
              <strong>{slug}</strong>
            </div>
          )}
        </section>
        {slug && (
          <section className="glass-panel">
            <Link to="/" className="tree-chip is-active">
              Back to portal
            </Link>
          </section>
        )}
      </div>
    );
  }

  const paragraphs = buildTopicArticleParagraphs(topic, summary);

  return (
    <div className="page-shell topic-page">
      <section className="glass-panel page-hero topic-page__hero">
        <div>
          <p className="page-kicker">Topic encyclopedia</p>
          <h1>{topic.label}</h1>
          <p className="page-intro">{topic.description}</p>
        </div>
        <div className="page-stat">
          <span>Linked events</span>
          <strong>{summary.eventCount}</strong>
        </div>
      </section>

      <section className="glass-panel topic-page__entry">
        {paragraphs.map((paragraph, index) => (
          <p key={`${topic.slug}-${index}`}>{paragraph}</p>
        ))}
      </section>

      <section className="topic-page__related">
        <div className="topic-page__rail">
          <div className="glass-panel">
            <h2>Related events</h2>
            <p className="page-intro">These records are the most direct places to continue reading the topic across the archive.</p>
          </div>
          <div className="page-grid page-grid--cards">
            {summary.events.slice(0, 6).map(event => (
              <article key={event.id} className="glass-panel topic-related-card">
                <h3>{event.title}</h3>
                <p className="topic-related-card__meta">
                  {event.date_start}
                  {event.date_end ? ` - ${event.date_end}` : ''}
                </p>
                <p>{summaryText(event.description)}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="glass-panel topic-page__sidebar">
          <h2>Where the topic points</h2>
          <div className="topic-page__mini">
            <span>People</span>
            <p>{summary.people.length ? summary.people.slice(0, 4).join(', ') : 'No related people have been indexed yet.'}</p>
          </div>
          <div className="topic-page__mini">
            <span>Works</span>
            <p>{summary.works.length ? summary.works.slice(0, 4).join(', ') : 'No related works have been indexed yet.'}</p>
          </div>
          <div className="topic-page__mini">
            <span>Places</span>
            <p>{summary.locations.length ? summary.locations.slice(0, 4).join(', ') : 'No related places have been indexed yet.'}</p>
          </div>
          <div className="topic-page__backlink">
            <Link to="/" className="tree-chip is-active">Back to portal</Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default TopicPage;
