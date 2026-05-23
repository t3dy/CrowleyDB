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
        "Crowley's first wife and an important figure in the Cairo Working narrative. Her later life is often flattened by hostile or sensational accounts, so the portal keeps her biography explicit and keeps her role separate from Crowley's later mythmaking.",
    ),
    (
        "PRS_002",
        "Victor Neuburg",
        "Frater Achad",
        "Major Associate",
        1883,
        1940,
        "Poet and magical collaborator who worked with Crowley in the desert Aethyr work and appears throughout the early Thelemic orbit. Neuburg gives the portal a strong bridge between literary modernism and Crowley's visionary method.",
    ),
    (
        "PRS_003",
        "Leah Hirsig",
        "Alostrael",
        "Major Associate",
        1883,
        1975,
        "Crowley's major partner during the Abbey of Thelema years and one of the most important figures in his middle period. She was both a symbolic role-holder and a practical organizer inside the Abbey's daily life.",
    ),
    (
        "PRS_004",
        "Mary Desti",
        "Unknown",
        "Major Associate",
        1871,
        1931,
        "Singer, traveler, and social connector whose role in Paris and New York helps anchor Crowley's American years and the Paris Working milieu. Desti matters here because she sits at the junction of performance, occult society, and Crowley's social mobility.",
    ),
    (
        "PRS_005",
        "Allan Bennett",
        "Iehi Aour",
        "Major Associate",
        1872,
        1923,
        "An early mentor in ceremonial magic and Buddhism whose influence helped shape Crowley's A.'.A.'. training structure. Bennett is one of the clearest examples of Crowley learning from another practitioner rather than merely inventing a system in isolation.",
    ),
    (
        "PRS_006",
        "MacGregor Mathers",
        "S. L. MacGregor Mathers",
        "Rival",
        1854,
        1918,
        "Founder of the Golden Dawn order and one of Crowley's major adversaries during the schism years. He represents the hierarchical and combative side of the order Crowley both inherited and tried to outgrow.",
    ),
    (
        "PRS_007",
        "W. B. Yeats",
        "Demon est Deus Inversus",
        "Rival",
        1865,
        1939,
        "Poet, Golden Dawn member, and a major literary and occult interlocutor in Crowley's early career and temple disputes. Yeats matters because he brings literary prestige, symbolic criticism, and a very public version of the occult debate.",
    ),
    (
        "PRS_008",
        "Jane Wolfe",
        "Soror Estai",
        "Disciple",
        1875,
        1958,
        "American actress turned disciple who gives the portal a clear line into the Abbey of Thelema and the later preservation of Crowley's work. Her testimony helps anchor the practical reality of the Abbey beyond Crowley's own account.",
    ),
    (
        "PRS_009",
        "Jack Parsons",
        "Thelema's Rocket Man",
        "Disciple",
        1914,
        1952,
        "Rocket engineer and occultist whose story links Crowley studies to mid-century American esotericism. Parsons shows how Crowley's influence crossed from ritual circles into technical and countercultural American modernity.",
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
        "Editor, practitioner, and important transmitter of Crowley's ritual and psychological methods to later generations. Regardie is central to the survival of the ritual corpus because he helped turn private material into something later readers could actually study.",
    ),
    (
        "PRS_012",
        "James Eshelman",
        "Unknown",
        "Disciple",
        1945,
        None,
        "A later Thelemic writer and organizer whose work emphasizes practical order structure, formal training, and the modern afterlife of Crowley's initiatory system. He matters here as a representative of the later organizational reading of Crowley's legacy.",
    ),
    (
        "PRS_013",
        "Richard Kaczynski",
        "Unknown",
        "Scholar",
        1950,
        None,
        "Author of a major modern biography of Crowley whose archival approach helps separate documentary record from self-mythology. Kaczynski is useful to the portal because his method is explicitly documentary and relational rather than devotional.",
    ),
    (
        "PRS_014",
        "Tobias Churton",
        "Unknown",
        "Scholar",
        1948,
        None,
        "Biographer and historian whose work emphasizes art, sex, occult culture, and the social worlds surrounding Crowley. Churton helps the portal keep the surrounding cultural scene visible instead of reducing Crowley to an isolated magician.",
    ),
    (
        "PRS_015",
        "Marco Pasi",
        "Unknown",
        "Scholar",
        1970,
        None,
        "Academic historian of Western esotericism whose work situates Crowley inside larger histories of modern religion and occultism. Pasi is valuable for keeping Crowley inside the broader study of esotericism rather than treating him as a lone outlier.",
    ),
    (
        "PRS_016",
        "Martin Starr",
        "Unknown",
        "Scholar",
        None,
        None,
        "Editor and scholar whose documentary work on Crowley correspondence and ephemera has made later archival study much easier. Starr is the sort of editor whose labor makes the portal's own documentary browsing possible.",
    ),
    (
        "PRS_S001",
        "Michael Maier",
        "Unknown",
        "Thelemic Saint",
        1568,
        1622,
        "German physician, court counselor, and learned alchemist whose Rosicrucian writings made him a natural ancestor for later occult lineages.",
    ),
    (
        "PRS_S002",
        "Jacques de Molay",
        "Unknown",
        "Thelemic Saint",
        1243,
        1314,
        "The last Grand Master of the Knights Templar and a martyr figure whose symbolic afterlife far exceeds the historical record.",
    ),
    (
        "PRS_S003",
        "Christian Rosenkreuz",
        "Frater C.R.C.",
        "Thelemic Saint",
        1378,
        1484,
        "Legendary Rosicrucian founder and literary cipher, invoked less as a person than as a mythic origin for initiatory fraternities.",
    ),
    (
        "PRS_S004",
        "Paracelsus",
        "Unknown",
        "Thelemic Saint",
        1493,
        1541,
        "Swiss physician, alchemist, and astrologer whose medicine and cosmology fed later esoteric and Thelemic admiration alike. Paracelsus appears as an ancestral figure because his blend of medicine, symbolism, and experimental thought fits Crowley's retrospective canon well.",
    ),
    (
        "PRS_S005",
        "Apollonius of Tyana",
        "Unknown",
        "Thelemic Saint",
        15,
        100,
        "Greek Neopythagorean philosopher and wonder-worker often invoked as an exemplar of sacred wisdom, ascent, and holy charisma.",
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
