import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { fetchJSON } from './api';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import './index.css';
import TopicShelf from './components/TopicShelf';
import { TOPIC_GROUPS } from './topicGroups';
import { PortalIdentityProvider, usePortalIdentity } from './portalIdentity';

// Fix for default Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Lane = 'All' | 'A' | 'B' | 'C' | 'D' | 'E';

interface LaneContextType {
  currentLane: Lane;
  setLane: (lane: Lane) => void;
}

const LaneContext = createContext<LaneContextType>({ currentLane: 'All', setLane: () => {} });

export const useLane = () => useContext(LaneContext);

export const LaneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLane, setLane] = useState<Lane>('All');
  return (
    <LaneContext.Provider value={{ currentLane, setLane }}>
      {children}
    </LaneContext.Provider>
  );
};

import TreeOfLife from './pages/TreeOfLife';
import Grades from './pages/Grades';
import Saints from './pages/Saints';
import Home from './pages/Home';
import Works from './pages/Works';
import People from './pages/People';
import TopicPage from './pages/Topic';
import Numbers from './pages/Numbers';
import NumberPage from './pages/Number';
import Precursors from './pages/Precursors';
import PrecursorPage from './pages/Precursor';
import Readings from './pages/Readings';
import Initiation from './pages/Initiation';
import Character from './pages/Character';

const Navbar = () => {
  const { currentLane, setLane } = useLane();
  const { profile, traces } = usePortalIdentity();

  const lanes: { id: Lane; label: string }[] = [
    { id: 'All', label: 'All Evidence' },
    { id: 'A', label: 'Primary Record' },
    { id: 'B', label: 'Autobiography' },
    { id: 'C', label: 'Scholarship' },
    { id: 'D', label: 'Practitioners' },
    { id: 'E', label: 'History' },
  ];

  return (
    <nav className="site-header">
      <div className="site-header__inner">
        <div className="site-brand">
          <Link to="/" className="site-brand__title">
            Crowley Knowledge Portal
          </Link>
          <p className="site-brand__subtitle">
            A structured research viewer for Crowley&apos;s works, associates, and symbolic system.
          </p>
        </div>

        <div className="site-nav">
          <div className="site-nav__links">
            <Link to="/" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Home" data-portal-track-source="Navbar">Home</Link>
            <Link to="/works" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Works" data-portal-track-source="Navbar">Works</Link>
            <Link to="/tree" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Tree of Life" data-portal-track-source="Navbar">Tree of Life</Link>
            <Link to="/grades" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Grades" data-portal-track-source="Navbar">Grades</Link>
            <Link to="/biography" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Biography & Map" data-portal-track-source="Navbar">Biography &amp; Map</Link>
            <Link to="/people" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="People" data-portal-track-source="Navbar">People</Link>
            <Link to="/saints" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Saints" data-portal-track-source="Navbar">Saints</Link>
            <Link to="/numbers" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Numbers" data-portal-track-source="Navbar">Numbers</Link>
            <Link to="/precursors" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Precursors" data-portal-track-source="Navbar">Precursors</Link>
            <Link to="/readings" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Readings" data-portal-track-source="Navbar">Readings</Link>
            <Link to="/dictionary" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Dictionary" data-portal-track-source="Navbar">Dictionary</Link>
            <Link to="/initiation" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Initiation" data-portal-track-source="Navbar">
              Initiation
            </Link>
            <Link to="/character" data-portal-track-click="true" data-portal-track-hover="true" data-portal-track-label="Character Sheet" data-portal-track-source="Navbar">
              Character
            </Link>
          </div>

          <div className="site-nav__profile">
            <Link
              to={profile ? '/character' : '/initiation'}
              className="site-nav__profile-chip"
              data-portal-track-click="true"
              data-portal-track-hover="true"
              data-portal-track-label={profile ? profile.initiatoryName : 'Enter the lodge'}
              data-portal-track-source="Navbar"
            >
              <span>{profile ? profile.initiatoryName : 'Enter the lodge'}</span>
              <small>{profile ? `${traces.length} traces` : 'Create an initiatory name'}</small>
            </Link>
          </div>

          <label className="site-nav__lane">
            <span>Evidence lane</span>
            <select value={currentLane} onChange={event => setLane(event.target.value as Lane)}>
              {lanes.map(lane => (
                <option key={lane.id} value={lane.id}>
                  [{lane.id === 'All' ? '*' : lane.id}] {lane.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </nav>
  );
};

const BiographyAndMap = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [eventTopics, setEventTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const { currentLane } = useLane();

  useEffect(() => {
    fetchJSON('events').then(data => {
      setEvents(data.sort((a: any, b: any) => a.date_start.localeCompare(b.date_start)));
    });
    fetchJSON('locations').then(setLocations);
    fetchJSON('topics').then(setTopics);
    fetchJSON('event_topics').then(setEventTopics);
  }, []);

  const topicById = useMemo(() => Object.fromEntries(topics.map((topic: any) => [topic.id, topic])), [topics]);
  const topicsByEventId = useMemo(
    () =>
      eventTopics.reduce((acc: Record<string, string[]>, link: any) => {
        const topic = topicById[link.topic_id];
        if (!topic) return acc;
        acc[link.event_id] = acc[link.event_id] || [];
        acc[link.event_id].push(topic.label);
        return acc;
      }, {}),
    [eventTopics, topicById],
  );

  const filteredEvents = events.filter(event => {
    if (currentLane !== 'All' && event.evidentiary_lane !== currentLane) return false;
    if (selectedTopic === 'All') return true;
    return (topicsByEventId[event.id] || []).includes(selectedTopic);
  });

  const eventsByLocationId = useMemo(() => {
    return events.reduce((acc: Record<string, any[]>, event) => {
      if (!event.location_id) return acc;
      acc[event.location_id] = acc[event.location_id] || [];
      acc[event.location_id].push(event);
      return acc;
    }, {});
  }, [events]);

  return (
    <div className="page-shell page-shell--fullbleed biography-layout">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">CrowleyDB biography lane</p>
          <h1>Timeline</h1>
          <p className="page-intro">
            Browse the chronology with topic and evidence filters. The left panel keeps the narrative compact while
            the map anchors the events to place.
          </p>
        </div>
        <div className="page-stat">
          <span>Visible events</span>
          <strong>{filteredEvents.length}</strong>
        </div>
      </section>

      <div className="biography-layout__split">
        <aside className="glass-panel biography-layout__sidebar">
          <label className="stacked-field">
            <span>Topic</span>
            <select value={selectedTopic} onChange={event => setSelectedTopic(event.target.value)}>
              <option value="All">All topics</option>
              {topics.map((topic: any) => (
                <option key={topic.id} value={topic.label}>
                  {topic.label}
                </option>
              ))}
            </select>
          </label>

          <div className="timeline-stack">
            {filteredEvents.map(event => (
                <article
                  key={event.id}
                  className="glass-panel timeline-card"
                  data-portal-track-hover="true"
                  data-portal-track-click="true"
                  data-portal-track-label={event.title}
                  data-portal-track-detail={event.description}
                  data-portal-track-source="Timeline"
                  data-portal-track-domain="biography"
                >
                <div className="timeline-card__meta">
                  <span>
                    {event.date_start} {event.date_end ? `- ${event.date_end}` : ''}
                  </span>
                  <span className={`lane-pill lane-pill--${String(event.evidentiary_lane).toLowerCase()}`}>
                    Lane {event.evidentiary_lane}
                  </span>
                </div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div className="topic-chip-row">
                  {(topicsByEventId[event.id] || []).slice(0, 5).map((topic: string) => (
                    <span key={topic} className="topic-chip">
                      {topic}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </aside>

        <section className="biography-layout__map">
          <MapContainer center={[40.0, 10.0]} zoom={4} style={{ height: '100%', width: '100%', backgroundColor: '#222' }}>
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {locations.map(loc => (
              <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                <Tooltip direction="top" offset={[0, -10]} opacity={1} sticky>
                  <div className="map-tooltip">
                    <strong>{loc.name}</strong>
                    <span>{loc.significance}</span>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="map-popup">
                    <strong>{loc.name}</strong>
                    <p>{loc.significance}</p>
                    <div className="map-popup__section">
                      <span>Linked events</span>
                      <ul>
                        {(eventsByLocationId[loc.id] || [])
                          .slice()
                          .sort((left, right) => left.date_start.localeCompare(right.date_start))
                          .slice(0, 4)
                          .map((event: any) => (
                            <li key={event.id}>
                              <strong>{event.date_start}</strong>
                              <span>{event.title}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </div>

      <TopicShelf
        title="Key biography topics"
        intro="These topics give the timeline and map their structure: origin, schooling, movement, exile, decline, and the public afterlife of the life story."
        slugs={TOPIC_GROUPS.biography}
      />
    </div>
  );
};

const Dictionary = () => {
  const [terms, setTerms] = useState<any[]>([]);
  const { currentLane } = useLane();

  useEffect(() => {
    fetchJSON('terms').then(setTerms);
  }, []);

  const filteredTerms = terms.filter(term => {
    if (currentLane === 'All') return true;
    return term.evidentiary_lane === currentLane;
  });

  return (
    <div className="page-shell">
      <section className="glass-panel page-hero">
        <div>
          <p className="page-kicker">Reference terms</p>
          <h1>Thelemic Dictionary</h1>
          <p className="page-intro">Lexicon and Qabalistic terms of the Aeon of Horus.</p>
        </div>
        <div className="page-stat">
          <span>Entries</span>
          <strong>{filteredTerms.length}</strong>
        </div>
      </section>

      <div className="page-grid page-grid--cards">
        {filteredTerms.map(term => (
          <article
            key={term.id}
            className="glass-panel term-card"
            data-portal-track-hover="true"
            data-portal-track-click="true"
            data-portal-track-label={term.term}
            data-portal-track-detail={term.thelemic_significance}
            data-portal-track-source="Dictionary"
            data-portal-track-domain="dictionary"
          >
            <h3 className="term-card__title">
              {term.term}
              {term.gematria_value && <span className="term-card__value">[{term.gematria_value}]</span>}
            </h3>
            <p className="term-card__etymology">{term.etymology}</p>
            <p>
              <strong>Definition:</strong> {term.definition}
            </p>
            <p>
              <strong>Significance:</strong> {term.thelemic_significance}
            </p>
            <span className={`lane-pill lane-pill--${term.evidentiary_lane.toLowerCase()}`}>Lane {term.evidentiary_lane}</span>
          </article>
        ))}
      </div>

      <TopicShelf
        title="Key dictionary topics"
        intro="These topics anchor the lexicon page in the concepts that matter most to the portal: symbolism, correspondences, doctrine, instruction, and the reference logic that holds the system together."
        slugs={TOPIC_GROUPS.dictionary}
      />
    </div>
  );
};

function App() {
  return (
    <PortalIdentityProvider>
      <LaneProvider>
        <Router>
          <div className="app-shell">
            <Navbar />
            <main className="site-main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/works" element={<Works />} />
                <Route path="/tree" element={<TreeOfLife />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/biography" element={<BiographyAndMap />} />
                <Route path="/people" element={<People />} />
                <Route path="/saints" element={<Saints />} />
                <Route path="/numbers" element={<Numbers />} />
                <Route path="/numbers/:slug" element={<NumberPage />} />
                <Route path="/precursors" element={<Precursors />} />
                <Route path="/precursors/:slug" element={<PrecursorPage />} />
                <Route path="/readings" element={<Readings />} />
                <Route path="/dictionary" element={<Dictionary />} />
                <Route path="/topic/:slug" element={<TopicPage />} />
                <Route path="/initiation" element={<Initiation />} />
                <Route path="/character" element={<Character />} />
              </Routes>
            </main>
          </div>
        </Router>
      </LaneProvider>
    </PortalIdentityProvider>
  );
}

export default App;
