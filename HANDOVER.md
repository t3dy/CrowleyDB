# CrowleyDB Handover

## Current State

- The portal is deployed from commit `92d2a14` on `main`.
- GitHub Pages build is green.
- The archive PDFs for Kaczynski, Churton, and *The Confessions of Aleister Crowley* have markdown companions in `archive_markdown/` and are ingested into the `documents` table.
- The timeline has been expanded to 64 events with 95 person-event links.
- A controlled topic ontology now exists with 99 normalized tags and an `event_topics` join table.
- The frontend timeline/map page now has a topic filter, and the Works and People pages are wired into navigation.

## Key Files

- `database/schema.sql`
- `database/topic_taxonomy.json`
- `docs/CROWLEY_ONTOLOGY.md`
- `docs/STYLE_GUIDE.md`
- `docs/CONTENT_FRAMEWORK.md`
- `scripts/seed_timeline.py`
- `scripts/seed_people.py`
- `scripts/seed_dictionary.py`
- `scripts/seed_works.py`
- `scripts/ingest_archive_markdowns.py`
- `scripts/generate_topic_taxonomy.py`
- `scripts/build_site.py`
- `frontend/src/App.tsx`
- `frontend/src/pages/TreeOfLife.tsx`
- `frontend/src/pages/Works.tsx`
- `frontend/src/pages/People.tsx`

## What Landed

### Archive

- Converted the requested archive sources into markdown companions:
  - `archive_markdown/perdurabo.md`
  - `archive_markdown/beast_in_berlin.md`
  - `archive_markdown/confessions.md`
- Added conversion notes and an archive report.

### Ontology

- Added normalized topics support:
  - `topics`
  - `event_topics`
- Added a canonical topic seed file:
  - `database/topic_taxonomy.json`
- Expanded the topic vocabulary so the timeline can be browsed by:
  - core themes like `magick`, `initiation`, `drugs`, `sex`, `rivalry`, `legal_trouble`, `publication`, `travel`
  - life-course facets like `birth`, `family`, `education`, `rebellion`, `exile`, `reception`, and related tags

### Timeline and UI

- Expanded the timeline seed to a denser chronology and connected it to people and topics.
- Added a topic dropdown and topic chips to the biography/timeline page.
- Added a People page and improved the Works page summaries.
- Added the Tree of Life quiz-board redesign with attribution modes, token bank, and feedback loop.

## Working Database

- The writable build database is created under `C:\Dev\CROWLEYDB\.tmp\crowley_unified_rebuilt.sqlite`.
- The repo still has the original tracked database file, but the build and seed scripts now target the workspace-local rebuild path.
- `scripts/build_site.py` exports the frontend JSON from that rebuild database.

## Remaining Cleanup

- Temporary artifacts are still untracked in the workspace:
  - `.tmp/`
  - `database/crowley_unified_rebuilt.sqlite`
  - `database/crowley_unified_rebuilt.sqlite-journal`
  - `scripts/__pycache__/`
- These are build/runtime artifacts and do not need to be committed.

## If You Continue

1. Tighten the timeline topic mapping if you want fewer, broader tags.
2. Add a dedicated topic browser page so users can click a topic and see all matching events.
3. Decide whether the archive markdown should be published as a browsable in-app section or remain a backend research corpus.
4. Consider pruning or formalizing the extra life-course topic facets if you want a smaller ontology.

## Next-Agent Prompt

Use this if you are handing the project to another agent:

> Continue refining CrowleyDB from the current deployed state. Focus first on the relational browsing layer: make the topic ontology easier to browse in the UI, tighten any overly broad topic labels, and make sure archive-derived documents, timeline events, and people all cross-link cleanly. Preserve the existing deployable build, do not remove the archive markdown companions, and keep the evidentiary lanes visible everywhere. If you change the topic set, update `database/topic_taxonomy.json`, the seed scripts, the exported JSON, and the docs together so they stay in sync.

