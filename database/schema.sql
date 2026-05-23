-- c:\Dev\CrowleyPortal\database\schema.sql

-- 1. EVIDENTIARY LANES
-- A: Magical Record & Primary Libri
-- B: Autobiography & Self-Report
-- C: Scholarly Biography
-- D: Occult Disciples & Interpreters
-- E: Historical / Documentary Record

CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    publication_year INTEGER,
    evidentiary_lane TEXT CHECK(evidentiary_lane IN ('A', 'B', 'C', 'D', 'E')),
    file_path TEXT,
    description TEXT
);

-- 2. WORKS (THE LIBRI)
CREATE TABLE IF NOT EXISTS works (
    id TEXT PRIMARY KEY,
    liber_number INTEGER, -- E.g., 4, 777, 220
    title TEXT NOT NULL,
    class TEXT CHECK(class IN ('A', 'B', 'C', 'D', 'E', 'Unclassified')),
    date_composed TEXT,
    location_composed TEXT,
    summary TEXT,
    document_id TEXT REFERENCES documents(id)
);

-- 3. PERSONS (ASSOCIATES, SCHOLARS, FANS)
CREATE TABLE IF NOT EXISTS persons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    magical_motto TEXT, -- E.g., Perdurabo, To Mega Therion
    role_category TEXT CHECK(role_category IN ('Self', 'Major Associate', 'Minor Associate', 'Scholar', 'Disciple', 'Fan', 'Rival', 'Thelemic Saint')),
    birth_year INTEGER,
    death_year INTEGER,
    biography TEXT
);

-- 4. TERMS (THE DICTIONARY)
CREATE TABLE IF NOT EXISTS terms (
    id TEXT PRIMARY KEY,
    term TEXT NOT NULL,
    gematria_value INTEGER,
    etymology TEXT,
    definition TEXT,
    thelemic_significance TEXT,
    evidentiary_lane TEXT DEFAULT 'A'
);

-- 5. QABALAH & TAROT (THELEMIC SYSTEM)
-- Specifically encoding the Thoth tarot swaps (Tzaddi/Heh, etc.) and Golden Dawn attributions
CREATE TABLE IF NOT EXISTS thelemic_tree (
    path_number INTEGER PRIMARY KEY, -- 1 to 32
    name TEXT,
    hebrew_letter TEXT,
    astrological_attribution TEXT,
    thoth_tarot_card TEXT,
    gd_tarot_card TEXT,
    is_swapped BOOLEAN DEFAULT 0, -- True for Tzaddi (Emperor) and Heh (Star)
    color_scale_king TEXT,
    color_scale_queen TEXT,
    color_scale_emperor TEXT,
    color_scale_empress TEXT,
    god_name TEXT,
    archangel TEXT,
    angel_choir TEXT,
    crowley_tweaks TEXT,
    description TEXT
);

-- 5b. GRADES & INITIATIONS
CREATE TABLE IF NOT EXISTS grades (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    system TEXT CHECK(system IN ('A.''.A.''.', 'Golden Dawn', 'O.T.O.', 'Lurianic Kabbalah', 'Rosicrucian', 'Freemasonic')),
    tree_path_number INTEGER REFERENCES thelemic_tree(path_number),
    description TEXT
);

-- 5c. CORPUS SOURCE CATALOG & SYMBOL CLAIMS
CREATE TABLE IF NOT EXISTS corpus_sources (
    id TEXT PRIMARY KEY,
    source_kind TEXT NOT NULL,
    source_ref TEXT NOT NULL,
    title TEXT NOT NULL,
    author TEXT,
    priority_score INTEGER NOT NULL DEFAULT 0,
    focus TEXT,
    why_key TEXT,
    evidence_lane TEXT,
    file_path TEXT,
    search_terms TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS symbol_claims (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES corpus_sources(id) ON DELETE CASCADE,
    claim_type TEXT NOT NULL,
    symbol TEXT NOT NULL,
    symbol_value TEXT,
    related_symbol TEXT,
    claim_text TEXT NOT NULL,
    evidence_locator TEXT,
    evidence_excerpt TEXT,
    confidence REAL NOT NULL DEFAULT 0.8,
    priority_score INTEGER NOT NULL DEFAULT 0,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_corpus_sources_priority ON corpus_sources(priority_score DESC, title);
CREATE INDEX IF NOT EXISTS idx_symbol_claims_source_id ON symbol_claims(source_id);
CREATE INDEX IF NOT EXISTS idx_symbol_claims_symbol ON symbol_claims(symbol);
CREATE INDEX IF NOT EXISTS idx_symbol_claims_claim_type ON symbol_claims(claim_type);

-- 6. EVENTS & TIMELINE
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    date_start TEXT,
    date_end TEXT,
    title TEXT NOT NULL,
    description TEXT,
    location_id TEXT,
    evidentiary_lane TEXT,
    document_id TEXT REFERENCES documents(id)
);

-- 7. LOCATIONS (INTERACTIVE MAP)
CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    significance TEXT
);

-- 8. INITIATIONS & WORKINGS
CREATE TABLE IF NOT EXISTS workings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date_start TEXT,
    date_end TEXT,
    location_id TEXT REFERENCES locations(id),
    grade_achieved TEXT, -- E.g., 5=6 Adeptus Minor
    order_name TEXT CHECK(order_name IN ('Golden Dawn', 'A.''.A.''.', 'O.T.O.', 'Independent')),
    description TEXT
);

-- 9. TOPIC TAXONOMY (CONTROLLED VOCABULARY)
-- Canonical seed metadata lives in database/topic_taxonomy.json.
-- Events are tagged through event_topics; do not add free-text topic fields.
CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS event_topics (
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_topics_sort_order ON topics(sort_order, label);
CREATE INDEX IF NOT EXISTS idx_event_topics_event_id ON event_topics(event_id);
CREATE INDEX IF NOT EXISTS idx_event_topics_topic_id ON event_topics(topic_id);

-- JOIN TABLES
CREATE TABLE IF NOT EXISTS term_works (
    term_id TEXT REFERENCES terms(id),
    work_id TEXT REFERENCES works(id),
    PRIMARY KEY (term_id, work_id)
);

CREATE TABLE IF NOT EXISTS person_events (
    person_id TEXT REFERENCES persons(id),
    event_id TEXT REFERENCES events(id),
    PRIMARY KEY (person_id, event_id)
);

CREATE TABLE IF NOT EXISTS person_workings (
    person_id TEXT REFERENCES persons(id),
    working_id TEXT REFERENCES workings(id),
    role TEXT, -- E.g., 'Primary', 'Scarlet Woman', 'Scribe'
    PRIMARY KEY (person_id, working_id)
);
