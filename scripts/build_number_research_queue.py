from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "frontend" / "public" / "data"
ARCHIVE_DIR = ROOT / "archive_markdown"
OUTPUT_JSON = ROOT / "database" / "number_research_queue.json"
OUTPUT_MD = ROOT / "database" / "number_research_queue.md"


CANONICAL_PRIORITY_NUMBERS = [4, 11, 22, 30, 93, 111, 156, 220, 418, 666, 777]
SOURCE_KEYWORDS = [
    "gematria",
    "qabalah",
    "qabal",
    "tarot",
    "correspondence",
    "sephirah",
    "path",
    "number",
    "liber",
    "aethyr",
    "thelema",
    "beast",
    "babalon",
    "agape",
    "will",
    "witch",
    "horus",
]

PRIORITY_WORKS = {
    "Liber AL vel Legis": "The revealed source text anchors the whole system, so its title number is the first thing to read.",
    "777 and Other Qabalistic Writings": "The title is itself a symbolic number and the book is the clearest correspondence engine in the archive.",
    "The Book of Thoth": "The tarot manual is the major late commentary on the revised symbolic system.",
    "Book 4 / Liber ABA": "The title carries an explicit liber number and the work explains method as training.",
    "Liber Aleph vel CXI": "The title carries a Roman-numeral signal that should be read as part of the work's symbolic identity.",
    "The Vision and the Voice": "The work is one of the major visionary records and should stay high in the reading queue.",
    "The Equinox, Vol. I, No. 1": "The serial title matters because Crowley uses publication structure as part of the doctrine.",
    "The Book of Lies": "The title has no explicit numeral, but the compressed form makes it a high-value symbolic text.",
    "Magick in Theory and Practice": "This is one of the clearest statements of Crowley's mature method and should be read alongside the number material.",
}

TITLE_PRIORITY_REASONS = {
    4: "Liber 4 is explicit in the title of Book 4 / Liber ABA.",
    11: "Liber Aleph vel CXI contains a Roman-numeral title signal that points to 111.",
    22: "The number belongs to the ladder of symbolic sequence and is worth preserving as a known occult target.",
    30: "The Vision and the Voice is built around thirty Aethyrs, so the number is one of its structural keys.",
    93: "93 is the core Thelemic number for Thelema and Agape.",
    111: "Liber Aleph vel CXI points directly at 111.",
    156: "156 is the Babalon number and a recurring title-level shorthand in Crowley.",
    220: "Liber AL vel Legis is Liber 220.",
    418: "The Vision and the Voice and the Great Work tradition keep 418 central.",
    666: "Crowley uses 666 as a public persona, a provocation, and a symbolic signature.",
    777: "777 is the correspondence table that Crowley treats like a symbolic filing cabinet.",
}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def roman_to_int(value: str) -> int | None:
    numerals = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
    value = value.upper().strip()
    if not value or not re.fullmatch(r"[IVXLCDM]+", value):
        return None
    total = 0
    prev = 0
    for char in reversed(value):
        current = numerals[char]
        if current < prev:
            total -= current
        else:
            total += current
            prev = current
    return total


def extract_title_numbers(title: str) -> list[int]:
    numbers: list[int] = []
    seen: set[int] = set()
    for token in re.findall(r"\b\d+\b", title):
        value = int(token)
        if value not in seen:
            seen.add(value)
            numbers.append(value)
    for token in re.findall(r"\b[IVXLCDM]{1,5}\b", title, flags=re.I):
        value = roman_to_int(token)
        if value and value not in seen:
            seen.add(value)
            numbers.append(value)
    return numbers


def normalize(text: str) -> str:
    return " ".join(text.split()).strip()


def sentence(text: str) -> str:
    cleaned = normalize(text)
    return f"{cleaned}." if cleaned else ""


def score_title(work: dict, signal_numbers: list[int]) -> tuple[int, list[str]]:
    reasons: list[str] = []
    score = 0

    liber_number = work.get("liber_number")
    if isinstance(liber_number, int):
        score += 90
        reasons.append(f"Liber number {liber_number} in the work record.")
        signal_numbers.append(liber_number)

    extracted = extract_title_numbers(work["title"])
    if extracted:
        score += 40 * len(extracted)
        reasons.append(f"Title signal(s): {', '.join(map(str, extracted))}.")
        signal_numbers.extend(extracted)

    title = work["title"]
    if title in PRIORITY_WORKS:
        score += 60
        reasons.append(PRIORITY_WORKS[title])

    if title.startswith("Liber "):
        score += 20
        reasons.append("Liber titles deserve first-pass reading because Crowley uses the title as part of the number system.")

    if "777" in title:
        score += 80
    if "Thoth" in title:
        score += 50
    if "AL vel Legis" in title:
        score += 50
    if "Aleph vel CXI" in title:
        score += 50

    return score, reasons


def collect_work_inventory(works: list[dict]) -> tuple[list[dict], dict[int, dict]]:
    inventory: list[dict] = []
    by_number: dict[int, dict] = {}

    for work in works:
        signal_numbers: list[int] = []
        score, reasons = score_title(work, signal_numbers)
        unique_numbers = []
        seen: set[int] = set()
        for number in signal_numbers:
            if number not in seen:
                seen.add(number)
                unique_numbers.append(number)
                by_number.setdefault(
                    number,
                    {
                        "number": number,
                        "label": str(number),
                        "priority_score": 0,
                        "priority_reasons": [],
                        "title_sources": [],
                        "source_snippets": [],
                    },
                )
                by_number[number]["priority_score"] += 10
                by_number[number]["title_sources"].append(
                    {
                        "work_id": work["id"],
                        "title": work["title"],
                        "reason": "Title or liber number signal.",
                    }
                )

        inventory.append(
            {
                "work_id": work["id"],
                "title": work["title"],
                "liber_number": work.get("liber_number"),
                "class": work.get("class"),
                "date_composed": work.get("date_composed"),
                "location_composed": work.get("location_composed"),
                "priority_score": score,
                "priority_reasons": reasons,
                "title_numbers": unique_numbers,
            }
        )

    return sorted(inventory, key=lambda item: (-item["priority_score"], item["title"])), by_number


def collect_number_records(works: list[dict], terms: list[dict]) -> dict[int, dict]:
    records: dict[int, dict] = {}

    for work in works:
        liber_number = work.get("liber_number")
        if isinstance(liber_number, int):
            entry = records.setdefault(
                liber_number,
                {
                    "number": liber_number,
                    "label": str(liber_number),
                    "priority_score": 0,
                    "priority_reasons": [],
                    "title_sources": [],
                    "source_snippets": [],
                },
            )
            entry["priority_score"] += 60
            entry["priority_reasons"].append(f"Work title anchor: {work['title']}.")
            entry["title_sources"].append(
                {
                    "work_id": work["id"],
                    "title": work["title"],
                    "reason": "Liber number in works table.",
                }
            )

        for number in extract_title_numbers(work["title"]):
            entry = records.setdefault(
                number,
                {
                    "number": number,
                    "label": str(number),
                    "priority_score": 0,
                    "priority_reasons": [],
                    "title_sources": [],
                    "source_snippets": [],
                },
            )
            entry["priority_score"] += 20
            entry["priority_reasons"].append(f"Title signal in {work['title']}.")
            entry["title_sources"].append(
                {
                    "work_id": work["id"],
                    "title": work["title"],
                    "reason": "Title numeral or Roman numeral signal.",
                }
            )

    for term in terms:
        gematria_value = term.get("gematria_value")
        if isinstance(gematria_value, int):
            entry = records.setdefault(
                gematria_value,
                {
                    "number": gematria_value,
                    "label": str(gematria_value),
                    "priority_score": 0,
                    "priority_reasons": [],
                    "title_sources": [],
                    "source_snippets": [],
                },
            )
            entry["priority_score"] += 70
            entry["priority_reasons"].append(f"Gematria term: {term['term']}.")
            entry["title_sources"].append(
                {
                    "term_id": term["id"],
                    "term": term["term"],
                    "reason": "Gematria value in dictionary term.",
                }
            )

    for number in CANONICAL_PRIORITY_NUMBERS:
        entry = records.setdefault(
            number,
            {
                "number": number,
                "label": str(number),
                "priority_score": 0,
                "priority_reasons": [],
                "title_sources": [],
                "source_snippets": [],
            },
        )
        entry["priority_score"] += 100
        entry["priority_reasons"].append(TITLE_PRIORITY_REASONS[number])

    return records


def add_tree_numbers(records: dict[int, dict], tree_entries: list[dict]) -> None:
    for entry in tree_entries:
        number = entry["path_number"]
        record = records.setdefault(
            number,
            {
                "number": number,
                "label": str(number),
                "priority_score": 0,
                "priority_reasons": [],
                "title_sources": [],
                "tree_sources": [],
                "source_snippets": [],
            },
        )
        record["priority_score"] += 40
        record["priority_reasons"].append(f"Tree entry: {entry['name']}.")
        record.setdefault("tree_sources", []).append(
            {
                "path_number": number,
                "name": entry["name"],
                "reason": entry.get("description") or entry.get("crowley_tweaks") or "Tree position in the Thelemic map.",
            }
        )


def add_snippet(record: dict, source_name: str, line_no: int, text: str) -> None:
    snippet = {
        "source": source_name,
        "line": line_no,
        "text": normalize(text),
    }
    if snippet["text"] and snippet not in record["source_snippets"]:
        record["source_snippets"].append(snippet)


def scan_archive_for_numbers(records: dict[int, dict]) -> None:
    candidate_numbers = sorted(records.keys())
    if not candidate_numbers:
        return
    pattern = re.compile(r"\b(" + "|".join(map(re.escape, map(str, candidate_numbers))) + r")\b")

    for path in sorted(ARCHIVE_DIR.glob("*.md")):
        if path.name.lower() == "conversion_report.md":
            continue
        lines = path.read_text(encoding="utf-8").splitlines()
        lowered = [line.lower() for line in lines]
        for index, line in enumerate(lines):
            if line.lstrip().startswith("|"):
                continue
            if not pattern.search(line):
                continue
            if not any(keyword in lowered[index] for keyword in SOURCE_KEYWORDS):
                continue

            window_start = max(0, index - 1)
            window_end = min(len(lines), index + 2)
            window = " ".join(part.strip() for part in lines[window_start:window_end] if part.strip())
            for match in pattern.finditer(line):
                number = int(match.group(1))
                record = records.get(number)
                if not record:
                    continue
                record["priority_score"] += 3
                add_snippet(record, path.name, index + 1, window)


def make_prompt(record: dict) -> str:
    return (
        f"Read the source snippets for Crowley number {record['number']} and write a paraphrased encyclopedia entry. "
        "Prioritize title symbolism, 777 correspondences, The Book of Thoth revisions, the Book of the Law, "
        "Golden Dawn inheritance, and any joking or mnemonic use that is actually supported by the source. "
        "Do not quote the source verbatim. Return a short index-card paragraph, then a longer encyclopedia paragraph."
    )


def build_output(records: dict[int, dict], work_inventory: list[dict]) -> dict:
    numbered = sorted(records.values(), key=lambda item: (-item["priority_score"], item["number"]))
    for item in numbered:
        item["priority_reasons"] = sorted(set(item["priority_reasons"]))
        item["source_snippets"] = item["source_snippets"][:6]
        item["llm_prompt"] = make_prompt(item)
    return {
        "version": 1,
        "title_first_work_inventory": work_inventory,
        "number_dossiers": numbered,
    }


def write_markdown(output: dict) -> None:
    lines = ["# Crowley Number Research Queue", "", "This queue is ordered for source-first LLM reading.", ""]
    lines.append("## Title-First Works")
    lines.append("")
    for item in output["title_first_work_inventory"]:
        title_numbers = ", ".join(map(str, item["title_numbers"])) if item["title_numbers"] else "none"
        lines.append(f"- **{item['title']}**")
        lines.append(f"  - Priority score: {item['priority_score']}")
        lines.append(f"  - Number signals: {title_numbers}")
        for reason in item["priority_reasons"][:3]:
            lines.append(f"  - {reason}")
    lines.append("")
    lines.append("## Number Dossiers")
    lines.append("")
    for item in output["number_dossiers"][:50]:
        lines.append(f"### {item['number']}")
        lines.append("")
        lines.append(f"- Priority score: {item['priority_score']}")
        if item["priority_reasons"]:
            lines.append(f"- Reasons: {' '.join(item['priority_reasons'][:3])}")
        if item["title_sources"]:
            titles = ", ".join(source.get("title", source.get("term", "")) for source in item["title_sources"][:3])
            lines.append(f"- Sources: {titles}")
        if item.get("tree_sources"):
            tree_bits = ", ".join(source["name"] for source in item["tree_sources"][:3])
            lines.append(f"- Tree: {tree_bits}")
        if item["source_snippets"]:
            lines.append("- Snippets:")
            for snippet in item["source_snippets"][:2]:
                lines.append(f"  - {snippet['source']}:{snippet['line']} - {snippet['text']}")
        lines.append("")
    OUTPUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    works = load_json(DATA_DIR / "works.json")
    terms = load_json(DATA_DIR / "terms.json")
    tree_entries = load_json(DATA_DIR / "thelemic_tree.json")
    work_inventory, _ = collect_work_inventory(works)
    records = collect_number_records(works, terms)
    add_tree_numbers(records, tree_entries)
    scan_archive_for_numbers(records)
    output = build_output(records, work_inventory)
    OUTPUT_JSON.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    write_markdown(output)
    print(f"Wrote {OUTPUT_JSON} and {OUTPUT_MD} with {len(output['number_dossiers'])} number dossiers.")


if __name__ == "__main__":
    main()
