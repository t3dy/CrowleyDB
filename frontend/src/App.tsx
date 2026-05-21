import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { fetchJSON } from './api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './index.css';

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

export const LaneProvider: React.FC<{children: ReactNode}> = ({ children }) => {
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

const Navbar = () => {
  const { currentLane, setLane } = useLane();
  
  const lanes: { id: Lane, label: string, color: string }[] = [
    { id: 'All', label: 'All Evidence', color: 'var(--text-parchment)' },
    { id: 'A', label: 'Primary Record', color: 'var(--lane-a)' },
    { id: 'B', label: 'Autobiography', color: 'var(--lane-b)' },
    { id: 'C', label: 'Scholarship', color: 'var(--lane-c)' },
    { id: 'D', label: 'Practitioners', color: 'var(--lane-d)' },
    { id: 'E', label: 'History', color: 'var(--lane-e)' }
  ];

  return (
    <nav style={{ padding: '1rem', background: 'var(--bg-panel)', borderBottom: '1px solid var(--accent-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--accent-gold)' }}>
        Crowley Knowledge Portal
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/">Home</Link>
        <Link to="/works">Works</Link>
        <Link to="/tree">Tree of Life</Link>
        <Link to="/grades">Grades</Link>
        <Link to="/biography">Biography & Map</Link>
        <Link to="/saints">Saints</Link>
        <Link to="/dictionary">Dictionary</Link>
        
        <select 
          value={currentLane} 
          onChange={(e) => setLane(e.target.value as Lane)}
          style={{ background: 'var(--bg-obsidian)', color: 'var(--text-parchment)', padding: '0.5rem', border: '1px solid var(--accent-gold)', borderRadius: '4px' }}
        >
          {lanes.map(l => (
            <option key={l.id} value={l.id} style={{ color: l.color }}>
              [{l.id === 'All' ? '*' : l.id}] {l.label}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

const BiographyAndMap = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const { currentLane } = useLane();

  useEffect(() => {
    fetchJSON('events').then(data => {
      setEvents(data.sort((a: any, b: any) => a.date_start.localeCompare(b.date_start)));
    });
    fetchJSON('locations').then(setLocations);
  }, []);

  const filteredEvents = events.filter(e => {
    if (currentLane === 'All') return true;
    return e.evidentiary_lane === currentLane;
  });

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 73px)' }}>
      {/* Sidebar Timeline */}
      <div style={{ width: '400px', overflowY: 'auto', padding: '2rem', borderRight: '1px solid var(--accent-gold)' }}>
        <h1 style={{ marginTop: 0 }}>Timeline</h1>
        {filteredEvents.map(event => (
          <div key={event.id} className="glass-panel" style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
              {event.date_start} {event.date_end ? `- ${event.date_end}` : ''}
            </div>
            <h3 style={{ margin: '0.5rem 0' }}>{event.title}</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{event.description}</p>
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ 
                display: 'inline-block', 
                padding: '0.2rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.75rem',
                background: `var(--lane-${event.evidentiary_lane.toLowerCase()})`,
                color: '#fff'
              }}>
                Lane {event.evidentiary_lane}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Map Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer center={[40.0, 10.0]} zoom={4} style={{ height: '100%', width: '100%', backgroundColor: '#222' }}>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">Carto</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {locations.map(loc => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
              <Popup>
                <div style={{ color: '#333' }}>
                  <strong style={{ display: 'block', fontSize: '1.1em', marginBottom: '4px' }}>{loc.name}</strong>
                  <p style={{ margin: 0, fontSize: '0.9em' }}>{loc.significance}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

const Dictionary = () => {
  const [terms, setTerms] = useState<any[]>([]);
  const { currentLane } = useLane();

  useEffect(() => {
    fetchJSON('terms').then(setTerms);
  }, []);

  const filteredTerms = terms.filter(t => {
    if (currentLane === 'All') return true;
    return t.evidentiary_lane === currentLane;
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Thelemic Dictionary</h1>
      <p>Lexicon and Qabalistic terms of the Aeon of Horus.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        {filteredTerms.map(term => (
          <div key={term.id} className="glass-panel">
            <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {term.term} 
              {term.gematria_value && <span style={{ fontSize: '0.9rem', color: 'var(--accent-gold)' }}>[{term.gematria_value}]</span>}
            </h3>
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{term.etymology}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Definition:</strong> {term.definition}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Significance:</strong> {term.thelemic_significance}</p>
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ 
                display: 'inline-block', 
                padding: '0.2rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.75rem',
                background: `var(--lane-${term.evidentiary_lane.toLowerCase()})`,
                color: '#fff'
              }}>
                Lane {term.evidentiary_lane}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <LaneProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/works" element={<Works />} />
              <Route path="/tree" element={<TreeOfLife />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/biography" element={<BiographyAndMap />} />
              <Route path="/saints" element={<Saints />} />
              <Route path="/dictionary" element={<Dictionary />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LaneProvider>
  );
}

export default App;
