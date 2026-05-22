from __future__ import annotations

import json
import re
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

import fitz
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = Path(r"E:\pdf\crowley")
OUTPUT_DIR = ROOT / "archive_markdown"


@dataclass(frozen=True)
class SourceSpec:
    key: str
    title: str
    author: str
    pattern: str


SOURCES = [
    SourceSpec(
        key="perdurabo",
        title="Perdurabo: The Life of Aleister Crowley",
        author="Richard Kaczynski",
        pattern="*Perdurabo, Revised and Expanded Edition_ The Life of Aleister Crowley*pdf",
    ),
    SourceSpec(
        key="beast_in_berlin",
        title="Aleister Crowley: The Beast in Berlin: Art, Sex, and Magick in the Weimar Republic",
        author="Tobias Churton",
        pattern="*Beast in Berlin*pdf",
    ),
    SourceSpec(
        key="confessions",
        title="The Confessions of Aleister Crowley: An Autohagiography",
        author="Aleister Crowley",
        pattern="*Confessions of Aleister Crowley*pdf",
    ),
]


TOPIC_RULES: list[tuple[str, list[str]]] = [
    ("initiation", ["initiation", "initiate", "golden dawn", "neophyte", "order", "admission"]),
    ("magick", ["magick", "magic", "ceremonial", "ritual", "thelema", "sigil", "invocation", "evocation"]),
    ("drugs", ["drug", "drugs", "opium", "cocaine", "heroin", "hashish", "cannabis", "morphine", "laudanum"]),
    ("sex", ["sex", "sexual", "lover", "mistress", "affair", "brothel", "prostitute", "seduction", "marriage"]),
    ("rivalry", ["rival", "rivalry", "feud", "quarrel", "dispute", "attack", "hostile", "enmity"]),
    ("legal trouble", ["court", "police", "arrest", "lawsuit", "libel", "trial", "prosecution", "charges", "sued"]),
    ("publication", ["publish", "published", "publication", "book", "article", "magazine", "press", "edition"]),
    ("travel", ["travel", "travell", "journey", "voyage", "trip", "arrived", "departed", "sailed", "moved"]),
    ("family", ["mother", "father", "wife", "husband", "child", "children", "daughter", "son", "family"]),
    ("followers", ["follower", "student", "disciples", "acolyte", "associate", "assistant", "secretary"]),
    ("golden dawn", ["golden dawn", "mathers", "yeats", "bennett", "neophyte", "hieron"]),
    ("oto", ["ordo templi orientis", "o.t.o.", "oto"]),
    ("a.a.", ["a.'.a.'", "a.a.", "astrum argentum"]),
    ("abbey", ["abbey of thelema", "cefalu", "café", "abbey"]),
    ("art", ["art", "painting", "painter", "exhibition", "gallery", "canvas"]),
]


KNOWN_PEOPLE = [
    "Aleister Crowley",
    "Richard Kaczynski",
    "Tobias Churton",
    "Rose Kelly",
    "Rose Edith Kelly",
    "Leah Hirsig",
    "Victor Neuburg",
    "Mary Desti",
    "Allan Bennett",
    "Samuel Liddell MacGregor Mathers",
    "MacGregor Mathers",
    "W. B. Yeats",
    "Jane Wolfe",
    "Jack Parsons",
    "Karl Germer",
    "Hanni Jaeger",
    "Raoul Loveday",
    "Oscar Eckenstein",
    "Israel Regardie",
    "James Eshelman",
    "Kenneth Grant",
    "Marco Pasi",
    "Martin Starr",
    "Alvo von Alvensleben",
    "Christopher Isherwood",
    "Jean Ross",
    "Ethel Mannin",
    "Curt Moreck",
    "Henri Birven",
    "Henry Bender",
]


KNOWN_PLACES = [
    "London",
    "Berlin",
    "Paris",
    "Cairo",
    "Cefalu",
    "Cefalù",
    "Boleskine",
    "Hastings",
    "New York",
    "Weida",
    "Hohenleuben",
    "Euston Road",
    "Trinity College",
    "Sicily",
    "India",
    "Switzerland",
    "Loch Ness",
    "Bou Saada",
    "Redhill",
]


def find_source(pattern: str) -> Path:
    matches = sorted(SOURCE_DIR.glob(pattern))
    if not matches:
        raise FileNotFoundError(f"No PDF matched {pattern!r} in {SOURCE_DIR}")
    return matches[0]


def normalize_text(text: str) -> str:
    text = text.replace("\x00", " ")
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.split("\n")]
    collapsed = []
    for line in lines:
        if line:
            collapsed.append(line)
        elif collapsed and collapsed[-1] != "":
            collapsed.append("")
    while collapsed and collapsed[0] == "":
        collapsed.pop(0)
    while collapsed and collapsed[-1] == "":
        collapsed.pop()
    return "\n".join(collapsed)


def page_text(pypdf_reader: PdfReader, fitz_doc: fitz.Document, page_index: int) -> str:
    try:
        text = pypdf_reader.pages[page_index].extract_text() or ""
    except Exception:
        text = ""
    text = normalize_text(text)
    if len(text) < 40:
        try:
            alt = fitz_doc.load_page(page_index).get_text("text") or ""
            alt = normalize_text(alt)
            if len(alt) > len(text):
                text = alt
        except Exception:
            pass
    return text


def first_nonempty_lines(text: str, limit: int = 15) -> list[str]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return lines[:limit]


def detect_heading(text: str) -> str | None:
    lines = first_nonempty_lines(text, 12)
    for line in lines:
        if re.match(r"^(CHAPTER|Chapter)\s+(?:[0-9IVXLC]+|ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN|ELEVEN|TWELVE|THIRTEEN|FOURTEEN|FIFTEEN|SIXTEEN|SEVENTEEN|EIGHTEEN|NINETEEN|TWENTY)\b", line):
            return line
        if re.match(r"^PART\s+[A-Z]+(?:\s*:\s*.*)?$", line):
            return line
        if re.match(r"^(Foreword|Introduction|Acknowledgments|Notes|References|Bibliography|Index|Footnotes|Endnotes|Epilogue|Contents|Dramatis Personae)$", line):
            return line
    return None


def parse_confessions_parts(text_pages: list[str]) -> list[dict]:
    page1 = text_pages[0] if text_pages else ""
    parts: list[dict] = []
    current_part: dict | None = None
    pending_chapter_group: str | None = None
    for line in first_nonempty_lines(page1, 120):
        part_match = re.match(r"^(PART\s+[A-Z]+):\s*(.*)$", line)
        if part_match:
            current_part = {
                "label": part_match.group(1).title(),
                "title": part_match.group(2).strip(),
                "chapter_group": "",
                "start_page": None,
            }
            parts.append(current_part)
            pending_chapter_group = None
            continue
        chapter_match = re.match(r"^(Chapter\s+\d+(?:,\s*\d+)*)(?:\s*\{(\d+)\})?$", line)
        if chapter_match:
            pending_chapter_group = chapter_match.group(1)
            if current_part is not None:
                current_part["chapter_group"] = pending_chapter_group
            if chapter_match.group(2) and current_part is not None and current_part.get("start_page") is None:
                current_part["start_page"] = int(chapter_match.group(2))
            continue
        page_match = re.match(r"^\{(\d+)\}$", line)
        if page_match and current_part is not None and current_part.get("start_page") is None:
            current_part["start_page"] = int(page_match.group(1))
            if pending_chapter_group and not current_part.get("chapter_group"):
                current_part["chapter_group"] = pending_chapter_group
            pending_chapter_group = None
    return [part for part in parts if part.get("start_page")]


def build_page_metadata(text: str) -> dict:
    lower = text.lower()
    people = [name for name in KNOWN_PEOPLE if name.lower() in lower]
    places = [place for place in KNOWN_PLACES if place.lower() in lower]
    topics: list[str] = []
    for topic, keywords in TOPIC_RULES:
        if any(keyword in lower for keyword in keywords):
            topics.append(topic)
    years = sorted(
        {
            year
            for year in re.findall(r"\b(18\d{2}|19\d{2}|20\d{2})\b", text)
            if 1870 <= int(year) <= 1948
        }
    )
    return {"people": people, "places": places, "topics": topics, "years": years}


def make_label(meta: dict, heading: str | None, text: str) -> str:
    people = meta["people"]
    places = meta["places"]
    topics = meta["topics"]
    years = meta["years"]
    if heading and heading.lower().startswith("chapter"):
        base = heading
    elif heading and heading.lower().startswith("part"):
        base = heading
    elif heading:
        base = heading
    else:
        base = "Biographical passage"

    bits: list[str] = []
    if people:
        bits.append(people[0])
        if len(people) > 1 and len(bits) < 2:
            bits.append(people[1])
    if places and len(bits) < 2:
        bits.append(places[0])
    if topics and len(bits) < 3:
        bits.append(topics[0])
    if years and len(bits) < 3:
        bits.append(years[0])
    if bits:
        return f"{base} - " + "; ".join(bits[:3])
    return base


def summarize_page(meta: dict, heading: str | None, page_index: int, text: str) -> str:
    parts = []
    if heading:
        parts.append(f"Starts from {heading.lower()}.")
    if meta["people"]:
        parts.append(f"Mentions {', '.join(meta['people'][:3])}.")
    if meta["places"]:
        parts.append(f"Places include {', '.join(meta['places'][:3])}.")
    if meta["topics"]:
        parts.append(f"Topic signals: {', '.join(meta['topics'][:4])}.")
    if meta["years"]:
        parts.append(f"Date signals: {', '.join(meta['years'][:4])}.")
    if not parts:
        parts.append("Low-signal page; useful mainly as structural continuity.")
    return " ".join(parts)


def build_segment_boundaries(text_pages: list[str], spec: SourceSpec) -> list[dict]:
    boundaries: list[dict] = []
    for idx, text in enumerate(text_pages):
        heading = detect_heading(text)
        if heading:
            boundaries.append({"page": idx + 1, "heading": heading})
    if spec.key == "confessions":
        if text_pages:
            parts = parse_confessions_parts(text_pages)
            if parts:
                boundaries = []
                for p in parts:
                    heading = f"{p['label']}: {p['title']}".strip(": ")
                    if p.get("chapter_group"):
                        heading = f"{heading} ({p['chapter_group']})"
                    boundaries.append({"page": p["start_page"], "heading": heading, "part": p})
    # Remove duplicates and sort.
    uniq: dict[tuple[int, str], dict] = {}
    for boundary in boundaries:
        key = (boundary["page"], boundary["heading"])
        uniq[key] = boundary
    boundaries = sorted(uniq.values(), key=lambda item: item["page"])
    return boundaries


def chapter_ranges(boundaries: list[dict], total_pages: int) -> list[dict]:
    if not boundaries:
        return [{"heading": "Unsegmented narrative", "start_page": 1, "end_page": total_pages}]
    ranges: list[dict] = []
    ordered = sorted(boundaries, key=lambda item: item["page"])
    for idx, boundary in enumerate(ordered):
        start = boundary["page"]
        end = ordered[idx + 1]["page"] - 1 if idx + 1 < len(ordered) else total_pages
        ranges.append({"heading": boundary["heading"], "start_page": start, "end_page": end})
    return ranges


def collect_page_events(text_pages: list[str], ranges: list[dict], spec: SourceSpec) -> list[dict]:
    events: list[dict] = []
    boundary_iter = iter(sorted(ranges, key=lambda item: item["start_page"]))
    current = next(boundary_iter, None)
    next_boundary = next(boundary_iter, None)
    for page_index, text in enumerate(text_pages, start=1):
        while next_boundary and page_index > next_boundary["start_page"]:
            current = next_boundary
            next_boundary = next(boundary_iter, None)
        meta = build_page_metadata(text)
        if len(text.strip()) < 60:
            continue
        if not meta["topics"]:
            continue
        if not (meta["people"] or meta["places"] or meta["years"]):
            continue
        signal_count = len(meta["people"]) + len(meta["places"]) + len(meta["topics"]) + len(meta["years"])
        if current and current["heading"]:
            signal_count += 1
        if signal_count < 3:
            continue
        label = make_label(meta, current["heading"] if current else None, text)
        events.append(
            {
                "id": f"{spec.key}-p{page_index:04d}",
                "page": page_index,
                "label": label,
                "people": meta["people"],
                "places": meta["places"],
                "topics": meta["topics"],
                "years": meta["years"],
                "summary": summarize_page(meta, current["heading"] if current else None, page_index, text),
            }
        )
    return events


def collect_section_summaries(text_pages: list[str], ranges: list[dict]) -> list[dict]:
    sections: list[dict] = []
    for item in ranges:
        start = item["start_page"]
        end = item["end_page"]
        combined = "\n".join(text_pages[start - 1 : end])
        meta = build_page_metadata(combined)
        sections.append(
            {
                "heading": item["heading"],
                "start_page": start,
                "end_page": end,
                "people": meta["people"],
                "places": meta["places"],
                "topics": meta["topics"],
                "years": meta["years"],
                "summary": summarize_page(meta, item["heading"], start, combined),
            }
        )
    return sections


def dedupe(items: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result


def md_escape(text: str) -> str:
    return text.replace("|", "\\|")


def write_markdown(spec: SourceSpec, source_path: Path, output_path: Path, page_texts: list[str]) -> dict:
    reader = PdfReader(str(source_path))
    fitz_doc = fitz.open(str(source_path))

    text_pages = [page_text(reader, fitz_doc, i) for i in range(len(reader.pages))]
    blank_pages = [idx + 1 for idx, text in enumerate(text_pages) if len(text.strip()) < 20]
    boundaries = build_segment_boundaries(text_pages, spec)
    ranges = chapter_ranges(boundaries, len(text_pages))
    sections = collect_section_summaries(text_pages, ranges)
    events = collect_page_events(text_pages, ranges, spec)
    people = dedupe(sorted({person for section in sections for person in section["people"]} | {person for event in events for person in event["people"]}))
    places = dedupe(sorted({place for section in sections for place in section["places"]} | {place for event in events for place in event["places"]}))
    topics = dedupe(sorted({topic for section in sections for topic in section["topics"]} | {topic for event in events for topic in event["topics"]}))

    total_pages = len(text_pages)
    extracted_pages = total_pages - len(blank_pages)
    extraction_mode = "text-layer with fitz fallback"
    limitations = []
    if blank_pages:
        sample = ", ".join(map(str, blank_pages[:12]))
        limitations.append(f"{len(blank_pages)} pages were blank or near-blank in the extracted text layer (sample pages: {sample}).")
    limitations.append("Illustrations, scans, and decorative front matter are not transcribed.")
    if spec.key == "confessions":
        limitations.append("The contents page uses internal reference pagination, so the section map below labels those ranges as book references rather than physical PDF pages.")
    limitations.append("This companion summarizes structure and detected entities; it intentionally does not reproduce full copyrighted prose.")

    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    source_meta = reader.metadata or {}

    lines: list[str] = []
    lines.extend(
        [
            "---",
            f'title: "{spec.title}"',
            f"author: \"{spec.author}\"",
            f'source_file: "{source_path.name}"',
            f'output_kind: "markdown companion"',
            f'generated_utc: "{now}"',
            f"pages_total: {total_pages}",
            f"pages_with_text: {extracted_pages}",
            f'extraction_mode: "{extraction_mode}"',
            f'source_title_raw: "{source_meta.get("/Title", "")}"',
            f'source_author_raw: "{source_meta.get("/Author", "")}"',
            "---",
            "",
            f"# {spec.title}",
            "",
            "## Source",
            f"- Source file: `{source_path}`",
            f"- Source folder: `{SOURCE_DIR}`",
            f"- PDF pages: {total_pages}",
            f"- Text-bearing pages: {extracted_pages}",
            f"- Extraction mode: {extraction_mode}",
            "",
            "## Extraction note",
            "This companion file is a structural and analytical markdown note for the source PDF.",
            "It preserves chapter or part organization, records entity and topic signals, and points to likely biographical events for later relational indexing.",
            "It does not reproduce the full book text.",
            "",
            "## Limitations",
        ]
    )
    for item in limitations:
        lines.append(f"- {item}")
    lines.append("")

    lines.append("## Section map")
    for section in sections:
        people_str = ", ".join(section["people"][:4]) if section["people"] else "none detected"
        places_str = ", ".join(section["places"][:4]) if section["places"] else "none detected"
        topics_str = ", ".join(section["topics"][:6]) if section["topics"] else "none detected"
        years_str = ", ".join(section["years"][:6]) if section["years"] else "none detected"
        if spec.key == "confessions":
            if section["end_page"] >= section["start_page"]:
                page_span = f"book refs. {section['start_page']}-{section['end_page']}"
            else:
                page_span = f"book refs. {section['start_page']}+"
        else:
            page_span = f"pp. {section['start_page']}-{section['end_page']}"
        lines.append(
            f"- **{md_escape(section['heading'])}** `{page_span}` "
            f"| people: {md_escape(people_str)} | places: {md_escape(places_str)} | topics: {md_escape(topics_str)} | years: {md_escape(years_str)}"
        )
        lines.append(f"  - {md_escape(section['summary'])}")
    lines.append("")

    lines.append("## Event index")
    lines.append("Each event entry below is a source-grounded candidate for later timeline ingestion.")
    lines.append("")
    lines.append("| id | page | label | people | places | topics | years |")
    lines.append("| --- | ---: | --- | --- | --- | --- | --- |")
    for event in events:
        people_str = ", ".join(event["people"]) if event["people"] else ""
        places_str = ", ".join(event["places"]) if event["places"] else ""
        topics_str = ", ".join(event["topics"]) if event["topics"] else ""
        years_str = ", ".join(event["years"]) if event["years"] else ""
        lines.append(
            "| "
            + " | ".join(
                [
                    md_escape(event["id"]),
                    str(event["page"]),
                    md_escape(event["label"]),
                    md_escape(people_str),
                    md_escape(places_str),
                    md_escape(topics_str),
                    md_escape(years_str),
                ]
            )
            + " |"
        )
    lines.append("")

    lines.append("## People index")
    if people:
        for person in people:
            lines.append(f"- {md_escape(person)}")
    else:
        lines.append("- none detected")
    lines.append("")

    lines.append("## Places index")
    if places:
        for place in places:
            lines.append(f"- {md_escape(place)}")
    else:
        lines.append("- none detected")
    lines.append("")

    lines.append("## Topic index")
    if topics:
        for topic in topics:
            lines.append(f"- {md_escape(topic)}")
    else:
        lines.append("- none detected")
    lines.append("")

    output_path.write_text("\n".join(lines), encoding="utf-8")

    return {
        "source_file": source_path.name,
        "output_file": str(output_path),
        "pages_total": total_pages,
        "pages_with_text": extracted_pages,
        "events": len(events),
        "sections": len(sections),
        "blank_pages": len(blank_pages),
        "boundaries": boundaries,
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    report_rows: list[dict] = []
    for spec in SOURCES:
        source_path = find_source(spec.pattern)
        output_path = OUTPUT_DIR / f"{spec.key}.md"
        report_rows.append(write_markdown(spec, source_path, output_path, []))

    report = OUTPUT_DIR / "conversion_report.md"
    report_lines = [
        "# Crowley Archive Conversion Report",
        "",
        "This directory contains markdown companions for the selected archive sources.",
        "",
        "| source file | output markdown | pages | text pages | sections | event candidates | blank pages |",
        "| --- | --- | ---: | ---: | ---: | ---: | ---: |",
    ]
    for row in report_rows:
        report_lines.append(
            "| "
            + " | ".join(
                [
                    row["source_file"],
                    row["output_file"].replace(str(ROOT) + "\\", "").replace("\\", "/"),
                    str(row["pages_total"]),
                    str(row["pages_with_text"]),
                    str(row["sections"]),
                    str(row["events"]),
                    str(row["blank_pages"]),
                ]
            )
            + " |"
        )
    report_lines.extend(
        [
            "",
            "## Notes",
            "- Output stays entirely inside the workspace.",
            "- The markdown companions summarize structure and detection indexes rather than reproducing full copyrighted prose.",
            "- Blank or image-heavy pages are noted in the per-file limitations sections.",
        ]
    )
    report.write_text("\n".join(report_lines), encoding="utf-8")


if __name__ == "__main__":
    main()
