import type { Course } from '../courses'

const LANGS = [
  { code: 'es', name: 'Spanish',        family: 'Romance' },
  { code: 'fr', name: 'French',         family: 'Romance' },
  { code: 'pt', name: 'Portuguese',     family: 'Romance' },
  { code: 'it', name: 'Italian',        family: 'Romance' },
  { code: 'zh', name: 'Mandarin',       family: 'Sino-Tibetan' },
  { code: 'ja', name: 'Japanese',       family: 'Japonic' },
  { code: 'ko', name: 'Korean',         family: 'Koreanic' },
  { code: 'hi', name: 'Hindi',          family: 'Indo-Aryan' },
  { code: 'de', name: 'German',         family: 'Germanic' },
  { code: 'nl', name: 'Dutch',          family: 'Germanic' },
  { code: 'ru', name: 'Russian',        family: 'Slavic' },
  { code: 'ar', name: 'Arabic',         family: 'Semitic' },
  { code: 'sw', name: 'Swahili',        family: 'Bantu' },
  { code: 'ht', name: 'Haitian Creole', family: 'French Creole' },
]

type LangEntry = { code: string; name: string; family: string }

// ─── MODULE 1: SCRIPT / ALPHABET ──────────────────────────────────────────────
// Only for languages that require learning a new writing system first.
// Script languages: ja (Hiragana+Katakana), ko (Hangul), ru (Cyrillic),
//                   ar (Arabic), hi (Devanagari)

function buildScriptModule(lang: LangEntry, module: number): Course {
  const data: Record<string, {
    subtitle: string
    terms: { term: string; definition: string }[]
    content: string
    q: string
    options: string[]
    correct: number
    explanation: string
  }> = {
    ja: {
      subtitle: 'Master Hiragana and Katakana — the two phonetic alphabets you need before anything else',
      terms: [
        { term: 'Hiragana (ひらがな)', definition: '46 characters representing every syllable in Japanese. Used for native Japanese words, grammatical particles, and verb endings. Rounded, cursive shapes. You MUST know these before studying vocabulary.' },
        { term: 'Katakana (カタカナ)', definition: '46 angular characters representing the same sounds as hiragana, but used for foreign loanwords, foreign names, scientific terms, and emphasis. "Coffee" → コーヒー (kōhī). Same sounds, different symbols.' },
        { term: 'Romaji (ローマ字)', definition: 'The romanisation of Japanese — writing Japanese sounds in Latin letters. A temporary crutch for beginners ONLY. Relying on romaji past week one permanently handicaps your reading. Learn hiragana in week one, katakana in week two.' },
        { term: 'Mora / Haku (拍)', definition: 'Japanese is mora-timed, not syllable-timed. Each hiragana character = one mora of equal duration. "Sapporo" has 4 morae: sa-p-po-ro (サッポロ). The double consonant (っ/ッ) is itself a mora — a beat of silence.' },
        { term: 'Long Vowels (長音)', definition: 'A stretched vowel changes meaning: oba-san (おばさん) = aunt; obā-san (おばあさん) = grandmother. In hiragana, long vowels are written by adding the vowel: おお (ō), uu (うう). In katakana, a dash extends the vowel: コーヒー.' },
      ],
      content: `## Japanese — Writing System First

Before you learn a single word of Japanese, you must learn to read. Japanese uses three scripts simultaneously: **Hiragana**, **Katakana**, and **Kanji**. The good news: hiragana and katakana are phonetic — each symbol = one sound, always, no exceptions.

### Hiragana: The Foundation (Week 1)

Hiragana has 46 base characters, all representing consonant+vowel pairs (or standalone vowels). Learn them in this order:

**Row 1 — Vowels**: あ (a) い (i) う (u) え (e) お (o)

**Row 2 — K sounds**: か (ka) き (ki) く (ku) け (ke) こ (ko)

**Row 3 — S sounds**: さ (sa) し (shi) す (su) せ (se) そ (so)

**Row 4 — T sounds**: た (ta) ち (chi) つ (tsu) て (te) と (to)

**Row 5 — N sounds**: な (na) に (ni) ぬ (nu) ね (ne) の (no)

**Row 6 — H sounds**: は (ha) ひ (hi) ふ (fu) へ (he) ほ (ho)

**Row 7 — M sounds**: ま (ma) み (mi) む (mu) め (me) も (mo)

**Row 8 — Y sounds**: や (ya) ゆ (yu) よ (yo)

**Row 9 — R sounds**: ら (ra) り (ri) る (ru) れ (re) ろ (ro)

**Row 10 — W/N**: わ (wa) を (wo/o) ん (n)

Dakuten (゛) adds voicing: か→が (ka→ga), さ→ざ (sa→za), た→だ (ta→da), は→ば (ha→ba).
Handakuten (゜) adds p-sound: は→ぱ (ha→pa).

**Practice words in hiragana only**: あいさつ (aisatsu — greeting), きいて (kiite — listen), みず (mizu — water), ねこ (neko — cat), はな (hana — flower/nose).

### Katakana: Foreign Words (Week 2)

Katakana mirrors hiragana's sound system exactly, but uses angular shapes for loanwords:

ア (a) イ (i) ウ (u) エ (e) オ (o)
カ (ka) キ (ki) ク (ku) ケ (ke) コ (ko)

**Common katakana words you already know**:
- コーヒー (kōhī) — coffee
- テレビ (terebi) — television
- アイスクリーム (aisukurīmu) — ice cream
- スマートフォン (sumātofon) — smartphone
- レストラン (resutoran) — restaurant

### Special Symbols

- **っ / ッ** (small tsu): doubles the next consonant. きって (kitte — stamp), ざっし (zasshi — magazine).
- **ー** (long vowel bar, katakana only): stretches the preceding vowel. コーヒー = ko-o-hi-i.
- **Combination characters**: small や/ゆ/よ attach to i-column characters: き+ゃ = きゃ (kya), に+ゅ = にゅ (nyu).

### Kanji: The Third System

Kanji are Chinese characters adapted into Japanese. There are ~2,000 in common use. You do NOT need them immediately — but you will need them. Hiragana and katakana unlock reading now; kanji study begins in parallel with vocabulary from Module 3 onwards.

### Your Week-1 Target

Recognise and read all 46 hiragana characters without hesitation. Use flashcards (Anki), the hiragana chart on your wall, and write each character by hand at least 20 times. Speed matters: fluent hiragana reading is the gateway to everything in Japanese.`,
      q: 'Which script would you use to write the loanword "television" in Japanese?',
      options: ['Hiragana (ひらがな)', 'Katakana (カタカナ)', 'Kanji (漢字)', 'Romaji'],
      correct: 1,
      explanation: 'Foreign loanwords (gairaigo) are written in Katakana. "Television" → テレビ (terebi). Hiragana is for native Japanese words and grammar. Kanji represent meaning-based characters from Chinese. Romaji is only used in textbooks for beginners.',
    },
    ko: {
      subtitle: 'Learn Hangul — the world\'s most systematically designed alphabet — in one week',
      terms: [
        { term: 'Hangul (한글)', definition: 'The Korean alphabet, invented in 1443 by King Sejong. Unlike Chinese characters (which took years to learn), Hangul was designed to be learned in days. It is featural — consonant shapes represent the position of the tongue and lips when producing the sound.' },
        { term: 'Consonants (자음)', definition: '14 basic consonants: ㄱ(g/k) ㄴ(n) ㄷ(d/t) ㄹ(r/l) ㅁ(m) ㅂ(b/p) ㅅ(s) ㅇ(ng/silent) ㅈ(j) ㅊ(ch) ㅋ(k) ㅌ(t) ㅍ(p) ㅎ(h). Aspirated versions (ㅋ ㅌ ㅍ ㅊ) are pronounced with a puff of air.' },
        { term: 'Vowels (모음)', definition: '10 basic vowels built from three elements — a horizontal line (earth), a vertical line (human), and a dot (heaven). ㅏ(a) ㅑ(ya) ㅓ(eo) ㅕ(yeo) ㅗ(o) ㅛ(yo) ㅜ(u) ㅠ(yu) ㅡ(eu) ㅣ(i).' },
        { term: 'Syllable Block (음절)', definition: 'Korean is written in syllable blocks, not linear strings. Each block = initial consonant + vowel (+ optional final consonant). 한 = ㅎ(h) + ㅏ(a) + ㄴ(n) = "han." The spatial arrangement matters: vertical vowels (ㅏ ㅓ ㅣ) sit to the right of the consonant; horizontal vowels (ㅗ ㅜ ㅡ) sit below.' },
        { term: 'Batchim (받침)', definition: 'The final consonant in a syllable block. 닭 (dak — chicken) = ㄷ+ㅏ+ㄹ+ㄱ. Not all consonants appear as batchim; and when they do, their pronunciation can change depending on the following syllable. This pronunciation shift (연음 — linking) is a key feature to master.' },
      ],
      content: `## Korean — Hangul First

Korean is written exclusively in Hangul — a featural alphabet designed in 1443 to replace Chinese character learning with something ordinary people could master quickly. King Sejong succeeded: Hangul can be learned to read level in under a week. This is your Week 1 task.

### The Consonants (자음)

Hangul consonant shapes mimic the tongue and lip positions:

| Symbol | Sound | Mnemonic |
|--------|-------|----------|
| ㄱ | g (initial) / k (final) | Looks like the back of the tongue touching the roof of the mouth |
| ㄴ | n | Tongue touching the ridge behind teeth |
| ㄷ | d (initial) / t (final) | Like ㄴ with a roof |
| ㄹ | r/l | Flap between r and l |
| ㅁ | m | Shape of closed lips |
| ㅂ | b (initial) / p (final) | Lips opening — extension of ㅁ |
| ㅅ | s | Like teeth |
| ㅇ | silent (initial) / ng (final) | Circle — no shape of mouth = no sound |
| ㅈ | j | Like ㅅ with a base |
| ㅎ | h | Like a person with a hat — air from the throat |

**Aspirated** (strong breath): ㅋ(k) ㅌ(t) ㅍ(p) ㅊ(ch)
**Tense** (sharp, no breath): ㄲ(kk) ㄸ(tt) ㅃ(pp) ㅆ(ss) ㅉ(jj)

### The Vowels (모음)

Basic vowels — learn these cold:
- ㅏ = "ah" (like "father")
- ㅓ = "uh" (like "but")
- ㅗ = "oh" (like "go")
- ㅜ = "oo" (like "food")
- ㅡ = "eu" (no English equivalent — lips spread flat, sound from throat)
- ㅣ = "ee" (like "feet")

Add ㅇ (silent) before these to write pure vowels: 아(a), 어(eo), 오(o), 우(u), 으(eu), 이(i).

### Building Syllable Blocks

Every Korean syllable is written as a block:

**Pattern 1** (consonant + vertical vowel): 가 = ㄱ+ㅏ = "ga"
**Pattern 2** (consonant + horizontal vowel): 고 = ㄱ+ㅗ = "go"
**Pattern 3** (consonant + vowel + final consonant): 각 = ㄱ+ㅏ+ㄱ = "gak"

Practice words:
- 한국 (hanguk) — Korea: ㅎ+ㅏ+ㄴ / ㄱ+ㅜ+ㄱ
- 사람 (saram) — person: ㅅ+ㅏ / ㄹ+ㅏ+ㅁ
- 물 (mul) — water: ㅁ+ㅜ+ㄹ
- 밥 (bap) — rice/meal: ㅂ+ㅏ+ㅂ

### Week 1 Goal

Read all consonants and vowels instantly, and be able to sound out any syllable block — even if you don't know the word's meaning yet. Reading Korean syllables mechanically is achievable in 3-5 days of daily practice.`,
      q: 'How is the word 한 (han) structured in Hangul?',
      options: [
        'It is a single consonant ㅎ',
        'It is ㅎ (h) + ㅏ (a) + ㄴ (n) arranged in a syllable block',
        'It is three separate characters written left to right',
        'It uses a Chinese character with Korean pronunciation',
      ],
      correct: 1,
      explanation: 'Hangul is written in syllable blocks, not linear sequences. 한 = initial consonant ㅎ (h) + vowel ㅏ (a) + final consonant ㄴ (n), all arranged spatially in one block. This block-based system is what makes Korean visually distinct from other alphabets.',
    },
    ru: {
      subtitle: 'Learn the Cyrillic alphabet — 33 letters, many familiar — and start reading Russian in days',
      terms: [
        { term: 'Кириллица (Kirillitsa)', definition: 'The Cyrillic alphabet, created in the 9th century by Saints Cyril and Methodius for Slavic languages. Russian Cyrillic has 33 letters. About one-third look and sound like their Latin equivalents, one-third look like Latin letters but sound different (false friends), and one-third are entirely new shapes.' },
        { term: 'True Friends', definition: 'Cyrillic letters that match their Latin look and sound: А а (a), Е е (ye), К к (k), М м (m), О о (o), Т т (t). Learning these first gives you instant footholds.' },
        { term: 'False Friends (Ложные друзья)', definition: 'Letters that look Latin but sound different — the main trap: В в = "v" (not B), Н н = "n" (not H), Р р = "r" (not R), С с = "s" (not C), У у = "oo" (not U-as-in-up), Х х = "kh" (not X). Memorise these first to avoid hardwiring wrong sounds.' },
        { term: 'Soft Sign (Ь) and Hard Sign (Ъ)', definition: 'ь (soft sign) softens the preceding consonant — makes it "palatalized." день (den\' — day) vs ден (impossible). ъ (hard sign) separates a prefix from a root, indicating no palatalization: объявление (ob\'yavleniye — announcement). ь is very common; ъ is rare.' },
        { term: 'Stress (Ударение)', definition: 'Russian stress is unpredictable and not marked in standard text. Unstressed о is reduced to an "a" sound: молоко (milk) = ma-la-KO, not MO-lo-KO. Unstressed е/я are further reduced. Getting stress wrong is the single biggest cause of being misunderstood in Russian.' },
      ],
      content: `## Russian — Cyrillic First

Russian uses Cyrillic — 33 letters, learnable in 1-2 weeks. The good news: Russian is 100% phonetic once you know the script and the stress. Unlike English, Russian spelling reliably predicts pronunciation (with the one caveat of vowel reduction under stress).

### The 33 Letters

**Group 1 — True Friends** (look and sound like Latin):
А а (a), Е е (ye), К к (k), М м (m), О о (o), Т т (t)

**Group 2 — False Friends** (look familiar, sound different — memorise these):
| Cyrillic | Sounds like | NOT like |
|----------|-------------|----------|
| В в | "v" (vine) | B |
| Г г | "g" (go) | G (close enough) |
| Н н | "n" (no) | H |
| Р р | "r" (rolled) | R |
| С с | "s" (sun) | C |
| У у | "oo" (food) | U |
| Х х | "kh" (Bach) | X |

**Group 3 — New Letters** (no Latin equivalent):
| Cyrillic | Sound |
|----------|-------|
| Б б | b (bed) |
| Д д | d (dog) |
| Ж ж | zh (treasure) |
| З з | z (zoo) |
| И и | ee (feet) |
| Й й | y (yes) — short |
| Л л | l (lamp) |
| П п | p (pot) |
| Ф ф | f (fog) |
| Ц ц | ts (cats) |
| Ч ч | ch (church) |
| Ш ш | sh (shoe) |
| Щ щ | shch (fresh cheese) |
| Ъ ъ | hard sign — see terms |
| Ы ы | "ih" — no English equiv — between "i" and "u" |
| Ь ь | soft sign — softens consonant before it |
| Э э | e (pet) — not softened |
| Ю ю | yu (you) |
| Я я | ya (yard) |

### Vowel Reduction

Russian has 5 vowel letters that appear in stressed syllables. In unstressed positions:
- **О → А**: город (city) = GO-rod (stressed) but gorod in print; unstressed о → "a" sound
- **Е, Я → И**: when unstressed, shift toward "ih" sound

This is why hearing Russians speak sounds fast and compressed — vowels shrink when not stressed.

### Reading Practice

Sound out these Russian words you already know:
- МЕТРО → metro (subway)
- КОФЕ → kofe (coffee)
- ТАКСИ → taksi (taxi)
- БАНК → bank
- ИНТЕРНЕТ → internet
- РЕСТОРАН → restoran (restaurant)

### Week 1 Goal

Recognise all 33 Cyrillic letters instantly, read Russian words aloud (even if you don't know their meaning), and have the false friends permanently memorised. With 20 minutes of daily practice, this is achievable in 5-7 days.`,
      q: 'Which of these Cyrillic letters is a "false friend" — it looks like a Latin letter but sounds different?',
      options: ['А а (sounds like "ah")', 'Р р (looks like R, sounds like "r" rolled)', 'К к (sounds like "k")', 'М м (sounds like "m")'],
      correct: 1,
      explanation: 'Р р is the classic false friend: it looks exactly like the Latin R but in Russian it represents the rolled "r" sound. А, К, and М are true friends — they look like their Latin counterparts AND sound similar. False friends (Н=n, В=v, С=s, У=oo, Х=kh, Р=r) must be memorised explicitly to avoid reading errors.',
    },
    ar: {
      subtitle: 'Arabic script from scratch — right-to-left, 28 letters, and connected writing',
      terms: [
        { term: 'Arabic Script (الكتابة العربية)', definition: 'Arabic is written right-to-left. The alphabet has 28 letters, all consonants — vowel sounds are either implied by context or marked as small diacritics (tashkeel/harakat) in teaching materials and the Quran. Most everyday text omits vowel marks.' },
        { term: 'Letter Forms', definition: 'Every Arabic letter has up to 4 forms depending on position in a word: isolated (standalone), initial (beginning of word), medial (middle of word), and final (end of word). Six letters (و ز ر ذ د ا) only connect to the preceding letter, never the following — words "break" after them.' },
        { term: 'Sun and Moon Letters (حروف شمسية وقمرية)', definition: 'When the definite article الـ (al-) precedes a "sun letter," the L assimilates to the first consonant: الشمس (al-shams → ash-shams, "the sun"). With "moon letters," al- is pronounced fully: القمر (al-qamar, "the moon"). 14 sun letters, 14 moon letters.' },
        { term: 'Short Vowels (الحركات)', definition: 'Arabic has 3 short vowel sounds marked with diacritics: فَتْحَة (fatha) = "a" (a small stroke above), كَسْرَة (kasra) = "i" (stroke below), ضَمَّة (damma) = "u" (small loop above). In everyday text these are omitted — fluent readers infer from context.' },
        { term: 'Emphatic Consonants (الأصوات المفخمة)', definition: 'Arabic has "emphatic" or "pharyngealized" versions of ص ض ط ظ — these are pronounced with the back of the tongue raised and the throat constricted, giving a "darker," rounder quality to surrounding vowels. "a" near ص sounds like "au" in "caught." These distinguish Arabic from related Semitic languages.' },
      ],
      content: `## Arabic — Script First

Arabic is the 5th most-spoken language in the world, the liturgical language of Islam, and the root of thousands of words in Spanish, English, Persian, Turkish, Urdu, and Swahili. Its script looks daunting from the outside. Up close, it is a logical system of 28 letters that follow consistent rules.

### Right-to-Left Reading

Arabic reads from right to left, top to bottom. When Arabic and English text appear together (as in this lesson), Arabic text is right-justified. Your eye learns to track right-to-left faster than you expect — it is primarily a habit shift.

### The 28 Letters

Arabic letters are grouped by their base shape — some letters share a shape and are distinguished only by the number and position of dots:

**Group 1 — No dots**:
| Letter | Name | Sound |
|--------|------|-------|
| ا | Alif | Long "aa" vowel (or glottal stop) |
| و | Waw | W or long "oo" |
| ي | Ya | Y or long "ee" |
| ل | Lam | L |
| م | Meem | M |
| ن | Noon | N |
| ر | Ra | R (slightly rolled) |
| ز | Zayn | Z |

**Group 2 — Dots distinguish similar shapes**:
| Letters | Sounds |
|---------|--------|
| ب/ت/ث | B / T / TH (as in "think") |
| ج/ح/خ | J / H (pharyngeal) / KH (like Bach) |
| د/ذ | D / DH (as in "the") |
| س/ش | S / SH |
| ص/ض | emphatic S / emphatic D |
| ط/ظ | emphatic T / emphatic DH |
| ع/غ | ayin (voiced pharyngeal) / Ghayn (French R) |
| ف/ق | F / Q (deep k from throat) |
| ك | K |
| ه | H (lighter than ح) |

### Connected Writing in Practice

Arabic letters connect within words like cursive handwriting. The word كتب (kataba — he wrote):
- ك (ka) in initial form + ت (ta) in medial form + ب (ba) in final form = كتب

The six non-connecting letters (ا و ر ز د ذ) cause a word to "break" — the next letter starts fresh.

### The Definite Article: ال (al-)

All nouns are made definite by prefixing الـ: كتاب (kitaab — a book) → الكتاب (al-kitaab — the book). With sun letters, the L assimilates: الشمس = ash-shams (the sun), not al-shams.

### Arabic Dialects vs. Modern Standard Arabic (MSA)

**MSA (الفصحى, fuṣḥā)**: The standardised written form — used in news, books, official communication, and across all Arabic-speaking countries. What you're learning here is MSA.

**Dialects (العامية, ʿāmmīya)**: Each region has a spoken dialect — Egyptian, Levantine, Gulf, Moroccan — that can differ substantially. Egyptian Arabic is most widely understood due to Egypt's film and TV output.

**Strategy**: Learn MSA script and structure first. Egyptian or Levantine for conversational speaking. This combination unlocks both formal and informal Arabic.

### Week 1-2 Goal

Learn all 28 letter base shapes and their 4 positional forms. Be able to trace Arabic words letter by letter. Recognise the definite article ال. Do not worry about pronunciation nuance yet — that comes in Module 2.`,
      q: 'Why does the Arabic word الشمس (the sun) sound like "ash-shams" rather than "al-shams"?',
      options: [
        'Because Arabic pronunciation rules drop the L always',
        'Because ش (shin) is a sun letter — the L of ال assimilates to the following consonant',
        'Because it is an irregular word',
        'Because MSA and dialect differ here',
      ],
      correct: 1,
      explanation: 'ش is a sun letter (حرف شمسي). When the definite article الـ precedes a sun letter, the L assimilates (doubles and disappears) into the first consonant of the noun. So al+shams → ash-shams. Moon letters (like ق in القمر / al-qamar) keep the L fully pronounced. There are 14 sun letters and 14 moon letters.',
    },
    hi: {
      subtitle: 'Devanagari script — 47 characters, vowels as diacritics, and the foundation of Hindi reading',
      terms: [
        { term: 'देवनागरी (Devanagari)', definition: 'The script used for Hindi, Sanskrit, Marathi, and Nepali. "Deva" (divine) + "nagari" (urban/refined). 47 primary characters: 14 vowels (स्वर) and 33 consonants (व्यंजन). Written left-to-right, with a horizontal line (शिरोरेखा, shirorēkhā) connecting the tops of letters in a word.' },
        { term: 'Inherent Vowel (अ)', definition: 'Every Devanagari consonant carries an inherent "a" vowel. क = "ka" not "k." To write a consonant without a vowel, a virama (्) is added: क् = "k" with no following vowel. This changes how consonants cluster — क्ष (ksha) is क् + ष.' },
        { term: 'Matras (मात्राएँ)', definition: 'Vowel diacritics that replace the inherent "a" with another vowel. They attach to the consonant shape, changing its form. क + ā-matra (ा) = का (kā). क + i-matra (ि) = कि (ki). क + u-matra (ु) = कु (ku). The matra position (above, below, before, after) varies by vowel.' },
        { term: 'Conjunct Consonants (संयुक्त व्यंजन)', definition: 'When two consonants meet without a vowel between them, they form a conjunct — they fuse or stack. प् + र = प्र (pra). क् + ष = क्ष (ksha). Some conjuncts are irregular — their combined form looks nothing like either component. These must be memorised.' },
        { term: 'Nasalisation (अनुनासिक / अनुस्वार)', definition: 'Hindi vowels can be nasalised. The chandrabindu (ँ) marks optional light nasalisation; the anusvar (ं) marks full nasalisation of the vowel and affects the following consonant. हाँ (hā̃) = yes (lightly nasal). The distinction matters for meaning: मन (man — mind) vs माँ (māṃ — mother).' },
      ],
      content: `## Hindi — Devanagari First

Hindi is spoken natively by over 500 million people and is India's most widely spoken language. Its script, Devanagari, looks complex at first — but it is phonetically precise: each character maps to exactly one sound, and the rules for combining them are consistent. Unlike English, there are no "silent letters" or arbitrary pronunciations.

### The Vowels (स्वर) — 14 Sounds

Independent vowels (used at the start of words or syllables):
| Devanagari | Sound | Example |
|------------|-------|---------|
| अ | a (schwa, like "but") | अब (ab — now) |
| आ | ā (long a, "father") | आम (ām — mango) |
| इ | i (short "it") | इसका (iskā — its) |
| ई | ī (long "ee") | ईमानदार (īmāndār — honest) |
| उ | u (short "put") | उन (un — those) |
| ऊ | ū (long "oo") | ऊँचा (ū̃cā — tall) |
| ए | e (long "say") | एक (ek — one) |
| ऐ | ai (short "man") | ऐनक (ainak — glasses) |
| ओ | o (long "go") | ओर (or — direction) |
| औ | au (short "caught") | औरत (aurat — woman) |

### The Consonants (व्यंजन) — 33 Letters

Hindi consonants are grouped by where in the mouth they are produced — a logical phonetic system from Sanskrit grammar:

**Velar** (back of throat): क (ka) ख (kha) ग (ga) घ (gha) ङ (ṅa)
**Palatal**: च (ca) छ (cha) ज (ja) झ (jha) ञ (ña)
**Retroflex** (tongue curled back): ट (ṭa) ठ (ṭha) ड (ḍa) ढ (ḍha) ण (ṇa)
**Dental** (teeth): त (ta) थ (tha) द (da) ध (dha) न (na)
**Labial** (lips): प (pa) फ (pha) ब (ba) भ (bha) म (ma)
**Approximants**: य (ya) र (ra) ल (la) व (va)
**Sibilants**: श (śa) ष (ṣa) स (sa)
**Aspirate**: ह (ha)

### Aspirated vs. Unaspirated

A critical Hindi distinction: क (ka) vs. ख (kha) — the second has a puff of breath. This distinction carries meaning:
- पल (pal) = moment; फल (phal) = fruit
- काल (kāl) = time/death; खाल (khāl) = skin/hide

English speakers naturally aspirate initial K/P/T — this helps with ख/फ/थ. The unaspirated versions (क/प/त) sound more like English K/P/T after S (as in "skill," "spill," "still").

### Reading Your First Word

Let's build: नमस्ते (Namaste)
- न (na) + म (ma) = नम
- स् (s — virama removes inherent a) + त (ta) = स्त
- Combined: नमस्त + े (e-matra) = नमस्ते
- Pronunciation: na-mas-te (the final e is voiced, unlike the dropped e in English "namaste")

### Week 1 Goal

Recognise all 14 vowels and their matra forms. Read the 33 consonants in isolation. Be able to sound out simple CV (consonant-vowel) syllables. Writing practice is essential — the shirorēkhā (top line) should be drawn last, connecting the syllable.`,
      q: 'In Devanagari, what does the virama (्) do when added to a consonant?',
      options: [
        'It adds a long vowel sound after the consonant',
        'It removes the inherent "a" vowel, making the consonant bare',
        'It marks the consonant as aspirated',
        'It connects two words together',
      ],
      correct: 1,
      explanation: 'Every Devanagari consonant carries an inherent "a" vowel by default. क = "ka." The virama (्) suppresses this inherent vowel, leaving a bare consonant: क् = just "k." This is essential for forming consonant clusters (conjuncts): क् + ष = क्ष (ksha). Without virama, two consonants would each carry their inherent "a" — क + ष = कष (kasha), a different syllable.',
    },
  }

  const d = data[lang.code]
  return {
    id: `lang-${lang.code}-script`,
    track: 'language',
    title: `${lang.name}: Script & Alphabet`,
    subtitle: d.subtitle,
    level: 'Basic',
    xp: 200,
    duration: 45,
    module,
    content: d.content,
    keyTerms: d.terms,
    quiz: {
      question: d.q,
      options: d.options,
      correct: d.correct,
      explanation: d.explanation,
    },
    certArea: `${lang.name} Writing System`,
    courseObjective: `Read and recognise the ${lang.name} script without romanisation`,
    moduleObjective: `Complete script literacy — no more romaji/romanisation dependency`,
  }
}

// ─── MODULE 2: SOUNDS & PRONUNCIATION ────────────────────────────────────────

function buildSoundsModule(lang: LangEntry, module: number): Course {
  const data: Record<string, {
    subtitle: string
    terms: { term: string; definition: string }[]
    content: string
    q: string
    options: string[]
    correct: number
    explanation: string
  }> = {
    es: {
      subtitle: 'Spanish phonics — pure vowels, the rolled R, and why spelling always tells you how to speak',
      terms: [
        { term: 'Pure Vowels (A E I O U)', definition: 'Spanish has 5 vowels that never shift: A = "ah" (padre), E = "eh" (mesa), I = "ee" (libro), O = "oh" (cosa), U = "oo" (luna). They sound the same in every context. This predictability makes Spanish pronunciation far easier than English or French.' },
        { term: 'The Rolled R (rr / r initial)', definition: 'Double-R (rr) is a trill — the tongue vibrates rapidly against the ridge behind the upper teeth. Also used when R appears at the start of a word (Roma, rojo). Single R mid-word is a single tap, like the D in American English "butter." Practice: say "d-d-d-d" fast, tongue on the ridge.' },
        { term: 'LL and Y', definition: 'In most Spanish dialects, LL and Y are both pronounced like the English Y (yes). "Llama" → "YAH-mah." In parts of Argentina and Uruguay, both are pronounced like the ZH sound in "treasure" (rioplatense). Neither is like the English LL.' },
        { term: 'J and G (before e/i)', definition: 'Spanish J and G (before E or I) both produce the same sound: a strong H-like fricative from the back of the throat. "Jardín" → "har-DEEN." "Gente" → "HEN-teh." The sound is stronger than English H — produced farther back.' },
        { term: 'Stress Rules', definition: 'Default stress falls on the second-to-last syllable for words ending in a vowel, N, or S (HABlo, coMEN). For words ending in other consonants, stress falls on the last syllable (felIZ, ciudAD). An accent mark (á é í ó ú) overrides these rules and marks the stressed syllable explicitly.' },
      ],
      content: `## Spanish Sounds — A Phonetically Honest Language

Spanish is one of the most phonetically consistent languages in the world. Every letter has one primary sound, and spelling reliably predicts pronunciation. This is a massive advantage over French or English.

### The Vowel System

Spanish vowels are pure and short. They never glide or diphthong in the way English vowels do:
- **A**: always "ah" — never "ay" as in English "late." padre (PAH-dreh)
- **E**: always "eh" — never "ee" as in "be." mesa (MEH-sah)
- **I**: always "ee" — libro (LEE-broh)
- **O**: always "oh" — never "uh" as in English "love." cosa (KOH-sah)
- **U**: always "oo" — luna (LOO-nah). Silent after Q and in GUE/GUI/QUE/QUI.

### Consonants That Differ From English

**B and V**: In Spanish, B and V are pronounced identically — a soft bilabial sound (lips nearly touching, some air passing through). "Barco" and "vamos" start with the same sound. No distinction.

**C**: Before A, O, U = K sound (casa). Before E, I = S sound in Latin America (cena → SEH-nah), or TH sound in Castilian Spain (cena → THEH-nah).

**H**: Always silent. "Hola" = "OH-lah." There is no H sound in Spanish.

**Ñ**: A separate letter — NY sound as in "canyon." España = "es-PAH-nyah."

**Z**: In Latin America, Z = S (zapato → sah-PAH-toh). In Castilian Spain, Z = TH (zapato → thah-PAH-toh).

### The R Family

| Spelling | Sound | Example |
|----------|-------|---------|
| r (mid-word) | single tap — like "d" in American "butter" | pero (but) |
| rr | full trill — tongue vibrates | perro (dog) |
| r (word-initial) | full trill | Roma, rojo |

"Pero" (but) vs "perro" (dog) — the trill makes the difference. It takes time; practice daily.

### Diphthongs

When two weak vowels (I, U) combine, or when a strong vowel (A, E, O) pairs with a weak one in the same syllable, they form a diphthong:
- AI: aire (AH-ee-reh — air)
- IE: bien (BYEHN — well)
- UA: agua (AH-gwah — water)
- UE: bueno (BWEH-noh — good)

### Rhythm and Linking

Spanish links words in a phrase smoothly. "¿Cómo estás?" = "KOH-moh-es-TAHS" — no gap between words. The S of "cómo" links to the E of "estás." This linking is natural and expected.`,
      q: 'How is the letter H pronounced in Spanish?',
      options: ['Like the English H in "hello"', 'Like a strong breathy sound from the throat', 'It is always silent', 'It sounds like J in some dialects'],
      correct: 2,
      explanation: 'H is always silent in Spanish with no exceptions. "Hola" = "OH-lah," not "HOH-lah." The strong H-from-the-throat sound is actually the J (and G before e/i) — "jardín" = "har-DEEN." Confusing H with J is a very common learner error.',
    },
    fr: {
      subtitle: 'French phonology — nasal vowels, liaison, the guttural R, and silent final consonants',
      terms: [
        { term: 'Nasal Vowels', definition: 'French has 4 nasal vowels — the sound passes through the nose. an/en (like "on" in British "song"), in/ain/ein (like "an" in "ban" — nasal), on (like a nasal "oh"), un (in some dialects). "Bien" (byɛ̃), "bon" (bɔ̃), "brun" (bʁœ̃). The key: the N or M is NOT pronounced as a separate consonant — it nasalises the vowel.' },
        { term: 'Le R Guttural', definition: 'The French R is produced in the back of the throat — a uvular fricative or trill. The tongue stays flat; the back of the throat constricts. It sounds like a gentle gargle. Practice words: rouge (red), merci (thank you), Paris. It bears no resemblance to English R.' },
        { term: 'Liaison', definition: 'When a word ending in a normally-silent consonant is followed by a word beginning with a vowel sound, the consonant is voiced and bridges the two words. "Vous avez" = voo-ZAH-vay (not voo ah-vay). "Les enfants" = lay-ZON-fon. The linked consonant always carries into the next syllable.' },
        { term: 'Silent Final Consonants', definition: 'French words typically do not voice final consonants: "est" (is) = "ay" not "est," "beaucoup" = "boh-KOO" not "boh-KOOP," "Paris" = "pah-REE" not "pah-REE." Exceptions include: C, R, F, L often ARE pronounced (the word "CaReFuL" helps remember which).' },
        { term: 'E Caduc (Mute E)', definition: 'An unstressed E at the end of a syllable or word is often dropped in speech. "Je ne sais pas" in rapid speech → "j\'sais pas." "Justement" → "just\'ment." This syllable-dropping is normal, not sloppy. Learning when to drop E is part of natural-sounding French.' },
      ],
      content: `## French Sounds — Where the Difficulty Lives

French pronunciation has a reputation for difficulty, and it is partially deserved. Silent letters, nasal vowels, the guttural R, and liaison rules all require active training. But once these systems click, French pronunciation becomes quite consistent.

### The Vowel System

French has more vowel sounds than English — approximately 12 pure vowels plus the nasal vowels.

**Key French vowel challenges**:
- **U** (as in "tu" — you): No English equivalent. Lips rounded as if to say "oo," but tongue pushed forward as if to say "ee." Try saying "ee" while rounding your lips.
- **EU** (as in "feu" — fire, "bleu" — blue): Similar lip rounding. Like U but more open.
- **E** (as in "le" — the): The schwa — a neutral, unstressed sound. "uh."

### Nasal Vowels

Four nasal sounds — vowel + nasal resonance, with N/M NOT voiced separately:
| Spelling | Sound | Word |
|----------|-------|------|
| an, en, am, em | ã (open, nasal) | enfant (child), temps (time) |
| in, ain, ein, im | ɛ̃ (bright, nasal) | vin (wine), main (hand) |
| on, om | ɔ̃ (rounded, nasal) | bon (good), ombre (shadow) |
| un, um | œ̃ (some dialects) | un (one), parfum (perfume) |

Practice: say "ah" while air flows through your nose simultaneously. That's the quality.

### The R

Produced at the very back of the mouth. Steps:
1. Say the K sound — notice where your tongue rises at the back
2. Keep that throat position but instead of stopping air, let it pass through
3. Add voice — you now have the French R

Words to drill: rue (street), rouge (red), très (very), merci (thank you), Paris.

### Liaison in Practice

Liaison is mandatory in some contexts, optional in others, and forbidden in a few:

**Mandatory**: Article + noun: les enfants → lay-ZON-fon; vous avez → voo-ZAH-vay
**Optional**: After a verb in casual speech: "il est arrivé" may or may not link
**Forbidden**: After "et" (and), before "h aspiré" words like "les haricots" (lay ah-ree-KOH — no Z)

### The French Accent System

Five accents in French, each with a specific function:
- **é** (accent aigu): closed E sound — "é" = "ay"
- **è, ê** (accent grave/circonflexe): open E sound — "è" = "eh" in "bed"
- **â, ô, î, û**: historically marked a dropped S — "forêt" (forest), mostly changes vowel quality
- **ç** (cédille): makes C sound like S before A, O, U: "français" = "fran-SAY"
- **ë, ï** (tréma): indicates the vowel is pronounced separately — "Noël" = "no-EL" (two syllables)`,
      q: 'How is liaison applied in "vous avez" (you have)?',
      options: [
        'The S of "vous" is silent — "voo ah-vay"',
        'The S of "vous" links to "avez" making a Z sound — "voo-ZAH-vay"',
        'An extra vowel sound is inserted between the words',
        'The V of "vous" doubles — "voov-ah-vay"',
      ],
      correct: 1,
      explanation: 'Liaison: when "vous" (normally silent S) precedes a vowel-initial word like "avez," the S is voiced as Z and links to the next syllable. "Vous avez" = "voo-ZAH-vay." This is mandatory liaison — skipping it sounds unnatural. The Z sound (not S) is always used in French liaison.',
    },
    pt: {
      subtitle: 'Portuguese phonology — nasal vowels, the swallowed vowels of European Portuguese, and BP vs EP',
      terms: [
        { term: 'Nasal Vowels (Vogais Nasais)', definition: 'Portuguese has 5 nasal vowels, more than French. ã/an/am (like "on" in "song" — nasal), en/em (nasal "en"), in/im (nasal "een"), on/om (nasal "on"), un/um (nasal "oon"). The tilde (ã) always marks nasalisation. "Maçã" (apple), "pão" (bread), "irmã" (sister).' },
        { term: 'Vowel Reduction (European Portuguese)', definition: 'In European Portuguese, unstressed vowels are dramatically reduced or dropped. "Porto" → "POR-tu" (the O becomes near-silent). "Obrigado" → "ob-ri-GAH-du." This swallowing of vowels makes EP sound fast and consonant-heavy compared to Brazilian Portuguese.' },
        { term: 'LH and NH', definition: '"LH" = the LL sound in Spanish "llama" — a palatal lateral, like Y+L merged: "filho" (son) = "FEE-lyoo." "NH" = the Spanish Ñ — a palatal nasal like "ny": "senhor" (sir/Mr.) = "se-NYOR." These digraphs are uniquely Portuguese.' },
        { term: 'The S/Z/SH/ZH Sounds', definition: 'Portuguese S has multiple realisations. In Brazil: S/Z as in English. In Portugal and Rio de Janeiro: S before a voiceless consonant or at end of word = SH ("gosto" → "GOSH-tu"); S before a voiced consonant = ZH (like "measure"). "Lisboa" → "leezh-BOH-ah" in EP.' },
        { term: 'BP vs EP Stress', definition: 'Brazilian Portuguese (BP) is syllable-timed — each syllable has roughly equal duration, vowels are open. European Portuguese (EP) is stress-timed — stressed syllables are long, unstressed ones are compressed or dropped. This is the root of why EP sounds so different from BP to beginners.' },
      ],
      content: `## Portuguese Sounds — Two Accents, One Script

Portuguese sounds different from Spanish despite sharing most vocabulary. The key differences: nasal vowels, the palatal LH/NH sounds, and the dramatic vowel reduction in European Portuguese.

### Vowel System

Portuguese has more vowel sounds than Spanish — approximately 9 oral vowels plus 5 nasal:

**Oral vowels**: a, á, â, e, é, ê, i, o, ó, ô, u
**Nasal vowels**: ã, an/am, en/em, in/im, on/om, un/um

Key sounds:
- **â, ê**: the circumflex marks a close/reduced vowel — â ≈ "uh," ê ≈ "ay" (tense)
- **ã**: nasal "ah" — as in "maçã" (apple), "irmã" (sister)
- **ão**: nasal "ow" — as in "pão" (bread), "não" (no)

### Brazilian vs European: The Sound Gap

**Brazilian Portuguese (BP)**:
- Vowels open and clear: "porta" = POR-ta (both vowels audible)
- S before vowels = S: "casa" = KAH-za (Z between vowels in BP)
- Final unstressed vowels pronounced: "leite" = LAY-chee (BP palatalises T before I)
- T before I = "ch" sound in BP: "tia" (aunt) = "CHEE-ah"

**European Portuguese (EP)**:
- Unstressed vowels reduced: "porta" = "POR-t" (final A near-silent)
- S/Z → SH/ZH before consonants: "mesmo" = "MEHZH-mu"
- T always = T: "tia" = "TEE-ah"
- "De" reduced to just "d'" in rapid speech

### The LH and NH Sounds

These are Portuguese-specific digraphs not found in Spanish:

**LH** = palatal lateral (like saying L + Y simultaneously):
- filho (son) = FEE-lyoo
- trabalho (work) = trah-BAH-lyoo
- mulher (woman) = moo-LYEHR

**NH** = palatal nasal (NY sound):
- senhor (Mr./sir) = se-NYOR
- banho (bath) = BAH-nyoo
- vinho (wine) = VEE-nyoo

### Rhythm Practice

BP rhythm — open and musical: "Eu não sei o que fazer" = "Ew NOW say oo ke fah-ZEH"
EP rhythm — compressed: "Eu não sei o que fazer" = "Eu now say ke fzER" (reduced)

Both are correct Portuguese — for which to target, decide your dialect first.`,
      q: 'What happens to the T sound before the vowel I in Brazilian Portuguese?',
      options: [
        'It stays as a hard T (as in "top")',
        'It becomes a CH sound (as in "cheese") — "tia" = "CHEE-ah"',
        'It becomes silent',
        'It becomes D',
      ],
      correct: 1,
      explanation: 'In Brazilian Portuguese, T and D before the vowel I (and sometimes E) are palatalised — T → "ch" and D → "dj." So "tia" (aunt) = "CHEE-ah," "dia" (day) = "DJEE-ah." This is a key feature of BP that distinguishes it from European Portuguese, where T and D remain hard before all vowels.',
    },
    it: {
      subtitle: 'Italian phonics — double consonants, C/G rules, and the musical stress patterns',
      terms: [
        { term: 'C and G Rules', definition: 'C before A, O, U = K: "casa" (KAH-sah). C before E, I = CH: "cena" (CHEH-nah — dinner), "cinema." G before A, O, U = G in "go": "gatto" (cat). G before E, I = J in "joy": "gelato" (jeh-LAH-toh), "giro." To force the K/G sound before E/I, insert H: "che" (KEH — what), "ghetto" (GEH-toh).' },
        { term: 'Double Consonants (Consonanti Doppie)', definition: 'Italian double consonants are genuinely lengthened — the consonant is held for approximately twice as long. This distinction carries meaning: "pala" (shovel) vs "palla" (ball); "casa" (house) vs "cassa" (cash register); "ano" (anus) vs "anno" (year). Italians notice and value correct doubling.' },
        { term: 'SC Before E/I', definition: '"SC" before E or I = SH sound: "sciare" (to ski) = "SHYAH-reh," "scena" (scene) = "SHEH-nah." Before A, O, U = SK: "scala" (staircase) = "SKAH-lah." Adding H prevents the SH shift: "sche" = "SKEH," "schi" = "SKEE."' },
        { term: 'GLI', definition: 'The "GLI" combination = a palatal lateral, similar to the LL in Spanish "llama" — an LY sound. "Figlio" (son) = "FEE-lyoh." "Aglio" (garlic) = "AH-lyoh." "Luglio" (July) = "LOO-lyoh." There is no equivalent in English; approximate with "li-y" said fast.' },
        { term: 'Stress in Italian', definition: 'Italian stress is mostly regular: most words stress the second-to-last syllable (penultimate stress). "Amico" = ah-MEE-koh. "Finestra" = fee-NES-trah. Exceptions exist and are marked with a grave accent (à, è, ì, ò, ù) when the stress falls on the final syllable: "caffè," "città," "perché."' },
      ],
      content: `## Italian Sounds — The Most Phonetically Transparent Romance Language

Italian is praised for its phonetic clarity: what you see is what you say (with a few rules to learn first). Once you know the C/G/SC rules and the double-consonant system, Italian pronunciation is highly predictable.

### The Vowel System

Italian has 7 vowel sounds (5 letters, but E and O each have open and close variants):
- **a**: always "ah" — pasta (PAH-stah)
- **e (close)**: "ay" — sera (SEH-rah — evening)
- **e (open)**: "eh" — bello (BEH-loh — beautiful)
- **i**: always "ee" — vino (VEE-noh)
- **o (close)**: "oh" — nome (NOH-meh — name)
- **o (open)**: "aw" — cosa (KAW-zah — thing)
- **u**: always "oo" — luna (LOO-nah)

The E/O distinction (close vs. open) varies by region and is not marked in standard spelling. Northern Italian tends toward close E/O; Southern Italian toward open. Both are acceptable.

### The C and G System

| Spelling | Before | Sound | Example |
|----------|--------|-------|---------|
| C | a, o, u | K | cane (dog), cosa (thing), cuore (heart) |
| C | e, i | CH | cena (dinner), cibo (food) |
| CH | e, i | K | che (what), chi (who) |
| G | a, o, u | G (go) | gatto (cat), gonna (skirt) |
| G | e, i | J (joy) | gente (people), giro (turn) |
| GH | e, i | G (go) | spaghetti, ghiaccio (ice) |

### Double Consonants

Hold the consonant. The way to feel this:
- Single: "pala" (shovel) — tongue touches ridge once for L
- Double: "palla" (ball) — tongue stays on ridge, pause, then releases

This is not an accent quirk — it is a phonemic distinction that changes meaning.

Common minimal pairs:
- camino (fireplace) / cammino (I walk)
- tono (tone) / tonno (tuna)
- sete (thirst) / sette (seven)

### Regional Variation

Italian regional accents vary significantly:
- **Tuscan** (Florence): standard literary Italian — CH used for word-initial C in some dialects ("la casa" → "la hasa")
- **Roman**: open vowels, some consonant softening
- **Northern (Milan, Turin)**: flatter intonation, close vowels
- **Southern (Naples, Sicily)**: open vowels, different rhythm, some consonant changes

Standard Italian is based on Florentine/Tuscan norms and is what you'll hear on RAI national television.`,
      q: 'How is "gente" (people) pronounced in Italian?',
      options: ['GEN-teh (hard G as in "get")', 'JHEN-teh (soft G as in "gentle")', 'YEN-teh (Y sound)', 'KHEN-teh (K sound)'],
      correct: 1,
      explanation: 'G before E or I in Italian produces a J/DZH sound (as in English "joy" or "gentle"). So "gente" = JHEN-teh. To get the hard G before E/I, Italian inserts H: "ghetto" = GEH-toh. This same rule applies to C: "cena" (dinner) = CHEH-nah (soft), while "che" (what) = KEH (hard C, forced by the H).',
    },
    zh: {
      subtitle: 'Mandarin tones — the four tones plus neutral, and Pinyin pronunciation rules',
      terms: [
        { term: 'The Four Tones + Neutral', definition: 'Mandarin is a tonal language — pitch determines meaning. 1st tone (ā): high, flat, sustained. 2nd tone (á): rising, like a question in English. 3rd tone (ǎ): dipping then rising (low-dip). 4th tone (à): sharp falling, like a command. Neutral tone (a): short and unstressed. mā (mother), má (hemp/numb), mǎ (horse), mà (scold).' },
        { term: 'Pinyin', definition: 'The official romanisation of Mandarin. Not an independent language — a transcription tool. Pinyin letters are NOT always pronounced like English: "x" = SH, "q" = CH, "zh" = J+R, "c" = TS, "r" = retroflex approximant. Never read Pinyin as English spelling.' },
        { term: 'Initials and Finals', definition: 'Mandarin syllables = Initial (consonant) + Final (vowel + any ending). Initials: b p m f / d t n l / g k h / j q x / zh ch sh r / z c s. Finals include: a, o, e, i, u, ü and combinations. Every syllable has exactly one tone.' },
        { term: 'Retroflex Sounds (zh, ch, sh, r)', definition: 'These four initials are produced with the tongue curled back (retroflex). "zh" = like J in "joy" but with tongue curled back. "ch" = like CH in "chair" but retroflex. "sh" = like SH in "shoe" but retroflex. "r" = no English equivalent — like a voiced retroflex approximant, somewhat like the beginning of "leisure" with tongue curled.' },
        { term: '3rd Tone Sandhi', definition: 'When two 3rd-tone syllables appear consecutively, the first changes to 2nd tone. 你 nǐ (3rd) + 好 hǎo (3rd) → ní hǎo (the nǐ rises to 2nd tone in speech, though written 3rd). This is a mandatory rule, not optional. Three consecutive 3rd tones: first two shift to 2nd, last stays 3rd.' },
      ],
      content: `## Mandarin Sounds — Tones First, Everything Else Second

Mandarin Chinese is tonal — the pitch contour of a syllable is part of the word itself, not an expression of emotion. Getting tones wrong does not just make you sound foreign; it changes what you are saying. This must be your first focus.

### The Four Tones

Imagine a scale of 1 (low) to 5 (high):

| Tone | Mark | Contour | Feel | Example |
|------|------|---------|------|---------|
| 1st | ā | 5-5 (high flat) | Singing a sustained high note | mā — mother |
| 2nd | á | 3-5 (rising) | Asking "huh?" | má — hemp |
| 3rd | ǎ | 2-1-4 (low dip) | Skeptical "oh?" | mǎ — horse |
| 4th | à | 5-1 (sharp fall) | Firm "no!" | mà — scold |
| Neutral | a | short, unstressed | Quickly appended | ma — question particle |

**The 3rd tone in isolation** sounds like a full dip-and-rise. In natural speech before another syllable, it often only dips (stays low) without fully rising — this is called a "half 3rd tone."

### Pinyin — Not English Spelling

These Pinyin letters ≠ their English sounds:

| Pinyin | Actual Sound | English approximate |
|--------|-------------|---------------------|
| x | sh (palatal) | "she" but from front of mouth |
| q | ch (palatal) | "cheese" but from front |
| j | j (palatal) | "jeep" but from front |
| zh | j+r (retroflex) | like "judge" with tongue back |
| ch | ch (retroflex) | "church" with tongue back |
| sh | sh (retroflex) | "shoe" with tongue back |
| r | voiced retroflex | somewhat like "r" in "leisure" |
| c | ts | "cats" — very common beginner error |
| z | dz | "kids" — not English Z |
| e (alone) | uh+o | neutral back vowel |
| ü (written u after j/q/x/y) | ü | like French U — round lips, say "ee" |

### Tone Pairs to Drill

The minimal pairs that most English learners confuse:

- 买 mǎi (3rd — to buy) vs 卖 mài (4th — to sell) — critical for shopping!
- 问 wèn (4th — to ask) vs 吻 wěn (3rd — to kiss)
- 书 shū (1st — book) vs 熟 shú (2nd — cooked/ripe)
- 饿 è (4th — hungry) vs 鹅 é (2nd — goose)

### Tone Sandhi Rules

**Two 3rd tones**: first becomes 2nd. 你好 nǐhǎo → níhǎo (spoken)
**不 bù (4th) before 4th tone**: becomes 2nd — 不是 bú shì (is not)
**一 yī (1st)**: before 4th tone → 2nd; before 1st/2nd/3rd → 4th. 一个 yí gè, 一天 yī tiān

These are automatic in natural speech — you will absorb them, but knowing the rules speeds the process.`,
      q: 'What pitch contour describes the 2nd tone in Mandarin?',
      options: ['High and flat (sustained)', 'Rising (from mid to high)', 'Dipping then rising (low dip)', 'Sharp falling (from high to low)'],
      correct: 1,
      explanation: 'The 2nd tone (á) rises from a mid pitch to high — like asking "huh?" or "really?" in English. 1st tone is high and flat. 3rd tone dips low then rises. 4th tone falls sharply. The 2nd tone is the "questioning" tone and is the most natural-feeling for English speakers since English uses rising intonation for questions.',
    },
    ja: {
      subtitle: 'Japanese pitch accent, mora timing, and the three sounds English speakers miss',
      terms: [
        { term: 'Mora Timing (モーラ)', definition: 'Japanese is mora-timed — each hiragana character takes the same amount of time to say. English is stress-timed (stressed syllables are longer). In Japanese: "Tōkyō" (東京) has 4 morae — To-o-kyo-o — each equal. The long vowel is two morae, not one. Cutting morae short makes you sound foreign and can change meaning.' },
        { term: 'Pitch Accent (ピッチアクセント)', definition: 'Japanese uses pitch, not stress, to distinguish words. Tokyo dialect: words have a pitch that starts low or high and drops at a predictable point. 橋 hashi (high-low) = bridge; 箸 hashi (low-high) = chopsticks; 端 hashi (low-high-low) = edge. Pitch accent varies significantly by region — Tokyo standard is taught first.' },
        { term: 'Long Vowels (長音)', definition: 'Japanese long vowels (ā, ī, ū, ē, ō) are double-length morae. おばあさん (obāsan — grandmother) vs おばさん (obasan — aunt). おじいさん (ojīsan — grandfather) vs おじさん (ojisan — uncle). Shortening long vowels changes meaning completely. In romaji: written as ā/ō or aa/oo.' },
        { term: 'The Double Consonant (っ/ッ)', definition: 'The small っ/ッ (tsu) represents a mora of closure — the mouth forms the next consonant but pauses before releasing. きって (kitte — stamp) = ki + pause + te. In English terms, it sounds like a brief stop or catch. Dropping the double consonant changes meaning: きて (kite — come here) vs きって (kitte — stamp).' },
        { term: 'R vs L — Neither Exists in Japanese', definition: 'The Japanese ら行 (ra-row: ら り る れ ろ) sounds like neither English R nor L — it is a single flap of the tongue, like the D in American "butter" or the R in Spanish "pero." English speakers hear it as R or L depending on context. Practice: tap tongue once against the ridge behind upper teeth.' },
      ],
      content: `## Japanese Sounds — Mora Timing and Pitch

Japanese is NOT a tonal language in the Mandarin sense, but it IS a pitch-accent language. And its mora-timed rhythm is fundamentally different from English's stress-timed rhythm. These two features are the core phonological shift for English learners.

### The Mora System

A mora is a unit of sound duration. In Japanese, every mora takes the same amount of time:

**Regular CV morae**: か (ka), き (ki), く (ku) — one mora each
**Long vowels**: おか (oka — hill) = 2 morae; おかあ (okā — part of "mother") = 3 morae
**Double consonant**: きって (kitte — stamp) = ki + tt-pause + te = 3 morae
**Syllable-final N**: えん (en — yen) = e + n = 2 morae

In English, "Tokyo" = 3 syllables (TO-kyo). In Japanese, 東京 = 4 morae: TO-O-KYO-O. Equal beats.

### The 5 Vowels

Japanese has 5 pure vowels — consistent, no shifting:
- **あ (a)**: "ah" — always, every time
- **い (i)**: "ee" — always
- **う (u)**: unrounded — like "oo" but without lip rounding (lips spread flat)
- **え (e)**: "eh"
- **お (o)**: "oh"

The unrounded う is the key Japanese vowel: try saying "oo" while spreading your lips flat instead of rounding them.

### Devoiced Vowels

In Tokyo Japanese, い and う are often devoiced (whispered or dropped) between two voiceless consonants or at end of utterance:
- すき (suki — like): "ski" (the u is whispered)
- です (desu — is/am/are): often pronounced "des" in casual speech
- します (shimasu — do): "sh'mas"

This is natural in standard Japanese — do not try to voice these vowels in rapid speech.

### Consonants Different from English

| Japanese | Description |
|----------|-------------|
| r-row (ら り る れ ろ) | single tongue flap — neither R nor L |
| ふ (fu) | bilabial fricative — like F but lips are close (not biting lower lip) |
| づ / ず | both = "dzu" → simplified to "zu" in modern speech |
| じ / ぢ | both = "dji" → simplified to "ji" |
| を (wo) | pronounced "o" in modern Japanese — the W is mostly historical |

### Pitch Accent (Briefly)

Tokyo dialect has two pitch levels: Low (L) and High (H). Every word has a pattern:
- 雨 ame (rain): L-H — rises
- 飴 ame (candy): H-L — falls

For beginners, pitch accent is not the priority — intelligibility matters more. But listening carefully from day one trains your ear for the patterns.`,
      q: 'How many morae does the word きって (kitte — stamp) contain?',
      options: ['2 (ki and te)', '3 (ki, the double-consonant pause, and te)', '4 (k, i, t, e)', '1 (it is one syllable)'],
      correct: 1,
      explanation: 'Japanese is mora-timed. きって = き (ki) + っ (the double-consonant mora — a moment of closure) + て (te) = 3 morae. The small っ is itself a mora of silent closure before the next consonant releases. Compare: きて (kite — come here) = 2 morae (ki+te) vs きって (kitte — stamp) = 3 morae. The timing difference is audible and meaningful.',
    },
    ko: {
      subtitle: 'Korean consonant tensing, vowel harmony, and the sounds that trip up English speakers',
      terms: [
        { term: 'Three-Way Consonant Distinction', definition: 'Korean has a three-way distinction in stops: plain (ㅂ ㄷ ㄱ ㅈ), aspirated (ㅍ ㅌ ㅋ ㅊ), and tense (ㅃ ㄸ ㄲ ㅉ). Plain = relaxed, slight aspiration. Aspirated = strong puff of air (like English P/T/K at start of word). Tense = glottalised, no breath, intense. 불 bul (fire, plain), 풀 pul (grass, aspirated), 뿔 ppul (horn, tense).' },
        { term: 'Vowel Harmony (모음 조화)', definition: 'Traditional Korean grammar distinguishes "bright" (yang) vowels — ㅏ ㅗ — from "dark" (yin) vowels — ㅓ ㅜ ㅡ. Verb endings alternate based on the vowel of the verb stem. 가다 (to go) → 가요 (goes, bright vowel stem). 서다 (to stand) → 서요 (dark vowel). Learning this simplifies conjugation.' },
        { term: 'Final Consonant Pronunciation (받침)', definition: 'All consonants in the final (batchim) position reduce to one of 7 sounds: p, t, k, m, n, ng, l. ㄱ ㅋ ㄲ → k sound at syllable end. ㄷ ㅌ ㅅ ㅆ ㅈ ㅊ ㅎ → t sound. ㅂ ㅍ → p sound. This unreleased final consonant is not popped — it is a closure only.' },
        { term: 'Liaison / Linking (연음)', definition: 'When a syllable ending in a consonant (batchim) is followed by a syllable starting with ㅇ (silent initial), the batchim consonant "moves" to become the initial of the next syllable. 한국어 (hangugeo — Korean language): 국 + 어 → 구거 in speech. This linking is natural and mandatory.' },
        { term: 'ㅡ (eu) — The Mystery Vowel', definition: 'The vowel ㅡ has no English equivalent. It is a high back unrounded vowel — say "ee" but pull your tongue toward the back of the mouth without rounding your lips. Appears in: 으 (eu — mild affirmation), 그 (geu — that), 크다 (to be big). English speakers default to "uh" — the actual sound is higher and further back.' },
      ],
      content: `## Korean Sounds — Three-Way Stops and Linking Rules

Korean phonology has two features that challenge English speakers consistently: the three-way distinction in consonants (plain/aspirated/tense) and the linking rules that make Korean sound fluid but hard to parse.

### The Three-Way Stop System

English has two types of P/T/K: voiced (B/D/G) and voiceless aspirated (P/T/K). Korean has three types, all voiceless:

| Type | Description | Feeling | Examples |
|------|-------------|---------|---------|
| Plain | Lax, between B and P | Neither tense nor breathy | 바 ba, 다 da, 가 ga |
| Aspirated | Strong puff of air | Like English P/T/K | 파 pa, 타 ta, 카 ka |
| Tense | Glottalised, sharp | Tense throat, no breath | 빠 ppa, 따 tta, 까 kka |

**Test for aspiration**: hold your hand in front of your mouth. Plain = slight puff. Aspirated = big puff. Tense = NO puff.

### The Korean Vowels

10 basic vowels plus 11 compound vowels:

**Basic horizontal-stack vowels** (sit below consonant):
ㅗ (o), ㅜ (u), ㅡ (eu)

**Basic vertical-stack vowels** (sit beside consonant):
ㅏ (a), ㅓ (eo), ㅣ (i)

**With Y-glide** (add ㅣ sound onset):
ㅛ (yo), ㅠ (yu), ㅑ (ya), ㅕ (yeo)

**Compound vowels** (two simple vowels merged):
ㅐ (ae — like "bed"), ㅔ (e — like "bed," merging with ㅐ in modern speech), ㅘ (wa), ㅙ (wae), ㅚ (oe), ㅝ (wo), ㅞ (we), ㅟ (wi), ㅢ (ui — rare, sounds like "ee" in most contexts)

### Linking in Action

Korean links final consonants into the next syllable's initial position:

- 한국어: 한 + 국 + 어 → [한구거] (han-gu-geo) in speech
- 음악: 음 + 악 → [으막] (eu-mak)
- 집에: 집 + 에 → [지베] (ji-be)

The final ㅂ (p-sound when isolated) becomes B when linking to a vowel-initial syllable.

### Consonant Assimilation

Adjacent consonants influence each other across syllable boundaries:

- ㄱ + ㄴ → [ㅇ + ㄴ]: 국물 (broth) → [궁물] (nasal assimilation)
- ㄴ + ㄹ → [ㄹ + ㄹ]: 신라 (Silla) → [실라]
- ㅂ + ㄴ → [ㅁ + ㄴ]: 밥물 → [밤물]

These changes are fully predictable from the rules — learning them is part of reading Korean at speed.`,
      q: 'What is the difference between 불 (bul — fire), 풀 (pul — grass), and 뿔 (ppul — horn)?',
      options: [
        'They are different words with no relationship to pronunciation type',
        'The initial ㅂ/ㅍ/ㅃ represents plain, aspirated, and tense consonants respectively',
        'The vowels are different in each word',
        'The final consonant changes in each word',
      ],
      correct: 1,
      explanation: 'All three words have the same vowel (ㅜ = u) and the same final consonant (ㄹ = l). The only difference is the initial consonant: ㅂ (plain B/P), ㅍ (aspirated P with breath), and ㅃ (tense PP with glottalisation and no breath). This three-way distinction is unique to Korean among major world languages and must be practised until each type feels distinct.',
    },
    hi: {
      subtitle: 'Hindi sounds — retroflex consonants, aspirated pairs, and the schwa deletion rule',
      terms: [
        { term: 'Retroflex Consonants (ट ठ ड ढ ण)', definition: 'Hindi has a full set of retroflex consonants — produced with the tongue curled back to touch the roof of the mouth. ट (ṭ), ठ (ṭh), ड (ḍ), ढ (ḍh), ण (ṇ). These contrast with dental equivalents: त (t), थ (th), द (d), ध (dh), न (n) — produced with tongue touching the back of the upper teeth. English has NO retroflex consonants; they must be trained.' },
        { term: 'Aspiration Pairs', definition: 'Hindi has aspirated versions of every stop consonant: क/ख (k/kh), ग/घ (g/gh), ट/ठ (ṭ/ṭh), ड/ढ (ḍ/ḍh), त/थ (t/th), द/ध (d/dh), प/फ (p/ph), ब/भ (b/bh). Aspirated = puff of air. Unaspirated = clean, like consonants after S in English (skill, still, spill). Aspiration changes meaning: पल (pal — moment) vs फल (phal — fruit).' },
        { term: 'Schwa Deletion Rule', definition: 'The inherent vowel (schwa "a") in Devanagari is deleted in certain positions in Hindi pronunciation, even though it appears in the script. "कमल" (kamal — lotus) is written with three syllables but often pronounced "kaml." The schwa before the final consonant in a word is usually deleted. This is why Hindi sounds compressed.' },
        { term: 'Nasalisation (ँ and ं)', definition: 'Hindi vowels can be nasalised. Chandrabindu (ँ) marks gentle nasalisation of the vowel. Anusvar (ं) marks full nasalisation that affects the following consonant. "हाँ" (hā̃ — yes), "माँ" (māṃ — mother). Nasalisation is not optional — it is phonemically distinctive: मन (man — mind) vs मान (mān — honour) vs माँ (māṃ — mother).' },
        { term: 'र (ra) and ड़/ढ़', definition: 'Standard Hindi र is a flap, similar to the Spanish single R. The letters ड़ (ṛ) and ढ़ (ṛh) are retroflex flaps — the tongue flaps back. These appear mostly in words of Sanskrit or Dravidian origin. "सड़क" (saṛak — road), "पड़ना" (paṛnā — to fall). The dot below (़) marks the retroflex flap variant.' },
      ],
      content: `## Hindi Sounds — A Phonetically Rich System

Hindi has one of the most systematic consonant inventories of any language — 33 consonants arranged in a logical grid by place and manner of articulation. The challenge for English speakers is the retroflex-dental distinction and the aspiration pairs, which do not exist in English.

### The Consonant Grid

Hindi consonants are arranged from the back of the mouth to the front:

| Place | Unaspirated | Aspirated | Unaspirated voiced | Aspirated voiced | Nasal |
|-------|-------------|-----------|-------------------|-----------------|-------|
| Velar (back) | क (k) | ख (kh) | ग (g) | घ (gh) | ङ (ṅ) |
| Palatal | च (c) | छ (ch) | ज (j) | झ (jh) | ञ (ñ) |
| Retroflex | ट (ṭ) | ठ (ṭh) | ड (ḍ) | ढ (ḍh) | ण (ṇ) |
| Dental | त (t) | थ (th) | द (d) | ध (dh) | न (n) |
| Labial | प (p) | फ (ph) | ब (b) | भ (bh) | म (m) |

### Retroflex vs. Dental: The Critical Distinction

**Dental** consonants (त द न): tongue tip touches the back of the upper TEETH. Like French or Spanish T.
**Retroflex** consonants (ट ड ण): tongue curls back and touches the ROOF of the mouth.

English has neither — our T is somewhere between. To train:
- Dental: say "the" in French — tongue behind teeth
- Retroflex: say "T" while curling tongue back as far as comfortable

Minimal pairs:
- ताल (tāl — rhythm, dental T) vs टाल (ṭāl — to dodge, retroflex T)
- दल (dal — group, dental D) vs डाल (ḍāl — branch, retroflex D)

### The Aspiration Test

Hold a thin piece of paper in front of your mouth:
- **Unaspirated** (क प त): paper barely moves
- **Aspirated** (ख फ थ): paper blows away from you

In English, P/T/K at the start of a word are aspirated (paper moves). P/T/K after S are not (spin, still, skill — paper stays). Hindi unaspirated = like after-S English consonants.

### Schwa Deletion in Practice

Written: कमल → would logically read ka-ma-la
Spoken: → "kamal" (the final "a" drops)

Written: विद्यालय (school) → vi-dyā-la-ya (4 syllables on paper)
Spoken: → "vidyālay" (final schwa deleted)

This deletion is not arbitrary — there are rules governing which schwas drop. The general pattern: the schwa of the syllable immediately before the final syllable in a word tends to delete.

### The ह (ha) Sound

Hindi ह is a voiced glottal fricative — more voiced and breathy than English H. It is always pronounced (unlike Hindi words borrowed into English, where the H is often dropped). "हाँ" (yes) = a clear breathy H followed by the nasalised ā.`,
      q: 'What distinguishes a retroflex consonant (like ट) from a dental consonant (like त) in Hindi?',
      options: [
        'Retroflex consonants are aspirated; dental are not',
        'Retroflex = tongue curls back to roof of mouth; dental = tongue touches back of upper teeth',
        'Retroflex consonants are nasal; dental are oral',
        'There is no audible difference — only spelling differs',
      ],
      correct: 1,
      explanation: 'The distinction is entirely about tongue position. Dental consonants (त द न) are made with the tongue tip touching the back of the upper teeth — like French or Spanish. Retroflex consonants (ट ड ण) are made with the tongue curled backward to touch the hard palate (roof of mouth). This difference is audible and changes meaning: ताल (rhythm) vs टाल (to dodge). English has neither — our T is alveolar (behind the teeth ridge), which is why both sound "close but different" to English ears.',
    },
    de: {
      subtitle: 'German phonology — umlauts, the ich-Laut vs ach-Laut, and consonant clusters',
      terms: [
        { term: 'Umlauts (Ä Ö Ü)', definition: 'German has three modified vowels marked with two dots (Umlaut): Ä (ae) = like E in "bed," Ö = like French EU (round lips, say "eh"), Ü = like French U (round lips, say "ee"). These are separate phonemes — "schon" (already) vs "schön" (beautiful) are different words. When typing without umlauts: ä=ae, ö=oe, ü=ue.' },
        { term: 'The CH Sounds: Ich-Laut vs. Ach-Laut', definition: '"CH" in German has two distinct realisations based on the preceding vowel. After front vowels (e, i, ä, ö, ü) and consonants: "ich-Laut" — a palatal fricative, like a soft hiss from the front of the mouth (ich, nicht, Mädchen). After back vowels (a, o, u, au): "ach-Laut" — a velar fricative, like clearing the throat (Bach, Buch, noch). Same spelling, different sounds.' },
        { term: 'Final Consonant Devoicing (Auslautverhärtung)', definition: 'German devoices voiced consonants at the end of syllables or words: B→P, D→T, G→K, V→F. "Hund" (dog) = "hunt" in pronunciation. "Tag" (day) = "tak." "Bald" (soon) = "balt." This is why "Hund" and "Hunde" (plural) have the same D in writing but different sounds (T vs. D).' },
        { term: 'The R Sound', definition: 'Standard German R is a uvular sound — like French R, produced at the very back of the throat. In some Southern German dialects, a rolled/trilled R appears. In many casual/colloquial contexts, post-vocalic R is vocalised (reduced to a vague "ah" sound): "hier" = "hee-ah," "wir" = "vee-ah." Three R variants exist; uvular is the standard.' },
        { term: 'SP and ST', definition: 'In German, SP and ST at the START of a word (or syllable) are pronounced SHP and SHT: "Sprache" (language) = "SHPRAkheh," "Stein" (stone) = "SHTyne," "Spiel" (game) = "SHPeel." Mid-word or at the end, SP/ST are pronounced as written: "Wespe" (wasp) = "VESpeh." The position matters.' },
      ],
      content: `## German Sounds — Logic Over Exceptions

German pronunciation is more consistent than English but requires mastering sounds that do not exist in English: the CH variations, the umlauts, and the uvular R. Once these are internalised, German is highly phonetically regular.

### The German Vowel System

German has more vowel distinctions than English, including long/short contrasts and the three umlauts:

**Short vowels** (followed by double consonant or consonant cluster): a (as in "man"), e (as in "bed"), i (as in "bit"), o (like short "o"), u (like short "oo")

**Long vowels** (followed by single consonant or H): ā (as in "father"), ē (like "ay"), ī (like "ee"), ō (like "oh"), ū (like "oo")

**The Umlauts**:
- **Ä/ä**: short = "bed" vowel; long = like "bare"
- **Ö/ö**: round lips for "oh," say "eh" — like French EU. "Schön" (beautiful), "Öl" (oil)
- **Ü/ü**: round lips for "oo," say "ee" — like French U. "Über" (over), "fünf" (five)

### The CH Problem (Solved)

The rules are consistent — just memorise which vowels trigger which sound:

**Ich-Laut** (front CH — palatal fricative):
Occurs after: e, i, ä, ö, ü, ei, eu, äu, n, r, l + consonants
Sound: hiss from front of mouth, like "h" in "huge" (British pronunciation)
Words: ich (I), nicht (not), Mädchen (girl), Löcher (holes), durch (through)

**Ach-Laut** (back CH — velar fricative):
Occurs after: a, o, u, au
Sound: back-of-throat clearing, like Scottish "loch" or Spanish J
Words: Bach (stream), Buch (book), noch (still), auch (also)

### Final Devoicing in Action

When you add a suffix, the devoicing disappears because the consonant is no longer final:

| Singular | Pronunciation | Plural | Pronunciation |
|----------|---------------|--------|---------------|
| Hund (dog) | hunt | Hunde | HUN-deh |
| Tag (day) | tak | Tage | TAH-geh |
| Weg (path) | vek | Wege | VEH-geh |
| Dieb (thief) | deep | Diebe | DEE-beh |

### Consonant Clusters

German allows consonant clusters that English avoids:
- "Strumpf" (stocking) = SHTRUMPF — initial SHTR
- "Herbst" (autumn) = HERPST — final BPST
- "durch" (through) = DURCH — final RCH

These clusters become manageable once you recognise that German phonology allows them — don't insert extra vowels between consonants.`,
      q: 'How is "ich" (I) pronounced in standard German?',
      options: [
        'Like English "ick" (short I + hard K)',
        'With the ich-Laut — a soft palatal hiss (like "h" in British "huge")',
        'With the ach-Laut — a back-of-throat clearing sound',
        'Like "ish" — the CH becomes a SH sound',
      ],
      correct: 1,
      explanation: '"Ich" ends in a front vowel I, so the CH uses the ich-Laut — a palatal fricative produced at the front of the mouth, like the H in British "huge" or the Y in "yes" hardened slightly. The ach-Laut (back-throat clearing) only applies after back vowels (a, o, u, au). Mispronouncing "ich" as "ish" (SH sound) is a very common English-speaker error.',
    },
    nl: {
      subtitle: 'Dutch phonology — the G, the diphthongs, and why Dutch is the closest language to English',
      terms: [
        { term: 'The Dutch G', definition: 'Dutch G is a velar or uvular fricative — a scraping sound from the back of the throat, like a stronger version of the German ach-Laut. "Goed" (good) = "khoot." In southern dialects (Belgium, North Brabant), G is softer. This sound is the first thing non-Dutch speakers notice — and often the last they master.' },
        { term: 'Long Vowels and Spelling', definition: 'Dutch spelling encodes vowel length. A long vowel in an open syllable is spelled with one vowel letter: "maken" (to make) = MAH-ken. The same long vowel in a closed syllable is doubled: "maat" (measure) = MAHT. Short vowels in closed syllables use one vowel: "man" (man) = short A. This makes Dutch spelling predictable once the system is known.' },
        { term: 'Diphthongs (IJ/EI, OE, UI, AU/OU)', definition: 'Dutch diphthongs: IJ and EI both = "eye" sound (they are identical in most dialects). OE = "oo" (like English "who"). UI = a unique sound — rounded front vowel, like "ow" with lips rounded. AU/OU = "ow" as in "now." "Huis" (house) = "howss" with rounded lips. "Buiten" (outside) = "bwiten" approximately.' },
        { term: 'De-Voicing', definition: 'Like German, Dutch devoices final consonants: B→P, D→T, G→CH, V→F, Z→S. "Hond" (dog) = "hont." "Goed" (good) = "khoot." "Vlug" (fast) = "vlukh." The voiced consonant returns when a suffix is added: "honden" = "honden" (D is now not final).' },
        { term: 'Diminutives (-tje/-je)', definition: 'Dutch diminutives use the suffix -tje or -je (pronounced "cha" or "ya"). "Huis" (house) → "huisje" (little house = "hows-yuh"). The diminutive is used constantly in Dutch — for smallness, affection, informality, and even neutrality. Understanding -tje pronunciation rules unlocks a huge vocabulary extension.' },
      ],
      content: `## Dutch Sounds — English's Closest Living Relative

Dutch is more closely related to English than any other major language. Many words are recognisable across the two languages. The main phonological challenges are the guttural G, the diphthong UI, and the vowel-length spelling system.

### The Vowel System

Dutch vowels follow a predictable spelling rule:

**Open syllable** (ends with vowel — unclosed): long vowel, one letter
**Closed syllable** (ends with consonant): short vowel, one letter; OR double letter for long vowel

| Spelling | Syllable | Sound | Example |
|----------|----------|-------|---------|
| a (open) | open | long "ah" | maken (to make) |
| aa | closed | long "ah" | maat (measure) |
| a | closed | short "ah" | man (man) |
| e (open) | open | long "ay" | nemen (to take) |
| ee | closed | long "ay" | meer (lake) |
| e | closed | short "eh" | pen (pen) |

Same pattern for O/OO and U/UU.

### The Diphthongs

| Diphthong | Sound | Words |
|-----------|-------|-------|
| ij / ei | like "eye" (identical in most dialects) | zijn (to be), mein (mine) |
| oe | "oo" (long, like "who") | boek (book), moeder (mother) |
| ui | unique — rounded "ow" | huis (house), buiten (outside) |
| au / ou | "ow" (like "now") | auto (car), oud (old) |
| aai | "eye" extended | haai (shark) |
| oei | "ooi" | moeite (effort) |

**The UI challenge**: this sound requires rounded lips (like "oo") while the tongue position moves forward (like "uh"). Practice: say "ow" while rounding your lips aggressively. "Huis" (house) → "howss" (simplified) but the actual UI is more compressed and rounded.

### The G and CH

Dutch G = voiced velar/uvular fricative (back-of-throat scrape with voice)
Dutch CH = voiceless version of the same sound (like German ach-Laut)
These are the same place of articulation — G is voiced, CH is not.

Regional variation: in Belgium and the south, G is softer (less scraping). In the Randstad (Amsterdam, Rotterdam, The Hague), G is typically hard/scraping.

### English-Dutch Cognates

These pairs illustrate the close relationship:

| Dutch | English | Dutch | English |
|-------|---------|-------|---------|
| water | water | land | land |
| gras | grass | hand | hand |
| zout | salt | regen | rain |
| huis | house | brood | bread |
| melk | milk | nacht | night |

The shared Germanic core makes Dutch highly accessible for English speakers — estimated 6-9 months to conversational fluency (FSI Category I).`,
      q: 'Why is "hond" (dog) pronounced "hont" in Dutch?',
      options: [
        'The D in Dutch is always silent',
        'Dutch final consonant devoicing converts D → T at the end of a syllable',
        'It is an irregular pronunciation with no rule',
        'The spelling is wrong — it should be spelled "hont"',
      ],
      correct: 1,
      explanation: 'Dutch (like German) has final consonant devoicing: voiced consonants become voiceless at syllable/word end. B→P, D→T, G→CH, V→F, Z→S. "Hond" (spelled with D) is pronounced "hont" (T). When a vowel-initial suffix is added, the D is no longer final and voices again: "honden" (dogs) = D is voiced. The spelling preserves the underlying voiced consonant; pronunciation follows the devoicing rule.',
    },
    ru: {
      subtitle: 'Russian phonology — consonant softening, vowel reduction, and the sounds English lacks',
      terms: [
        { term: 'Hard vs. Soft Consonants (Palatalization)', definition: 'Every Russian consonant has a "hard" (non-palatalized) and "soft" (palatalized) version. Soft consonants are produced with the tongue body raised toward the hard palate — like a Y-glide added to the consonant. Т (hard) vs. Ть (soft) = like "t" vs. "ty" merged. The soft sign ь marks softness. This distinction carries meaning: брат (brat — brother) vs. брать (brat\' — to take).' },
        { term: 'Vowel Reduction Under Stress', definition: 'Unstressed Russian vowels reduce significantly. О reduces to А sound: молоко (milk) = ma-la-KO (not MO-lo-KO). Е reduces toward И: ребёнок (child) → unstressed е sounds more like И. Я also reduces. Only the stressed vowel retains its full quality. Russian stress is unpredictable and must be memorised per word.' },
        { term: 'The Ы Sound', definition: 'The vowel Ы has no English equivalent. It is a high back unrounded vowel — like "ih" but produced further back in the mouth. Lips slightly spread, tongue pushed back. Often described as the sound between "i" and "u." Practice: say "rrr" then try to add a vowel from that throat position. Words: мы (my — we), ты (ty — you), рыба (ryba — fish).' },
        { term: 'Voiced/Voiceless Assimilation', definition: 'Adjacent consonants assimilate in voicing. A voiced consonant before a voiceless one becomes voiceless: ложка (lozhka — spoon) → "loshka" (Ж devoices before К). A voiceless before a voiced becomes voiced: сделать (to do) → "zd\'elat\'" (С voices before Д). Exception: В does not cause voicing of preceding consonants.' },
        { term: 'Consonant Clusters', definition: 'Russian allows consonant clusters that English avoids. "Встреча" (meeting) = vstryecha — starts with VST. "Здравствуйте" (hello formal) = zdrastvuyte — starts with ZDRAV. "Строить" (to build) = stroit\'. These clusters are natural in Russian; do not insert vowels between them.' },
      ],
      content: `## Russian Sounds — Stress and Softness

Russian phonology has two features that most affect comprehension: unpredictable stress (which triggers vowel reduction throughout the word) and the hard/soft consonant distinction (which affects nearly every consonant and carries grammatical meaning).

### Vowel Reduction: The Central Rule

Russian has 6 vowel phonemes, but in unstressed syllables, many reduce:

| Vowel | Stressed | Pre-stressed | Other unstressed |
|-------|----------|--------------|-----------------|
| О | "oh" | → "ah" | → "uh" |
| А | "ah" | "ah" | → "uh" |
| Е | "yeh" | → "yih" | → "yuh" |
| Я | "yah" | → "yih" | → "yuh" |
| И | "ee" | "ee" | "ee" (stays) |
| У | "oo" | "oo" | "oo" (stays) |

**Example**: город (city) = written GO-rod, pronounced GA-rad (unstressed O→A, unstressed O→A). Stress is on the first syllable, so the second O also reduces further.

The only way to know stress: look it up when learning a word, and note it. Dictionaries mark stress with an accent: го́род.

### Hard and Soft Consonants

Every Russian consonant (except Ж, Ш, Ц which are always hard, and Й, Ч, Щ which are always soft) has a hard and soft pair:

**How softening sounds**: add a Y-glide to the consonant. Т = "t." Ть = "ty" merged into one sound (like "tune" in British English, where the T is naturally softened before "yoo").

**What marks softness**:
1. The soft sign ь: брать (brat\' — to take)
2. Soft vowels Е, Ё, И, Ю, Я following a consonant: тётя (tyotya — aunt)
3. Another soft consonant: contexts where softness spreads

Minimal pairs:
- брат (brat — brother, hard T) vs. брать (brat\' — to take, soft T)
- мол (mol — pier, hard L) vs. моль (mol\' — moth, soft L)
- жить (zhit\' — to live) vs. жил (zhil — lived, past tense)

### The Six Vowels

| Letter | Sound | Hard vs. Soft pair |
|--------|-------|--------------------|
| А / Я | ah / yah | А after hard C; Я softens preceding C |
| О / Ё | oh / yoh | О hard; Ё softens (also carries stress always) |
| У / Ю | oo / yoo | У hard; Ю softens |
| Э / Е | eh / yeh | Э hard; Е softens |
| Ы / И | ih / ee | Ы after hard C; И softens |
| (none) / Й | — / y | Й = short Y glide |

### Rolled R (Р)

Russian Р is a full alveolar trill — the tongue vibrates against the ridge behind the upper teeth. Similar to Spanish RR. Both hard (р) and soft (рь) versions exist. "Рыба" (ryba — fish), "рядом" (ryadom — nearby, soft Р).`,
      q: 'Why is молоко (milk) pronounced "ma-la-KO" rather than "MO-lo-KO"?',
      options: [
        'It is an irregular word with arbitrary pronunciation',
        'Unstressed О reduces to an А sound — only the stressed syllable (KO) keeps its full vowel',
        'Russian О is always pronounced as А',
        'The spelling is outdated — modern Russian spells it малако',
      ],
      correct: 1,
      explanation: 'Russian vowel reduction: stress falls on the final syllable (ko). The two preceding О vowels are unstressed and reduce — О in pre-stressed position reduces to "a," further-unstressed О reduces even more toward "uh." So МО-ло-КО on paper → ma-la-KO in speech. This reduction applies throughout Russian and is why knowing stress per word is essential — it determines how every other vowel sounds.',
    },
    ar: {
      subtitle: 'Arabic phonology — pharyngeal consonants, emphatic sounds, and the root-pattern system',
      terms: [
        { term: 'Pharyngeal Consonants (ع and ح)', definition: 'Arabic has two consonants produced in the pharynx (the throat above the larynx): ع (ayin) — a voiced constriction, like a strained "ah" from deep in the throat; and ح (ḥa) — a voiceless pharyngeal fricative, like whispering from deep in the throat. Neither exists in English. ع is the most distinctive Arabic sound and marks authentic pronunciation.' },
        { term: 'Emphatic Consonants (ص ض ط ظ)', definition: 'Four consonants have "emphatic" (pharyngealized) versions: ص (ṣ), ض (ḍ), ط (ṭ), ظ (ẓ). These are produced with the tongue body raised toward the pharynx simultaneously — giving surrounding vowels a "darker," more backed quality. A near "a" becomes "au." Emphatic consonants affect the quality of vowels in the entire syllable and sometimes adjacent syllables.' },
        { term: 'The Uvulars (خ غ ق)', definition: 'Arabic has three uvular/back-velar sounds. خ (khā) = voiceless velar fricative, like German ach or Spanish J. غ (ghayn) = voiced version of the same — like a French R or a guttural gargle. ق (qāf) = a stop produced at the uvula — like K but further back, with a distinctive "popping" quality. ق is pronounced differently in dialects (Cairene Egyptian ق → glottal stop).' },
        { term: 'Gemination (Shadda)', definition: 'Arabic doubles consonants for grammatical and semantic purposes. The shadda (ّ) diacritic marks a doubled consonant. "Mudarris" (مُدَرِّس — teacher) has a doubled R. "Allah" (اللّٰه) has a doubled L. Gemination is phonemically significant: "kataba" (he wrote) vs. "kattaba" (he made someone write). The doubled consonant is held longer.' },
        { term: 'The Glottal Stop (Hamza ء)', definition: 'Hamza (ء) represents the glottal stop — the catch in the throat in "uh-oh." It appears as a standalone letter or sitting on ا و ي. "Ahmed" (أحمد) starts with a hamza-on-alif = glottal stop + "a." The hamza is a full consonant in Arabic — omitting it changes words. In casual dialects, some hamzas are dropped (Cairene ق→ glottal stop, Cairene hamza sometimes dropped).' },
      ],
      content: `## Arabic Sounds — The Throat and the Emphasis

Arabic has sounds that exist in very few other major world languages: the pharyngeal consonants ع and ح, the emphatic series, and the uvular consonants. These are the phonological heart of what makes Arabic sound distinctively Arabic. They must be trained actively — passive exposure alone will not produce them.

### The Arabic Consonant Inventory

Arabic has 28 consonants across six places of articulation:

**Labial**: ب (b), م (m), و (w)
**Labiodental**: ف (f)
**Dental**: ث (th as in "think"), ذ (dh as in "the")
**Alveolar**: ت (t), د (d), ن (n), س (s), ز (z), ر (r), ل (l)
**Palato-alveolar**: ش (sh), ج (j — dialect varies: standard = dj, Egyptian = g, Levantine = zh)
**Velar**: ك (k), خ (kh — like Bach), غ (ghayn — voiced kh)
**Uvular**: ق (q — deep k)
**Pharyngeal**: ح (ḥ — voiceless), ع (ʿayn — voiced)
**Glottal**: ء (hamza — glottal stop), ه (h)
**Emphatic**: ص (ṣ), ض (ḍ), ط (ṭ), ظ (ẓ)

### Training the Pharyngeals

**ح (ḥa)**: Whisper from deep in your throat — not from the mouth, not from the larynx, but from the pharynx. It sounds like a breath of air being squeezed through a narrow tube in the throat. Practice: breathe out while constricting your throat. "مُحَمَّد" (Muḥammad) contains this sound.

**ع (ʿayn)**: Add voice to the ح constriction. This is the hardest Arabic sound for English speakers. It sounds like a strained "ah" from deep in the throat. Some describe it as "swallowing a vowel." Practice: make the ح, then add voice. "عَرَبِيّ" (ʿarabī — Arabic) starts with this sound.

### The Emphatic Vowels

When an emphatic consonant appears, the nearby vowels shift:
- Short "a" (fatḥa) → "au" (as in "caught") near emphatics
- Short "i" → "e" near emphatics
- This gives Arabic its distinctive "dark" vs. "bright" vowel quality

Compare:
- سَار (sāra — he walked) — non-emphatic S, bright vowel
- صَار (ṣāra — he became) — emphatic Ṣ, darker vowel quality

### Short and Long Vowels

Arabic has 3 short vowels (diacritics) and 3 long vowels (written with letters):

| Short | Diacritic | Long | Written | Sound |
|-------|-----------|------|---------|-------|
| a (fatḥa) | َ | ā | ا | "ah" / "aa" |
| i (kasra) | ِ | ī | ي | "ee" / "iii" |
| u (ḍamma) | ُ | ū | و | "oo" / "ooo" |

Long vowels are approximately twice the duration of short vowels — this distinction is phonemic (changes meaning).

### MSA vs. Dialect Pronunciation

The sounds described above are Modern Standard Arabic (MSA / fuṣḥā). In dialects:
- Egyptian: ق → glottal stop, ج → G (hard)
- Levantine: ق → glottal stop, ج → ZH sound
- Gulf: ق → G, ج → Y before front vowels
- MSA/Quranic: ق = uvular stop, ج = voiced postalveolar affricate

For comprehension across the Arab world, MSA pronunciation is the baseline.`,
      q: 'What makes the emphatic consonants (ص ض ط ظ) different from their non-emphatic counterparts (س د ت ذ)?',
      options: [
        'Emphatic consonants are pronounced louder',
        'Emphatic consonants are pharyngealised — the throat constricts simultaneously, darkening nearby vowels',
        'Emphatic consonants are aspirated — a puff of air follows them',
        'Emphatic consonants are always doubled (geminated)',
      ],
      correct: 1,
      explanation: 'Emphatic consonants (also called pharyngealised or velarised) are produced with a secondary constriction in the pharynx (throat) simultaneous with the primary articulation. This raises the tongue body back and up, which "darkens" the quality of surrounding vowels — short "a" sounds like "au" in "caught," and the whole syllable has a more backed, rounder quality. Emphasis is a secondary articulation feature, not loudness, aspiration, or gemination.',
    },
    sw: {
      subtitle: 'Swahili phonology — a phonetically consistent Bantu language with Arabic and English loanwords',
      terms: [
        { term: 'Phonetic Consistency', definition: 'Swahili is highly phonetically regular — each letter has one sound, always. There are no silent letters, no vowel shifts, no spelling exceptions. This makes Swahili among the easiest languages for English speakers to read aloud correctly once the 5 vowels and a few consonant rules are known. What you see is always what you say.' },
        { term: 'Five Pure Vowels', definition: 'Swahili has exactly 5 vowel sounds: A = "ah" (baba — father), E = "eh" (meza — table), I = "ee" (mimi — I/me), O = "oh" (soda — cup), U = "oo" (umeme — electricity). These never shift. This is the same vowel system as Spanish and Italian — pure, consistent, no diphthonging.' },
        { term: 'The NG Sound (NG\')', definition: 'Swahili has an initial NG\' sound — the same NG as in "singing" but appearing at the START of syllables. "Ng\'ombe" (cow), "ng\'oa" (to uproot). This initial NG is challenging for English speakers, as English only allows NG in the middle or end of syllables. Practice by starting to say "singing" then stopping after the NG.' },
        { term: 'Prenasalised Consonants (MB, ND, NG, NZ)', definition: 'Swahili combines nasal + consonant into single phonological units at the start of syllables: MB (mbwa — dog), ND (ndizi — banana), NG (ngoma — drum), NZ (nzuri — good). These are spoken as one combined sound, not two. "Mbwa" = M+B fused, not "m-bwa" as two syllables.' },
        { term: 'Stress on Second-to-Last Syllable', definition: 'Almost universally, Swahili stress falls on the penultimate (second-to-last) syllable. "Habari" = ha-BA-ri. "Asante" = a-SAN-te. "Chakula" = cha-KU-la (food). Arabic loanwords sometimes carry different stress but usually assimilate to penultimate. This rule is highly reliable.' },
      ],
      content: `## Swahili Sounds — East Africa's Lingua Franca

Swahili (Kiswahili) is spoken by approximately 200 million people across Tanzania, Kenya, Uganda, the Democratic Republic of Congo, and coastal East Africa. It is the most widely spoken Bantu language and serves as the national language of Tanzania and Kenya. Its phonology is straightforward for English speakers — the main challenges are prenasalised consonants and initial NG'.

### The Vowel System

Swahili's 5 vowels are pure and never shift:

| Vowel | Sound | Example Word | Meaning |
|-------|-------|--------------|---------|
| A | "ah" (father) | baba | father |
| E | "eh" (bed) | meza | table |
| I | "ee" (feet) | mimi | I/me |
| O | "oh" (go) | soda | cup |
| U | "oo" (food) | umeme | electricity |

**No diphthongs** — each vowel is its own syllable. "Nairobi" = Na-i-ro-bi (4 syllables, 4 vowels, each separate).

### Consonants

Most Swahili consonants map cleanly to English sounds:

- **B, D, F, G, H, J, K, L, M, N, P, S, T, V, W, Y, Z**: as in English (note: G is always hard as in "go")
- **SH**: as in "shoe" — dawa (medicine), shari (trouble)
- **CH**: as in "church" — chakula (food), cheza (to play)
- **DH**: as in "the" — Arabic loanword pattern
- **TH**: as in "think" — less common
- **GH**: a voiced velar/uvular fricative (from Arabic loanwords) — ghali (expensive)

### Prenasalised Consonants

These are single phonological units, not two consonants:

| Combo | English approximate | Swahili word | Meaning |
|-------|--------------------|-----------| ---------|
| MB | "m" + "b" fused | mbwa | dog |
| ND | "n" + "d" fused | ndizi | banana |
| NG | "ng" as in "singing" | ngoma | drum |
| NZ | "n" + "z" fused | nzuri | good/beautiful |
| NJ | "n" + "j" fused | njia | road/path |

These are NOT two-syllable sequences. "Mbwa" (dog) = one syllable, not "em-bwa."

### The Challenging NG'

Ng' (with apostrophe) = the NG sound from word-initial position:
- ng'ombe (cow): starts with NG sound
- ng'oa (to uproot): starts with NG
- ng'ang'a (a type of insect): starts with NG, has it again

Training: say "singing" then "singing-a" then "ng'a" — strip away the "si" prefix.

### Stress and Rhythm

Penultimate stress (second-to-last syllable):
- habari (news/how are you) = ha-BA-ri
- asante (thank you) = a-SAN-te
- karibu (welcome/near) = ka-RI-bu
- mzuri (fine/good) = m-ZU-ri (the M is a syllabic nasal, a single mora)

### Arabic Loanwords

About 20-30% of Swahili vocabulary comes from Arabic, reflecting centuries of coastal trade:
- kitabu (book) ← كتاب (kitāb)
- dawa (medicine) ← دواء (dawāʾ)
- wakati (time) ← وقت (waqt)
- bahari (ocean) ← بحر (baḥr)
- ghali (expensive) ← غالي (ghālī)`,
      q: 'How many syllables does "mbwa" (dog) have in Swahili?',
      options: ['Two: "em-bwa"', 'One: "mbwa" — MB is a prenasalised consonant, not two separate consonants', 'Three: "m-b-wa"', 'Two: "mb-wa"'],
      correct: 1,
      explanation: 'In Swahili, MB (like ND, NZ, NG) is a prenasalised consonant — a single phonological unit combining nasal + consonant. "Mbwa" is one syllable with the structure MB + wa. The M is not a separate syllable but part of the initial consonant cluster. This is a feature of Bantu languages generally and is trained by producing M and B simultaneously rather than sequentially.',
    },
    ht: {
      subtitle: 'Haitian Creole phonology — French roots, simplified vowels, and nasal consonants',
      terms: [
        { term: 'French-Derived Phonology', definition: 'Haitian Creole pronunciation derives primarily from 17th-18th century French, with significant simplification. Many French sounds that are difficult for English speakers (uvular R, front rounded vowels Ü/Œ) are replaced in Creole with simpler equivalents. This makes Haitian Creole, counterintuitively, easier to pronounce than standard French.' },
        { term: 'The Haitian R', definition: 'Haitian Creole R is typically pronounced as a uvular approximant (French-derived) or sometimes as a flap in some speakers. Unlike French R, it is lighter and less friction-heavy. In some positions, especially before consonants or at word end, R may be reduced or nearly silent: "manje" (to eat, from French "manger") — the R has fully disappeared.' },
        { term: 'Nasal Vowels', definition: 'Haitian Creole has 4 nasal vowels inherited from French: AN (as in "fran"), EN/IN (as in "men"), ON (as in "bon"), UN (as in "un" in northern French). Written with N after the vowel: "manje" (food, nasal A→ AN in some forms). Nasal vowels are a key feature distinguishing Creole from related Caribbean languages.' },
        { term: 'Vowel System Simplification', definition: 'Compared to French\'s 12+ vowel sounds, Haitian Creole has approximately 7 oral vowels: a, e (as in "day"), è (as in "bed"), i, o, ò (open O), u (oo). The French front rounded vowels Ü and Œ are absent — replaced by I and E/È respectively. "Tu" (you) in French → "ou" in Creole (pronounced "oo").' },
        { term: 'Spelling Reform (IPN Orthography)', definition: 'Haitian Creole uses a standardised phonemic spelling system (IPN, 1979/1980) where each letter represents one sound consistently. "ou" = "oo," "an" = nasal A, "on" = nasal O, "en/in" = nasal I, "ch" = SH, "j" = ZH. This phonemic spelling makes Creole highly readable once you know the conventions.' },
      ],
      content: `## Haitian Creole Sounds — Simplified French

Haitian Creole emerged in the late 1600s-1700s as enslaved Africans from diverse linguistic backgrounds developed a common language using French as the primary lexical source. The result is a language with French-derived vocabulary but streamlined grammar and pronunciation — often more regular than its source.

### The Vowel System

7 oral vowels + 4 nasal vowels:

**Oral vowels**:
| Letter | Sound | Word | Meaning |
|--------|-------|------|---------|
| a | "ah" | manje | to eat |
| e | "ay" (closed) | bèbè | baby |
| è | "eh" (open) | mèsi | thank you |
| i | "ee" | mimi | me (informal) |
| o | "oh" (closed) | bò | side |
| ò | "aw" (open) | fòm | form |
| ou | "oo" | ou | you |

Note: "ou" = "oo" in IPN orthography. This is the word for "you" and also represents the "oo" sound.

**Nasal vowels**:
| Spelling | Sound | Word | Meaning |
|----------|-------|------|---------|
| an | nasal "ah" | manje | food |
| en / in | nasal "ee" | chen | dog |
| on | nasal "oh" | bon | good |
| un | nasal "uh" | uncommon in modern IPN |

### Consonants

Most consonants are familiar. Key differences from English:

| Haitian Creole | Sound | Note |
|----------------|-------|------|
| ch | "sh" (shoe) | NOT "ch" as in English "church" |
| j | "zh" (measure) | voiced version of "sh" |
| r | uvular/light approximant | lighter than French R |
| g | always hard G (go) | never like English "gym" |
| w | "w" (English) | from African substratum |

**"ch" = SH**: "chèf" (chief/boss) = "shef," "cho" (hot) = "sho"
**"j" = ZH**: "jou" (day) = "zhoo," "je" (eye) = "zheh"

### IPN Spelling System in Practice

The 1979/1980 orthographic reform made Creole spelling phonemic — one letter = one sound:

| IPN Spelling | Pronunciation | Meaning |
|-------------|---------------|---------|
| ou | oo | you |
| an | nasal ah | (suffix or word) |
| on | nasal oh | (found in loanwords) |
| en | nasal ee | (in words) |
| ng | ng (singing) | (in some words) |

### Tone and Rhythm

Haitian Creole is not tonal, but it has a distinctive rhythm — syllable-timed like French, with roughly equal weight per syllable. Stress is typically on the last syllable of a phrase or utterance, not necessarily of individual words.

### Key Differences From French

| Feature | French | Haitian Creole |
|---------|--------|----------------|
| "You" | tu / vous | ou |
| Front rounded vowels | ü, œ | absent (→ i, e) |
| R | uvular fricative | lighter approximant |
| Articles | le/la/les + noun | ayricle follows noun (la, a, yo) |
| Grammar | complex conjugation | no conjugation by person |

This simplification is not "broken French" — it is a fully systematic language that emerged under specific historical conditions with its own complete grammar.`,
      q: 'In Haitian Creole IPN orthography, how is "ch" pronounced?',
      options: ['Like English "ch" in "church"', 'Like "sh" in "shoe"', 'Like "k" in "king"', 'Like "ts" in "cats"'],
      correct: 1,
      explanation: 'In Haitian Creole\'s IPN orthography, "ch" represents the SH sound (as in "shoe"), not the English CH sound (as in "church"). This reflects the French origin — in French, "ch" is also SH. So "chèf" (boss) = "shef," "cho" (hot) = "sho." The English CH sound does not exist in standard Haitian Creole. The letter J in Creole represents the ZH sound (as in "measure") — the voiced counterpart of CH/SH.',
    },
  }

  const d = data[lang.code]
  return {
    id: `lang-${lang.code}-sounds`,
    track: 'language',
    title: `${lang.name}: Sounds & Pronunciation`,
    subtitle: d.subtitle,
    level: 'Basic',
    xp: 200,
    duration: 40,
    module,
    content: d.content,
    keyTerms: d.terms,
    quiz: {
      question: d.q,
      options: d.options,
      correct: d.correct,
      explanation: d.explanation,
    },
    certArea: `${lang.name} Phonology`,
    courseObjective: `Produce ${lang.name} sounds accurately enough to be understood by native speakers`,
    moduleObjective: `Master the phonological features that most distinguish ${lang.name} from English`,
  }
}

const allLanguageCourses: Course[] = []
const SCRIPT_LANGS = ['ja', 'ko', 'ru', 'ar', 'hi']
let _moduleCounter = 1

for (const lang of LANGS) {
  if (SCRIPT_LANGS.includes(lang.code)) {
    allLanguageCourses.push(buildScriptModule(lang, _moduleCounter++))
  }
}

export const languageCoursesFull: Course[] = allLanguageCourses
