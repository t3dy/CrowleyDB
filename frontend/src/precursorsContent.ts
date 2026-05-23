type PrecursorEntry = {
  slug: string;
  title: string;
  subtitle: string;
  glyphs: string[];
  summary: string;
  teaser: string;
  paragraphLead: string;
  sourceLineage: string;
  symbolicMode: string;
  inheritanceNote: string;
  titleSignal: string;
  relatedCrowleyWorks: string[];
  relatedCrowleyNumbers: string[];
  relatedConcepts: string[];
  paragraphs: string[];
};

const sentence = (text: string) => {
  const trimmed = text.trim().replace(/\s+/g, ' ').replace(/\.$/, '');
  return trimmed ? `${trimmed}.` : '';
};

export const PRECURSOR_ENTRIES: PrecursorEntry[] = [
  {
    slug: 'agrippa',
    title: 'Agrippa',
    subtitle: 'Christian Kabbalah, talismanic proportion, and operative number',
    glyphs: ['✶', '☉', '☿'],
    summary:
      'Agrippa gives Crowley a world in which number is not only counted but worked, so arithmetic, divine names, planetary order, and magical action all belong to the same discipline.',
    teaser:
      'He is the great pre-Crowley bridge figure: not the source of the whole system, but the writer who makes the old symbolic furniture look usable for a ceremonial magician.',
    paragraphLead:
      'Agrippa is the strongest early modern ancestor for Crowley’s number thinking because he treats number as a real force in correspondence rather than as a dry abstraction.',
    sourceLineage:
      'Renaissance Christian Kabbalah, Hermeticism, and learned magic as they were reassembled into an operative encyclopedia of occult number.',
    symbolicMode:
      'Number appears as proportion, hierarchy, signature, and talismanic relation; the value of a number lies in what it can link, balance, or empower.',
    inheritanceNote:
      'Crowley inherits Agrippa indirectly through later occult tables, then makes the relation more theatrical and more explicit in 777.',
    titleSignal:
      'Agrippa matters here because the title of De Occulta Philosophia becomes part of the learned-magical canon that Crowley keeps re-reading as a source of number lore.',
    relatedCrowleyWorks: ['777 and Other Qabalistic Writings', 'The Book of Thoth', 'Book 4 / Liber ABA'],
    relatedCrowleyNumbers: ['777', '220', '418'],
    relatedConcepts: ['Christian Kabbalah', 'Talismanic proportion', 'Planetary virtue', 'Magical arithmetic'],
    paragraphs: [
      'Agrippa is the writer who helps make number feel operative before Crowley arrives to systematize the whole thing. In his hands, number is not a neutral counting tool but a way of organizing divine names, planetary forces, letters, and ritual correspondences into a single usable map. That makes him crucial to any genealogy of Crowley’s number thought, because Crowley does not begin with a blank slate; he begins with a learned magical archive that already treats number as a bridge between heaven and the ritual room.',
      'The important thing about Agrippa is not simply that he lists things. It is that he assumes the list itself can participate in magical action when the relations are correctly understood. A number can name a degree of order, a proportion of power, or a route by which occult force is carried into a talisman or a rite. Crowley’s later tables preserve that basic assumption even when he sharpens the style, changes the emphases, or turns the whole operation into a more aggressive publishing persona.',
      'Crowley’s system differs from Agrippa’s in tone as much as in method. Agrippa is learned, cumulative, and scholastic; Crowley is editorial, self-conscious, and often mischievous. But the inheritance is real. When Crowley makes 777 into a symbolic filing cabinet, he is standing on a tradition in which number already behaves like a form of magic, not just a label for it.',
      'For the portal, Agrippa belongs in a separate section because he is not Crowley’s source text in the narrow sense; he is one of the older engines that explains why Crowley’s numbers can work the way they do at all. The reader should encounter him as a precursor, then move forward into the Golden Dawn and Crowley layers with the genealogy already visible.',
    ],
  },
  {
    slug: 'pythagorean-number',
    title: 'Pythagorean Number',
    subtitle: 'Monad, dyad, triad, tetrad, and decad',
    glyphs: ['①', '②', '③', '④'],
    summary:
      'The Pythagorean layer teaches Crowley that number can be ontological: unity generates difference, difference can be ordered, and the whole cosmos can be read through numerical pattern.',
    teaser:
      'This is the old philosophical grammar behind the more magical tables, and it keeps surfacing whenever Crowley makes a number stand for a principle rather than a count.',
    paragraphLead:
      'Pythagorean number is the deep philosophical substrate under later occult number systems because it treats number as the structure of being itself.',
    sourceLineage:
      'Greek mathematical mysticism, Pythagorean lore, and the later philosophical tradition that turns arithmetic into metaphysics.',
    symbolicMode:
      'Number behaves as a ladder of principles: unity, duality, relation, form, and completion. The numeric series is itself a theory of reality.',
    inheritanceNote:
      'Crowley inherits the idea that numbers can express states of reality, then folds it into Qabalah, tarot, and initiatory sequencing.',
    titleSignal:
      'The symbolic weight here lives less in publication titles than in the foundational series of 1, 2, 3, 4, and 10, which later occult writers keep citing as a philosophical shorthand.',
    relatedCrowleyWorks: ['The Book of Thoth', '777 and Other Qabalistic Writings', 'Liber Aleph vel CXI'],
    relatedCrowleyNumbers: ['1', '3', '4', '10'],
    relatedConcepts: ['Monad', 'Triad', 'Tetrad', 'Decad'],
    paragraphs: [
      'The Pythagorean layer is the oldest philosophical pressure behind Crowley’s number work. Here the number is not primarily a label attached to a thing; it is a way of saying what a thing is made of. Unity, duality, triad, tetrad, and decad become more than arithmetic steps. They are ontological positions, and the cosmos can be read as if it were arranged by those positions from the start.',
      'That matters for Crowley because his own system keeps treating numbers as qualitative rather than merely quantitative. The sephiroth are not just ten boxes. The paths are not just twenty-two lines. Number is already a theory of relation, and the Pythagorean tradition makes that feel almost self-evident. Crowley can then add the Hebrew letter, the tarot trump, and the ritual grade as if he were merely extending an older philosophical habit into a more elaborate magical architecture.',
      'The Pythagorean view also gives Crowley something he loves: a way to make completion feel mathematically inevitable. The decad can appear as a fulfillment of the series, the tetrad as an ordered stability, and the triad as a living mediation. These are not simply symbols Crowley copies; they are the kind of number ideas that allow him to insist that the universe is intelligible as pattern.',
      'Placed in its own section, this layer helps the reader see that Crowley’s number system is not born with the Golden Dawn. It has a much longer philosophical ancestry, and that ancestry is part of why Crowley can speak about numbers as if they were both metaphysical facts and magical techniques.',
    ],
  },
  {
    slug: 'platonic-neoplatonic-ascent',
    title: 'Platonic and Neoplatonic Ascent',
    subtitle: 'Emanation, return, and ordered ascent through number',
    glyphs: ['☉', '☾', '🜂'],
    summary:
      'Platonic and Neoplatonic thought gives Crowley a story in which number helps describe how unity unfolds into multiplicity and how the many can be drawn back toward the one.',
    teaser:
      'The occult ladder matters here: number is not just a count, but a motion from source to image and back again.',
    paragraphLead:
      'The Platonic and Neoplatonic thread teaches that number is part of a metaphysical ascent, not only a way of cataloguing things.',
    sourceLineage:
      'Plato, Plotinus, later Neoplatonic synthesis, and the broad esoteric inheritance that treats ascent as a structured return to unity.',
    symbolicMode:
      'Number appears as emanation, hierarchy, and re-ascent: the sequence of being is also the sequence of the soul’s remembering.',
    inheritanceNote:
      'Crowley inherits this atmosphere through ceremonial magic and Qabalistic interpretation, where the Tree becomes a map of descent and return.',
    titleSignal:
      'The title logic is philosophical rather than bibliographic: the important number is the one hidden in the structure of ascent itself, not the title on the cover.',
    relatedCrowleyWorks: ['The Vision and the Voice', 'The Book of Thoth', 'Liber AL vel Legis'],
    relatedCrowleyNumbers: ['1', '10', '21', '32'],
    relatedConcepts: ['Emanation', 'Return', 'Hierarchy', 'Ascent'],
    paragraphs: [
      'Platonic and Neoplatonic number theory matters because it teaches a way of thinking in which the many emerge from the one without destroying its unity. That is exactly the kind of metaphysical motion Crowley likes to exploit when he treats the Tree of Life as both a diagram of reality and a map of practice. Number becomes a story about how being unfolds, not simply a tag for where something sits in the sequence.',
      'Neoplatonic writing also supplies a temperament that occultists love: the sense that ascent is disciplined, ordered, and legible. A number can mark a rung on the ladder of return. A stage can be both symbolic and experiential. Crowley later pushes this into his own initiatory language, but the basic idea is older: you climb by becoming more unified, and number helps name the shape of that climb.',
      'This layer is especially useful for reading Crowley’s Tree work because it explains why his system so often feels like a machine for reconciling multiplicity with order. The diagram is not a random occult collage. It is a map of how many things can still belong to one cosmos and one ascent. In that sense, the Neoplatonic inheritance is everywhere in the background even when the vocabulary looks purely Golden Dawn or Thelemic.',
      'The separate section lets the reader see that Crowley’s numbers are not only about correspondences. They are also about metaphysical movement, and the older philosophical tradition gives that movement its grammar.',
    ],
  },
  {
    slug: 'hermetic-correspondence',
    title: 'Hermetic Correspondence',
    subtitle: 'Similarity across planes and the logic of hidden analogy',
    glyphs: ['☿', '✡', '🜍'],
    summary:
      'Hermetic correspondence gives Crowley the habit of reading the world as a mesh of reflections, so a number can speak across planets, gods, colors, letters, and ritual operations.',
    teaser:
      'It is the prehistory of 777 in spirit: the conviction that nothing magical stands alone if the correspondences are properly seen.',
    paragraphLead:
      'Hermetic correspondence is the rule that allows occult number to become a cross-indexed language rather than a pile of isolated symbols.',
    sourceLineage:
      'Hermeticism, Renaissance magical synthesis, and later esoteric table-making that treats analogy as a reliable occult method.',
    symbolicMode:
      'Number functions as a relational key. Its job is to reveal that things on different levels of reality can answer one another.',
    inheritanceNote:
      'Crowley inherits this logic through Golden Dawn reference tables and then makes it explicit in the very design of 777.',
    titleSignal:
      'The title logic is infrastructural: the occult book itself becomes a correspondence machine, so the symbolic order begins before the reader reaches the first table.',
    relatedCrowleyWorks: ['777 and Other Qabalistic Writings', 'The Book of Thoth', 'Book 4 / Liber ABA'],
    relatedCrowleyNumbers: ['7', '22', '32', '777'],
    relatedConcepts: ['Analogy', 'Cross-reference', 'Table-making', 'Symbolic mapping'],
    paragraphs: [
      'Hermetic correspondence is the idea that the world can be read by linked likenesses. A planet can answer a metal. A color can answer a deity. A number can answer a letter or a ritual condition. This is the connective tissue that makes Crowley’s later tables plausible, because it teaches the magician to expect that the universe is already organized in a way that can be cross-read.',
      'Crowley does not invent this habit; he inherits it. But he inherits it at a moment when tables, charts, and coded correspondences have become one of the main tools of ceremonial magic. That means 777 can be understood not just as a Crowley book but as an argument that the right arrangement of correspondences is itself a form of knowledge. The book is both map and method.',
      'What makes the Hermetic layer important is that it explains why number can function as a key rather than a conclusion. The number opens a door to a set of relations. It does not stand alone. It gathers its neighbors. In that sense, Crowley’s number work is deeply Hermetic even when he is being aggressively Thelemic, because he keeps relying on the older conviction that the visible world is readable through structure.',
      'This section belongs on its own because it marks the transition from philosophical number to operational number. By the time Crowley is done with the inheritance, correspondence has become one of his central publishing technologies.',
    ],
  },
  {
    slug: 'golden-dawn-tables',
    title: 'Golden Dawn Tables',
    subtitle: 'Grade maps, tarot lines, color scales, and temple bookkeeping',
    glyphs: ['⚖️', '🌈', '🜂'],
    summary:
      'The Golden Dawn turns number into an organizational system for initiation, and Crowley inherits that bureaucracy of symbol before he edits it into 777 and the Book of Thoth.',
    teaser:
      'This is where number becomes an administrative magic: the order is not only mystical, it is indexed, graded, and tabled.',
    paragraphLead:
      'The Golden Dawn tables are the immediate practical ancestor of Crowley’s number system because they make number into a filing technology for ritual life.',
    sourceLineage:
      'Golden Dawn manuscript culture, initiation grading, tarot attributions, color scales, and the tabular habits of late Victorian ceremonial magic.',
    symbolicMode:
      'Number behaves as an index for initiation, an address for symbols, and a way to organize the temple into readable layers.',
    inheritanceNote:
      'Crowley inherits the tables almost wholesale, then revises them by putting his own symbolic emphases, titles, and notes into the apparatus.',
    titleSignal:
      'The title signal here is institutional rather than literary: tables and grade names matter because they make the magical order itself legible as a numbered system.',
    relatedCrowleyWorks: ['777 and Other Qabalistic Writings', 'The Book of Thoth', 'Magick in Theory and Practice'],
    relatedCrowleyNumbers: ['22', '32', '93', '777'],
    relatedConcepts: ['Tarot attributions', 'Grade system', 'Color scales', 'Initiatory bureaucracy'],
    paragraphs: [
      'The Golden Dawn is the immediate practical source for Crowley’s famous number tables. It teaches him that number can be used to organize initiation, tarot, color, letter, planet, and ritual rank into one large and surprisingly efficient symbolic machine. The order is magical, but it is also bureaucratic, and that bureaucracy is part of the power. Things can be remembered because they are filed.',
      'That is why Crowley’s revision of the Golden Dawn tables matters so much. He does not just inherit a system of correspondences; he inherits a method for turning the temple into a readable index. Grades line up with numbers. Paths line up with letters and trumps. Color scales line up with ceremonial furniture. The result is a taxonomy that feels less like a theory and more like an operating environment.',
      'Crowley’s contribution is to make the apparatus louder and more self-conscious. He keeps the tables, but he also turns the tables into an argument about authority, revision, and magical interpretation. This is where the inside joke begins to show: the order wants to look like a disciplined archive, while Crowley wants to show that the archive is itself a magical performance.',
      'Because the Golden Dawn layer sits so close to Crowley’s own work, it deserves its own section instead of being folded into Crowley as if the lineage did not matter. The portal can then show clearly that Crowley’s number system is a revision of a pre-existing order of ritual bookkeeping.',
    ],
  },
  {
    slug: 'crowley-revision',
    title: 'Crowley Revision',
    subtitle: 'Title numbers, doctrinal re-editing, and the theatrical filing system',
    glyphs: ['93', '220', '777'],
    summary:
      'Crowley revises the inherited number systems by making them more explicit, more literary, and more self-staging, so the number on the cover and the number in the table become part of the same argument.',
    teaser:
      'This is where publication titles start doing magic all by themselves: 777, 220, 418, 666, 156, and 93 become part of the doctrine before the reader reaches the doctrine.',
    paragraphLead:
      'Crowley Revision is the point where the inherited systems become unmistakably Thelemic because Crowley begins to make titles, numbers, and editorial choices speak as one.',
    sourceLineage:
      'Golden Dawn tables, Agrippa’s learned magic, the Platonic ladder, Hermetic correspondence, and the habit of treating publication form as part of occult meaning.',
    symbolicMode:
      'Number now works as title, brand, doctrine, mnemonic, and joke at once; the symbolic system includes the publishing apparatus itself.',
    inheritanceNote:
      'Crowley does not invent number symbolism here so much as he re-voices it, making older traditions feel sharpened, theatrical, and self-aware.',
    titleSignal:
      'The title signal is the priority of the section: 777 and Other Qabalistic Writings, Liber AL vel Legis, Liber 4 / Liber ABA, Liber Aleph vel CXI, The Vision and the Voice, and The Book of Thoth all show Crowley making title numerology part of the work’s identity.',
    relatedCrowleyWorks: ['777 and Other Qabalistic Writings', 'Liber AL vel Legis', 'Book 4 / Liber ABA', 'Liber Aleph vel CXI', 'The Book of Thoth'],
    relatedCrowleyNumbers: ['93', '156', '220', '418', '666', '777'],
    relatedConcepts: ['Publication numerology', 'Revision', 'Branding', 'Doctrinal shorthand'],
    paragraphs: [
      'Crowley’s revisionary move is to take inherited number symbolism and turn the publishing form itself into part of the occult argument. A title can carry a number. A number can act like a doctrine. A classification can become a signature. That is why his work is so useful for a portal like this one: the cover page already belongs to the symbolic system before the first paragraph begins.',
      'The most obvious examples are the titles that announce their number openly. 777 and Other Qabalistic Writings makes the table into the title. Liber AL vel Legis gives the revelation text a book-numbered identity. Liber 4 / Liber ABA, Liber Aleph vel CXI, The Vision and the Voice, and The Book of Thoth each show a different way of letting a book’s formal identity carry symbolic weight. In Crowley, the title is often not just a label; it is a compressed argument about the work’s place in the system.',
      'That is also why Crowley’s better-known numbers behave as more than trivia. 93 is a ritual greeting and a doctrinal shorthand. 156 points to Babalon as a symbolic current. 220 identifies the law text that frames the Aeon. 418 marks a formula of transformation. 666 is a persona he turns inside out until it becomes a brand. The number is never only a number once Crowley gets hold of it.',
      'For the portal, this section is the final Crowley layer because it shows how the inherited systems become deliberately Thelemic. The old ideas are still there, but they now sit inside a publishing and editorial style that treats number as doctrine, signature, and performance all at once.',
    ],
  },
];

export function buildPrecursorEntries() {
  return PRECURSOR_ENTRIES.slice();
}

export function buildPrecursorCardCopy(entry: PrecursorEntry) {
  return `${sentence(entry.summary)} ${sentence(entry.teaser)}`.trim();
}

export function buildPrecursorArticleParagraphs(entry: PrecursorEntry) {
  return entry.paragraphs.length ? entry.paragraphs : [sentence(entry.summary)];
}

export function getPrecursorEntryBySlug(entries: PrecursorEntry[], slug: string | undefined) {
  return entries.find(entry => entry.slug === slug);
}

