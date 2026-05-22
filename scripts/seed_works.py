import sqlite3

from db_utils import open_db

DOCUMENTS = [
    ("DOC_WKS_001", "Liber AL vel Legis", "Aleister Crowley", 1904, "A", None, "The received text that opens Crowley's Thelemic system and frames the Cairo Working."),
    ("DOC_WKS_002", "Book 4 / Liber ABA", "Aleister Crowley", 1909, "A", None, "Crowley's instructional manual on yoga, magick, and the disciplined training life."),
    ("DOC_WKS_003", "The Vision and the Voice", "Aleister Crowley", 1909, "A", None, "Record of the thirty Enochian Aethyrs worked in Algeria with Victor Neuburg."),
    ("DOC_WKS_004", "777 and Other Qabalistic Writings", "Aleister Crowley", 1909, "A", None, "Crowley's correspondence tables and Qabalistic reference work."),
    ("DOC_WKS_005", "The Book of Thoth", "Aleister Crowley", 1944, "B", None, "Crowley's late tarot manual for the Thoth deck and its symbolic revisions."),
    ("DOC_WKS_006", "The Equinox, Vol. I, No. 1", "Aleister Crowley", 1909, "A", None, "The first issue of Crowley's magical journal, with instruction, ritual, and polemic."),
    ("DOC_WKS_007", "The Book of Lies", "Aleister Crowley", 1912, "A", None, "Short symbolic chapters, jokes, aphorisms, and doctrinal reversals."),
    ("DOC_WKS_008", "Liber Aleph vel CXI", "Aleister Crowley", 1911, "A", None, "Crowley's letter-form work of magical instruction addressed to his magical son."),
    ("DOC_WKS_009", "The Blue Equinox", "Aleister Crowley", 1919, "A", None, "Later issue of The Equinox and a major post-war manifesto volume."),
    ("DOC_WKS_010", "Magick in Theory and Practice", "Aleister Crowley", 1929, "A", None, "A major statement of Crowley's magical theory and practical method."),
    ("DOC_WKS_011", "The Confessions of Aleister Crowley", "Aleister Crowley", 1929, "B", None, "Crowley's autobiographical life story, written as a self-interpreting narrative."),
    ("DOC_WKS_012", "Diary of a Drug Fiend", "Aleister Crowley", 1922, "B", None, "Crowley's famous novel of discipline, addiction, and transformation."),
]

WORKS = [
    (
        "WKS_001",
        220,
        "Liber AL vel Legis",
        "A",
        "1904-04-08 to 1904-04-10",
        "Cairo, Egypt",
        "The central revealed text of Thelema. It records the Cairo Working and names the core figures of the Aeon of Horus: Nuit, Hadit, Aiwass, and the problem of True Will.",
        "DOC_WKS_001",
    ),
    (
        "WKS_002",
        4,
        "Book 4 / Liber ABA",
        "B",
        "1909-1912",
        "London and Paris",
        "Crowley's major instructional manual on yoga, magick, and the disciplined training life. It remains one of the portal's clearest bridges between doctrine and practice.",
        "DOC_WKS_002",
    ),
    (
        "WKS_003",
        418,
        "The Vision and the Voice",
        "A",
        "1909-11 to 1909-12",
        "Bou Saada, Algeria",
        "The record of the thirty Enochian Aethyrs worked with Victor Neuburg. The text is central to Crowley's account of the Abyss, the Holy Guardian Angel, and the desert visionary current.",
        "DOC_WKS_003",
    ),
    (
        "WKS_004",
        777,
        "777 and Other Qabalistic Writings",
        "Unclassified",
        "1909",
        "London",
        "A reference compendium of correspondences used to map Crowley's Qabalistic and ceremonial system. It is indispensable even though it is not itself a narrative work.",
        "DOC_WKS_004",
    ),
    (
        "WKS_005",
        None,
        "The Book of Thoth",
        "Unclassified",
        "1944",
        "London",
        "Crowley's late tarot manual and commentary on the Thoth deck. It codifies major revisions in his tarot attributions and symbolic language.",
        "DOC_WKS_005",
    ),
    (
        "WKS_006",
        None,
        "The Equinox, Vol. I, No. 1",
        "D",
        "1909",
        "London",
        "The first issue of Crowley's periodical for instruction, ritual publication, and polemic. It is one of the chief print vehicles of his early system.",
        "DOC_WKS_006",
    ),
    (
        "WKS_007",
        None,
        "The Book of Lies",
        "B",
        "1912",
        "London",
        "A dense collection of short chapters, jokes, aphorisms, and symbolic reversals. It rewards close reading and compresses doctrine into literary fragments.",
        "DOC_WKS_007",
    ),
    (
        "WKS_008",
        None,
        "Liber Aleph vel CXI",
        "B",
        "1911",
        "London",
        "A letter-form work addressed to Crowley's magical son. It combines ethical counsel, spiritual instruction, and personal myth.",
        "DOC_WKS_008",
    ),
    (
        "WKS_009",
        None,
        "The Blue Equinox",
        "E",
        "1919",
        "New York City",
        "A later issue of The Equinox that gathers manifestos, rituals, and doctrinal material from Crowley's post-war American career.",
        "DOC_WKS_009",
    ),
    (
        "WKS_010",
        None,
        "Magick in Theory and Practice",
        "B",
        "1929",
        "Paris",
        "One of Crowley's clearest explanations of how his magical theory is meant to operate in practice. It remains a major source for modern readers.",
        "DOC_WKS_010",
    ),
    (
        "WKS_011",
        None,
        "The Confessions of Aleister Crowley",
        "B",
        "1929",
        "Paris",
        "Crowley's autobiography, written as a self-interpreting life story. It is essential, but it must be read with the caution due an unreliable narrator.",
        "DOC_WKS_011",
    ),
    (
        "WKS_012",
        None,
        "Diary of a Drug Fiend",
        "C",
        "1922",
        "Cefalu, Sicily",
        "Crowley's best-known novel, written as a fictional argument for discipline, addiction, and transformation.",
        "DOC_WKS_012",
    ),
]

TERM_WORKS = [
    ("TRM_001", "WKS_001"),
    ("TRM_001", "WKS_002"),
    ("TRM_002", "WKS_001"),
    ("TRM_004", "WKS_003"),
    ("TRM_004", "WKS_005"),
    ("TRM_009", "WKS_002"),
    ("TRM_016", "WKS_002"),
    ("TRM_016", "WKS_008"),
    ("TRM_017", "WKS_003"),
    ("TRM_017", "WKS_005"),
    ("TRM_018", "WKS_001"),
    ("TRM_020", "WKS_005"),
]


def seed_works():
    conn = open_db()
    cursor = conn.cursor()

    cursor.executemany(
        """
        INSERT OR REPLACE INTO documents (id, title, author, publication_year, evidentiary_lane, file_path, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        DOCUMENTS,
    )

    cursor.execute("DELETE FROM term_works")
    cursor.execute("DELETE FROM works")

    cursor.executemany(
        """
        INSERT INTO works (id, liber_number, title, class, date_composed, location_composed, summary, document_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        WORKS,
    )

    cursor.executemany(
        """
        INSERT INTO term_works (term_id, work_id)
        VALUES (?, ?)
        """,
        TERM_WORKS,
    )

    conn.commit()
    conn.close()
    print(f"Seeded {len(WORKS)} works and {len(TERM_WORKS)} term-work links.")


if __name__ == "__main__":
    seed_works()
