# CrowleyDB

[![Website Viewer](https://img.shields.io/badge/Website-Live_Viewer-blue?style=for-the-badge)](https://t3dy.github.io/CrowleyDB/)

**Live database viewer:** [https://t3dy.github.io/CrowleyDB/](https://t3dy.github.io/CrowleyDB/)

CrowleyDB is a digital humanities project for organizing, cross-referencing, and exploring the works, life, associates, travels, and symbolic system of Aleister Crowley. The goal is not just to collect information, but to make the material browsable, traceable, and transparent about what is documented versus what is interpretive.

## Project Goals

- Build a structured research portal around Crowley's texts, biography, and occult framework.
- Keep source attribution visible so users can distinguish primary records, scholarship, autobiography, and later practitioner interpretation.
- Provide a fast, static, GitHub Pages-friendly viewer that is easy to maintain and deploy.
- Support both historical study and symbolic exploration without collapsing the two into one unsupported narrative.

## Why This Architecture

We chose a mostly static architecture because it gives the project reliability, speed, and low operational overhead.

- The database is the source of truth, which keeps the content model normalized and easier to reason about.
- Static JSON export lets the frontend stay lightweight while still consuming rich structured data.
- GitHub Pages hosting keeps the viewer simple to deploy and easy to share.
- A React + Vite frontend gives us a responsive interface without requiring a backend service.

## Technology Stack

### Data and Storage

- `SQLite` for the unified research database.
- Python ingestion scripts to parse source material and build the database.
- Export scripts that convert database tables into frontend-ready JSON.

### Frontend

- `React 19` for the UI layer.
- `Vite` for fast builds and local development.
- `react-router-dom` with `HashRouter` so routing works cleanly on GitHub Pages.
- `react-leaflet` and `Leaflet` for map-based exploration.
- Custom CSS for the project's dark, archival visual style.

### Deployment

- GitHub Actions for automated build and publish.
- GitHub Pages for hosting the static viewer.

## Design Choices

### Evidence-Lane Model

The project uses a 5-lane evidentiary model to keep interpretation honest.

- `A` Primary Record: diaries, magical records, and original texts.
- `B` Autobiography: Crowley's self-reporting and self-mythology.
- `C` Scholarship: modern academic biography and historical analysis.
- `D` Practitioners: later occult and esoteric interpretation.
- `E` Historical/Documentary: verifiable legal, archival, and contextual records.

This matters because Crowley's life is heavily mediated by self-narration, later mythmaking, and competing esoteric readings. The model lets us surface that complexity instead of flattening it.

### Tone and Presentation

The writing style is meant to be academically careful while still respecting the internal logic of the material. That means:

- factual claims are attributed where possible,
- speculation is labeled,
- practitioner language is preserved when it is part of the source context,
- the interface stays clear about what is evidence and what is interpretation.

### Static-First Delivery

We intentionally avoid a backend API for the public viewer. That choice keeps deployment simple, reduces breakage points, and makes the project more sustainable as a long-term research reference.

## What's In the Database

The current model is designed to hold:

- texts and Libri,
- people and associates,
- timeline events,
- locations and travel data,
- dictionary terms,
- initiatory grades,
- Tree of Life correspondences,
- tarot and Qabalistic relationships.

## Current Status

Completed work includes:

- unified database schema,
- ingestion and export scripts,
- the frontend viewer,
- map and timeline exploration,
- automated build and deployment to GitHub Pages.

## Next Steps

Planned improvements are focused on depth, search, and richer navigation:

- build a gematria and isopsephy search experience,
- add a full Tarot explorer for the Thoth deck,
- expand PDF ingestion toward full-text extraction and OCR,
- add relational breadcrumbs so users can trace associative paths,
- continue manual data entry for associates, workings, and supporting metadata,
- improve source coverage and verification as new material is added.

## Data Sources

The project draws from primary texts, biographies, reference works, and digital repositories, including:

- `Liber AL vel Legis`, `Liber ABA`, and `The Vision and the Voice`,
- major biographies such as *Perdurabo* and *The Beast in Berlin*,
- *The Book of Thoth* and *777 and Other Qabalistic Writings*,
- scholarly and archival web resources relevant to Western esotericism and Crowley studies.

## Repository Notes

The live viewer is deployed automatically from the `main` branch. The source of truth for the portal is the repository itself, with the frontend consuming exported data generated from the database build pipeline.
