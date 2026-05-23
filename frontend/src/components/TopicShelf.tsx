import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../api';
import { buildTopicCardCopy, buildTopicSummary } from '../topicContent';

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

type TopicShelfProps = {
  title: string;
  intro: string;
  slugs: readonly string[];
};

const TopicShelf = ({ title, intro, slugs }: TopicShelfProps) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTopics, setEventTopics] = useState<EventTopic[]>([]);

  useEffect(() => {
    fetchJSON('topics').then(setTopics);
    fetchJSON('events').then(setEvents);
    fetchJSON('event_topics').then(setEventTopics);
  }, []);

  const topicBySlug = useMemo(
    () => Object.fromEntries(topics.map(topic => [topic.slug, topic])),
    [topics],
  );

  const entries = slugs
    .map(slug => topicBySlug[slug])
    .filter((topic): topic is Topic => Boolean(topic));

  const summaryBySlug = useMemo(() => {
    return Object.fromEntries(
      entries.map(topic => [topic.slug, buildTopicSummary(topic, events, eventTopics)]),
    ) as Record<string, ReturnType<typeof buildTopicSummary>>;
  }, [entries, events, eventTopics]);

  return (
    <section className="glass-panel topic-shelf">
      <div className="topic-shelf__header">
        <div>
          <p className="page-kicker">Key Topics</p>
          <h2>{title}</h2>
          <p className="page-intro">{intro}</p>
        </div>
        <div className="page-stat">
          <span>Topics shown</span>
          <strong>{entries.length}</strong>
        </div>
      </div>

      <div className="topic-shelf__grid">
        {entries.map(topic => (
          <Link
            key={topic.id}
            to={`/topic/${topic.slug}`}
            className="topic-shelf-card topic-shelf-card--link"
            data-portal-track-hover="true"
            data-portal-track-click="true"
            data-portal-track-label={topic.label}
            data-portal-track-detail={topic.description}
            data-portal-track-source="Topic shelf"
            data-portal-track-domain="topic"
          >
            <h3>{topic.label}</h3>
            <p>{buildTopicCardCopy(topic, summaryBySlug[topic.slug])}</p>
            <span className="topic-shelf-card__cta">Open encyclopedia entry</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TopicShelf;
