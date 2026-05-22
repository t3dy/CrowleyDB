import sqlite3

from db_utils import open_db

PEOPLE = [
    (
        "PRS_000",
        "Aleister Crowley",
        "Perdurabo",
        "Self",
        1875,
        1947,
        "Poet, occultist, mountaineer, and polemical writer whose self-authored mythos and ritual corpus define the portal's core subject.",
    ),
    (
        "PRS_001",
        "Rose Edith Kelly",
        "Rose Crowley",
        "Major Associate",
        1874,
        1932,
        "Crowley's first wife and an important figure in the Cairo Working narrative. Her later life is often flattened by hostile or sensational accounts, so the portal keeps her biography explicit.",
    ),
    (
        "PRS_002",
        "Victor Neuburg",
        "Frater Achad",
        "Major Associate",
        1883,
        1940,
        "Poet and magical collaborator who worked with Crowley in the desert Aethyr work and appears throughout the early Thelemic orbit.",
    ),
    (
        "PRS_003",
        "Leah Hirsig",
        "Alostrael",
        "Major Associate",
        1883,
        1975,
        "Crowley's major partner during the Abbey of Thelema years and one of the most important figures in his middle period.",
    ),
    (
        "PRS_004",
        "Mary Desti",
        "Unknown",
        "Major Associate",
        1871,
        1931,
        "A close companion and collaborator whose presence helps anchor the Paris and New York phases of Crowley's American years.",
    ),
    (
        "PRS_005",
        "Allan Bennett",
        "Iehi Aour",
        "Major Associate",
        1872,
        1923,
        "An early mentor in ceremonial magic and Buddhism whose influence helped shape Crowley's A.'.A.'. training structure.",
    ),
    (
        "PRS_006",
        "MacGregor Mathers",
        "S. L. MacGregor Mathers",
        "Rival",
        1854,
        1918,
        "Founder of the Golden Dawn order and one of Crowley's major adversaries during the schism years.",
    ),
    (
        "PRS_007",
        "W. B. Yeats",
        "Demon est Deus Inversus",
        "Rival",
        1865,
        1939,
        "Poet, Golden Dawn member, and a major literary and occult interlocutor in Crowley's early career and temple disputes.",
    ),
    (
        "PRS_008",
        "Jane Wolfe",
        "Soror Estai",
        "Disciple",
        1875,
        1958,
        "American actress turned disciple who gives the portal a clear line into the Abbey of Thelema and the later preservation of Crowley's work.",
    ),
    (
        "PRS_009",
        "Jack Parsons",
        "Thelema's Rocket Man",
        "Disciple",
        1914,
        1952,
        "Rocket engineer and occultist whose story links Crowley studies to mid-century American esotericism.",
    ),
    (
        "PRS_010",
        "Kenneth Grant",
        "Tao",
        "Disciple",
        1924,
        2011,
        "A later occult interpreter whose writings extended Crowley's influence into the Typhonian stream and a highly idiosyncratic post-Crowley current.",
    ),
    (
        "PRS_011",
        "Israel Regardie",
        "Ad Maiorem Adonai Gloriam",
        "Disciple",
        1907,
        1985,
        "Editor, practitioner, and important transmitter of Crowley's ritual and psychological methods to later generations.",
    ),
    (
        "PRS_012",
        "James Eshelman",
        "Unknown",
        "Disciple",
        1945,
        None,
        "A later Thelemic writer and organizer who helps represent the order's modern interpretive afterlife.",
    ),
    (
        "PRS_013",
        "Richard Kaczynski",
        "Unknown",
        "Scholar",
        1950,
        None,
        "Author of one of the most important modern biographies of Crowley and a major archival source for the portal.",
    ),
    (
        "PRS_014",
        "Tobias Churton",
        "Unknown",
        "Scholar",
        1948,
        None,
        "Biographer and historian whose work on Crowley and esoteric history is central to contemporary study.",
    ),
    (
        "PRS_015",
        "Marco Pasi",
        "Unknown",
        "Scholar",
        1970,
        None,
        "Academic historian of Western esotericism whose work helps situate Crowley within broader intellectual history.",
    ),
    (
        "PRS_016",
        "Martin Starr",
        "Unknown",
        "Scholar",
        None,
        None,
        "Editor and scholar whose work on Crowley's correspondence and historical documents is useful for archival research.",
    ),
    (
        "PRS_S001",
        "Michael Maier",
        "Unknown",
        "Thelemic Saint",
        1568,
        1622,
        "A German physician, counselor to Rudolf II, and a learned alchemist and Rosicrucian apologist.",
    ),
    (
        "PRS_S002",
        "Jacques de Molay",
        "Unknown",
        "Thelemic Saint",
        1243,
        1314,
        "The 23rd and last Grand Master of the Knights Templar and a central martyr figure in later occult myth.",
    ),
    (
        "PRS_S003",
        "Christian Rosenkreuz",
        "Frater C.R.C.",
        "Thelemic Saint",
        1378,
        1484,
        "Legendary founder of the Rosicrucian Order and a symbolic ancestor for later occult fraternities.",
    ),
    (
        "PRS_S004",
        "Paracelsus",
        "Unknown",
        "Thelemic Saint",
        1493,
        1541,
        "Swiss physician, alchemist, and astrologer of the German Renaissance.",
    ),
    (
        "PRS_S005",
        "Apollonius of Tyana",
        "Unknown",
        "Thelemic Saint",
        15,
        100,
        "Greek Neopythagorean philosopher and wonder-worker often invoked as an exemplar of sacred wisdom.",
    ),
]

PERSON_EVENTS = [
    ("PRS_000", "EVT_002"),
    ("PRS_000", "EVT_003"),
    ("PRS_000", "EVT_004"),
    ("PRS_000", "EVT_005"),
    ("PRS_000", "EVT_006"),
    ("PRS_000", "EVT_007"),
    ("PRS_000", "EVT_008"),
    ("PRS_000", "EVT_009"),
    ("PRS_000", "EVT_010"),
    ("PRS_000", "EVT_011"),
    ("PRS_001", "EVT_005"),
    ("PRS_002", "EVT_007"),
    ("PRS_003", "EVT_010"),
    ("PRS_004", "EVT_009"),
    ("PRS_005", "EVT_006"),
    ("PRS_006", "EVT_004"),
    ("PRS_007", "EVT_004"),
]


def seed_people():
    conn = open_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM person_workings")
    cursor.execute("DELETE FROM persons")

    cursor.executemany(
        """
        INSERT INTO persons (id, name, magical_motto, role_category, birth_year, death_year, biography)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        PEOPLE,
    )

    cursor.executemany(
        """
        INSERT OR IGNORE INTO person_events (person_id, event_id)
        VALUES (?, ?)
        """,
        PERSON_EVENTS,
    )

    conn.commit()
    conn.close()
    print(f"Seeded {len(PEOPLE)} people and {len(PERSON_EVENTS)} person-event links.")


if __name__ == "__main__":
    seed_people()
