# Crowley Knowledge Portal: Data Ontology

This document defines the knowledge domains and editorial boundaries for the Aleister Crowley digital humanities resource. It is built to support both scholarly browsing and practitioner reading, while keeping the project framed as a contested archive where claims stay sourced and evidentiary lanes remain visible.

## 1. Evidentiary Lanes

To handle Crowley's extreme unreliability and the heavily mythologized nature of his life, every claim in the database must be tagged with an evidentiary lane.

| Lane | Source Class | Description |
|---|---|---|
| **A** | **Magical Record & Primary Libri** | Crowley's diaries, *The Equinox*, the Holy Books (Class A-E), ritual records, and original magical texts (e.g., *The Book of the Law*). |
| **B** | **Autobiography & Self-Report** | *The Confessions of Aleister Crowley*, personal letters where he interprets his own life. Treat as an unreliable narrator. |
| **C** | **Academic / Scholarly Biography** | Kaczynski (*Perdurabo*), Churton, Sutin, Pasi, Baker, Bogdan. The historical consensus. |
| **D** | **Occult Disciples & Practitioners** | Grant, Regardie, DuQuette, Eshelman, Parsons. Explanations of how the magick is practiced or its metaphysical implications. |
| **E** | **Historical / Documentary Record** | Intelligence files (MI5), contemporary newspaper clippings, census data, third-party letters. |

## 2. Core Entities

### 2.1 The Libri (Works)
Crowley's bibliography is vast. Every work must be classified by its A.'.A.'. Class:
* **Class A**: Holy Books (cannot be changed so much as the style of a letter). e.g. *Liber AL vel Legis*.
* **Class B**: Scholarship and enlightenment.
* **Class C**: Matter suggestive of anything but itself.
* **Class D**: Official rituals and instructions.
* **Class E**: Manifestos, broadsheets, epistles.

### 2.2 Tarot and Qabalah (The Thelemic System)
The portal explicitly maps Crowley's idiosyncratic Qabalistic system, most notably from *The Book of Thoth* and *Liber 777*.
**Crucial Deviations from Golden Dawn:**
* **Tzaddi is not the Star**: Crowley swapped the attributions of Tzaddi and Heh. In the Thelemic system, Tzaddi = The Emperor (Aries) and Heh = The Star (Aquarius).
* **Strength / Lust**: Strength becomes Lust (Leo / Teth).
* **Temperance / Art**: Temperance becomes Art (Sagittarius / Samekh).
* **Justice / Adjustment**: Justice becomes Adjustment (Libra / Lamed).
* **The Fool's Position**: Aleph / The Fool is placed on the Tree of Life in its dynamic, active form.
* **The Lamen of the Rose Cross**: Specific Thelemic color scales and attributions mapped for frontend visualizations.

### 2.3 The Dictionary (Jargon & Metaphysics)
Crowley redefined words and relied heavily on Gematria. Dictionary entries must contain:
* The word (e.g. *Thelema*, *Agape*, *Babalon*).
* Gematria value (e.g. 93, 156).
* Etymological root (Greek/Hebrew).
* Meaning in the context of the Aeon of Horus.

### 2.4 Persons (Associates & Disciples)
The network of people around Crowley is vast.
* **Scarlet Women**: Rose Edith Kelly, Mary Desti, Leah Hirsig.
* **Magical Partners / Rivals**: Victor Neuburg, MacGregor Mathers, W.B. Yeats, Allan Bennett.
* **Later Disciples**: Jack Parsons, Kenneth Grant, Jane Wolfe.

### 2.5 Initiations, Grades, and Workings
Crowley's life is structured by his initiatory grades (A.'.A.'. and O.T.O.) and specific magical workings.
* **Grades**: Probationer (0=0), Neophyte (1=10) ... up to Ipsissimus (10=1).
* **Workings**: The Paris Working (1914), The Abuldiz Working (1911), The Amalantrah Working (1918), The Cairo Working (1904).

### 2.6 Topic Taxonomy for Event Browsing
Events are tagged with a controlled vocabulary so users can filter the biography by theme without relying on free-text labels.

**Normalized structure**
* `topics` is the controlled vocabulary table.
* `event_topics` is the many-to-many join table between `events` and `topics`.
* A single event may carry multiple topic tags.
* Topic slugs are stable identifiers for filtering, URL state, and export pipelines.

**Canonical seed metadata**
* `database/topic_taxonomy.json` is the source file for the topic list and ordering.
* Keep the schema, docs, and seed metadata aligned instead of inventing ad hoc labels in event text.

**Required topic set**

| Slug | Label | Editorial scope |
|---|---|---|
| `magick` | Magick | Operative ceremonial magic, workings, techniques, and practical magical method. |
| `initiation` | Initiation | Grades, oaths, ordeals, admissions, and threshold crossings in orders or systems. |
| `drugs` | Drugs | Intoxication, addiction, treatment, experimentation, and drug use as a historical fact. |
| `sex` | Sex | Sexual conduct, erotic practice, scandal, and sexual relationships when they shape an event. |
| `rivalry` | Rivalry | Conflict, dispute, polemic, competition, or antagonism with a person or group. |
| `legal_trouble` | Legal Trouble | Arrests, trials, prosecutions, police attention, censorship, or legal consequences. |
| `publication` | Publication | Writing, printing, publishing, editing, serialization, and the release of texts. |
| `travel` | Travel | Journeys, relocation, expeditions, border crossings, and movement that matters biographically. |
| `followers` | Followers | Students, disciples, patrons, acolytes, and other people who attach themselves to his current. |
| `wife` | Wife | Events involving a spouse or wife, including marriage, separation, conflict, and collaboration. |
| `children` | Children | Events involving children, parenting, custody, family life, loss, or inheritance. |
| `lovers` | Lovers | Romantic or sexual partners, affairs, household arrangements, and intimate entanglements. |
| `golden_dawn` | Golden Dawn | The Hermetic Order of the Golden Dawn, its members, schism, rituals, and afterlife in his career. |
| `oto` | O.T.O. | Ordo Templi Orientis membership, administration, doctrine, disputes, and institutional history. |
| `aa` | A.'.A.'. | The A.'.A.'. system, its grades, offices, aspirants, and instructional literature. |
| `politics` | Politics | Political affiliations, propaganda, state power, war, nationalism, espionage, and ideology. |
| `ritual` | Ritual | Ceremonies, invocations, liturgies, working sequences, and formal magical acts. |
| `correspondence` | Correspondence | Letters, telegrams, notes, and epistolary exchanges that reveal developments or relationships. |
| `occult_study` | Occult Study | Reading, research, translation, lecturing, library work, and study of esoteric systems. |
| `finance` | Finance | Money, debts, patronage, earnings, bequests, bankruptcy, accounts, and material support. |
| `health` | Health | Illness, injury, exhaustion, treatment, addiction, convalescence, and bodily decline or recovery. |

**Extended facet layer**
* The canonical topic file may also include narrower biographical facets used by the timeline seed, such as `birth`, `family`, `education`, `rebellion`, `mountaineering`, `art`, `war`, `exile`, `reception`, and other high-signal life-course markers.
* Keep those facets normalized in `topics` and `event_topics`; do not collapse them into free-text prose.

**Tagging guidance**
* Tag the event, not the person.
* Prefer the most specific topic or topics that are directly visible in the event record.
* Avoid over-tagging; two or three topics are usually enough.
* Use the controlled vocabulary only. If a new theme appears repeatedly, add it to the taxonomy rather than improvising a label.

## 3. Disputed Zones
When documenting the following events, the database must **never flatten the narrative**. It must surface the contradictions between lanes:
1. **The Cairo Working (1904):** Did Aiwass physically dictate the book? (Lane A/B says yes; Lane C suggests psychological projection/subconscious).
2. **The Golden Dawn Schism (1900):** Mathers vs. Crowley vs. Yeats. The Battle of Blythe Road.
3. **The Abbey of Thelema (1920-1923):** Raoul Loveday's death. Sensationalist press (Lane E) vs. Crowley's defense (Lane B) vs. Historical reality (Lane C).
4. **Secret Agent 666:** Crowley's claim to be working for British Intelligence (MI5) during WWI in America.

## 4. Frontend Requirements
The frontend must support relational browsing:
* **Thelemic Tree of Life Map**: Interactive map of the 10 Sephiroth and 22 Paths, with hover text, popups, and the Thoth Tarot swaps (Tzaddi/Heh) clearly surfaced.
* **Gematria Search**: Ability to type "93" and see all related terms, works, and events.
* **Lane Filtering**: A toggle to filter the timeline or biographies to show only "Scholarly Consensus", "Crowley's Self-Report", or other evidentiary lanes as needed.
