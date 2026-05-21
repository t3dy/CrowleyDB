# Crowley Knowledge Portal: Data Ontology

This document defines the knowledge domains and editorial boundaries for the Aleister Crowley digital humanities resource. It is designed to serve both the rigorous academic scholar and the ceremonial magick practitioner, acting as a "contested archive" where claims are meticulously sourced and evidentiary lanes are preserved.

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
Crowley’s life is structured by his initiatory grades (A.'.A.'. and O.T.O.) and specific magical workings.
* **Grades**: Probationer (0=0), Neophyte (1=10) ... up to Ipsissimus (10=1).
* **Workings**: The Paris Working (1914), The Abuldiz Working (1911), The Amalantrah Working (1918), The Cairo Working (1904).

## 3. Disputed Zones
When documenting the following events, the database must **never flatten the narrative**. It must surface the contradictions between lanes:
1. **The Cairo Working (1904):** Did Aiwass physically dictate the book? (Lane A/B says yes; Lane C suggests psychological projection/subconscious).
2. **The Golden Dawn Schism (1900):** Mathers vs. Crowley vs. Yeats. The Battle of Blythe Road.
3. **The Abbey of Thelema (1920-1923):** Raoul Loveday's death. Sensationalist press (Lane E) vs. Crowley's defense (Lane B) vs. Historical reality (Lane C).
4. **Secret Agent 666:** Crowley's claim to be working for British Intelligence (MI5) during WWI in America.

## 4. Frontend Requirements
The frontend must support relational browsing:
* **Thelemic Tree of Life Map**: Interactive D3/Canvas map showing the 10 Sephiroth and 22 Paths, explicitly using the Thoth Tarot swaps (Tzaddi/Heh).
* **Gematria Search**: Ability to type "93" and see all related terms, works, and events.
* **Lane Filtering**: A toggle to filter the timeline or biographies to only show "Scholarly Consensus" or "Crowley's Self-Report".
