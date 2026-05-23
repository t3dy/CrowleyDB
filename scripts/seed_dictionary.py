import sqlite3

from db_utils import open_db
from prose_enrichment import enrich_terms

TERMS = [
    (
        "TRM_001",
        "Thelema",
        93,
        "Greek thelema, meaning will.",
        "The central principle of Crowley's system: discovering and carrying out True Will.",
        "Crowley presents it as the Word of the Law and the governing idea of the Aeon of Horus.",
        "A",
    ),
    (
        "TRM_002",
        "Agape",
        93,
        "Greek agape, meaning love.",
        "A Thelemic key term for love, devotion, and spiritual generosity.",
        "Crowley pairs Agape with Thelema through gematria, making the two 93 words a recurring formula.",
        "A",
    ),
    (
        "TRM_003",
        "Aiwass",
        93,
        "Name recorded by Crowley; etymology is uncertain.",
        "The voice or intelligence who dictated Liber AL vel Legis to Crowley in Cairo.",
        "Aiwass anchors the Cairo Working and Crowley's account of the opening of the new Aeon, even though later readers disagree about how to interpret the experience.",
        "A",
    ),
    (
        "TRM_004",
        "Babalon",
        156,
        "Thelemic spelling of Babylon, reframed through Crowley's symbolic system.",
        "The Scarlet Woman, the mystical city, and a central feminine principle in Thelema.",
        "Babalon appears throughout Crowley's mystical writings as a key figure of liberation, transformation, and initiation.",
        "A",
    ),
    (
        "TRM_005",
        "Nuit",
        None,
        "Egyptian sky goddess spelling used in Liber AL.",
        "The infinite expanse, surrounding space, and cosmic mother in Liber AL.",
        "Nuit is paired with Hadit to form the opening cosmology of The Book of the Law.",
        "A",
    ),
    (
        "TRM_006",
        "Hadit",
        None,
        "Egyptian solar-point spelling used in Liber AL.",
        "The infinitely small point at the center of consciousness in Liber AL.",
        "Hadit complements Nuit as the inward, singular pole of the Thelemic cosmos.",
        "A",
    ),
    (
        "TRM_007",
        "Hoor-paar-kraat",
        None,
        "Greek transliteration of Harpocrates.",
        "The silent and hidden child-form of Horus.",
        "Crowley uses the figure to frame silence, concealment, and the secret center of the self.",
        "A",
    ),
    (
        "TRM_008",
        "Magick",
        None,
        "Crowley's preferred spelling for ritual and spiritual practice.",
        "The science and art of causing change in conformity with Will.",
        "The spelling distinguishes ceremonial and initiatory practice from stage magic or trickery.",
        "A",
    ),
    (
        "TRM_009",
        "Abramelin",
        None,
        "From the Book of Abramelin the Mage.",
        "A demanding magical operation aimed at contacting the Holy Guardian Angel.",
        "Crowley's early attempts to work the system at Boleskine shaped much of his later magical self-understanding.",
        "A",
    ),
    (
        "TRM_010",
        "True Will",
        None,
        "Crowley's philosophical phrase for the authentic course of a life.",
        "The unique purpose or vector each person is meant to discover and fulfill.",
        "The phrase sits at the center of Crowley's ethics: Do what thou wilt shall be the whole of the Law.",
        "A",
    ),
    (
        "TRM_011",
        "93",
        93,
        "A Thelemic number associated with Thelema and Agape.",
        "A shorthand used as both greeting and symbol.",
        "The number appears in letters, signatures, rituals, and modern Thelemic identity.",
        "A",
    ),
    (
        "TRM_012",
        "156",
        156,
        "A Thelemic number associated with Babalon.",
        "A shorthand for the Scarlet Woman and related symbolic work.",
        "The number is often used as a compact marker of the Babalon current.",
        "A",
    ),
    (
        "TRM_013",
        "A.'.A.'.",
        None,
        "Argentum Astrum, the Silver Star order.",
        "Crowley's initiatory order for magical training and advancement.",
        "The portal uses the A.'.A.'. grade system to organize the Tree of Life and several biographies.",
        "A",
    ),
    (
        "TRM_014",
        "O.T.O.",
        None,
        "Ordo Templi Orientis.",
        "An initiatory order tied to ritual, law, and the public spread of Thelema.",
        "The O.T.O. became one of the most visible institutional afterlives of Crowley's work.",
        "E",
    ),
    (
        "TRM_015",
        "Aeon of Horus",
        None,
        "Crowley's historical-spiritual frame for the current age.",
        "The era inaugurated in The Book of the Law and centered on self-discovery and True Will.",
        "The portal treats the phrase as the broad interpretive frame for Crowley's later work.",
        "A",
    ),
    (
        "TRM_016",
        "Holy Guardian Angel",
        None,
        "Common Western esoteric term, central in Crowley's writing.",
        "The guiding intelligence or inward spiritual presence sought in initiatory work.",
        "The aim of the Abramelin operation and much of Crowley's practical magic is to attain this contact.",
        "A",
    ),
    (
        "TRM_017",
        "Scarlet Woman",
        None,
        "Crowley's title for a feminine magical partner and cosmic principle.",
        "A role tied to Babalon, magical partnership, and the drama of the Aeon.",
        "The portal uses the term both for specific historical women and for the larger symbolic current.",
        "A",
    ),
    (
        "TRM_018",
        "Stele of Revealing",
        None,
        "Egyptian funerary stele that Crowley interpreted as a ritual key.",
        "The artifact used to frame the Cairo Working and the reception of Liber AL.",
        "The stele links the museum object, the ritual narrative, and Crowley's new aeon claims.",
        "E",
    ),
    (
        "TRM_019",
        "Book 4",
        None,
        "Crowley's major instructional work, also known as Liber ABA.",
        "A systematic manual of yoga, mysticism, and ceremonial practice.",
        "It remains one of the portal's key works because it translates theory into practice.",
        "A",
    ),
    (
        "TRM_020",
        "The Book of Thoth",
        None,
        "Crowley's tarot manual on the Thoth deck.",
        "A detailed account of Crowley's tarot attributions and symbolic system.",
        "It is one of the best sources for Crowley's Tree of Life revisions and tarot correspondences.",
        "B",
    ),
]

TERMS = enrich_terms(TERMS)


def seed_dictionary():
    conn = open_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM terms")
    cursor.executemany(
        """
        INSERT INTO terms (id, term, gematria_value, etymology, definition, thelemic_significance, evidentiary_lane)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        TERMS,
    )

    conn.commit()
    conn.close()
    print(f"Seeded {len(TERMS)} dictionary terms.")


if __name__ == "__main__":
    seed_dictionary()
