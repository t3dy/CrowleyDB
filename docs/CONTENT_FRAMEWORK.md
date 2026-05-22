# Crowley Knowledge Portal: Content Framework

This document defines the structure for the copy the portal needs across its major content types. Use it when adding or revising entries so the database, the frontend, and the editorial voice stay in sync.

## Shared Rules

- Lead with the fact or definition before interpretation.
- Keep the evidentiary lane visible when a claim is disputed or source-dependent.
- Prefer short, scannable paragraphs over long essays.
- Use source-linked language instead of unsupported certainty.
- When Crowley and scholarship disagree, keep both readings visible.

## Dictionary Entries

Use when creating or revising term records.

- Term name
- Gematria or number value, if relevant
- Etymology or transliteration
- Plain-language definition
- Crowley's usage or redefinition
- Qabalistic or ritual context
- Related terms
- Evidentiary lane

Recommended length: 80 to 180 words.

## Works Summaries

Use when summarizing a Liber or other major work.

- Title and liber number
- A.A. class or other classification
- Date and location of composition
- One-sentence significance
- Core doctrine or structure
- Reception by scholars and practitioners
- Notes about important editorial or textual issues

Recommended length: 120 to 220 words.

## People Profiles

Use for associates, scholars, disciples, rivals, and saints.

- Full name and role category
- Magical motto, if known
- Relationship to Crowley
- Key dates or shared workings
- Later trajectory or significance
- Where the profile diverges from Crowley's own account

Recommended length: 120 to 240 words.

## Scholar Profiles

Use for historians, biographers, and commentators.

- Full name
- Main thesis or angle
- Key publications
- Method or interpretive style
- Why the scholar matters to the portal
- Any important disagreements with other scholars

Recommended length: 100 to 200 words.

## Timeline Events

Use for chronological events, rituals, publications, and life changes.

- Date or date range
- Event title
- Location
- What happened
- Why it matters
- Cross-links to works or people
- Topic tags from the controlled vocabulary, when applicable

Recommended length: 40 to 100 words.

## Topic Tags

Use when assigning normalized event themes for browsing and filtering.

- Use the shared topic list in `database/topic_taxonomy.json`
- Apply only when the theme is directly visible in the event
- Prefer specific tags over broad tags
- Avoid inventing one-off labels in prose
- Use multiple tags only when the event genuinely spans several themes

The current controlled vocabulary includes:

- Magick
- Initiation
- Drugs
- Sex
- Rivalry
- Legal Trouble
- Publication
- Travel
- Followers
- Wife
- Children
- Lovers
- Golden Dawn
- O.T.O.
- A.'.A.'.
- Politics
- Ritual
- Correspondence
- Occult Study
- Finance
- Health

The taxonomy file can also include narrower life-course facets such as `birth`, `family`, `education`, `rebellion`, `mountaineering`, `art`, `war`, `exile`, and `reception` when the timeline needs denser relational browsing.

## Map Popups

Use for place cards on the interactive map.

- Site name
- Date or date range
- What happened there
- Why the site matters
- Source tone label, if needed

Recommended length: 30 to 90 words.

## Editorial Categories

Use these categories when classifying prose:

- `Primary record`
- `Autobiography`
- `Scholarship`
- `Practitioner interpretation`
- `Historical/documentary`

## Practical Check

Before adding a new entry, ask:

1. What is this entry for?
2. Which lane does it belong to?
3. What is the shortest accurate version of the note?
4. What should the reader click next?
