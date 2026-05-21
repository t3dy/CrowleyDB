# CrowleyDB: The Aleister Crowley Knowledge Portal

[![Website Viewer](https://img.shields.io/badge/Website-Live_Viewer-blue?style=for-the-badge)](https://t3dy.github.io/CrowleyDB/)

Welcome to **CrowleyDB**, a Digital Humanities project designed to chart the works, life, and complex occult systems of Aleister Crowley. You can view the live portal here: **[https://t3dy.github.io/CrowleyDB/](https://t3dy.github.io/CrowleyDB/)**

## Overview

This project bridges the gap between secular academic research and the internal logic of a ceremonial magick practitioner. It achieves this by creating a highly structured, relational database that catalogues Crowley's works (the Libri), his associates, a Thelemic dictionary, his biographical timeline, map of his travels, and an interactive Qabalistic Tree of Life featuring his specific modifications (like the Thoth Tarot Tzaddi/Heh swap).

## Technology Stack

The project operates on an automated, zero-backend deployment model:

* **Database Generation (`sqlite3`)**: Python scripts parse raw PDFs and manual data objects to build `crowley_unified.sqlite`.
* **Static JSON Pipeline**: A build script (`scripts/build_site.py`) exports tables from the SQLite database into optimized, static JSON files in the frontend's public directory.
* **Frontend Viewer**: A high-performance, purely static **React 19 + Vite** single-page application.
* **Routing & UI**: 
  * `react-router-dom` (HashRouter for GitHub Pages compatibility).
  * `react-leaflet` with Leaflet.js for interactive mapping.
  * Custom CSS modules utilizing a "Dark Occult" aesthetic (Glassmorphism, Google Fonts: Cinzel, Inter, Frank Ruhl Libre).
* **Deployment**: Automated via GitHub Actions (`.github/workflows/deploy.yml`), which builds the React app and deploys it to GitHub Pages on every push to the `main` branch.

## Methodologies

### The 5-Lane Evidentiary System
To accurately capture the life of a figure as heavily self-mythologized as Crowley, we utilize a 5-Lane Evidentiary tagging system. This allows the UI to filter out unverified claims from historical consensus:
* **[A] Primary Record**: Crowley's diaries, magical records, and the primary Libri (e.g., The Book of the Law).
* **[B] Autobiography**: His unverified self-report and self-mythology (e.g., *The Confessions of Aleister Crowley*).
* **[C] Scholarship**: Rigorous, consensus-based academic biography (e.g., Richard Kaczynski, Tobias Churton, Marco Pasi).
* **[D] Practitioners**: Later interpretations by occult disciples and esoteric practitioners (e.g., Kenneth Grant, James Eshelman).
* **[E] Historical/Documentary**: Verified historical, legal, and documentary records.

### Dual-Perspective Tone
The writing maintains *Academic Detachment with Practitioner Empathy*. It does not dismiss the metaphysical mechanics of Crowley's rituals; rather, it describes their internal logic meticulously and objectively while utilizing precise attribution (e.g., "According to his magical record...").

## Data Sources

Our data is aggregated from a variety of foundational texts, which our Python scripts ingest:
* **Primary Libri**: Liber AL vel Legis, Liber ABA, The Vision and the Voice.
* **Biographies**: *Perdurabo* by Richard Kaczynski, *The Beast in Berlin* by Tobias Churton.
* **Tarot & Qabalah**: *The Book of Thoth*, *777 and Other Qabalistic Writings*.
* **Digital Repositories**: Hermetic.com, Keep Silence, and various scholarly papers on the history of Western Esotericism.

## Current Architecture & Plans

### What is Completed
- [x] **Database Schema**: Fully defined `schema.sql` capable of tracking texts, people, timeline events, map locations, initiatory grades, dictionary terms, and Tree of Life paths.
- [x] **Data Ingestion Scripts**: Python logic to populate the SQLite database and export it to JSON.
- [x] **Thelemic Tree of Life Viewer**: Interactive React component that maps Crowley's specific tarot swaps (Tzaddi/Heh), Golden Dawn color scales, Archangels, and God Names.
- [x] **Biographical Map & Timeline**: Leaflet integration mapping Crowley's travels to specific timeline events.
- [x] **Automated Build/Deploy CI**: GitHub Actions workflow deploying directly to GitHub Pages.

### What is Left to Do (Future Plans)
- [ ] **Gematria Engine**: Build a Fuse.js powered search bar that allows users to type numbers (e.g., "93", "156") and returns all dictionary terms, works, and concepts that sum to that number via Hebrew or Greek Isopsephy.
- [ ] **Tarot Explorer**: Implement a grid view of the 78 cards of the Thoth Tarot with high-res scans and sorting capabilities (by Element, Suit, Decan).
- [ ] **Expanded PDF Parsing**: Enhance `scripts/ingest_pdfs.py` to extract actual full-text content via OCR/PyPDF2 for deep semantic searching, rather than just file metadata.
- [ ] **Relational Breadcrumbs**: Implement a UI feature that tracks associative paths as users browse (e.g., `The Book of Thoth > Atu IV: The Emperor > Tzaddi > Thelema`).
- [ ] **Expanded Data Entry**: Manually input the hundreds of minor associates, additional dictionary terms, and all specific magical workings from his diaries into the seed scripts.
