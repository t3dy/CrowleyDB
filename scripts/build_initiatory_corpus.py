from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

from build_site import build_site
from db_utils import open_db


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "frontend" / "public" / "data"
ARCHIVE_DIR = ROOT / "archive_markdown"
DB_DIR = ROOT / "database"

OUTPUT_CATALOG_JSON = DB_DIR / "initiatory_corpus_catalog.json"
OUTPUT_CATALOG_MD = DB_DIR / "initiatory_corpus_catalog.md"
OUTPUT_CLAIMS_JSON = DB_DIR / "initiatory_symbol_claims.json"
OUTPUT_CLAIMS_MD = DB_DIR / "initiatory_symbol_claims.md"


SOURCE_CATALOG = [
    {
        "source_kind": "work",
        "source_ref": "WKS_004",
        "title": "777 and Other Qabalistic Writings",
        "author": "Aleister Crowley",
        "priority_score": 100,
        "focus": "Correspondence tables, title numerology, and the skeleton key for qabalistic comparison.",
        "why_key": "The title is itself a symbolic number and the book is the clearest correspondence engine in the archive.",
        "evidence_lane": "A",
        "file_path": None,
        "search_terms": ["777", "correspondence", "qabalah", "tarot", "sephirah", "number"],
        "notes": "Top priority for symbolic tables and number symbolism.",
    },
    {
        "source_kind": "work",
        "source_ref": "WKS_001",
        "title": "Liber AL vel Legis",
        "author": "Aleister Crowley",
        "priority_score": 98,
        "focus": "Revelation, title number 220, True Will, and the doctrinal frame of the Aeon.",
        "why_key": "The revealed text anchors the whole system, so its title number is the first thing to read.",
        "evidence_lane": "A",
        "file_path": None,
        "search_terms": ["220", "thelema", "will", "nuit", "hadit", "aiwass"],
        "notes": "Primary doctrinal baseline.",
    },
    {
        "source_kind": "work",
        "source_ref": "WKS_005",
        "title": "The Book of Thoth",
        "author": "Aleister Crowley",
        "priority_score": 96,
        "focus": "Tarot revisions, pip symbolism, major arcana attributions, and Crowley's late symbolic synthesis.",
        "why_key": "The tarot manual is the major late commentary on the revised symbolic system.",
        "evidence_lane": "A",
        "file_path": None,
        "search_terms": ["tarot", "thoth", "emperor", "star", "tzaddi", "heh", "pip"],
        "notes": "Essential for tarot and number symbolism.",
    },
    {
        "source_kind": "work",
        "source_ref": "WKS_002",
        "title": "Book 4 / Liber ABA",
        "author": "Aleister Crowley",
        "priority_score": 94,
        "focus": "Training method, yoga, magick, and the grade logic behind disciplined practice.",
        "why_key": "The title carries an explicit liber number and the work explains method as training.",
        "evidence_lane": "A",
        "file_path": None,
        "search_terms": ["4", "yoga", "magick", "training", "grade", "discipline"],
        "notes": "Core initiatory training manual.",
    },
    {
        "source_kind": "work",
        "source_ref": "WKS_003",
        "title": "The Vision and the Voice",
        "author": "Aleister Crowley",
        "priority_score": 92,
        "focus": "The 30 Aethyrs, abyssal work, visionary ascent, and the symbolic density of 418.",
        "why_key": "The work is one of the major visionary records and should stay high in the reading queue.",
        "evidence_lane": "A",
        "file_path": None,
        "search_terms": ["418", "aethyr", "abyss", "vision", "voice", "neuburg"],
        "notes": "Visionary sequence and abyssal symbolism.",
    },
    {
        "source_kind": "work",
        "source_ref": "WKS_008",
        "title": "Liber Aleph vel CXI",
        "author": "Aleister Crowley",
        "priority_score": 90,
        "focus": "Epistolary instruction, 111 symbolism, and the intimate pedagogy of magical succession.",
        "why_key": "The title carries a Roman-numeral signal that should be read as part of the work's symbolic identity.",
        "evidence_lane": "B",
        "file_path": None,
        "search_terms": ["111", "aleph", "letter", "son", "instruction"],
        "notes": "Letter-form work with title numerology.",
    },
    {
        "source_kind": "work",
        "source_ref": "WKS_010",
        "title": "Magick in Theory and Practice",
        "author": "Aleister Crowley",
        "priority_score": 88,
        "focus": "Practical method, force, will, and the translation of theory into training.",
        "why_key": "This is one of the clearest statements of Crowley's mature magical method and should be read alongside the number material.",
        "evidence_lane": "A",
        "file_path": None,
        "search_terms": ["magick", "practice", "theory", "will", "method"],
        "notes": "Practical method and symbolic application.",
    },
    {
        "source_kind": "work",
        "source_ref": "WKS_006",
        "title": "The Equinox, Vol. I, No. 1",
        "author": "Aleister Crowley",
        "priority_score": 86,
        "focus": "Periodical doctrine, ritual publication, and the way serial form becomes part of the teaching system.",
        "why_key": "The serial title matters because Crowley uses publication structure as part of the doctrine.",
        "evidence_lane": "A",
        "file_path": None,
        "search_terms": ["equinox", "publication", "ritual", "instruction", "polemic"],
        "notes": "Serial publication as symbolic form.",
    },
    {
        "source_kind": "work",
        "source_ref": "WKS_007",
        "title": "The Book of Lies",
        "author": "Aleister Crowley",
        "priority_score": 84,
        "focus": "Paradox, joke, aphorism, and compressed symbolic instruction.",
        "why_key": "The title has no explicit numeral, but the compressed form makes it a high-value symbolic text.",
        "evidence_lane": "A",
        "file_path": None,
        "search_terms": ["lies", "paradox", "aphorism", "joke", "symbol"],
        "notes": "Compressed symbolic teaching.",
    },
    {
        "source_kind": "work",
        "source_ref": "WKS_009",
        "title": "The Blue Equinox",
        "author": "Aleister Crowley",
        "priority_score": 82,
        "focus": "Post-war manifesto language, organizational rhetoric, and publication as doctrine.",
        "why_key": "Later issue of The Equinox and a major post-war manifesto volume.",
        "evidence_lane": "A",
        "file_path": None,
        "search_terms": ["equinox", "manifesto", "publication", "ritual", "doctrine"],
        "notes": "Post-war organizational prose.",
    },
    {
        "source_kind": "work",
        "source_ref": "WKS_011",
        "title": "The Confessions of Aleister Crowley",
        "author": "Aleister Crowley",
        "priority_score": 80,
        "focus": "Self-interpretation, self-fashioning, and the title as a program of retrospective myth.",
        "why_key": "The autobiography is indispensable, but the portal keeps its self-construction visible so the reader can tell memory from performance.",
        "evidence_lane": "B",
        "file_path": None,
        "search_terms": ["confession", "autobiography", "self", "life", "memory"],
        "notes": "Retrospective self-interpretation.",
    },
    {
        "source_kind": "work",
        "source_ref": "WKS_012",
        "title": "Diary of a Drug Fiend",
        "author": "Aleister Crowley",
        "priority_score": 78,
        "focus": "Fictionalized discipline, addiction, transformation, and the readable afterlife of training language.",
        "why_key": "The book matters because it translates occult discipline into fiction for a wider audience.",
        "evidence_lane": "B",
        "file_path": None,
        "search_terms": ["drug", "fiend", "discipline", "novel", "transformation"],
        "notes": "Fictionalized symbolic discipline.",
    },
    {
        "source_kind": "document",
        "source_ref": "ARC_PERDURABO",
        "title": "Perdurabo: The Life of Aleister Crowley",
        "author": "Richard Kaczynski",
        "priority_score": 70,
        "focus": "Archival biography that serves as a documentary baseline for the modern scholarly view.",
        "why_key": "The companion keeps the Kaczynski biography searchable as an indexable source text.",
        "evidence_lane": "C",
        "file_path": str(ARCHIVE_DIR / "perdurabo.md"),
        "search_terms": ["crowley", "biography", "archive", "scholarship", "history"],
        "notes": "Companion biography extracted from archive markdown.",
    },
    {
        "source_kind": "document",
        "source_ref": "ARC_BEAST_IN_BERLIN",
        "title": "Aleister Crowley: The Beast in Berlin",
        "author": "Tobias Churton",
        "priority_score": 68,
        "focus": "Weimar culture, sex, art, and the social worlds around Crowley.",
        "why_key": "The companion preserves the Berlin biography as a readable source node.",
        "evidence_lane": "C",
        "file_path": str(ARCHIVE_DIR / "beast_in_berlin.md"),
        "search_terms": ["berlin", "weimar", "sex", "art", "crowley"],
        "notes": "Companion biography extracted from archive markdown.",
    },
    {
        "source_kind": "document",
        "source_ref": "ARC_CONFESSIONS",
        "title": "The Confessions of Aleister Crowley",
        "author": "Aleister Crowley",
        "priority_score": 66,
        "focus": "Self-authored myth and autobiographical performance.",
        "why_key": "The companion preserves Crowley's autobiography as a source with a clearly marked self-interpretive stance.",
        "evidence_lane": "B",
        "file_path": str(ARCHIVE_DIR / "confessions.md"),
        "search_terms": ["confession", "self", "life", "memory", "performance"],
        "notes": "Autobiographical companion extracted from archive markdown.",
    },
]


WORK_CLAIM_MAP = {
    "WKS_001": [
        (
            "title_number",
            "220",
            "Liber AL vel Legis is identified as Liber 220, so the number functions as part of the title's doctrinal identity rather than as a separate decoration.",
            "works.json:WKS_001",
            "The title and summary both mark the text as the central revealed source of Thelema.",
            0.98,
            90,
        ),
        (
            "doctrinal_origin",
            "Thelema",
            "The work frames the Cairo Working, Nuit, Hadit, Aiwass, and True Will as the core doctrinal cluster of the Aeon.",
            "works.json:WKS_001",
            "The summary treats the text as origin story and doctrinal baseline.",
            0.95,
            86,
        ),
    ],
    "WKS_002": [
        (
            "title_number",
            "4",
            "Book 4 / Liber ABA makes the number 4 part of its symbolic title, which suits a work that turns doctrine into training and structure.",
            "works.json:WKS_002",
            "The liber number and title work together as a method label.",
            0.95,
            88,
        ),
        (
            "training_method",
            "discipline",
            "The book teaches yoga, magick, and disciplined practice as a system of method rather than as a set of slogans.",
            "works.json:WKS_002",
            "The summary identifies the work as an instructional manual.",
            0.94,
            82,
        ),
    ],
    "WKS_003": [
        (
            "title_number",
            "418",
            "The Vision and the Voice keeps 418 in the symbolic field of the work, linking visionary sequence to the Great Work tradition.",
            "works.json:WKS_003",
            "The work is central to the abyssal and visionary record.",
            0.94,
            90,
        ),
        (
            "visionary_sequence",
            "30 Aethyrs",
            "The thirty Aethyrs organize the book as a layered visionary ascent whose structure is as important as the text itself.",
            "works.json:WKS_003",
            "The summary identifies the thirty Aethyr work with Victor Neuburg.",
            0.93,
            86,
        ),
    ],
    "WKS_004": [
        (
            "title_number",
            "777",
            "777 and Other Qabalistic Writings is keyed by the number 777, making the title itself a symbolic pointer to correspondence work.",
            "works.json:WKS_004",
            "The summary presents the book as a reference compendium of correspondences.",
            0.98,
            92,
        ),
        (
            "correspondence_engine",
            "qabalah",
            "The book behaves like a lookup engine for tarot, astrology, deity names, and other symbolic cross-links that make Crowley's system navigable.",
            "works.json:WKS_004",
            "The summary explicitly calls it a correspondence table.",
            0.98,
            90,
        ),
    ],
    "WKS_005": [
        (
            "tarot_revision",
            "Thoth",
            "The Book of Thoth is the mature tarot commentary where Crowley's revisions become explicit and the deck is treated as a doctrinal object.",
            "works.json:WKS_005",
            "The summary says the book codifies major revisions in his tarot attributions.",
            0.97,
            90,
        ),
        (
            "pip_symbolism",
            "numbered minors",
            "The work explains the pips as symbolic numbers rather than merely elemental suits, which is central to Crowley's reading practice.",
            "works.json:WKS_005",
            "The summary notes the deck, commentary, and doctrinal logic together.",
            0.95,
            88,
        ),
    ],
    "WKS_006": [
        (
            "publication_structure",
            "serial form",
            "The Equinox uses serial publication as part of the teaching system, showing how printed format becomes a doctrinal device.",
            "works.json:WKS_006",
            "The summary emphasizes doctrine, ritual, and polemic sharing the same print space.",
            0.92,
            82,
        ),
    ],
    "WKS_007": [
        (
            "compressed_symbolism",
            "paradox",
            "The Book of Lies turns paradox and joke into a method of compressed symbolic instruction.",
            "works.json:WKS_007",
            "The summary notes aphorisms and symbolic reversals.",
            0.9,
            80,
        ),
    ],
    "WKS_008": [
        (
            "title_number",
            "111",
            "Liber Aleph vel CXI uses 111 as part of its title signal, making numerology part of the work's identity.",
            "works.json:WKS_008",
            "The title carries a Roman-numeral signal in the book record.",
            0.96,
            88,
        ),
        (
            "epistolary_instruction",
            "magical son",
            "The letter form makes instruction intimate while still treating the work as pedagogical and ceremonial.",
            "works.json:WKS_008",
            "The summary describes the work as a letter-form work of magical instruction.",
            0.9,
            82,
        ),
    ],
    "WKS_009": [
        (
            "postwar_manifesto",
            "Blue Equinox",
            "The Blue Equinox gathers manifestos, rituals, and doctrinal material from Crowley's post-war American career.",
            "works.json:WKS_009",
            "The summary says it bridges the New York material and later organizational ambitions.",
            0.9,
            82,
        ),
    ],
    "WKS_010": [
        (
            "method_statement",
            "practice",
            "Magick in Theory and Practice translates theory into a readable training manual and keeps method, discipline, and symbolic logic aligned.",
            "works.json:WKS_010",
            "The summary identifies the book as a major statement of mature magical theory and practice.",
            0.94,
            88,
        ),
    ],
    "WKS_011": [
        (
            "self_fashioning",
            "autobiography",
            "The Confessions of Aleister Crowley is a self-interpreting life story, useful precisely because its self-construction is visible.",
            "works.json:WKS_011",
            "The summary warns the reader to treat it as self-construction as well as recollection.",
            0.93,
            84,
        ),
    ],
    "WKS_012": [
        (
            "fictional_discipline",
            "addiction",
            "Diary of a Drug Fiend turns discipline, addiction, and transformation into fiction so the training logic can travel beyond the ritual corpus.",
            "works.json:WKS_012",
            "The summary calls it a fictional argument for discipline and transformation.",
            0.9,
            80,
        ),
    ],
}


WORK_TITLE_NOTES = {
    "WKS_001": (
        "title_symbolism",
        "revelatory title",
        "Liber AL vel Legis treats the title as a doctrinal statement: revelation, law, and a numbered liber identity all occupy the same symbolic space.",
        "works.json:WKS_001",
        "The summary treats the text as the central revealed source of Thelema.",
        0.97,
        90,
    ),
    "WKS_002": (
        "title_symbolism",
        "dual title",
        "Book 4 / Liber ABA makes the English title and the liber number work together, so the title itself already stages method, lineage, and training.",
        "works.json:WKS_002",
        "The summary identifies the book as a core initiatory training manual.",
        0.96,
        88,
    ),
    "WKS_003": (
        "title_symbolism",
        "visionary title",
        "The Vision and the Voice names the work as both sight and utterance, which fits a text built around visionary ascent and recorded speech.",
        "works.json:WKS_003",
        "The work is central to the abyssal and visionary record.",
        0.95,
        88,
    ),
    "WKS_004": (
        "title_symbolism",
        "correspondence title",
        "777 and Other Qabalistic Writings makes the number 777 part of the title identity, turning the book into a caption for the whole correspondence method.",
        "works.json:WKS_004",
        "The summary presents the book as a reference compendium of correspondences.",
        0.98,
        92,
    ),
    "WKS_005": (
        "title_symbolism",
        "thoth title",
        "The Book of Thoth invokes the god of writing, measurement, and record, so the title itself frames the tarot book as a symbolic ledger.",
        "works.json:WKS_005",
        "The summary says the book codifies major revisions in his tarot attributions.",
        0.96,
        90,
    ),
    "WKS_006": (
        "title_symbolism",
        "serial title",
        "The Equinox, Vol. I, No. 1 makes publication sequence part of the teaching, so the issue number and volume are themselves symbolic coordinates.",
        "works.json:WKS_006",
        "The summary emphasizes doctrine, ritual, and polemic sharing the same print space.",
        0.93,
        86,
    ),
    "WKS_007": (
        "title_symbolism",
        "paradox title",
        "The Book of Lies turns the title into a paradoxical teaching device, since the book announces falsehood while using contradiction to deliver instruction.",
        "works.json:WKS_007",
        "The summary notes aphorisms and symbolic reversals.",
        0.92,
        84,
    ),
    "WKS_008": (
        "title_symbolism",
        "letter-number title",
        "Liber Aleph vel CXI treats the title as both letter and number, which suits a work that presents instruction in epistolary and symbolic form.",
        "works.json:WKS_008",
        "The title carries a Roman-numeral signal in the book record.",
        0.95,
        88,
    ),
    "WKS_009": (
        "title_symbolism",
        "seasonal title",
        "The Blue Equinox uses a colored season title to mark a phase of publication and doctrine, so the title reads like a symbolic weather report as much as an issue label.",
        "works.json:WKS_009",
        "The summary says it bridges the New York material and later organizational ambitions.",
        0.9,
        82,
    ),
    "WKS_010": (
        "title_symbolism",
        "method title",
        "Magick in Theory and Practice announces its method at the level of the title, binding speculation and training into a single phrase.",
        "works.json:WKS_010",
        "The summary identifies the book as a major statement of mature magical theory and practice.",
        0.95,
        88,
    ),
    "WKS_011": (
        "title_symbolism",
        "autobiographical title",
        "The Confessions of Aleister Crowley says from the title that the life is being offered as a self-interpreting record, not a neutral memoir.",
        "works.json:WKS_011",
        "The summary warns the reader to treat it as self-construction as well as recollection.",
        0.93,
        84,
    ),
    "WKS_012": (
        "title_symbolism",
        "fiction title",
        "Diary of a Drug Fiend makes occult discipline enter the novel as lived example, so the title itself frames addiction, practice, and transformation as narrative material.",
        "works.json:WKS_012",
        "The summary calls it a fictional argument for discipline and transformation.",
        0.9,
        82,
    ),
}


WORK_CONTEXT_NOTES = {
    "WKS_001": (
        "work_symbolic_role",
        "doctrinal center",
        "Liber AL vel Legis functions as the doctrinal center of the archive, so every later number, grade, and attribution has to be read with its revelation frame in mind.",
        "works.json:WKS_001",
        "The summary treats the text as the central revealed source of Thelema.",
        0.95,
        86,
    ),
    "WKS_002": (
        "work_symbolic_role",
        "curricular manual",
        "Book 4 / Liber ABA works like a curriculum, because it turns spiritual labor into a staged sequence of training tasks that can be tracked against the Tree of Life.",
        "works.json:WKS_002",
        "The summary identifies the book as a core initiatory training manual.",
        0.94,
        84,
    ),
    "WKS_003": (
        "work_symbolic_role",
        "visionary record",
        "The Vision and the Voice is more than an account of visions; it is a record of how Crowley uses serial ascent to make initiatory change legible.",
        "works.json:WKS_003",
        "The work is central to the abyssal and visionary record.",
        0.94,
        84,
    ),
    "WKS_004": (
        "work_symbolic_role",
        "correspondence atlas",
        "777 and Other Qabalistic Writings acts as an atlas of correspondences, so later claims about number, tarot, and sephirot can be read as applications of its table logic.",
        "works.json:WKS_004",
        "The summary presents the book as a reference compendium of correspondences.",
        0.97,
        90,
    ),
    "WKS_005": (
        "work_symbolic_role",
        "tarot revision",
        "The Book of Thoth is the place where Crowley's mature tarot logic becomes visible, especially where the pips, the trumps, and the newer attributions all have to fit together.",
        "works.json:WKS_005",
        "The summary says the book codifies major revisions in his tarot attributions.",
        0.96,
        88,
    ),
    "WKS_006": (
        "work_symbolic_role",
        "periodical teaching",
        "The Equinox, Vol. I, No. 1 treats periodical publication as an initiatory medium, so the serial form belongs to the doctrine rather than sitting outside it.",
        "works.json:WKS_006",
        "The summary emphasizes doctrine, ritual, and polemic sharing the same print space.",
        0.92,
        82,
    ),
    "WKS_007": (
        "work_symbolic_role",
        "aphoristic method",
        "The Book of Lies uses contradiction as method, which means its jokes, reversals, and aphorisms should be read as deliberate symbolic instruction.",
        "works.json:WKS_007",
        "The summary notes aphorisms and symbolic reversals.",
        0.92,
        82,
    ),
    "WKS_008": (
        "work_symbolic_role",
        "instructional letter",
        "Liber Aleph vel CXI uses the shape of a letter to make initiation feel intimate, but the number and form keep the teaching tied to the larger symbolic order.",
        "works.json:WKS_008",
        "The summary describes the work as a letter-form work of magical instruction.",
        0.93,
        84,
    ),
    "WKS_009": (
        "work_symbolic_role",
        "manifesto phase",
        "The Blue Equinox marks a later phase of Crowley's public doctrine, so it matters as an index of how the movement shifted after the war.",
        "works.json:WKS_009",
        "The summary says it bridges the New York material and later organizational ambitions.",
        0.9,
        80,
    ),
    "WKS_010": (
        "work_symbolic_role",
        "method synthesis",
        "Magick in Theory and Practice synthesizes theory and training into one work, which is why it remains a core source for how the system should be used.",
        "works.json:WKS_010",
        "The summary identifies the book as a major statement of mature magical theory and practice.",
        0.94,
        86,
    ),
    "WKS_011": (
        "work_symbolic_role",
        "mythic autobiography",
        "The Confessions of Aleister Crowley is valuable because its autobiography is also myth-making, so it reveals how Crowley wants his own life to function as evidence.",
        "works.json:WKS_011",
        "The summary warns the reader to treat it as self-construction as well as recollection.",
        0.93,
        84,
    ),
    "WKS_012": (
        "work_symbolic_role",
        "fictional initiation",
        "Diary of a Drug Fiend stages initiation through fiction, allowing Crowley's discipline language to be tested in a narrative form that reaches beyond the ritual books.",
        "works.json:WKS_012",
        "The summary calls it a fictional argument for discipline and transformation.",
        0.9,
        80,
    ),
}


GRADE_CLAIM_NOTES = {
    "GRD_001": "Neophyte marks the first contact with the elemental ground of the work, so the page keeps the task and the sefirah together.",
    "GRD_002": "Zelator organizes bodily discipline around Yesod, which makes the grade a foundational training stage rather than a title.",
    "GRD_003": "Practicus gives intellect and Qabalah a working place on Hod, keeping analysis tied to the ladder.",
    "GRD_004": "Philosophus ties emotional and moral testing to Netzach, so the number equation remains visible as part of the moral task.",
    "GRD_005": "Adeptus Minor connects to Tiphareth and the Holy Guardian Angel, making the center of the tree a practical goal rather than a decorative symbol.",
    "GRD_006": "Adeptus Major brings force and practical magick into Geburah, where severity becomes application.",
    "GRD_007": "Adeptus Exemptus emphasizes Chesed and the thesis-like articulation of a complete system, not merely attainment.",
    "GRD_008": "Magister Templi centers Binah, crossing the Abyss and the dissolution of the small self.",
    "GRD_009": "Magus belongs to Chokmah and the declaration of a Word, which is why the title is both vocational and symbolic.",
    "GRD_010": "Ipsissimus points to Kether and a condition beyond ordinary comprehension, so the grade reads as an extreme of initiation rather than a prize.",
    "GRD_011": "Golden Dawn usage preserves a comparative frame for the Neophyte ladder and keeps the historical inheritance visible.",
    "GRD_012": "Golden Dawn wording keeps the Thelemic ladder in dialogue with its order predecessor, so the historical comparison remains explicit.",
}


TREE_CLAIM_NOTES = {
    11: ("letter", "Aleph", "Air", "The Fool"),
    12: ("letter", "Beth", "Mercury", "The Magus"),
    13: ("letter", "Gimel", "Moon", "The Priestess"),
    14: ("letter", "Daleth", "Venus", "The Empress"),
    15: ("letter", "Heh", "Aquarius", "The Star"),
    16: ("letter", "Vau", "Taurus", "The Hierophant"),
    17: ("letter", "Zayin", "Gemini", "The Lovers"),
    18: ("letter", "Cheth", "Cancer", "The Chariot"),
    19: ("letter", "Teth", "Leo", "Lust"),
    20: ("letter", "Yod", "Virgo", "The Hermit"),
    21: ("letter", "Kaph", "Jupiter", "Fortune"),
    22: ("letter", "Lamed", "Libra", "Adjustment"),
    23: ("letter", "Mem", "Water", "The Hanged Man"),
    24: ("letter", "Nun", "Scorpio", "Death"),
    25: ("letter", "Samekh", "Sagittarius", "Art"),
    26: ("letter", "Ayin", "Capricorn", "The Devil"),
    27: ("letter", "Pe", "Mars", "The Tower"),
    28: ("letter", "Tzaddi", "Aries", "The Emperor"),
    29: ("letter", "Qoph", "Pisces", "The Moon"),
    30: ("letter", "Resh", "Sun", "The Sun"),
    31: ("letter", "Shin", "Fire", "The Aeon"),
    32: ("letter", "Tau", "Saturn", "The Universe"),
}


TERM_CLAIM_NOTES = {
    "TRM_001": "Thelema is the core doctrinal word, so the term page keeps law, will, and method in the same frame.",
    "TRM_002": "The 93 pairing with Thelema gives the term a numerical and literary life, which is why gematria and practice stay visible together.",
    "TRM_003": "Aiwass anchors the Cairo Working and the opening of the new Aeon, even though later readers still disagree about the experience.",
    "TRM_004": "Babalon carries both a symbolic and a historical charge, so the entry keeps the Scarlet Woman current and the larger mythic field visible.",
    "TRM_005": "Nuit is paired with Hadit at the start of Liber AL, and the page keeps that cosmology available as an organizing principle.",
    "TRM_006": "Hadit complements Nuit as the inward pole of consciousness, which makes the term central to Thelemic subjectivity.",
    "TRM_007": "The hidden child-form keeps silence, concealment, and the secret center of the self in play.",
    "TRM_008": "Crowley's spelling keeps ritual practice distinct from stage illusion, which matters because the portal tracks method, not trickery.",
    "TRM_009": "The Abramelin operation shaped Crowley's magical self-understanding, so the term stays tied to ordeal and aspiration.",
    "TRM_010": "True Will is the ethical core of the system, and the entry keeps it readable as a lived direction rather than a slogan.",
    "TRM_011": "93 functions as shorthand for Thelema and Agape, which is why it appears so often in letters, signatures, and ritual identity.",
    "TRM_012": "156 keeps the Babalon current compact, letting the archive point to the Scarlet Woman without losing the wider symbolic context.",
    "TRM_013": "The A.'.A.'. is the initiatory framework that gives the Tree of Life and the biographies their training logic.",
    "TRM_014": "The O.T.O. belongs to the institutional afterlife of Thelema, so the page keeps doctrine, membership, and administration in view together.",
    "TRM_015": "The Aeon of Horus is the broad historical frame for Crowley's later work, and the portal uses it as a way to organize the whole archive.",
    "TRM_016": "The Holy Guardian Angel sits at the center of Crowley's practical magic, making it one of the most important terms for understanding his training system.",
    "TRM_017": "The Scarlet Woman is both a role and a symbolic current, so the page keeps specific women and larger mythic patterns in the same line of sight.",
    "TRM_018": "The stele links the museum object, the ritual narrative, and Crowley's new aeon claim, which gives the term a documentary as well as symbolic role.",
    "TRM_019": "Book 4 is one of the archive's clearest manuals of disciplined practice, so the term is treated as a method entry rather than just a title.",
    "TRM_020": "The tarot manual is also a doctrine of revision, and the portal keeps the Tree of Life changes visible beside the deck commentary.",
}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def normalize(text: str) -> str:
    return " ".join(text.split()).strip()


def sentencify(text: str) -> str:
    cleaned = normalize(text)
    return f"{cleaned}." if cleaned and not cleaned.endswith(".") else cleaned


def short_excerpt(text: str, limit: int = 240) -> str:
    cleaned = normalize(text)
    if len(cleaned) <= limit:
        return cleaned
    return cleaned[: limit - 1].rstrip() + "…"


def make_source_id(kind: str, ref: str) -> str:
    return f"SRC_{kind.upper()}_{ref.replace('-', '_').replace('.', '_')}"


def make_claim_id(index: int) -> str:
    return f"CLM_{index:05d}"


def build_source_catalog(works: list[dict], documents: list[dict], grades: list[dict], tree: list[dict], terms: list[dict]) -> list[dict]:
    catalog: list[dict] = []
    work_by_id = {row["id"]: row for row in works}
    doc_by_id = {row["id"]: row for row in documents}

    for entry in SOURCE_CATALOG:
        row = {
            **entry,
            "id": make_source_id(entry["source_kind"], entry["source_ref"]),
        }
        if entry["source_kind"] == "work":
            work = work_by_id.get(entry["source_ref"])
            if work:
                row["notes"] = row.get("notes") or work.get("summary")
        elif entry["source_kind"] == "document":
            doc = doc_by_id.get(entry["source_ref"])
            if doc:
                row["notes"] = row.get("notes") or doc.get("description")
        catalog.append(row)

    for grade in grades:
        catalog.append(
            {
                "id": make_source_id("grade", grade["id"]),
                "source_kind": "grade",
                "source_ref": grade["id"],
                "title": grade["name"],
                "author": None,
                "priority_score": 25,
                "focus": f"Initiatory grade and sefirah {grade['tree_path_number']}.",
                "why_key": "Derived grade record from the database ladder.",
                "evidence_lane": "A",
                "file_path": None,
                "search_terms": [grade["name"], str(grade["tree_path_number"])],
                "notes": grade["description"],
            }
        )

    for path in tree:
        catalog.append(
            {
                "id": make_source_id("tree", str(path["path_number"])),
                "source_kind": "tree",
                "source_ref": str(path["path_number"]),
                "title": path["name"],
                "author": None,
                "priority_score": 30,
                "focus": f"Path {path['path_number']} and its attributions.",
                "why_key": "Derived Tree of Life record from the database ladder.",
                "evidence_lane": "A",
                "file_path": None,
                "search_terms": [str(path["path_number"]), path["name"], path.get("hebrew_letter") or ""],
                "notes": path.get("description") or path.get("crowley_tweaks"),
            }
        )

    for term in terms:
        if term.get("gematria_value") is None and not term.get("thelemic_significance"):
            continue
        catalog.append(
            {
                "id": make_source_id("term", term["id"]),
                "source_kind": "term",
                "source_ref": term["id"],
                "title": term["term"],
                "author": None,
                "priority_score": 28,
                "focus": "Dictionary term and symbolic meaning.",
                "why_key": "Derived dictionary term from the database vocabulary.",
                "evidence_lane": term.get("evidentiary_lane") or "A",
                "file_path": None,
                "search_terms": [term["term"], str(term.get("gematria_value") or "")],
                "notes": term.get("thelemic_significance"),
            }
        )

    return catalog


def add_claim(claims: list[dict], source_id: str, claim_type: str, symbol: str, claim_text: str, evidence_locator: str, evidence_excerpt: str, confidence: float = 0.8, priority_score: int = 50, related_symbol: str | None = None, symbol_value: str | None = None, notes: str | None = None) -> None:
    claims.append(
        {
            "source_id": source_id,
            "claim_type": claim_type,
            "symbol": symbol,
            "symbol_value": symbol_value,
            "related_symbol": related_symbol,
            "claim_text": sentencify(claim_text),
            "evidence_locator": evidence_locator,
            "evidence_excerpt": short_excerpt(evidence_excerpt),
            "confidence": confidence,
            "priority_score": priority_score,
            "notes": notes,
        }
    )


def build_work_claims(works: list[dict], claims: list[dict]) -> None:
    for work in works:
        source_id = make_source_id("work", work["id"])
        if work["id"] in WORK_CLAIM_MAP:
            for claim_type, symbol, text, locator, excerpt, confidence, priority in WORK_CLAIM_MAP[work["id"]]:
                add_claim(claims, source_id, claim_type, symbol, text, locator, excerpt, confidence, priority)
        liber_number = work.get("liber_number")
        if isinstance(liber_number, int):
            add_claim(
                claims,
                source_id,
                "liber_number",
                str(liber_number),
                f"{work['title']} is explicitly identified by Liber number {liber_number}, so the number functions as part of the title's symbolic identity.",
                f"works.json:{work['id']}",
                work.get("summary", ""),
                0.95,
                88,
                symbol_value=str(liber_number),
            )
        if work["id"] in WORK_TITLE_NOTES:
            claim_type, symbol, text, locator, excerpt, confidence, priority = WORK_TITLE_NOTES[work["id"]]
            add_claim(
                claims,
                source_id,
                claim_type,
                symbol,
                text,
                locator,
                excerpt,
                confidence,
                priority,
            )
        if work["id"] in WORK_CONTEXT_NOTES:
            claim_type, symbol, text, locator, excerpt, confidence, priority = WORK_CONTEXT_NOTES[work["id"]]
            add_claim(
                claims,
                source_id,
                claim_type,
                symbol,
                text,
                locator,
                excerpt,
                confidence,
                priority,
            )
        if any(char.isdigit() for char in work["title"]):
            numbers = sorted(set(int(token) for token in re.findall(r"\b\d+\b", work["title"])))
            for number in numbers:
                add_claim(
                    claims,
                    source_id,
                    "title_numerology",
                    str(number),
                    f"The title itself carries the number {number}, so Crowley treats the title as a symbolic container rather than a neutral label.",
                    f"works.json:{work['id']}",
                    work["title"],
                    0.9,
                    80,
                    symbol_value=str(number),
                )


def build_document_claims(documents: list[dict], claims: list[dict]) -> None:
    for doc in documents:
        source_id = make_source_id("document", doc["id"])
        add_claim(
            claims,
            source_id,
            "documentary_role",
            doc["title"],
            f"The document is kept as a source companion for {doc['title']}, so the site can cite it as evidence rather than as a free-floating attachment.",
            f"documents.json:{doc['id']}",
            doc.get("description", ""),
            0.86,
            70,
            notes=f"Author: {doc.get('author') or 'unknown'}",
        )


def build_grade_claims(grades: list[dict], claims: list[dict]) -> None:
    for grade in grades:
        source_id = make_source_id("grade", grade["id"])
        tree_number = grade.get("tree_path_number")
        add_claim(
            claims,
            source_id,
            "grade_meaning",
            grade["name"],
            grade.get("description", ""),
            f"grades.json:{grade['id']}",
            grade.get("description", ""),
            0.96,
            78,
            related_symbol=str(tree_number) if tree_number else None,
        )
        if tree_number:
            add_claim(
                claims,
                source_id,
                "sefirah_attribution",
                str(tree_number),
                f"{grade['name']} is explicitly tied to Tree path or sefirah {tree_number}, making the number equation part of the initiatory meaning.",
                f"grades.json:{grade['id']}",
                grade.get("description", ""),
                0.95,
                76,
                symbol_value=str(tree_number),
            )
        if grade["id"] in GRADE_CLAIM_NOTES:
            add_claim(
                claims,
                source_id,
                "grade_commentary",
                grade["name"],
                GRADE_CLAIM_NOTES[grade["id"]],
                f"grades.json:{grade['id']}",
                grade.get("description", ""),
                0.88,
                72,
            )


def build_tree_claims(tree: list[dict], claims: list[dict]) -> None:
    for path in tree:
        source_id = make_source_id("tree", str(path["path_number"]))
        add_claim(
            claims,
            source_id,
            "path_attribution",
            str(path["path_number"]),
            f"Path {path['path_number']} is defined by {path.get('crowley_tweaks') or path.get('description')}, so the path number is inseparable from the attribution Crowley gives it.",
            f"thelemic_tree.json:{path['path_number']}",
            path.get("description", ""),
            0.97,
            80,
            related_symbol=path.get("thoth_tarot_card"),
            symbol_value=str(path["path_number"]),
        )
        note = TREE_CLAIM_NOTES.get(path["path_number"])
        if note:
            kind, hebrew, astro, tarot = note
            if path.get("hebrew_letter"):
                add_claim(
                    claims,
                    source_id,
                    "hebrew_letter",
                    path["hebrew_letter"],
                    f"The path is keyed by Hebrew letter {path['hebrew_letter']}, which lets Crowley treat the letter as an active component of the symbol rather than a label.",
                    f"thelemic_tree.json:{path['path_number']}",
                    path.get("crowley_tweaks", ""),
                    0.95,
                    78,
                    related_symbol=path.get("thoth_tarot_card"),
                )
            if path.get("astrological_attribution"):
                add_claim(
                    claims,
                    source_id,
                    "astrological_attribution",
                    path.get("astrological_attribution"),
                    f"The path is read through {path.get('astrological_attribution')}, so the zodiacal or planetary attribution becomes part of its movement and meaning.",
                    f"thelemic_tree.json:{path['path_number']}",
                    path.get("description", ""),
                    0.95,
                    78,
                    related_symbol=path.get("thoth_tarot_card"),
                )
            if path.get("thoth_tarot_card"):
                add_claim(
                    claims,
                    source_id,
                    "tarot_attribution",
                    path.get("thoth_tarot_card"),
                    f"The Thoth tarot card for this path is {path.get('thoth_tarot_card')}, which keeps tarot attribution in the same symbolic lane as the letter and astrology.",
                    f"thelemic_tree.json:{path['path_number']}",
                    path.get("crowley_tweaks", ""),
                    0.94,
                    76,
                    related_symbol=path.get("gd_tarot_card"),
                )
            if path.get("gd_tarot_card") and path.get("gd_tarot_card") != path.get("thoth_tarot_card"):
                add_claim(
                    claims,
                    source_id,
                    "golden_dawn_revision",
                    path.get("gd_tarot_card"),
                    f"Crowley's revision keeps the Golden Dawn card {path.get('gd_tarot_card')} visible beside the Thoth attribution, making the comparison part of the lesson.",
                    f"thelemic_tree.json:{path['path_number']}",
                    path.get("crowley_tweaks", ""),
                    0.92,
                    74,
                    related_symbol=path.get("thoth_tarot_card"),
                )


def build_term_claims(terms: list[dict], claims: list[dict]) -> None:
    for term in terms:
        source_id = make_source_id("term", term["id"])
        add_claim(
            claims,
            source_id,
            "term_definition",
            term["term"],
            term.get("thelemic_significance") or term.get("definition") or term.get("etymology") or term["term"],
            f"terms.json:{term['id']}",
            term.get("definition", ""),
            0.88,
            70,
            symbol_value=str(term.get("gematria_value") or ""),
        )
        if term.get("gematria_value") is not None:
            add_claim(
                claims,
                source_id,
                "gematria",
                str(term["gematria_value"]),
                f"The term carries gematria value {term['gematria_value']}, so its numerical identity is part of the word's symbolic meaning.",
                f"terms.json:{term['id']}",
                term.get("thelemic_significance", ""),
                0.94,
                76,
                symbol_value=str(term["gematria_value"]),
                related_symbol=term["term"],
            )


def build_archive_passage_claims(claims: list[dict]) -> list[dict]:
    archive_claims: list[dict] = []
    source_id_map = {
        "perdurabo": make_source_id("document", "ARC_PERDURABO"),
        "beast_in_berlin": make_source_id("document", "ARC_BEAST_IN_BERLIN"),
        "confessions": make_source_id("document", "ARC_CONFESSIONS"),
    }
    keyword_sets = {
        "grade": ["neophyte", "zelator", "practicus", "philosophus", "adeptus minor", "adeptus major", "magister templi", "magus", "ipsissimus"],
        "sefirah": ["kether", "chokmah", "binah", "chesed", "geburah", "tiphareth", "netzach", "hod", "yesod", "malkuth"],
        "number": ["93", "111", "156", "220", "418", "666", "777"],
        "tarot": ["fool", "magus", "priestess", "empress", "star", "hierophant", "lovers", "chariot", "lust", "adjustment", "death", "art", "devil", "tower", "moon", "sun", "aeon", "universe"],
        "order": ["golden dawn", "a.'.a.'", "o.t.o.", "liber", "qabalah", "qabal"],
    }

    for path in sorted(ARCHIVE_DIR.glob("*.md")):
        if path.name.lower() == "conversion_report.md":
            continue
        source_id = source_id_map.get(path.stem, make_source_id("document", f"ARC_{path.stem.upper()}"))
        text = path.read_text(encoding="utf-8")
        paragraphs = [para.strip() for para in re.split(r"\n\s*\n+", text) if para.strip()]
        for idx, paragraph in enumerate(paragraphs, 1):
            lowered = paragraph.lower()
            hits: list[tuple[str, str]] = []
            for claim_type, terms in keyword_sets.items():
                for term in terms:
                    if term in lowered:
                        hits.append((claim_type, term))
            if not hits:
                continue
            seen_terms = []
            for claim_type, term in hits[:3]:
                if term in seen_terms:
                    continue
                seen_terms.append(term)
                claim_text = f"The passage uses {term} as part of Crowley's symbolic or historical framing, so it can be read alongside the matching works and commentary."
                if claim_type == "number":
                    claim_text = f"The passage uses the number {term} in a Crowleyan symbolic frame, which is why the number should be tracked across the wider corpus."
                elif claim_type == "grade":
                    claim_text = f"The passage touches grade language through {term}, which helps place the biography or commentary against the initiatory ladder."
                elif claim_type == "sefirah":
                    claim_text = f"The passage touches the sefirah {term.title()}, helping map the text back onto the Tree of Life."
                elif claim_type == "tarot":
                    claim_text = f"The passage touches tarot language through {term}, which can be connected to Crowley's correspondence and card-attribution system."
                elif claim_type == "order":
                    claim_text = f"The passage touches order language through {term}, which matters because Crowley uses institutions as symbolic as well as historical structures."
                archive_claims.append(
                    {
                        "source_id": source_id,
                        "claim_type": f"passage_{claim_type}",
                        "symbol": term,
                        "symbol_value": None,
                        "related_symbol": None,
                        "claim_text": sentencify(claim_text),
                        "evidence_locator": f"{path.name}:p{idx}",
                        "evidence_excerpt": short_excerpt(paragraph, 300),
                        "confidence": 0.62,
                        "priority_score": 35,
                        "notes": "Archive markdown passage hit.",
                    }
                )
    claims.extend(archive_claims)
    return archive_claims


def build_corpus_outputs(works: list[dict], documents: list[dict], grades: list[dict], tree: list[dict], terms: list[dict]) -> tuple[list[dict], list[dict]]:
    sources = build_source_catalog(works, documents, grades, tree, terms)
    claims: list[dict] = []
    build_work_claims(works, claims)
    build_document_claims(documents, claims)
    build_grade_claims(grades, claims)
    build_tree_claims(tree, claims)
    build_term_claims(terms, claims)
    build_archive_passage_claims(claims)
    return sources, claims


def write_catalog_markdown(sources: list[dict], claims: list[dict]) -> None:
    lines = [
        "# Initiatory Corpus Catalog",
        "",
        "This catalog ranks the key Crowley texts and companion sources for ingesting grade, sefirah, number, title, and correspondence claims.",
        "",
        "## Priority Sources",
        "",
    ]
    for item in sorted(sources, key=lambda row: (-row["priority_score"], row["title"])):
        lines.append(f"### {item['title']}")
        lines.append("")
        lines.append(f"- Kind: `{item['source_kind']}`")
        lines.append(f"- Priority: `{item['priority_score']}`")
        lines.append(f"- Focus: {item.get('focus') or 'n/a'}")
        lines.append(f"- Why: {item.get('why_key') or 'n/a'}")
        if item.get("search_terms"):
            terms = ", ".join(term for term in item["search_terms"] if term)
            if terms:
                lines.append(f"- Search terms: {terms}")
        if item.get("notes"):
            lines.append(f"- Notes: {item['notes']}")
        lines.append("")

    lines.extend(["## Claim Summary", ""])
    counter = Counter(claim["claim_type"] for claim in claims)
    for claim_type, count in counter.most_common():
        lines.append(f"- {claim_type}: {count}")
    lines.append("")
    OUTPUT_CATALOG_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def write_claim_markdown(claims: list[dict]) -> None:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for claim in sorted(claims, key=lambda row: (-row["priority_score"], row["symbol"], row["claim_type"])):
        grouped[claim["claim_type"]].append(claim)

    lines = [
        "# Initiatory Symbol Claims",
        "",
        "This file summarizes the structured claims extracted from the source catalog, the Tree of Life, the grades, the terms, and the archive markdown companions.",
        "",
    ]
    for claim_type in sorted(grouped):
        lines.append(f"## {claim_type}")
        lines.append("")
        for claim in grouped[claim_type][:40]:
            lines.append(f"- **{claim['symbol']}** ({claim['source_id']})")
            lines.append(f"  - {claim['claim_text']}")
            lines.append(f"  - Evidence: {claim['evidence_locator']}")
            lines.append("")
    OUTPUT_CLAIMS_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def replace_table(conn, table_name: str, rows: list[dict]) -> None:
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM {table_name}")
    if not rows:
        return
    columns = list(rows[0].keys())
    placeholders = ", ".join(["?"] * len(columns))
    sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"

    def encode(value):
        if isinstance(value, (list, dict)):
            return json.dumps(value, ensure_ascii=False)
        return value

    cursor.executemany(sql, [tuple(encode(row[col]) for col in columns) for row in rows])


def main() -> None:
    works = load_json(DATA_DIR / "works.json")
    documents = load_json(DATA_DIR / "documents.json")
    grades = load_json(DATA_DIR / "grades.json")
    tree = load_json(DATA_DIR / "thelemic_tree.json")
    terms = load_json(DATA_DIR / "terms.json")

    sources, claims = build_corpus_outputs(works, documents, grades, tree, terms)
    claims_with_ids = [{**claim, "id": make_claim_id(index + 1)} for index, claim in enumerate(claims)]

    OUTPUT_CATALOG_JSON.write_text(json.dumps({"version": 1, "sources": sources}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    OUTPUT_CLAIMS_JSON.write_text(json.dumps({"version": 1, "claims": claims_with_ids}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    write_catalog_markdown(sources, claims)
    write_claim_markdown(claims)

    conn = open_db()
    replace_table(conn, "corpus_sources", sources)
    replace_table(conn, "symbol_claims", claims_with_ids)
    conn.commit()
    conn.close()

    build_site()
    print(f"Wrote {len(sources)} corpus sources and {len(claims)} symbol claims.")


if __name__ == "__main__":
    main()
