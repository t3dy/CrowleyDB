from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT_DIR = ROOT / "scripts"
OUTPUT_PATH = ROOT / "database" / "topic_taxonomy.json"
from prose_enrichment import expand_topic_description


BASE_TOPICS = [
    ("magick", "Magick", "Operative ceremonial magic, workings, techniques, and practical magical method."),
    ("initiation", "Initiation", "Grades, oaths, ordeals, admissions, and threshold crossings in orders or systems."),
    ("drugs", "Drugs", "Intoxication, addiction, treatment, experimentation, and drug use as a historical fact."),
    ("sex", "Sex", "Sexual conduct, erotic practice, scandal, and sexual relationships when they shape an event."),
    ("rivalry", "Rivalry", "Conflict, dispute, polemic, competition, or antagonism with a person or group."),
    ("legal_trouble", "Legal Trouble", "Arrests, trials, prosecutions, police attention, censorship, or legal consequences."),
    ("publication", "Publication", "Writing, printing, publishing, editing, serialization, and the release of texts."),
    ("travel", "Travel", "Journeys, relocation, expeditions, border crossings, and movement that matters biographically."),
    ("followers", "Followers", "Students, disciples, patrons, acolytes, and other people who attach themselves to his current."),
    ("wife", "Wife", "Events involving a spouse or wife, including marriage, separation, conflict, and collaboration."),
    ("children", "Children", "Events involving children, parenting, custody, family life, loss, or inheritance."),
    ("lovers", "Lovers", "Romantic or sexual partners, affairs, household arrangements, and intimate entanglements."),
    ("golden_dawn", "Golden Dawn", "The Hermetic Order of the Golden Dawn, its members, schism, rituals, and afterlife in his career."),
    ("oto", "O.T.O.", "Ordo Templi Orientis membership, administration, doctrine, disputes, and institutional history."),
    ("aa", "A.'.A.'.", "The A.'.A.'. system, its grades, offices, aspirants, and instructional literature."),
    ("politics", "Politics", "Political affiliations, propaganda, state power, war, nationalism, espionage, and ideology."),
    ("ritual", "Ritual", "Ceremonies, invocations, liturgies, working sequences, and formal magical acts."),
    ("correspondence", "Correspondence", "Letters, telegrams, notes, and epistolary exchanges that reveal developments or relationships."),
    ("occult_study", "Occult Study", "Reading, research, translation, lecturing, library work, and study of esoteric systems."),
    ("finance", "Finance", "Money, debts, patronage, earnings, bequests, bankruptcy, accounts, and material support."),
    ("health", "Health", "Illness, injury, exhaustion, treatment, addiction, convalescence, and bodily decline or recovery."),
]


SPECIAL_LABELS = {
    "aa": "A.'.A.'.",
    "oto": "O.T.O.",
    "golden_dawn": "Golden Dawn",
    "cairo_working": "Cairo Working",
    "holy_guardian_angel": "Holy Guardian Angel",
    "sex_magick": "Sex Magick",
    "postwar_reception": "Postwar Reception",
    "public_magic": "Public Magic",
    "self_fashioning": "Self-Fashioning",
    "public_image": "Public Image",
    "crown": "Crown",
    "legal_trouble": "Legal Trouble",
    "abbey_of_thelema": "Abbey of Thelema",
}


def slug_to_label(slug: str) -> str:
    if slug in SPECIAL_LABELS:
        return SPECIAL_LABELS[slug]
    return re.sub(r"[_-]+", " ", slug).strip().title()


def slug_to_description(slug: str, label: str) -> str:
    base = re.sub(r"[_-]+", " ", slug).strip()
    return expand_topic_description(slug, label, f"Controlled topic tag for events involving {base.lower()}.")


def main() -> None:
    sys.path.insert(0, str(SCRIPT_DIR))
    import seed_timeline

    unique_topics = sorted({topic for event in seed_timeline.EVENTS for topic in event["topics"]})
    ordered = []
    seen = set()

    for slug, label, description in BASE_TOPICS:
        if slug in unique_topics:
            ordered.append(
                {
                    "id": f"topic_{slug}",
                    "slug": slug,
                    "label": label,
                    "description": expand_topic_description(slug, label, description),
                    "sort_order": len(ordered) * 10 + 10,
                }
            )
            seen.add(slug)

    remainder = sorted(slug for slug in unique_topics if slug not in seen)
    for slug in remainder:
        label = slug_to_label(slug)
        ordered.append(
            {
                "id": f"topic_{slug.replace('-', '_')}",
                "slug": slug,
                "label": label,
                "description": slug_to_description(slug, label),
                "sort_order": len(ordered) * 10 + 10,
            }
        )

    OUTPUT_PATH.write_text(
        json.dumps({"version": 1, "topics": ordered}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT_PATH} with {len(ordered)} topics.")


if __name__ == "__main__":
    main()
