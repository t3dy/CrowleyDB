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

const sectionValue = (description: string, label: 'Topics' | 'People' | 'Works') => {
  const marker = ` | ${label}: `;
  const start = description.indexOf(marker);
  if (start === -1) return '';
  const remainder = description.slice(start + marker.length);
  const end = remainder.indexOf(' | ');
  return (end === -1 ? remainder : remainder.slice(0, end)).trim();
};

const summaryText = (description: string) => description.split(' | ')[0].trim();
const lowercaseFirst = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

const parseNames = (description: string, label: 'People' | 'Works') =>
  sectionValue(description, label)
    .split(', ')
    .map(item => item.trim())
    .filter(Boolean);

const ellipsize = (value: string, limit = 72) => {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).trimEnd()}…`;
};

const sentenceJoin = (items: string[]) => {
  if (!items.length) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
};

export type TopicSummary = {
  eventCount: number;
  firstEvent: Event | null;
  lastEvent: Event | null;
  events: Event[];
  locations: string[];
  people: string[];
  works: string[];
};

export function buildTopicSummary(
  topic: Topic,
  events: Event[],
  eventTopics: EventTopic[],
  locations: Location[] = [],
) {
  const eventIds = new Set(eventTopics.filter(link => link.topic_id === topic.id).map(link => link.event_id));
  const matchingEvents = [...events]
    .filter(event => eventIds.has(event.id))
    .sort((left, right) => left.date_start.localeCompare(right.date_start));

  const peopleSeen = new Map<string, number>();
  const worksSeen = new Map<string, number>();
  const locationsSeen = new Map<string, number>();
  const locationById = Object.fromEntries(locations.map(location => [location.id, location]));

  for (const event of matchingEvents) {
    for (const person of parseNames(event.description, 'People')) {
      peopleSeen.set(person, (peopleSeen.get(person) || 0) + 1);
    }
    for (const work of parseNames(event.description, 'Works')) {
      worksSeen.set(work, (worksSeen.get(work) || 0) + 1);
    }
    if (event.location_id && locationById[event.location_id]) {
      const location = locationById[event.location_id].name;
      locationsSeen.set(location, (locationsSeen.get(location) || 0) + 1);
    }
  }

  return {
    eventCount: matchingEvents.length,
    firstEvent: matchingEvents[0] || null,
    lastEvent: matchingEvents[matchingEvents.length - 1] || null,
    events: matchingEvents,
    locations: [...locationsSeen.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([name]) => name),
    people: [...peopleSeen.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([name]) => name),
    works: [...worksSeen.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([name]) => name),
  } satisfies TopicSummary;
}

export function buildTopicCardCopy(topic: Topic, summary: TopicSummary) {
  const intro = `${topic.label} is treated here as ${lowercaseFirst(topic.description)}`;
  const recordLine =
    summary.eventCount > 0
      ? `It appears in ${summary.eventCount} indexed events, most visibly through ${sentenceJoin(
          summary.events.slice(0, 2).map(event => `"${event.title}"`),
        )}.`
      : 'It does not yet have a dense event trail, so the page keeps it as a conceptual anchor for navigation and future expansion.';
  const contextLine =
    summary.people.length || summary.works.length
      ? `The surrounding archive places it beside ${
          summary.people.length ? `people such as ${sentenceJoin(summary.people.slice(0, 2))}` : ''
        }${summary.people.length && summary.works.length ? ' and ' : ''}${
          summary.works.length ? `works such as ${sentenceJoin(summary.works.slice(0, 2))}` : ''
        }.`
      : 'The surrounding archive currently uses it as a compact reference point rather than a fully cross-linked cluster.';
  return `${intro} ${recordLine} ${contextLine}`;
}

export function buildTopicArticleParagraphs(topic: Topic, summary: TopicSummary) {
  const paragraphs: string[] = [];
  const eventSpan =
    summary.firstEvent && summary.lastEvent
      ? summary.firstEvent.date_start === summary.lastEvent.date_start
        ? `Its dated record currently runs through ${summary.firstEvent.date_start}.`
        : `Its dated record currently runs from ${summary.firstEvent.date_start} to ${summary.lastEvent.date_start}.`
      : 'The current database has not yet attached it to a dated event trail.';

  paragraphs.push(
    `${topic.label} is one of the portal's controlled topics, and its description is ${lowercaseFirst(topic.description)}. The point of the page is to keep the term visible as a real entry rather than a loose tag: the reader gets the definition, the scope, and the reason it matters inside the archive. ${eventSpan}`,
  );

  if (summary.events.length) {
    const sampleEvents = summary.events.slice(0, 4).map(event => {
      return `${event.title} (${event.date_start})`;
    });
    paragraphs.push(
      `Within the database, the topic gathers around ${summary.events.length} linked events. The clearest way to read it is through the record trail itself, especially ${sentenceJoin(sampleEvents)}, which show how the term moves across biography, ritual, publication, and interpretation rather than staying fixed inside one section.`,
    );
  } else {
    paragraphs.push(
      `Within the database, the topic currently functions as a conceptual guidepost. That does not make it vague; it means the editorial structure is using it to mark a field that needs more direct event links, more cross-references, or a fuller prose treatment in a later pass.`,
    );
  }

  if (summary.people.length || summary.works.length || summary.locations.length) {
    const people = summary.people.slice(0, 4);
    const works = summary.works.slice(0, 4);
    const locations = summary.locations.slice(0, 4);
    const lines = [];
    if (people.length) lines.push(`People: ${sentenceJoin(people.map(name => ellipsize(name, 34)))}`);
    if (works.length) lines.push(`Works: ${sentenceJoin(works.map(name => ellipsize(name, 34)))}`);
    if (locations.length) lines.push(`Places: ${sentenceJoin(locations.map(name => ellipsize(name, 34)))}`);
    paragraphs.push(
      `The topic also draws a neighborhood around it. ${lines.join(' ')} This matters because the portal is not treating topics as mere keywords; it is using them to cluster the archive around recurring names, places, and texts so that the reader can move from a concept to the living record behind it.`,
    );
  } else {
    paragraphs.push(
      `The topic is not yet heavily populated with related names, places, or texts, which makes it an especially useful target for future writing. A stronger pass here would add connective prose, linked records, and a more explicit editorial explanation of how the term fits into the portal's map.`,
    );
  }

  paragraphs.push(
    `Read the page as an encyclopedia entry rather than a label. The card on the section pages is the short-form invitation; this page is the longer explanation that lets the archive slow down, name the relationships, and show why the topic deserves its own place in the system.`,
  );

  return paragraphs;
}

export { parseNames, summaryText };
