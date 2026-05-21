# CrowleyDB: Initial Conversation Log

## USER PROMPT 1
Study the frameworks of my knowledge portals in Dev\EmeraldTablet and c:\Query\Pat and create a plan for an Aleister Crowley knowledge portal with a dictionary explaining his peculiar take on various occult jargon, biography and timeline, interactive map of his travels and domiciles and adventures, cards with summaries of his works, biographies of his major and minor associates as discovered through his biographies, biographies of his scholarly interpreters and occult disciples and famous fans like Jimmy Page, and summaries of his works and ceremonial magic initiations

## SYSTEM ACTION 1
- Reviewed `c:\Dev\EmeraldTablet` architecture (`EMERALDTABLET.md`, `scripts/build_site.py`).
- Reviewed `c:\QueryPat` architecture (`QueryPatOverview.md`).
- Drafted `CROWLEY_PORTAL_PLAN.md` (saved to artifacts) detailing the 5-stage ingestion pipeline, SQLite data model, evidentiary lane separation (A: Primary Record, B: Autobiography, C: Scholarship, D: Practitioners, E: History), and features (Dictionary, Interactive Map, Timeline, Works cards).

## USER PROMPT 2
I have some Crowley materials at E:\pdf\crowley which I'd like you to ingest into a database with a data ontology designed to capture all the major themes that a scholarly as well as ceremonial magick practitioner approach would take to creating a digital humanities resource for crowley scholars. Bake all the desires and goals I have laid out in my prompts into system files and design style guides for every sort of entry (dictionary, summary, biography, timeline, interactive map popup text etc) and create explicit designs for front end functionality for relational browsing and allowing the user to search, sort by topics or themes or categories of various sorts appropriate to the material. I want tabs/sections for Crowley's Tarot and Qabalah and you can take a page from my TreeTapper project somewhere on the drive (see also TetrisCodex for various golden down software projects that we should be cribbing notes from for displays of the specific Thelemic take or twist on Tarot correspondences and associations on the Tree of Life, Rose Cross Lamen which he printed on the backs of Tarot cards

## SYSTEM ACTION 2
- Searched `c:\Dev` for `TetrisCodex` and `TreeTapper`.
- Read `golden-dawn-correspondences.js` to understand the Qabalistic structure.
- Created `c:\Dev\CrowleyPortal` (later renamed `CROWLEYDB`).
- Drafted system files:
  1. `docs\CROWLEY_ONTOLOGY.md` (defining the Thelemic twists on Qabalah, such as the Tzaddi/Heh swap, and Evidentiary Lanes).
  2. `docs\STYLE_GUIDE.md` (editorial rules for academic detachment vs practitioner empathy, formatting guidelines).
  3. `database\schema.sql` (the SQLite schema with tables for works, persons, terms, timeline events, locations, workings, and thelemic tree mappings).
  4. `docs\FRONTEND_DESIGN.md` (React/Vite architecture, Lane toggling, and Tree of Life interactions).
  5. `scripts\ingest_pdfs.py` (a pipeline script to parse `E:\pdf\crowley` and tag documents into Evidentiary Lanes).

## USER PROMPT 3
crowley's texts are well hosted online create a list of the 20 or 40 best online resources for crowley and OTO/AA studies

## SYSTEM ACTION 3
- Drafted `docs\ONLINE_RESOURCES.md`, detailing 40 of the best digital resources categorized into:
  1. Primary Texts & Archives (Keep Silence, Hermetic.com, OTO-USA, etc.)
  2. Scholarly Research (LAShTAL, CESNUR, Amsterdam Hermetica)
  3. Qabalah & Gematria Tools
  4. Lineages & Practitioner Commentary
  5. Specific Workings & Mysticism
  6. Audio/Video
  7. Specialized Repositories

## USER PROMPT 4
Give me an output INITIALCONVERSATION.md with the full text of this conversation (my prompts should be clearly marked out) and a handover document HANDOVER.md to continue work on a new folder. We should create a CROWLEYDB folder for the project and work in that folder

## SYSTEM ACTION 4
- Renamed `c:\Dev\CrowleyPortal` to `c:\Dev\CROWLEYDB`.
- Generated `INITIALCONVERSATION.md` (this file).
- Generated `HANDOVER.md`.
- Updated the paths in `ingest_pdfs.py` to point to `CROWLEYDB`.
