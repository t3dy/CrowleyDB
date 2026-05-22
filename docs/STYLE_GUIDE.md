# Crowley Knowledge Portal: Editorial Style Guide

This style guide dictates the tone, structure, and formatting for all human-authored and LLM-assisted prose in the Crowley Knowledge Portal.

## 1. Core Principles

1. **Academic Detachment with Practitioner Empathy**: The prose must remain objective, rigorous, and scholarly (Academic). However, it must precisely and accurately describe the metaphysical machinery as Crowley and his disciples understood it (Practitioner Empathy). Do not dismiss the magick; describe its internal logic meticulously.
2. **Attribution of Interpretations**: Never state interpretations as ground truth. Always use attribution tags.
   * *Incorrect*: "In 1904, Crowley received the Book of the Law from a praeterhuman intelligence."
   * *Correct*: "According to Crowley's magical record (Lane A), in 1904 he received the Book of the Law from a praeterhuman intelligence named Aiwass. Biographers like Kaczynski (Lane C) contextualize this as a profound psychological breakthrough."
3. **Lane Transparency**: Every entry must explicitly state its primary evidentiary lane (A, B, C, D, or E).
4. **Controlled Topic Tags**: Timeline entries and biographies should use the shared topic taxonomy rather than invented thematic labels.

## 2. Formatting by Entry Type

### 2.1 Dictionary / Jargon Entries
* **Header**: Term name, transliteration, and Gematria value (if applicable).
* **Definition**: A concise, 2-3 sentence summary.
* **Crowley's Usage**: How Crowley specifically used or redefined the term, with citations from the Libri.
* **Qabalistic Context**: Where the term sits on the Tree of Life or its astrological correspondence.
* **Related Terms**: Hyperlinks to associated concepts.

### 2.2 Summaries of Works (The Libri)
* **Metadata Block**: Liber Number, Class (A-E), Date of Composition, Location of Composition.
* **Context of Composition**: The historical and magical circumstances surrounding the writing.
* **Core Doctrine**: What the text actually says or instructs.
* **Scholarly / Practitioner Reception**: How the text has been utilized by the O.T.O., A.'.A.'., or analyzed by scholars.

### 2.3 Biographies of Associates
* **Role**: Primary relationship to Crowley (e.g., Scarlet Woman, Magical Childe, Rival).
* **Timeline of Interaction**: The specific years and workings they were involved in.
* **Post-Crowley Trajectory**: What happened to them after their association with Crowley ended (crucial, as many suffered).
* **Contradictions**: If Crowley's *Confessions* paints them negatively (as he often did with former lovers/friends), contrast this with objective biography (Lane C).

### 2.4 Timeline and Interactive Map Popups
* **Brevity**: Maximum 100 words per popup.
* **Fact-Forward**: State the event, the date, and the location.
* **Magical Significance**: A brief note on why this location/event matters to the Thelemic current.
* **Hover Text**: Add a shorter mouseover line for quick scanning; keep the popup itself for fuller context and linked records.

### 2.5 People Profiles
* **Role Header**: Identify the person as a self, associate, scholar, disciple, rival, or saint.
* **Relationship Summary**: Explain how they connect to Crowley in one sentence.
* **Biographical Arc**: Cover the most relevant dates, publications, or workings.
* **Afterward**: Note what happened after the Crowley connection ended when it matters.
* **Source Discipline**: Separate Crowley's own characterizations from scholarly consensus.

### 2.6 Scholar Profiles
* **Thesis**: State the scholar's main interpretive angle in plain language.
* **Key Works**: List the most relevant books, articles, or editions.
* **Method**: Note whether the scholar is archival, biographical, practitioner-oriented, or synthetic.
* **Value to the Portal**: Say why the profile matters to readers of Crowley studies.

### 2.7 Works Summaries
* **Metadata Block**: Liber number, class, date, and composition location.
* **Why It Matters**: One concise sentence about the text's place in Crowley's system.
* **Core Content**: What the work says, instructs, or argues.
* **Reception**: How scholars, disciples, or readers have used it.

### 2.8 Timeline Events
* **Date Precision**: Prefer exact dates when known; otherwise use clear ranges.
* **Context**: Explain what changed before and after the event.
* **Cross-Links**: Mention associated works, people, or places where useful.
* **Topic Tags**: Assign one or more controlled topic tags only when the event is directly about that theme.

### 2.9 Map Entries
* **Location First**: Name the site, then the historical moment.
* **Single-Sentence Function**: Keep map copy compact and oriented toward navigation.
* **Source Label**: Make it clear whether the note comes from primary record, autobiography, scholarship, or later interpretation.

### 2.10 Topic Tagging
Topic tags are for normalized filtering, not descriptive prose. Keep them stable and sparse.

* Use the canonical topic set defined in `database/topic_taxonomy.json`. The file may include both the broad core themes and finer-grained life-course facets.
* Prefer direct topical relevance over broad catch-all tagging.
* Tag the event itself, not the surrounding era.
* Use multiple tags only when the event genuinely sits at the intersection of several themes.
* If the taxonomy needs a new topic, update the controlled vocabulary first and then use it consistently across new content.

## 3. UI/UX Design Aesthetic
* **Color Palette**: Obsidian (Black/Dark Gray) backgrounds, Gold (#D4AF37) accents for interactivity, and deep Crimson (#8B0000) for warnings or specific Lane tags.
* **Typography**: 
   * Headings: A premium serif (e.g., *Cinzel* or *Playfair Display*) to evoke occult grimoires and turn-of-the-century publishing.
   * Body: A highly readable sans-serif (e.g., *Inter* or *Roboto*).
* **Icons**: Custom SVG glyphs for astrological signs, planetary symbols, and the 4 elements.
* **Cards**: Glassmorphism (translucent backgrounds with subtle blurring and borders) to give a modern, premium "portal" feel.

## 4. Copy Workflow

When creating new content, use the companion [Content Framework](CONTENT_FRAMEWORK.md) to keep the work consistent across terms, works, people, map pins, and timeline entries.
