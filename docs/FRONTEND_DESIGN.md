# Crowley Knowledge Portal: Frontend Design and Relational Browsing

## 1. Architectural Stack

- `React 19` with `Vite` for a static export build.
- `HashRouter` for GitHub Pages compatibility.
- React Context for lane filtering and lightweight global state.
- Client-side fuzzy search where it improves browsing.
- `Leaflet` for the interactive map and place-based browsing.
- CSS custom properties and shared card utilities for the dark archival theme.

## 2. Global UI Elements

### 2.1 Evidence Lane Toggle

A persistent lane selector in the top navigation filters the site by evidentiary lane.

- Default state: `All Evidence`
- Lane options:
  - `[A]` Primary Record
  - `[B]` Autobiography
  - `[C]` Scholarship
  - `[D]` Practitioner Interpretation
  - `[E]` Historical / Documentary
- Effect: the content remains visible only when it matches the selected lane, so source type stays obvious while browsing.

### 2.2 Relational Browsing

The site should reward movement between connected records rather than isolated pages.

- Works should link to people, terms, and related events.
- People should surface their main historical roles and the events attached to them.
- Timeline entries should show linked works and related people.
- Map entries should expose nearby events and the relevant text or context.

## 3. Core Sections and Functionality

### 3.1 The Tree of Life

The Tree viewer is both a reference diagram and a study interface.

- It should expose the Golden Dawn base layer, Crowley's revisions, and the resulting correspondences.
- Clicking a sefirah or path should open a detail panel with labels, tarot attributions, and related notes.
- The quiz mode should ask the reader to place attributions rather than simply read them.

### 3.2 The Tarot Explorer

The tarot view should present the Thoth deck as a relational system rather than a static gallery.

- Allow browsing by suit, element, decan, and Tree placement.
- Use a detail view for card-level notes, commentary, and linked references.

### 3.3 Relational Search and Number Browsing

The search layer should connect text search, number search, and cross-referenced entities.

- Searching for a person should surface works and events connected to that person.
- Searching for a number should return terms, correspondences, and linked concepts.
- Search results should distinguish between records, interpretation, and later commentary.

### 3.4 Interactive Map

The map should present Crowley's places as more than pins.

- Markers should be color-coded by site type or historical function when useful.
- Hover text should give a compact summary of why the place matters.
- Popups should include the place summary plus linked events and works.
- Each popup should answer three questions quickly: what place is this, why does it matter, and what should the reader click next?

### 3.5 Timeline

The timeline should remain the site’s most legible browsing tool.

- Cards should be ordered chronologically and filtered by evidence lane or topic.
- Each card should show the date, the event summary, linked people, and relevant tags.
- If an event has a disputed interpretation, the UI should preserve the tension instead of flattening it.

## 4. Visual Language

```css
:root {
  --bg-obsidian: #0f0f11;
  --bg-panel: rgba(25, 25, 30, 0.85);
  --accent-gold: #d4af37;
  --accent-crimson: #8b0000;
  --text-parchment: #e6e2d3;
  --text-muted: #8c887d;

  --lane-a: #c0392b;
  --lane-b: #d35400;
  --lane-c: #2980b9;
  --lane-d: #8e44ad;
  --lane-e: #7f8c8d;

  --font-heading: 'Cinzel', serif;
  --font-body: 'Inter', sans-serif;
}
```

- Panels should feel like dark glass, not flat rectangles.
- Hover and active states should be subtle but clearly visible.
- Typography should stay readable first, decorative second.

## 5. Copy Guidance

- Keep the evidence lane visible wherever claims could be read as fact or interpretation.
- Use short, concrete copy for cards and popups.
- Prefer linked navigation over long explanatory text.
- Keep map popups and timeline cards compact enough that they can be scanned quickly on desktop and mobile.
