# Crowley Archive Conversion Handover

## What was completed

- Converted the three requested source PDFs into markdown companions in this folder.
- Added a minimal Python converter at [scripts/convert_crowley_archive.py](/C:/Dev/CROWLEYDB/scripts/convert_crowley_archive.py).
- Preserved the original PDFs as the source of truth and avoided writing outside the workspace.
- Built a shared conversion report at [archive_markdown/conversion_report.md](/C:/Dev/CROWLEYDB/archive_markdown/conversion_report.md).

## Source files processed

- `Kaczynski, Richard - Perdurabo, Revised and Expanded Edition_ The Life of Aleister Crowley (2012, North Atlantic Books) - libgen.li.pdf`
- `Tobias Churton - Aleister Crowley_ The Beast in Berlin_ Art, Sex, and Magick in the Weimar Republic-Inner Traditions.pdf`
- `Aleister Crowley The Confessions of Aleister Crowley_ An Autohagiography libgen li.pdf`

## Output files

- [archive_markdown/perdurabo.md](/C:/Dev/CROWLEYDB/archive_markdown/perdurabo.md)
- [archive_markdown/beast_in_berlin.md](/C:/Dev/CROWLEYDB/archive_markdown/beast_in_berlin.md)
- [archive_markdown/confessions.md](/C:/Dev/CROWLEYDB/archive_markdown/confessions.md)

## Extraction notes

- All three PDFs had usable text layers.
- The markdown companions are structural notes and indexes, not full text reproductions.
- Blank or image-heavy pages were noted in each file’s limitations section.
- The Confessions source uses internal book-reference pagination in its contents page, so that file labels section spans as book references rather than pretending they are physical PDF pages.

## What the markdown contains

- Metadata headers
- Source and extraction notes
- Section maps
- Event candidate indexes
- People / places / topic indexes

## Recommended next step

Use the event candidate indexes in these markdown companions to seed or expand the biographical timeline, then normalize the named entities into the archive ontology before any bulk ingestion.

## Ready-to-use prompt

> Use the markdown companions in `archive_markdown/` to populate the Crowley biographical timeline with source-grounded events. Normalize people, places, and topics; preserve source page references; deduplicate repeated event candidates; and prefer the strongest evidence when the three books disagree. Keep the archive relationally browsable by topic, person, place, and event type.
