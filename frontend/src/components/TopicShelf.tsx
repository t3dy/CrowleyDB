import { useEffect, useMemo, useState } from 'react';
import { fetchJSON } from '../api';

type Topic = {
  id: string;
  slug: string;
  label: string;
  description: string;
  sort_order?: number;
};

type TopicShelfProps = {
  title: string;
  intro: string;
  slugs: readonly string[];
};

const TopicShelf = ({ title, intro, slugs }: TopicShelfProps) => {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    fetchJSON('topics').then(setTopics);
  }, []);

  const topicBySlug = useMemo(
    () => Object.fromEntries(topics.map(topic => [topic.slug, topic])),
    [topics],
  );

  const entries = slugs
    .map(slug => topicBySlug[slug])
    .filter((topic): topic is Topic => Boolean(topic));

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
          <article key={topic.id} className="topic-shelf-card">
            <h3>{topic.label}</h3>
            <p>{topic.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TopicShelf;
