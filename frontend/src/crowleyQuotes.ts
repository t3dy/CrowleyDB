export type QuoteBlock = {
  quote: string;
  sourceTitle: string;
  citation: string;
  note?: string;
  sourceUrl?: string;
};

type MinimalWork = {
  id?: string;
  title: string;
  liber_number?: number | null;
};

type MinimalDocument = {
  id?: string;
  title: string;
};

type MinimalPerson = {
  id?: string;
  name: string;
  role_category?: string | null;
};

type MinimalNumber = {
  slug: string;
  number: number;
  kind: 'sephirah' | 'path' | 'signature';
  title: string;
};

type MinimalPrecursor = {
  slug: string;
  title: string;
  relatedCrowleyWorks: string[];
};

const normalizeKey = (value: string | null | undefined) =>
  value
    ? value
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    : '';

const makeQuote = (
  quote: string,
  sourceTitle: string,
  citation: string,
  note?: string,
  sourceUrl?: string,
): QuoteBlock => ({
  quote,
  sourceTitle,
  citation,
  note,
  sourceUrl,
});

const QUOTE_BY_TITLE: Record<string, QuoteBlock> = {
  'liber-al-vel-legis': makeQuote(
    'Do what thou wilt shall be the whole of the Law.',
    'Liber AL vel Legis',
    'I:40',
    'A doctrinal baseline for the revealed-text layer.',
    'https://hermetic.com/legis/index',
  ),
  'book-4-liber-aba': makeQuote(
    'Magick is the Science and Art of causing Change to occur in conformity with Will.',
    'Magick in Theory and Practice',
    'Introduction and Theorems',
    'A clean short citation for the manual and training pages.',
    'https://hermetic.com/crowley/book-4/defs',
  ),
  'the-vision-and-the-voice': makeQuote(
    'And the Voice of the Aethyr echoeth: It beams.',
    'The Vision and the Voice',
    'Cry of the 5th Aethyr (LIT)',
    'A short direct line from the Aethyr record that suits the visionary pages.',
    'https://hermetic.com/crowley/the-vision-and-the-voice/aethyr5',
  ),
  '777-and-other-qabalistic-writings': makeQuote(
    'The number 777 affords a good example of the legitimate and illegitimate deductions to be drawn.',
    '777 and Other Qabalistic Writings',
    'Liber LVIII: Qabalah, Gematria',
    'Crowley frames 777 as both an example and a test case for symbolic reading.',
    'https://hermetic.com/crowley/libers/lib58',
  ),
  'the-book-of-thoth': makeQuote(
    'THE TAROT is a pack of seventy-eight cards.',
    'The Book of Thoth',
    'Theory of the Tarot',
    'A clean citation for tarot, number, and path pages.',
    'https://hermetic.com/crowley/book-of-thoth/theory',
  ),
  'the-equinox-vol-i-no-1': makeQuote(
    'THE METHOD OF SCIENCE - THE AIM OF RELIGION.',
    'The Equinox, Vol. I, No. 1',
    'Motto and title page',
    'A strong citation for the publication and editorial lane.',
    'https://hermetic.com/crowley/equinox/i/i/index',
  ),
  'the-book-of-lies': makeQuote(
    'The number of the book is 333.',
    'The Book of Lies',
    'Title page commentary',
    'Ideal for title numerology and paradox pages.',
    'https://hermetic.com/crowley/the-book-of-lies/index',
  ),
  'liber-aleph-vel-cxi': makeQuote(
    'The true Will cannot err.',
    'Liber Aleph vel CXI',
    'De Somniis',
    'A compact line for the epistolary and initiatory pages.',
    'https://hermetic.com/crowley/libers/lib111',
  ),
  'the-diary-of-a-drug-fiend': makeQuote(
    'It is a terrible story; but it is also a story of hope and of beauty.',
    'The Diary of a Drug Fiend',
    'Preface',
    'A short exact line for the drug and travel pages.',
    'https://hermetic.com/crowley/the-diary-of-a-drug-fiend/preface',
  ),
  'the-confessions-of-aleister-crowley': makeQuote(
    'The secret of life is concentration.',
    'The Confessions of Aleister Crowley',
    'Chapter 68',
    'A self-interpretive line that suits biography and documentary pages.',
    'https://hermetic.com/crowley/confessions/chapter68',
  ),
};

const PERSON_QUOTE_BY_NAME: Record<string, QuoteBlock> = {
  'aleister-crowley': makeQuote(
    'The secret of life is concentration.',
    'The Confessions of Aleister Crowley',
    'Chapter 68',
    'Crowley frames his life as discipline, not only as notoriety.',
    'https://hermetic.com/crowley/confessions/chapter68',
  ),
  'rose-edith-kelly': makeQuote(
    'Every man and every woman is a star.',
    'Liber AL vel Legis',
    'I:3',
    'A fitting line for the Cairo Working and for a biography that resists flattening her into a footnote.',
    'https://hermetic.com/legis/new-comment/i.3',
  ),
  'victor-neuburg': makeQuote(
    'And the Voice of the Aethyr echoeth: It beams.',
    'The Vision and the Voice',
    'Cry of the 5th Aethyr (LIT)',
    "A visionary line that suits Neuburg's role in the desert Aethyr work.",
    'https://hermetic.com/crowley/the-vision-and-the-voice/aethyr5',
  ),
  'leah-hirsig': makeQuote(
    'This Ark or Lotus is then the Body of Our Lady BABALON.',
    'Liber Aleph vel CXI',
    'De Natura Silentii Nostri',
    "Crowley's Babalon language is the strongest short citation for her Thelemic role.",
    'https://hermetic.com/crowley/libers/lib111',
  ),
  'mary-desti': makeQuote(
    'It is a terrible story; but it is also a story of hope and of beauty.',
    'The Diary of a Drug Fiend',
    'Preface',
    "Useful for a socially oriented biography because it preserves Crowley's balance of danger and aspiration.",
    'https://hermetic.com/crowley/the-diary-of-a-drug-fiend/preface',
  ),
  'allan-bennett': makeQuote(
    'The method of science, the aim of religion.',
    'The Equinox, Vol. I, No. 1',
    'Motto and title page',
    'A useful citation for Bennett because it bridges discipline and occult study.',
    'https://hermetic.com/crowley/equinox/i/i/index',
  ),
  'frieda-harris': makeQuote(
    'THE TAROT is a pack of seventy-eight cards.',
    'The Book of Thoth',
    'Theory of the Tarot',
    'A direct tarot citation for the artist of the Thoth deck.',
    'https://hermetic.com/crowley/book-of-thoth/theory',
  ),
  'frida-harris': makeQuote(
    'THE TAROT is a pack of seventy-eight cards.',
    'The Book of Thoth',
    'Theory of the Tarot',
    'A direct tarot citation for the artist of the Thoth deck.',
    'https://hermetic.com/crowley/book-of-thoth/theory',
  ),
  'macgregor-mathers': makeQuote(
    'The number 777 affords a good example of the legitimate and illegitimate deductions to be drawn.',
    '777 and Other Qabalistic Writings',
    'Liber LVIII: Qabalah, Gematria',
    'A practical citation for the Golden Dawn inheritance line.',
    'https://hermetic.com/crowley/libers/lib58',
  ),
  'w-b-yeats': makeQuote(
    'The word of Sin is Restriction.',
    'Liber AL vel Legis',
    'I:41',
    'A short line that suits a biography shaped by public conflict and polemical difference.',
    'https://hermetic.com/legis/new-comment/i.41',
  ),
  'jane-wolfe': makeQuote(
    'Magick is the Science and Art of causing Change to occur in conformity with Will.',
    'Magick in Theory and Practice',
    'Introduction and Theorems',
    'A good short citation for the disciplined training life around the Abbey years.',
    'https://hermetic.com/crowley/book-4/defs',
  ),
  'kenneth-grant': makeQuote(
    'And the Voice of the Aethyr echoeth: It beams.',
    'The Vision and the Voice',
    'Cry of the 5th Aethyr (LIT)',
    "A good short citation for later occultist reception of Crowley's visionary grammar.",
    'https://hermetic.com/crowley/the-vision-and-the-voice/aethyr5',
  ),
};

const TOPIC_QUOTE_BY_SLUG: Record<string, QuoteBlock> = {
  magick: QUOTE_BY_TITLE['book-4-liber-aba'],
  initiation: QUOTE_BY_TITLE['book-4-liber-aba'],
  drugs: QUOTE_BY_TITLE['the-diary-of-a-drug-fiend'],
  sex: makeQuote(
    'This Ark or Lotus is then the Body of Our Lady BABALON.',
    'Liber Aleph vel CXI',
    'De Natura Silentii Nostri',
    'A concise Crowley line for the sexual current as doctrine, symbol, and ritual power.',
    'https://hermetic.com/crowley/libers/lib111',
  ),
  rivalry: QUOTE_BY_TITLE['the-confessions-of-aleister-crowley'],
  legal_trouble: makeQuote(
    'The word of Sin is Restriction.',
    'Liber AL vel Legis',
    'I:41',
    'Useful for pages where the archive needs to frame conflict as restriction, refusal, or coercive order.',
    'https://hermetic.com/legis/new-comment/i.41',
  ),
  publication: QUOTE_BY_TITLE['the-equinox-vol-i-no-1'],
  travel: QUOTE_BY_TITLE['the-diary-of-a-drug-fiend'],
  golden_dawn: makeQuote(
    'The student must FIRST obtain a thorough knowledge of "Book 777."',
    'Liber O vel Manus et Sagittae',
    'Instruction on the Tree of Life',
    'Crowley explicitly points the student to 777 for the Golden Dawn inheritance line.',
    'https://hermetic.com/crowley/equinox/i/ii/eqi02003',
  ),
  thelema: QUOTE_BY_TITLE['liber-al-vel-legis'],
};

const NUMBER_QUOTE_BY_SLUG: Record<string, QuoteBlock> = {
  '93': QUOTE_BY_TITLE['liber-al-vel-legis'],
  '156': makeQuote(
    'This Ark or Lotus is then the Body of Our Lady BABALON.',
    'Liber Aleph vel CXI',
    'De Natura Silentii Nostri',
    'A compact citation for the Babalon number and the Scarlet Woman current.',
    'https://hermetic.com/crowley/libers/lib111',
  ),
  '220': QUOTE_BY_TITLE['liber-al-vel-legis'],
  '418': QUOTE_BY_TITLE['the-vision-and-the-voice'],
  '666': makeQuote(
    '666 The great wild beast',
    'Liber Aleph vel CXI',
    'Opening epistle heading',
    "Crowley's self-signature is the cleanest short citation for the Beast number.",
    'https://hermetic.com/crowley/libers/lib111',
  ),
  '777': QUOTE_BY_TITLE['777-and-other-qabalistic-writings'],
};

const PRECURSOR_QUOTE_BY_SLUG: Record<string, QuoteBlock> = {
  agrippa: QUOTE_BY_TITLE['777-and-other-qabalistic-writings'],
  'pythagorean-number': QUOTE_BY_TITLE['book-4-liber-aba'],
  'platonic-neoplatonic-ascent': QUOTE_BY_TITLE['the-vision-and-the-voice'],
  'hermetic-correspondence': QUOTE_BY_TITLE['777-and-other-qabalistic-writings'],
  'golden-dawn-tables': QUOTE_BY_TITLE['777-and-other-qabalistic-writings'],
  'crowley-revision': QUOTE_BY_TITLE['the-book-of-thoth'],
};

const fallbackWorkQuote = QUOTE_BY_TITLE['book-4-liber-aba'];
const fallbackDocumentQuote = QUOTE_BY_TITLE['the-confessions-of-aleister-crowley'];
const fallbackPersonQuote = QUOTE_BY_TITLE['liber-al-vel-legis'];
const fallbackTopicQuote = QUOTE_BY_TITLE['the-book-of-thoth'];
const fallbackNumberQuote = QUOTE_BY_TITLE['book-4-liber-aba'];
const fallbackPrecursorQuote = QUOTE_BY_TITLE['777-and-other-qabalistic-writings'];

function pickQuoteFromKeys(keys: Array<string | null | undefined>, fallback: QuoteBlock) {
  for (const key of keys) {
    const normalized = normalizeKey(key);
    if (!normalized) continue;
    const quote = QUOTE_BY_TITLE[normalized];
    if (quote) return quote;
  }
  return fallback;
}

export function getWorkQuote(work?: MinimalWork | null) {
  if (!work) return fallbackWorkQuote;
  return pickQuoteFromKeys([work.id, work.title, work.liber_number ? `Liber ${work.liber_number}` : null], fallbackWorkQuote);
}

export function getDocumentQuote(document?: MinimalDocument | null, relatedWorkTitles: string[] = []) {
  if (!document) return fallbackDocumentQuote;
  return pickQuoteFromKeys([document.id, document.title, ...relatedWorkTitles], fallbackDocumentQuote);
}

export function getPersonQuote(person?: MinimalPerson | null, relatedWorkTitles: string[] = []) {
  if (!person) return fallbackPersonQuote;
  const direct = PERSON_QUOTE_BY_NAME[normalizeKey(person.name)];
  if (direct) return direct;

  const fromRelatedWorks = pickQuoteFromKeys(relatedWorkTitles, fallbackPersonQuote);
  if (fromRelatedWorks !== fallbackPersonQuote) return fromRelatedWorks;

  if (person.role_category && normalizeKey(person.role_category) === 'rival') {
    return QUOTE_BY_TITLE['the-book-of-lies'];
  }

  return fallbackPersonQuote;
}

export function getTopicQuote(topicSlug?: string | null, relatedWorkTitles: string[] = []) {
  if (!topicSlug) return fallbackTopicQuote;
  const direct = TOPIC_QUOTE_BY_SLUG[normalizeKey(topicSlug)];
  if (direct) return direct;
  return pickQuoteFromKeys(relatedWorkTitles, fallbackTopicQuote);
}

export function getNumberQuote(entry?: MinimalNumber | null, relatedWorkTitles: string[] = []) {
  if (!entry) return fallbackNumberQuote;
  const direct = NUMBER_QUOTE_BY_SLUG[normalizeKey(entry.slug)];
  if (direct) return direct;

  if (entry.kind === 'signature') {
    return pickQuoteFromKeys(relatedWorkTitles, fallbackDocumentQuote);
  }

  if (entry.kind === 'sephirah') {
    return QUOTE_BY_TITLE['book-4-liber-aba'];
  }

  return QUOTE_BY_TITLE['the-book-of-thoth'];
}

export function getPrecursorQuote(entry?: MinimalPrecursor | null) {
  if (!entry) return fallbackPrecursorQuote;
  const direct = PRECURSOR_QUOTE_BY_SLUG[normalizeKey(entry.slug)];
  if (direct) return direct;

  return pickQuoteFromKeys(entry.relatedCrowleyWorks, fallbackPrecursorQuote);
}
