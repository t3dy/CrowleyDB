from __future__ import annotations

from typing import Iterable, Sequence


def _clean(text: str) -> str:
    return " ".join(text.split()).strip().rstrip(".")


def _sentence(text: str) -> str:
    cleaned = _clean(text)
    return f"{cleaned}." if cleaned else ""


def _join(items: Sequence[str]) -> str:
    cleaned = [item for item in items if item]
    if not cleaned:
        return ""
    if len(cleaned) == 1:
        return cleaned[0]
    if len(cleaned) == 2:
        return f"{cleaned[0]} and {cleaned[1]}"
    return ", ".join(cleaned[:-1]) + f", and {cleaned[-1]}"


def _append(*parts: str) -> str:
    sentences = [_sentence(part) for part in parts if part and part.strip()]
    return " ".join(sentence for sentence in sentences if sentence)


def _label_from_slug(slug: str) -> str:
    return slug.replace("_", " ").replace("-", " ").strip().title()


PERSON_ROLE_NOTES = {
    "Self": "The portal uses this biography as its organizing center, since nearly every other section is read against Crowley's own self-presentation.",
    "Major Associate": "Major associates are the people who make the social and ritual record legible, keeping the archive from collapsing into a lone-hero story.",
    "Disciple": "The disciple lane preserves the transmission history, showing how Crowley's methods were received, edited, preserved, or argued over by later readers.",
    "Scholar": "The scholar lane gives the archive a documentary counterweight, tying interpretation back to sources, editions, and criticism.",
    "Rival": "Rivals matter because conflict shaped both the organizations and the legend, and the archive keeps that friction visible.",
    "Thelemic Saint": "The saint lane records the retrospective ancestors that later Thelemites recruited into the symbolic family tree. These figures are read less as fixed biographies than as useful lineages, so the entry keeps their symbolic afterlife and the historical record in dialogue.",
}

PERSON_SPECIAL_NOTES = {
    "PRS_000": "He remains the center of gravity for the portal, but the entry is written to show the poet, the occult system-builder, and the self-mythologizing narrator at once.",
    "PRS_001": "Her role in the Cairo narrative matters because it keeps the revelation story from being reduced to Crowley's later version of it.",
    "PRS_002": "Neuburg gives the archive a bridge between literary modernism and visionary technique, which makes him valuable both as collaborator and witness.",
    "PRS_003": "Hirsig stands for the practical labor of the Abbey as much as for the symbolic role Crowley assigned her, so her biography keeps both sides in view.",
    "PRS_005": "Bennett matters because he shows Crowley learning from a serious practitioner rather than inventing the system in isolation.",
    "PRS_006": "Mathers anchors the order history that Crowley inherited, opposed, and tried to outgrow, so his biography is inseparable from the Golden Dawn fracture.",
    "PRS_007": "Yeats brings literary prestige and temple conflict into the same frame, which makes him one of the clearest links between modern poetry and occult politics.",
    "PRS_008": "Wolfe's testimony matters because it preserves the Abbey from becoming only Crowley's retrospective performance.",
    "PRS_009": "Parsons shows how Crowley's influence crossed into American technical culture and postwar occultism, giving the archive a surprising mid-century afterlife.",
    "PRS_010": "Grant extends Crowley's current into a later and more idiosyncratic tradition, which is why the portal keeps him as a transmission figure rather than a footnote.",
    "PRS_011": "Regardie is central to the survival of the ritual corpus because he helped turn private material into something later readers could actually study.",
    "PRS_012": "Eshelman represents the later organizational reading of Thelema, where structure, training, and formal order become the main interpretive lens.",
    "PRS_013": "Kaczynski's archival method helps separate documentary record from self-mythology, making him one of the portal's most useful modern biographical guides.",
    "PRS_014": "Churton keeps art, sex, and Weimar culture visible around Crowley, which helps the archive resist reducing him to a lone magician.",
    "PRS_015": "Pasi situates Crowley inside the broader history of Western esotericism, giving the portal a strong academic frame for comparison and context.",
    "PRS_016": "Starr matters because editorial labor and correspondence work make the archive itself possible, even when the labor is invisible in the source material.",
}

SAINT_NOTES = {
    "PRS_S001": "Maier helps the portal keep Rosicrucianism, alchemy, and courtly erudition in the same historical lane. His presence matters because Crowley and later readers could treat him as a disciplined scholar, a symbolic alchemist, and a model of learned synthesis all at once. That makes him one of the clearest bridges between Renaissance number lore and the later occult habit of reading texts as layered correspondences.",
    "PRS_S002": "De Molay survives in the archive less as a historical administrator than as a symbol of martyrdom and delayed revenge. Crowleyan and Golden Dawn readers repeatedly make him into a figure of templar endurance, secret transmission, and vindication after destruction. The entry therefore keeps the execution history and the symbolic afterlife in the same frame, since the second is often more important to the occult literature than the first.",
    "PRS_S003": "Rosenkreuz functions as a founding cipher, letting the archive point to mythic origin stories without pretending they are simple biography. His value lies in the way Rosicrucian literature turns hidden authorship into a teaching device, which later occult systems borrow whenever they need an origin that cannot be reduced to ordinary chronology. The portal keeps him as a name whose main force is generative rather than factual.",
    "PRS_S004": "Paracelsus matters because his experimental medicine and symbolic cosmology give Thelemic retrospection a Renaissance ancestor it can actually use. Crowley and his successors could point to Paracelsus when they wanted precedent for a magician-physician who combined practical experiment with a theory of signatures, correspondences, and inner powers. That makes him useful not only as a historical person, but as a pattern for how knowledge can move between science, medicine, and magic.",
    "PRS_S005": "Apollonius supplies a model of holy charisma and philosophical wandering that later occult readers repeatedly recruit into their own lineages. He functions in the archive as a philosophical traveler whose authority comes from encounter, discipline, and transformation rather than office or institution. The entry keeps that double life visible, since he is both a historical figure and a recurrent exemplar for magical self-fashioning.",
}

TOPIC_NOTES = {
    "art": "The archive treats art as more than decoration, because for Crowley it is often a vehicle for doctrine, self-fashioning, and ritual atmosphere. This keeps the page open to performance, illustration, music, and literary design as related parts of the same symbolic field.",
    "birth": "Birth is handled as a threshold topic rather than a biographical fact alone, since the archive often uses it to mark not only chronology but the beginning of a new symbolic cycle. That allows the reader to see how natal events, public beginnings, and initiatory beginnings can echo one another.",
    "death": "The topic preserves the tension between historical death and symbolic transformation, which is especially important in an archive that often treats endings as changes of form. That lets the reader read mortality, legacy, and transmutation together without flattening them into one meaning.",
    "home": "Home matters because it is where ritual, publication, domestic strain, and private myth often collide. The archive keeps the topic alive so the reader can see how houses, lodgings, and temporary rooms become part of the magician's method and not merely the setting around it.",
    "magick": "The entry keeps practical ritual, method, and results in the same frame so the topic behaves like a living practice rather than an abstract keyword.",
    "initiation": "The portal uses the term to track thresholds, admissions, and ordeals, which makes it one of the cleanest ways to read the archive's training logic.",
    "publication": "This topic lets the reader follow texts from composition through print, edition, and circulation, which is essential to Crowley's afterlife on the page.",
    "war": "War is not just a historical backdrop in the archive; it is also one of the pressures that reshapes ritual language, publication, and exile. The topic helps the reader notice how conflict changes the terms on which occult groups imagine discipline, survival, and authority.",
    "travel": "The archive uses travel to map how movement changes the shape of the biography, from ascent and exile to lecture tours and retreat.",
    "will": "Will is one of the archive's most important organizing ideas because it links ethics, aspiration, and disciplined action without collapsing them into ordinary desire. The topic keeps the word available as a live problem, not merely a slogan, so the reader can follow how intention becomes practice.",
    "golden_dawn": "The label stands for more than a single order; it also marks the politics, rituals, and disputes that organized a generation of occult writers.",
    "oto": "The institutional line matters here because the O.T.O. shows how Crowley's ideas moved from private ritual into public membership and administration.",
    "aa": "The A.'.A.'. entry keeps the training ladder visible, making grades, instruction, and aspirant discipline readable as a coherent structure.",
    "ritual": "The archive uses this topic to gather ceremonies, invocations, and formal acts into one search path, which keeps method from dissolving into narrative.",
    "correspondence": "Letters and notes often carry the archive's most immediate evidence, so the topic helps the reader move from published doctrine to lived exchange.",
    "occult_study": "Study is an active force in the archive, since reading, translation, and research often become the method by which the system is assembled.",
    "self_fashioning": "This topic keeps the performance of identity visible, which is crucial because Crowley repeatedly turned his own life into a designed literary object.",
    "public_image": "The archive uses this term to track the difference between lived record and staged persona, especially where fame or scandal distort the evidence.",
    "postwar_reception": "The label lets the reader see how Crowley's work changed after death, when editors, musicians, and occult groups turned him into a usable predecessor.",
    "abbey_of_thelema": "The Abbey topic collects the community, the experiment, and the collapse into one place, letting the reader see the domestic side of the system.",
    "holy_guardian_angel": "The term stays central because it links the practical disciplines of the archive to the inward aim of initiatory work.",
    "cairo_working": "The topic anchors the revelation narrative to a place, a date range, and a textual result, which makes it one of the archive's most important scenes.",
    "sex_magick": "The label keeps the ritual, the scandal, and the doctrine of polarity visible together, which is necessary if the archive is going to stay honest about the subject.",
}


WORK_NOTES = {
    "WKS_001": "The text is treated as the source-note for the whole system, because it names the voices, the law, and the problem of interpretation in one place.",
    "WKS_002": "This work is one of the clearest places where Crowley turns doctrine into a training manual, so the portal reads it as method rather than slogan.",
    "WKS_003": "The desert visionary record gives the archive one of its richest examples of Crowley's attempt to turn experience into a usable spiritual text.",
    "WKS_004": "As a correspondences table, it behaves like a lookup engine for the rest of the system, which is why the portal treats it as infrastructure as much as literature.",
    "WKS_005": "The tarot manual is where Crowley's symbolic revisions become explicit, so the entry keeps the deck, the commentary, and the doctrinal logic together.",
    "WKS_006": "The periodical voice matters because it lets doctrine, ritual, and polemic share the same print space, which is a key move in Crowley's publishing strategy.",
    "WKS_007": "The book compresses teaching into aphorism and paradox, making it a useful example of how Crowley used literary form to discipline interpretation.",
    "WKS_008": "The letter format keeps the work intimate while still making it a public piece of magical pedagogy, which is part of its lasting appeal.",
    "WKS_009": "This issue helps bridge the New York material and the later organizational ambitions of Crowley's system, so it is read as a hinge text.",
    "WKS_010": "The manual remains one of the clearest routes into Crowley's mature magical method because it translates theory into an actual training sequence.",
    "WKS_011": "The autobiography is indispensable, but the portal keeps its self-construction visible so the reader can tell memory from performance.",
    "WKS_012": "The novel matters because it translates occult discipline into fiction, making the Abbey years and the therapeutic rhetoric easier to read together.",
}


TERM_NOTES = {
    "TRM_001": "The term is handled as the central doctrinal word of the archive, so the page keeps law, will, and method in the same frame.",
    "TRM_002": "Its 93 pairing with Thelema gives the term a numerical and literary life, which is why the portal keeps the gematria and the practice visible together.",
    "TRM_003": "Aiwass anchors the Cairo Working and the opening of the new Aeon, even though later readers still disagree about how to interpret the experience.",
    "TRM_004": "Babalon carries both a symbolic and a historical charge, so the entry keeps the Scarlet Woman current and the wider mythic field visible.",
    "TRM_005": "Nuit is paired with Hadit at the start of Liber AL, and the page keeps that cosmology available as an organizing principle rather than a decorative reference.",
    "TRM_006": "Hadit complements Nuit as the inward pole of consciousness, which makes the term central to any reading of Thelemic subjectivity.",
    "TRM_007": "The hidden child-form keeps silence, concealment, and the secret center of the self in play, so the term functions as more than a mythic name.",
    "TRM_008": "Crowley's spelling keeps ritual practice distinct from stage illusion, which matters because the portal tracks method, not trickery.",
    "TRM_009": "The Abramelin operation shaped Crowley's own magical self-understanding, so the term stays tied to both ordeal and aspiration.",
    "TRM_010": "True Will is the ethical core of the system, and the entry keeps it readable as a lived direction rather than a vague inspirational slogan.",
    "TRM_011": "The number 93 functions as a shorthand for Thelema and Agape, which is why it appears so often in letters, signatures, and ritual identity.",
    "TRM_012": "The number 156 keeps the Babalon current compact, letting the archive point to the Scarlet Woman without losing the wider symbolic context.",
    "TRM_013": "The A.'.A.'. is the initiatory framework that gives the Tree of Life and the biographies their training logic.",
    "TRM_014": "The O.T.O. belongs to the institutional afterlife of Thelema, so the page keeps doctrine, membership, and administration in view together.",
    "TRM_015": "The Aeon of Horus is the broad historical frame for Crowley's later work, and the portal uses it as a way to organize the whole archive.",
    "TRM_016": "The Holy Guardian Angel sits at the center of Crowley's practical magic, making it one of the most important terms for understanding his training system.",
    "TRM_017": "The Scarlet Woman is both a role and a symbolic current, so the page keeps specific women and larger mythic patterns in the same line of sight.",
    "TRM_018": "The stele links the museum object, the ritual narrative, and Crowley's new aeon claim, which gives the term a documentary as well as symbolic role.",
    "TRM_019": "Book 4 is one of the archive's clearest manuals of disciplined practice, so the term is treated as a method entry rather than just a title.",
    "TRM_020": "The tarot manual is also a doctrine of revision, and the portal keeps the Tree of Life changes visible beside the deck commentary.",
}


LOCATION_NOTES = {
    "LOC_002": "The house matters because it turns an isolated site into a lasting node in the magical geography of the archive.",
    "LOC_003": "London is the crowded center where publishing, temple politics, and public controversy repeatedly meet. It remains the city where Crowley can be read as a writer, organizer, and nuisance all at once.",
    "LOC_004": "Cairo is the revelation city, and the archive keeps it as the place where the Thelemic narrative takes on documentary form. The museum, the apartment, and the ritual memory all hang on the same coordinate.",
    "LOC_005": "Bou Saada anchors the desert visionary current, making the Algerian work feel rooted in an actual geography of ordeal. The desert setting matters because it turns visionary work into a scene with weather, travel, and strain.",
    "LOC_007": "Cefalu is the place where Crowley tried to turn the system into a lived community, so it carries the weight of both experiment and collapse.",
    "LOC_008": "New York links the archive to American lecture culture, exile, and the postwar afterlife of Crowley's influence. It also keeps the public and the underground versions of the story in the same frame.",
    "LOC_009": "Hastings closes the biographical arc while opening the posthumous archive, which is why the place has such strong documentary weight.",
    "LOC_020": "Pasadena keeps the American occult afterlife visible, especially through the Parsons and Agape Lodge line of reception.",
}

DOCUMENT_NOTES = {
    "ARC_PERDURABO": "The companion keeps the Kaczynski biography searchable as an indexable source text, which is useful because the archive uses it as a documentary baseline for the modern scholarly view. It also preserves a critical counterweight to Crowley's own self-authored myth, so the biography can be read as research rather than homage. That balance matters because the site wants documentary sequence, not just narrative momentum. It gives the reader a stable point of comparison whenever the archive turns from Crowley's voice to later interpretation, and that stability is one of the main jobs of the bibliography.",
    "ARC_BEAST_IN_BERLIN": "The companion preserves the Berlin biography as a readable source node, allowing the site to connect Weimar culture, sex, art, and postwar interpretation in one source lane. Its main value is that it keeps the biography legible as a crafted scholarly object, which helps the archive hold the personal, theatrical, and political Crowley together. The companion also marks the work as one of the site’s best entry points into the social worlds around him. It gives the reader a route into the modern reception history without losing sight of the biographical evidence that anchors that reception.",
    "ARC_CONFESSIONS": "The companion preserves Crowley's autobiography as a source with a clearly marked self-interpretive stance, which is essential because the archive reads it against later scholarship and correspondence. It lets the reader see how Crowley wanted his life to be framed, then compare that framing with the documentary record. That tension is part of the work’s meaning, not a defect to smooth away. The entry therefore functions as both source and warning, since the autobiography is most useful when the reader remembers that self-narration is always a form of occult performance.",
}

TREE_NOTES = {
    19: "Crowley's Lust revision matters because it shows how he turns a traditional virtue into a more forceful and relational emblem.",
    21: "Fortune keeps the wheel and cyclical change in play, giving the portal a path where movement and luck are read as structured forces rather than random events.",
    22: "Adjustment is a balancing path, and the note preserves Crowley's emphasis on measured correction rather than simple moral judgment.",
    24: "Death here is transformation rather than merely ending, which is why the portal keeps the path as a symbolic bridge into renewal.",
    25: "Art is one of the most overtly alchemical paths, so the entry keeps the work of mixture, reconciliation, and timing visible.",
    28: "Crowley's swap is one of the best-known revisions in the Thoth scheme, and the note keeps that editorial decision explicit.",
    31: "The Aeon path marks the shift in symbolic era, so the entry keeps the historical and ritual dimensions in the same line of sight.",
    32: "The Universe path closes the diagram in a way that feels structural rather than merely terminal, which makes it a useful place to preserve Crowley's revisionary logic.",
}


GRADE_FOCUS = {
    1: "the crown as a point beyond ordinary distinction, where the ladder points back toward origin and the student is asked to imagine what lies before form",
    2: "the first stirrings of formative wisdom and duality, where polarity becomes a deliberate subject of work rather than a confusion to escape",
    3: "the shaping of understanding into a coherent structure, so intuition starts to harden into usable architecture",
    4: "the stabilizing of order, law, and disciplined expansion, which makes the grade feel like a house built to hold pressure",
    5: "force, severity, and the practical use of will, where energy is tested by friction and turned into method",
    6: "beauty, balance, and the work of integration, so the grade reads as a crossing point between ambition and harmony",
    7: "the field of desire, victory, and relational force, where achievement has to be understood in relation to others",
    8: "analysis, language, and the refinement of thought, making the grade a place where structure becomes articulate",
    9: "foundation, image, and the subtle ground of practice, where the unseen basis of the work is finally made legible",
    10: "embodiment, routine, and the discipline of ordinary life, so the highest abstraction is tested against repetition and time",
}


def expand_person_biography(person_id: str, name: str, motto: str, role: str, biography: str) -> str:
    extras = [
        PERSON_ROLE_NOTES.get(role),
        PERSON_SPECIAL_NOTES.get(person_id),
        SAINT_NOTES.get(person_id),
        "The biography is written as a relation to the rest of the archive, so the person's significance stays visible through work, correspondence, ritual, or reception rather than through personality alone.",
        f"The portal keeps {name} in this role so the biography remains a readable node in the archive rather than a detached name.",
    ]
    return _append(biography, *extras)


def enrich_people(rows):
    return [
        (
            person_id,
            name,
            motto,
            role,
            birth_year,
            death_year,
            expand_person_biography(person_id, name, motto, role, biography),
        )
        for person_id, name, motto, role, birth_year, death_year, biography in rows
    ]


def expand_document_description(document_id: str, title: str, description: str) -> str:
    note = f"The document anchors the bibliography for {title}, keeping the source lane visible alongside the works and events it supports."
    detail = "The portal treats documents as evidence-bearing companions rather than simple attachments, so the description explains why the text matters to the archive."
    third = DOCUMENT_NOTES.get(document_id, "It remains useful because the archive can cite it directly from the documentary shelf instead of hiding it inside a generic file list.")
    fourth = "That makes the document part of the interpretive path: a reader can move from the source itself to the people, places, and works it helps explain."
    fifth = "The title is not just a filename here; it is the label that lets the archive decide which shelf the source belongs on and what conversation it should enter."
    sixth = "These records are written so they can be quoted as evidence, not just remembered as background, which is why the prose keeps their bibliographic function explicit."
    return _append(description, note, detail, third, fourth, fifth, sixth)


def enrich_documents(rows):
    return [
        (
            document_id,
            title,
            author,
            publication_year,
            evidentiary_lane,
            file_path,
            expand_document_description(document_id, title, description),
        )
        for document_id, title, author, publication_year, evidentiary_lane, file_path, description in rows
    ]


def expand_work_summary(
    work_id: str,
    title: str,
    liber_number,
    class_label: str,
    date_composed: str,
    location_composed: str,
    summary: str,
) -> str:
    extras = []
    if liber_number is not None:
        extras.append(f"It carries Liber number {liber_number}, which helps position it inside the larger literary catalog.")
    if date_composed:
        extras.append(f"Composed around {date_composed} in {location_composed}, it ties the system to a specific historical moment and place.")
    extras.append(WORK_NOTES.get(work_id, f"The portal treats {title} as a core documentary node, keeping doctrine, method, and reception visible at once."))
    extras.append("The entry treats the work as both a historical object and a reading key for later events, so it remains useful beyond the bibliography.")
    extras.append("The title itself is part of the argument in Crowley, so the page keeps publication name, numbering, and doctrinal function in the same line of sight.")
    extras.append("That matters especially for his numbered and titled books, where the publication label can carry as much symbolic force as the content itself.")
    return _append(summary, *extras)


def enrich_works(rows):
    return [
        (
            work_id,
            liber_number,
            title,
            class_label,
            date_composed,
            location_composed,
            expand_work_summary(work_id, title, liber_number, class_label, date_composed, location_composed, summary),
            document_id,
        )
        for work_id, liber_number, title, class_label, date_composed, location_composed, summary, document_id in rows
    ]


def expand_term_definition(term_id: str, term: str, gematria_value, etymology: str, definition: str, thelemic_significance: str) -> tuple[str, str]:
    definition_extras = []
    if etymology:
        definition_extras.append(f"Its etymology keeps the term anchored in {etymology.lower()}.")
    if gematria_value is not None:
        definition_extras.append(f"The gematria value of {gematria_value} keeps the term connected to the numerical layer of the archive.")

    significance_extras = [
        TERM_NOTES.get(term_id, "The portal uses the term as a cross-reference point rather than a loose keyword, so the entry stays tied to works, events, and people."),
        "The page also keeps the term connected to the wider network of names and texts, which is what turns it into an encyclopedia entry rather than a glossary stub.",
        "The writing treats the term as something that can shift between doctrine, ritual usage, and numerical association, because that flexibility is part of how Crowley's system works.",
    ]

    return _append(definition, *definition_extras), _append(thelemic_significance, *significance_extras)


def enrich_terms(rows):
    return [
        (
            term_id,
            term,
            gematria_value,
            etymology,
            *expand_term_definition(term_id, term, gematria_value, etymology, definition, thelemic_significance),
            evidentiary_lane,
        )
        for term_id, term, gematria_value, etymology, definition, thelemic_significance, evidentiary_lane in rows
    ]


def expand_location_significance(location_id: str, name: str, significance: str) -> str:
    note = LOCATION_NOTES.get(
        location_id,
        "The place is treated as a fixed coordinate in the archive, which helps the reader connect movement, conflict, publication, and ritual to an actual geography.",
    )
    return _append(
        significance,
        note,
        f"The portal keeps {name} visible here so the geography of the archive remains concrete rather than abstract.",
        "That extra sentence keeps the location from reading like a map pin and lets it behave like a meaningful setting in the narrative network.",
        "The site matters because Crowley's life repeatedly turns geography into method: where he is changes what the work can become.",
        "The place also acts like a cue for atmosphere and phase, so the archive can read movement, publication, ritual, and conflict as spatially specific rather than generic.",
    )


def enrich_locations(rows):
    return [
        (
            location_id,
            name,
            latitude,
            longitude,
            expand_location_significance(location_id, name, significance),
        )
        for location_id, name, latitude, longitude, significance in rows
    ]


def expand_event_summary(summary: str, topics: Sequence[str], people: Sequence[str], works: Sequence[str], person_labels=None, work_labels=None) -> str:
    person_labels = person_labels or {}
    work_labels = work_labels or {}

    parts = [_sentence(summary)]
    topic_labels = [_label_from_slug(topic) for topic in topics[:3] if topic]
    if topic_labels:
        parts.append(f"It is indexed under {_join(topic_labels)}, which keeps the event visible as part of the archive's larger pattern instead of as a stray date.")
    else:
        parts.append("The record is kept in the chronology as a concrete scene rather than a loose note, so it can be read beside biography, ritual, publication, and reception.")

    person_names = [person_labels.get(person_id) for person_id in people[:3] if person_labels.get(person_id)]
    if person_names:
        parts.append(f"It stays linked to {_join(person_names)}, preserving the social and testimonial edge of the story.")

    work_titles = [work_labels.get(work_id) for work_id in works[:2] if work_labels.get(work_id)]
    if work_titles:
        parts.append(f"The related texts are {_join(work_titles)}, which keeps the written afterlife of the event on the page.")

    parts.append("Read together, the prose gives the event a place in the portal's map of Crowley's life instead of leaving it as a bare calendar fact.")
    parts.append("The extra sentence keeps the event functioning as a hinge between biography, documentary source, and the larger pattern of the archive.")
    parts.append("The title of the event matters too, because Crowley-style history often turns a scene into a named threshold, not just a dated occurrence.")
    return " ".join(parts)


def expand_grade_description(name: str, system: str, tree_path_number: int, description: str) -> str:
    focus = GRADE_FOCUS.get(tree_path_number, "a distinct phase of initiatory training")
    extras = [
        f"The grade is tied to {focus}, which keeps the symbolic number connected to a concrete task.",
        "In the portal it is read as a training stage rather than a ceremonial title, so the practical work stays visible.",
        f"That keeps {name} from becoming a label without context and lets the reader see how {system} structures progression.",
        "The title is part of the pedagogy, so the wording itself helps explain how the ladder turns number into discipline.",
        "The page also treats the grade name as a symbolic instruction, because Crowley often expects the title itself to carry the tone of the lesson.",
        "The numbered equation is therefore part of the meaning, not a decorative flourish, and the page keeps the arithmetic visible beside the ordeal.",
    ]
    if system != "A.'.A.'.":
        extras.append("The alternate system wording is preserved so the historical comparison remains clear.")
    return _append(description, *extras)


def enrich_grades(rows):
    return [
        (
            grade_id,
            name,
            system,
            tree_path_number,
            expand_grade_description(name, system, tree_path_number, description),
        )
        for grade_id, name, system, tree_path_number, description in rows
    ]


def expand_tree_description(
    path_number: int,
    name: str,
    hebrew_letter: str | None,
    astrological_attribution: str | None,
    thoth_tarot_card: str | None,
    is_swapped: int,
    description: str,
) -> str:
    if path_number <= 10:
        extras = [
            f"As {name}, it defines a station of the Tree rather than a transit line, and the colors, names, and angelic attributions turn it into a structural node in the map.",
            "In the portal it reads as a place where doctrine, embodiment, and function meet.",
            "The entry keeps the sephirah visible as an active principle, not just a diagram label, so the reader can read it as part of the system's working anatomy.",
            "The number itself matters because Crowley reads sephirotic structure as a sequence of principles that can be compared, repeated, and revised across the rest of the archive.",
        ]
    else:
        extras = [
            f"The path binds {hebrew_letter} to {astrological_attribution} and {thoth_tarot_card}, making the tarot attribution part of the explanation rather than a hidden assumption.",
        ]
        if is_swapped:
            extras.append("Crowley's swap note is preserved here so the Thoth revision reads as an intentional editorial choice rather than a mistake.")
        if description and "Often called" in description:
            extras.append("The traditional card name is retained so the older Golden Dawn pattern remains legible beside Crowley's revision.")
        extras.append(TREE_NOTES.get(path_number, "The portal keeps the path as a working symbol of transition, relation, and symbolic progression."))
        extras.append("In the portal it functions as a route across the diagram, not just a line on a chart.")
        extras.append("That makes each path read as a practical bridge between states, symbols, and initiatory movement.")
        extras.append("The number of the path is also part of the argument, since Crowley uses the sequence to make the Tree feel like a lived symbolic machine rather than a static chart.")
    return _append(description, *extras)


def enrich_tree_rows(rows):
    enriched = []
    for row in rows:
        if len(row) == 6:
            path_number, hebrew_letter, astrological_attribution, thoth_tarot_card, is_swapped, description = row
            enriched.append(
                (
                    path_number,
                    hebrew_letter,
                    astrological_attribution,
                    thoth_tarot_card,
                    is_swapped,
                    expand_tree_description(path_number, hebrew_letter, hebrew_letter, astrological_attribution, thoth_tarot_card, is_swapped, description),
                )
            )
        elif len(row) == 16:
            (
                path_number,
                name,
                hebrew_letter,
                astrological_attribution,
                thoth_tarot_card,
                gd_tarot_card,
                is_swapped,
                color_scale_king,
                color_scale_queen,
                color_scale_emperor,
                color_scale_empress,
                god_name,
                archangel,
                angel_choir,
                crowley_tweaks,
                description,
            ) = row
            enriched.append(
                (
                    path_number,
                    name,
                    hebrew_letter,
                    astrological_attribution,
                    thoth_tarot_card,
                    gd_tarot_card,
                    is_swapped,
                    color_scale_king,
                    color_scale_queen,
                    color_scale_emperor,
                    color_scale_empress,
                    god_name,
                    archangel,
                    angel_choir,
                    crowley_tweaks,
                    expand_tree_description(path_number, name, hebrew_letter, astrological_attribution, thoth_tarot_card, is_swapped, description),
                )
            )
        else:
            enriched.append(row)
    return enriched


def expand_topic_description(slug: str, label: str, description: str) -> str:
    note = TOPIC_NOTES.get(
        slug,
        "The portal uses the topic as a controlled index term, which means it points to events, people, and works without pretending the idea has only one meaning.",
    )
    bridge = (
        "This keeps the term usable as an encyclopedia heading, because the reader can move from the label to the linked records and back again."
    )
    archive_note = (
        "In the archive the topic functions as a small editorial hinge, joining biography, publication, ritual, and reception without flattening the differences between them."
    )
    use_note = (
        "Because the database is built from events, works, people, and places, the topic is what lets the same material be read from several directions without losing coherence."
    )
    ontology_note = (
        "The label therefore works like a map key: it promises a route through the archive, but it does not exhaust the thing itself, so the prose keeps room for disagreement, overlap, and historical change."
    )
    return _append(description, note, bridge, archive_note, use_note, ontology_note)
