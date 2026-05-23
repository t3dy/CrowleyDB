from __future__ import annotations

from pathlib import Path

from db_utils import open_db
from prose_enrichment import expand_document_description


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_DIR = ROOT / "archive_markdown"


ARCHIVE_DOCS = [
    (
        "ARC_PERDURABO",
        "Perdurabo: The Life of Aleister Crowley",
        "Richard Kaczynski",
        2012,
        "C",
        ARCHIVE_DIR / "perdurabo.md",
        "Markdown companion extracted from the Kaczynski biography for archive browsing and event indexing.",
    ),
    (
        "ARC_BEAST_IN_BERLIN",
        "Aleister Crowley: The Beast in Berlin",
        "Tobias Churton",
        None,
        "C",
        ARCHIVE_DIR / "beast_in_berlin.md",
        "Markdown companion extracted from the Berlin biography for archive browsing and event indexing.",
    ),
    (
        "ARC_CONFESSIONS",
        "The Confessions of Aleister Crowley",
        "Aleister Crowley",
        None,
        "B",
        ARCHIVE_DIR / "confessions.md",
        "Markdown companion extracted from Crowley's autobiography for archive browsing and event indexing.",
    ),
]


def ingest_archive_markdowns() -> None:
    conn = open_db()
    cursor = conn.cursor()

    for doc_id, title, author, year, lane, file_path, description in ARCHIVE_DOCS:
        enriched_description = expand_document_description(doc_id, title, description)
        cursor.execute(
            """
            INSERT OR REPLACE INTO documents (id, title, author, publication_year, evidentiary_lane, file_path, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (doc_id, title, author, year, lane, str(file_path), enriched_description),
        )

    conn.commit()
    conn.close()
    print(f"Ingested {len(ARCHIVE_DOCS)} archive markdown documents.")


if __name__ == "__main__":
    ingest_archive_markdowns()
