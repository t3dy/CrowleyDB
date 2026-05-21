# Crowley Knowledge Portal: Frontend Design & Relational Browsing

## 1. Architectural Stack
* **Framework**: React 19 + Vite (Static Export)
* **Routing**: HashRouter (for zero-config GitHub Pages deployment)
* **State Management**: Zustand (for bookmarks/saved readings) and React Context (for Lane filtering)
* **Search**: Fuse.js (client-side fuzzy search)
* **Visualizations**: D3.js (for the Tree of Life and Interactive Map)
* **Styling**: CSS Modules with CSS Variables (The "Dark Occult" theme).

## 2. Global UI Elements

### 2.1 The "Evidentiary Lane" Toggle
A persistent toggle in the top navigation bar allows the user to filter the entire site’s content by evidentiary lane.
* **Default State**: "All Evidence"
* **Toggle Options**:
  * `[A]` Primary Magical Record (Red)
  * `[B]` Crowley's Autobiography (Gold)
  * `[C]` Scholarly Consensus (Blue)
  * `[D]` Occult Disciples (Purple)
  * `[E]` Historical/Documentary (Gray)
* *Effect*: When toggled to "Scholarly Consensus", the dictionary definitions and timeline events sourced exclusively from Crowley's unverified self-report (Lane B) fade out or are hidden.

### 2.2 Relational Breadcrumbs
As the user navigates, breadcrumbs trace their associative path. 
* *Example*: `The Book of Thoth` > `Atu IV: The Emperor` > `Tzaddi (Hebrew Letter)` > `Thelema (Dictionary)`

## 3. Core Sections & Functionality

### 3.1 The Thelemic Tree of Life (Interactive Qabalah)
A central feature for the practitioner. A visual representation of the Tree of Life.
* **The Swaps**: Visually highlights Crowley's specific twists—the path of Tzaddi (The Emperor) connecting to Yesod/Netzach (or wherever mapped in his system) vs Heh (The Star).
* **Interactivity**: Clicking a Sephiroth (e.g., Tiphareth) or a Path (e.g., Gimel) opens a sliding side-panel.
* **Side-Panel Content**: 
  * The astrological correspondence.
  * The Thoth Tarot card (e.g., The High Priestess).
  * Associated Libri (e.g., *Liber B vel Magi*).
  * Gematria matches.

### 3.2 The Tarot Explorer (The Book of Thoth)
A grid view of the 78 cards of the Thoth Tarot.
* **Sorting Options**: By Suit, By Element, By Astrological Decan, By Tree of Life placement.
* **Detail View**: 
  * High-res scan of Frieda Harris's painting.
  * Crowley's commentary from *The Book of Thoth*.
  * Scholarly analysis (Lane C) on Harris's artistic influences (e.g., projective geometry).

### 3.3 Relational Search & "Gematria Engine"
A unified search bar powered by Fuse.js.
* **Text Search**: Searching "Aiwass" brings up Persons (Aiwass), Works (*The Book of the Law*), and Timeline Events (Cairo Working).
* **Number Search**: Typing a number (e.g., "93" or "156" or "418") triggers the "Gematria Engine," returning all Dictionary terms, Works, and concepts that sum to that number, categorized by Hebrew or Greek Isopsephy.

### 3.4 Interactive Map (The Travels of the Beast)
A Leaflet.js or Mapbox integration with a dark, vintage cartography style.
* **Markers**: Color-coded by type (Domiciles, Workings, Expeditions).
* **Popup Design**: 
  * Title and Date (e.g., *Bou Saâda, 1909*).
  * Brief description: "Crowley and Victor Neuburg scry the Aethyrs of the Enochian system."
  * **Link**: "View The Vision and the Voice (Liber 418) in Works."

### 3.5 Timeline (The Aeon of Horus)
A vertical timeline component.
* **Sorting/Filtering**: Filter by "A.'.A.'. Grades", "Publications", "Personal Life", "Legal Battles".
* **Cards**: Each event is a card with the Lane badge clearly visible. Conflicting accounts (e.g., the death of Raoul Loveday at the Abbey) show multiple Lane cards side-by-side to highlight the dispute.

## 4. Visual Language & Style Tokens
```css
:root {
  /* Colors */
  --bg-obsidian: #0f0f11;
  --bg-panel: rgba(25, 25, 30, 0.85);
  --accent-gold: #d4af37;
  --accent-crimson: #8b0000;
  --text-parchment: #e6e2d3;
  --text-muted: #8c887d;
  
  /* Lane Colors */
  --lane-a: #c0392b; /* Red */
  --lane-b: #d35400; /* Orange/Gold */
  --lane-c: #2980b9; /* Blue */
  --lane-d: #8e44ad; /* Purple */
  --lane-e: #7f8c8d; /* Gray */

  /* Typography */
  --font-heading: 'Cinzel', serif;
  --font-body: 'Inter', sans-serif;
  --font-hebrew: 'Frank Ruhl Libre', serif;
}
```
* **Glassmorphism**: Panels use backdrop-filter blurring (`backdrop-filter: blur(10px)`) to appear as floating glass over the dark background.
* **Borders**: Thin 1px solid `--accent-gold` borders on active or hovered elements.
