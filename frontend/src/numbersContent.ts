export type TreeEntry = {
  path_number: number;
  name: string;
  hebrew_letter: string | null;
  astrological_attribution: string | null;
  thoth_tarot_card: string | null;
  gd_tarot_card: string | null;
  is_swapped: number;
  color_scale_king: string | null;
  color_scale_queen: string | null;
  color_scale_emperor: string | null;
  color_scale_empress: string | null;
  god_name: string | null;
  archangel: string | null;
  angel_choir: string | null;
  crowley_tweaks: string | null;
  description: string | null;
};

export type GradeEntry = {
  id: string;
  name: string;
  system: string;
  tree_path_number: number;
  description: string;
};

export type WorkEntry = {
  id: string;
  liber_number: number | null;
  title: string;
  class: string;
  date_composed: string | null;
  location_composed: string | null;
  summary: string;
  document_id: string | null;
};

export type TermEntry = {
  id: string;
  term: string;
  gematria_value: number | null;
  etymology: string | null;
  definition: string;
  thelemic_significance: string;
  evidentiary_lane: string;
};

export type PersonEntry = {
  id: string;
  name: string;
  magical_motto: string | null;
  role_category: string;
  birth_year: number | null;
  death_year: number | null;
  biography: string;
};

export type NumberKind = 'sephirah' | 'path' | 'signature';

export type NumberEntry = {
  slug: string;
  number: number;
  kind: NumberKind;
  title: string;
  subtitle: string;
  glyphs: string[];
  summary: string;
  teaser: string;
  paragraphLead: string;
  treeEntry?: TreeEntry;
  grade?: GradeEntry;
  relatedWorks: string[];
  relatedTerms: string[];
  relatedPeople: string[];
};

const SEPHIROT_GLYPHS: Record<number, string[]> = {
  1: ['👑', '✶'],
  2: ['⚡', 'Δ'],
  3: ['🌙', '♄'],
  4: ['♃', '🏛️'],
  5: ['♂', '⚔️'],
  6: ['☉', '🜂'],
  7: ['♀', '🌹'],
  8: ['☿', '✒️'],
  9: ['☾', '🕯️'],
  10: ['🌍', '🜃'],
};

const PATH_GLYPHS: Record<number, string[]> = {
  11: ['א', '🃏', '🌬️'],
  12: ['ב', '🪄', '☿'],
  13: ['ג', '🌕', '👸'],
  14: ['ד', '♀', '👑'],
  15: ['ה', '♒', '✨'],
  16: ['ו', '♉', '⛩️'],
  17: ['ז', '♊', '💞'],
  18: ['ח', '♋', '🛡️'],
  19: ['ט', '♌', '🔥'],
  20: ['י', '♍', '🕯️'],
  21: ['כ', '♃', '🎡'],
  22: ['ל', '♎', '⚖️'],
  23: ['מ', '🌊', '🪝'],
  24: ['נ', '♏', '☠️'],
  25: ['ס', '♐', '🜍'],
  26: ['ע', '♑', '🐐'],
  27: ['פ', '♂', '🏚️'],
  28: ['צ', '♈', '👑'],
  29: ['ק', '♓', '🌫️'],
  30: ['ר', '☉', '☀️'],
  31: ['ש', '🔥', '🜏'],
  32: ['ת', '♄', '🌐'],
};

const SPECIAL_NUMBER_DEFS: {
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  glyphs: string[];
  summary: string;
  teaser: string;
  paragraphLead: string;
  relatedWorks: string[];
  relatedTerms: string[];
  relatedPeople: string[];
}[] = [
  {
    number: 93,
    slug: '93',
    title: '93',
    subtitle: 'Thelema and Agape',
    glyphs: ['93', '☉', '❤️'],
    summary: 'The famous 93 formula is the social handshake of Thelema: one word for Will, one word for Love, both lit by the same current.',
    teaser: 'Crowley liked 93 because it let doctrine travel as greeting, signature, and password all at once.',
    paragraphLead: '93 is the compact number in which Thelema and Agape are made to echo each other through gematria, so the number acts like a little doctrinal handshake rather than a mere count.',
    relatedWorks: ['Liber AL vel Legis'],
    relatedTerms: ['Thelema', 'Agape'],
    relatedPeople: ['Aleister Crowley'],
  },
  {
    number: 156,
    slug: '156',
    title: '156',
    subtitle: 'Babalon Current',
    glyphs: ['156', '🜏', '🌹'],
    summary: '156 compresses Babalon into a number Crowley can wear like a badge, a warning, or a joke that still works after the room gets quiet.',
    teaser: 'It is the kind of number that lets Crowley turn the Scarlet Woman into a filing category and a theatrical pose.',
    paragraphLead: '156 is the Babalon number, and in Crowley it behaves as both a symbolic key and a bit of stylish provocation.',
    relatedWorks: ['The Book of Thoth'],
    relatedTerms: ['Babalon', 'Scarlet Woman'],
    relatedPeople: ['Aleister Crowley', 'Leah Hirsig'],
  },
  {
    number: 220,
    slug: '220',
    title: '220',
    subtitle: 'Liber AL Vel Legis',
    glyphs: ['220', '📜', '☉'],
    summary: '220 is the book-number of Liber AL, which makes it the page where revelation, argument, and the beginning of the Aeon all get the same shelf label.',
    teaser: 'If 93 is the greeting, 220 is the opening scene.',
    paragraphLead: '220 is the Liber number of Liber AL vel Legis, the text that opens the Thelemic frame and gives the archive its doctrinal starting point.',
    relatedWorks: ['Liber AL vel Legis'],
    relatedTerms: ['Thelema', 'Aeon of Horus', 'Aiwass'],
    relatedPeople: ['Aleister Crowley', 'Rose Edith Kelly'],
  },
  {
    number: 418,
    slug: '418',
    title: '418',
    subtitle: 'Abrahadabra and the Abyss',
    glyphs: ['418', '🜍', '🌌'],
    summary: '418 is the big threshold number in Crowley’s symbolic theater, the place where the Great Work starts sounding like a stage direction.',
    teaser: 'It is a number that likes to arrive dressed as a formula.',
    paragraphLead: '418 is one of Crowley’s threshold numbers, the one he uses for the formula of the Great Work and the crossing of the Abyss.',
    relatedWorks: ['The Vision and the Voice'],
    relatedTerms: ['Holy Guardian Angel'],
    relatedPeople: ['Aleister Crowley', 'Victor Neuburg'],
  },
  {
    number: 666,
    slug: '666',
    title: '666',
    subtitle: 'The Beast 666',
    glyphs: ['666', '🐉', '🜏'],
    summary: '666 is Crowley’s most famous self-handle, the number that turns insult into signature and scandal into brand architecture.',
    teaser: 'The joke, if it is a joke, is that Crowley made the critics help him sell the mask.',
    paragraphLead: '666 is the Beast number, and Crowley wears it as a persona, a provocation, and a way of telling the world that the insult has already been repurposed.',
    relatedWorks: ['The Confessions of Aleister Crowley', 'Magick in Theory and Practice'],
    relatedTerms: ['Magick', 'True Will'],
    relatedPeople: ['Aleister Crowley'],
  },
  {
    number: 777,
    slug: '777',
    title: '777',
    subtitle: 'Qabalistic Correspondence Engine',
    glyphs: ['777', '🗂️', '✡️'],
    summary: '777 is the great filing cabinet of Crowley’s symbolic system, the place where names, planets, gods, letters, colors, and cards all learn to sit still for a table.',
    teaser: 'If you want the system as a machine, 777 is where the machine’s drawers open.',
    paragraphLead: '777 is the correspondence book, and in the portal it functions like a database before databases: a table of symbolic relations that lets the rest of the system stay navigable.',
    relatedWorks: ['777 and Other Qabalistic Writings', 'The Book of Thoth'],
    relatedTerms: ['Thelema', 'Magick'],
    relatedPeople: ['Aleister Crowley'],
  },
];

function sentence(text: string) {
  const trimmed = text.trim().replace(/\s+/g, ' ').replace(/\.$/, '');
  return trimmed ? `${trimmed}.` : '';
}

function compact(text: string | null | undefined) {
  return text ? text.replace(/\s+/g, ' ').trim() : '';
}

function ordinal(value: number) {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

function cardGlyphsForTree(entry: TreeEntry): string[] {
  if (entry.path_number <= 10) {
    return SEPHIROT_GLYPHS[entry.path_number] ?? [String(entry.path_number)];
  }
  return PATH_GLYPHS[entry.path_number] ?? [entry.hebrew_letter || String(entry.path_number)];
}

function cardSummaryForTree(entry: TreeEntry, grade?: GradeEntry) {
  const primary = compact(entry.description || entry.crowley_tweaks || entry.name);
  const gradeBit = grade
    ? ` It also sits under ${grade.name}, which keeps the initiation ladder visible beside the diagram.`
    : '';
  return sentence(`${primary}${gradeBit}`);
}

function buildTreeParagraphs(entry: TreeEntry, grade?: GradeEntry) {
  const paragraphs: string[] = [];
  if (entry.path_number <= 10) {
    paragraphs.push(
      sentence(
        `${entry.name} is the ${ordinal(entry.path_number)} station on Crowley’s Tree of Life, and in 777 it functions as a node rather than a bridge: a place where divine names, archangels, angelic orders, and color scales all stack on top of one another.`,
      ) +
        ' ' +
        sentence(
          `That layering is the point. Crowley is not just naming things; he is teaching the reader to think in correspondences, so each sephirah becomes a compact explanation of how the cosmos, the body, and the training path mirror one another.`,
        ),
    );
    paragraphs.push(
      sentence(
        `The 777 logic shows up in the details: ${entry.color_scale_king || 'the King scale'} in one column, ${entry.color_scale_queen || 'the Queen scale'} in another, ${entry.color_scale_emperor || 'the Emperor scale'} and ${entry.color_scale_empress || 'the Empress scale'} for the same number when the diagram shifts gear.`,
      ) +
        ' ' +
        sentence(
          `The point is not that one list is prettier than another; it is that Crowley wants the student to see the same number under multiple lights and realize that number, color, deity, and order are all doing the same work from different angles.`,
        ),
    );
    if (grade) {
      paragraphs.push(
        sentence(
          `Crowley’s grade system keeps this number live inside initiation: ${grade.name} marks the step on the ladder where the number stops being an abstract place on a chart and starts being a task, a discipline, or a psychological weather pattern.`,
        ) +
          ' ' +
          sentence(
            `The inside joke is that the order keeps saying “the next step will explain the previous one,” and then the student discovers that the explanation is more work, not less.`,
          ),
      );
    }
    paragraphs.push(
      sentence(
        `${entry.crowley_tweaks || entry.description || entry.name} In the Book of Thoth, the same number is still a living station, but Crowley presses the card-image harder so the sephirah reads like an argument rather than a static emblem.`,
      ) +
        ' ' +
        sentence(
          `That is the Crowley move in miniature: keep the old Qabalistic furniture, then make it talk back in a more theatrical dialect.`,
        ),
    );
    paragraphs.push(
      sentence(
        `Read as a whole, the number is not a statistic; it is a training room. 777 gives the table, the Tree gives the ladder, and the grade gives the practical joke that the ladder only matters if someone actually climbs it.`,
      ),
    );
    return paragraphs;
  }

  paragraphs.push(
    sentence(
      `${entry.hebrew_letter || `Path ${entry.path_number}`} is the number ${entry.path_number} on the Tree, and Crowley treats it as a bridge rather than a chamber: a route where a Hebrew letter, a planetary or zodiacal power, and a tarot trump are all made to carry the same symbolic load.`,
    ) +
      ' ' +
      sentence(
        `That is what 777 does all over the map. It refuses to let the letter sit alone, so every path becomes a little argument about how relation works: above and below, force and form, letter and image, letter and number.`,
      ),
  );
  paragraphs.push(
    sentence(
      `The Golden Dawn version and the Thoth version both live here, which is where Crowley starts his favorite habit of turning an editorial decision into a doctrinal event. ${entry.gd_tarot_card || 'The older order'} points one way; ${entry.thoth_tarot_card || 'the Thoth deck'} points another; and the student is expected to understand why the wobble matters.`,
    ) +
      ' ' +
      sentence(
        `${entry.crowley_tweaks || 'Crowley’s note preserves the change so the reader can see that the revision was deliberate.'} In other words, he does not hide the argument; he makes the argument part of the card.`,
      ),
  );
  if (entry.is_swapped) {
    paragraphs.push(
      sentence(
        `This is one of the swapped paths, which is the kind of Crowley move that makes traditionalists grumble and Thoth readers nod knowingly: the map is not just inherited, it is edited.`,
      ) +
        ' ' +
        sentence(
          `The joke inside the joke is that a swap can look like heresy or clarity depending on whether you are trying to preserve the old atlas or understand the new one.`,
        ),
    );
  }
  paragraphs.push(
    sentence(
      `In practical terms, the path teaches the same lesson as the rest of the system: when Crowley says “correspondence,” he means a disciplined way of seeing that lets tarot, astrology, Hebrew letter, and initiatory route all illuminate one another without collapsing into a single bland meaning.`,
    ) +
      ' ' +
      sentence(
        `That is why the path cards matter in both 777 and the Book of Thoth: one is the table that lets you file the cosmos, the other is the commentary that insists the filing system is itself a magical performance.`,
      ),
  );
  paragraphs.push(
    sentence(
      `Seen from the portal’s point of view, the number is useful because it makes the archive legible. A card can point to a path, the path can point to a grade, and the grade can point back to the lived problem of what it means to move through a system that keeps asking you to become the symbol it just handed you.`,
    ),
  );
  return paragraphs;
}

function buildSignatureParagraphs(entry: NumberEntry) {
  const { number, title } = entry;
  if (number === 93) {
    return [
      sentence(
        `93 is the easiest Crowley number to say out loud and one of the hardest to reduce, because it is both a greeting and a doctrine: Thelema and Agape folded together into a compact social code.`,
      ),
      sentence(
        `On the page it works almost like a password. In letters, signatures, and ritual shorthand, the number lets the community say “Will” and “Love” in one breath while also pretending they are only exchanging a clever numerical joke.`,
      ),
      sentence(
        `The deeper point is that gematria is not decorative here. Crowley wants the reader to feel that meaning can be compressed into number without being emptied out, and 93 is the cleanest example of that trick.`,
      ),
      sentence(
        `The joke is that a serious doctrine can still behave like a bit of in-group banter. 93 is the number that says “I know the code,” while also reminding you that the code itself is supposed to be lived, not merely admired.`,
      ),
      sentence(
        `In the portal, 93 points back to Thelema, Agape, and the whole social atmosphere in which the movement learned to greet itself as if language were already a magical act.`,
      ),
    ];
  }
  if (number === 156) {
    return [
      sentence(
        `156 is the Babalon number, and in Crowley’s hands it becomes a compact way to point at the Scarlet Woman current without having to unpack the whole myth every time.`,
      ),
      sentence(
        `That makes it both a symbol and a label. In the right room it can function like a badge of belonging; in the wrong room it looks like a private joke that escaped from the ritual page and wandered into ordinary conversation.`,
      ),
      sentence(
        `The number matters because Crowley uses it to keep the feminine current of liberation, desire, ordeal, and transformation visible. It is not a soft number, and it is not merely a pretty one.`,
      ),
      sentence(
        `The inside joke is that the thing Crowley treats as a sacred key is also the sort of thing he loved to let critics misunderstand first. He gets a little extra mileage out of that confusion.`,
      ),
      sentence(
        `In the portal, 156 is where Babalon stops being a floating idea and becomes a precise numerical anchor inside Crowley’s symbolic system.`,
      ),
    ];
  }
  if (number === 220) {
    return [
      sentence(
        `220 is Liber AL vel Legis, the book-number attached to the text that opens the Thelemic system and gives the archive its doctrinal starting line.`,
      ),
      sentence(
        `Crowley does not use that number as a decorative catalog tag. It marks a threshold: the text is not just one work among others, but the one through which the rest of the modern Thelemic vocabulary gets framed.`,
      ),
      sentence(
        `That means 220 sits at the junction of revelation and filing. It is the number of the text that tells you how to read the other numbers, which is exactly the kind of recursive move Crowley enjoyed.`,
      ),
      sentence(
        `The practical joke is that a revelation text arrives with a library label. Crowley’s system loves that tension because it lets mysticism sound organized and organization sound cosmic.`,
      ),
      sentence(
        `In the portal, 220 is the book-number that keeps the Cairo Working and the new Aeon narrative pinned to a specific object rather than a vaporous myth.`,
      ),
    ];
  }
  if (number === 418) {
    return [
      sentence(
        `418 is one of Crowley’s threshold numbers, tied to the formula of the Great Work and to the symbolic drama of crossing beyond ordinary identity.`,
      ),
      sentence(
        `It has a kind of theatrical force. When Crowley reaches for 418, he is talking about an experience that feels like more than a grade or a card: it is a formula, a transition, and a declaration that the old self is no longer enough.`,
      ),
      sentence(
        `The Vision and the Voice makes the number feel even more like an altitude marker. It is a number that tells you the map has become an ordeal and the ordeal has become a map.`,
      ),
      sentence(
        `The joke is that the number sounds technical right up until it becomes existential. That is very Crowley: the table and the abyss are often the same door from different angles.`,
      ),
      sentence(
        `In the portal, 418 links visionary work, the formula of transformation, and the habit of treating symbolic numbers as if they were weather reports from the soul.`,
      ),
    ];
  }
  if (number === 666) {
    return [
      sentence(
        `666 is the Beast number, and Crowley treats it as a persona, a provocation, and a deliberate act of self-mythologizing all at once.`,
      ),
      sentence(
        `The move is simple and mischievous: take a number that sounds like an accusation and turn it into a signature that still fits on a title page. Crowley liked giving his enemies the honor of marketing his legend for him.`,
      ),
      sentence(
        `The deeper point is that the Beast number belongs to the drama of Will. It is not there to flatter the ego; it is there to give the ego a mask serious enough to be interrogated.`,
      ),
      sentence(
        `The inside joke is that Crowley’s most notorious label also became one of his most efficient public brands. He made scandal legible, then made legibility useful.`,
      ),
      sentence(
        `In the portal, 666 is where persona, propaganda, and occult self-construction collide in the most Crowley-like way possible.`,
      ),
    ];
  }
  if (number === 777) {
    return [
      sentence(
        `777 is the correspondence table, and that means it behaves less like a book to read once and more like a filing system for the entire symbolic universe Crowley wanted to keep track of.`,
      ),
      sentence(
        `Its genius is practical. The work lets a reader move from letters to planets, from gods to colors, from tarot to angelic orders, and from one symbolic shelf to another without pretending that any one shelf is the whole truth.`,
      ),
      sentence(
        `Book of Thoth depends on that habit of reading. The tarot manual is really 777 with commentary, a place where the table becomes a living set of arguments about what the cards mean and why the correspondences matter.`,
      ),
      sentence(
        `The in-group joke is that Crowley made the cosmos look like office furniture. But that is precisely the point: the magician must be able to sit inside the filing cabinet and still find the drawer labeled “transformation.”`,
      ),
      sentence(
        `In the portal, 777 is the number that explains why Crowley’s system feels so modular: because he treated meaning as something that could be cross-indexed without being flattened.`,
      ),
    ];
  }
  return [
    sentence(`${title} is one of Crowley’s signature numbers, and the portal keeps it here as a compact entry in the symbolic ledger.`),
    sentence(`It belongs to the same family of thinking as the more famous numbers: compressed meaning, ritual shorthand, and a habit of making the number do cultural work.`),
    sentence(`The main job of the page is to show that numbers in Crowley are never only numerals; they are labels for relationships, moods, orders, and narrative positions.`),
    sentence(`The page also keeps the number tied to the rest of the archive so it can be read as part of a system rather than as a trivia fact.`),
    sentence(`In the portal, the number is a small encyclopedia heading that opens onto a larger web of doctrine and reception.`),
  ];
}

function buildSignatureSummary(entry: NumberEntry) {
  return sentence(entry.summary);
}

function buildSignatureCardTeaser(entry: NumberEntry) {
  return sentence(entry.teaser);
}

export function buildNumberEntries(
  treeEntries: TreeEntry[],
  grades: GradeEntry[],
  works: WorkEntry[],
  terms: TermEntry[],
  people: PersonEntry[] = [],
) {
  const gradeByPath = new Map(grades.map(grade => [grade.tree_path_number, grade]));
  const workByTitle = new Map(works.map(work => [work.title, work]));
  const termByTerm = new Map(terms.map(term => [term.term, term]));
  const personByName = new Map(people.map(person => [person.name, person]));

  const treeNumberEntries: NumberEntry[] = treeEntries
    .slice()
    .sort((left, right) => left.path_number - right.path_number)
    .map(entry => {
      const grade = gradeByPath.get(entry.path_number);
      const isSephirah = entry.path_number <= 10;
      const title = isSephirah ? entry.name : `${entry.path_number}: ${entry.hebrew_letter || entry.name}`;
      const subtitle = isSephirah ? `Tree station ${entry.path_number}` : `${entry.astrological_attribution || 'Path'} · ${entry.thoth_tarot_card || 'Thoth card'}`;
      return {
        slug: `tree-${entry.path_number}`,
        number: entry.path_number,
        kind: isSephirah ? 'sephirah' : 'path',
        title,
        subtitle,
        glyphs: cardGlyphsForTree(entry),
        summary: cardSummaryForTree(entry, grade),
        teaser: isSephirah
          ? `${entry.name} is the ${ordinal(entry.path_number)} station of the Tree, and Crowley makes it carry both a cosmological role and a training implication.`
          : `${entry.hebrew_letter || `Path ${entry.path_number}`} is one of the bridges where Crowley makes letter, planet, and tarot share the same rail.`,
        paragraphLead: entry.path_number <= 10
          ? `${entry.name} is the ${ordinal(entry.path_number)} station on the Tree.`
          : `${entry.hebrew_letter || `Path ${entry.path_number}`} is the bridge numbered ${entry.path_number}.`,
        treeEntry: entry,
        grade,
        relatedWorks: entry.path_number <= 10
          ? ['777 and Other Qabalistic Writings', 'The Book of Thoth']
          : ['777 and Other Qabalistic Writings', 'The Book of Thoth'],
        relatedTerms: entry.path_number <= 10 ? ['Thelema', 'Magick'] : ['Qabalah', 'Tarot', 'Correspondence'],
        relatedPeople: ['Aleister Crowley'],
      } satisfies NumberEntry;
    });

  const signatureEntries: NumberEntry[] = SPECIAL_NUMBER_DEFS.map(def => {
    const relatedWorks = def.relatedWorks
      .map(title => workByTitle.get(title))
      .filter((work): work is WorkEntry => Boolean(work))
      .map(work => work.title);
    const relatedTerms = def.relatedTerms
      .map(term => termByTerm.get(term))
      .filter((term): term is TermEntry => Boolean(term))
      .map(term => term.term);
    const relatedPeople = def.relatedPeople
      .map(person => personByName.get(person))
      .filter((person): person is PersonEntry => Boolean(person))
      .map(person => person.name);

    return {
      slug: `sig-${def.slug}`,
      number: def.number,
      kind: 'signature',
      title: def.title,
      subtitle: def.subtitle,
      glyphs: def.glyphs,
      summary: buildSignatureSummary({
        slug: `sig-${def.slug}`,
        number: def.number,
        kind: 'signature',
        title: def.title,
        subtitle: def.subtitle,
        glyphs: def.glyphs,
        summary: def.summary,
        teaser: def.teaser,
        paragraphLead: def.paragraphLead,
        relatedWorks,
        relatedTerms,
        relatedPeople,
      }),
      teaser: buildSignatureCardTeaser({
        slug: `sig-${def.slug}`,
        number: def.number,
        kind: 'signature',
        title: def.title,
        subtitle: def.subtitle,
        glyphs: def.glyphs,
        summary: def.summary,
        teaser: def.teaser,
        paragraphLead: def.paragraphLead,
        relatedWorks,
        relatedTerms,
        relatedPeople,
      }),
      paragraphLead: def.paragraphLead,
      relatedWorks,
      relatedTerms,
      relatedPeople,
    } satisfies NumberEntry;
  });

  return [...treeNumberEntries, ...signatureEntries].sort((left, right) => left.number - right.number);
}

export function buildNumberCardCopy(entry: NumberEntry) {
  return `${entry.summary} ${entry.teaser}`;
}

export function buildNumberArticleParagraphs(entry: NumberEntry) {
  if (entry.kind === 'signature') {
    return buildSignatureParagraphs(entry);
  }
  const tree = entry.treeEntry;
  if (!tree) return [sentence(entry.summary)];
  return buildTreeParagraphs(tree, entry.grade);
}

export function getNumberEntryBySlug(entries: NumberEntry[], slug: string | undefined) {
  return entries.find(entry => entry.slug === slug);
}
