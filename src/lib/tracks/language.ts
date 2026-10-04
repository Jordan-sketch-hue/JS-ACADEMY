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
    quiz: [{
      q: d.q,
      options: d.options,
      correct: d.correct,
      explanation: d.explanation,
    }],
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
    quiz: [{
      q: d.q,
      options: d.options,
      correct: d.correct,
      explanation: d.explanation,
    }],
    certArea: `${lang.name} Phonology`,
    courseObjective: `Produce ${lang.name} sounds accurately enough to be understood by native speakers`,
    moduleObjective: `Master the phonological features that most distinguish ${lang.name} from English`,
  }
}

// ─── MODULE 3: NUMBERS & GREETINGS ───────────────────────────────────────────

function buildNumbersGreetingsModule(lang: LangEntry, module: number): Course {
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
      subtitle: 'Numbers 1–1000, telling time, and the essential Spanish greeting exchanges',
      terms: [
        { term: '1–10: uno dos tres cuatro cinco seis siete ocho nueve diez', definition: 'The foundational ten. Note: uno becomes "un" before masculine nouns (un libro) and "una" before feminine nouns (una casa). Pronunciation tip: "siete" = SYEH-teh, "nueve" = NWEH-beh.' },
        { term: '11–20: Special forms', definition: 'Once, doce, trece, catorce, quince — these are unique words. 16–19 are compounds: dieciséis (16), diecisiete (17), dieciocho (18), diecinueve (19) — written as one word. Veinte (20).' },
        { term: 'Tens and Hundreds', definition: 'Treinta (30), cuarenta (40), cincuenta (50), sesenta (60), setenta (70), ochenta (80), noventa (90). Cien (100 exactly), ciento (100+): ciento uno (101). Doscientos/as (200) — agrees with gender: doscientas personas.' },
        { term: '¿Cómo estás? / ¿Cómo está usted?', definition: 'How are you? (informal tú / formal usted). Responses: Bien (well), Muy bien (very well), Más o menos (so-so), Regular (okay), Mal (bad), Más o menos, ¿y tú/usted? Follow immediately with "¿Y tú?" to return the question — this is the expected social script.' },
        { term: 'Telling Time: ¿Qué hora es?', definition: 'Es la una (It\'s 1:00). Son las dos (It\'s 2:00). Son las tres y media (3:30). Son las cuatro y cuarto (4:15). Son las cinco menos cuarto (4:45 — "5 minus a quarter"). De la mañana/tarde/noche = AM/afternoon/PM.' },
      ],
      content: `## Spanish Numbers & Greetings

### Numbers 1–100

**1–15** (unique words):
uno (1), dos (2), tres (3), cuatro (4), cinco (5), seis (6), siete (7), ocho (8), nueve (9), diez (10), once (11), doce (12), trece (13), catorce (14), quince (15)

**16–19** (compounds, one word):
dieciséis, diecisiete, dieciocho, diecinueve

**Tens**:
veinte (20), veintiuno (21)... veintinueve (29), treinta (30), cuarenta (40), cincuenta (50), sesenta (60), setenta (70), ochenta (80), noventa (90), cien/ciento (100)

**21–29**: veintiuno, veintidós, veintitrés... (one word each, accent on last syllable for 2/3/6)
**31+**: treinta y uno, treinta y dos... (separate words with "y")

### Hundreds
cien (100), doscientos (200), trescientos (300), cuatrocientos (400), quinientos (500), seiscientos (600), setecientos (700), ochocientos (800), novecientos (900), mil (1,000)

Gender agreement: doscientas mujeres (200 women, feminine), doscientos hombres (200 men, masculine).

### Essential Greeting Exchanges

**Formal**:
- Buenos días / Buenas tardes / Buenas noches
- ¿Cómo está usted? → Bien, gracias. ¿Y usted?
- Mucho gusto / Encantado(a) (nice to meet you)

**Informal**:
- Hola / ¿Qué tal? / ¿Qué pasa?
- ¿Cómo estás? → Bien ¿y tú? / Más o menos / Regular
- ¡Hasta luego! / ¡Hasta mañana! / ¡Nos vemos!

**Introductions**:
- ¿Cómo te llamas? → Me llamo [name]. / Soy [name].
- ¿De dónde eres? → Soy de [city/country].
- ¿A qué te dedicas? → Soy estudiante/médico/profesor...

### Telling Time

- ¿Qué hora es? (What time is it?)
- Es la una. (1:00) — singular "la"
- Son las dos. (2:00) — plural "las"
- Son las tres y cuarto. (3:15)
- Son las cuatro y media. (4:30)
- Son las cinco menos cuarto. (4:45)
- Son las doce del mediodía. (noon)
- Es medianoche. (midnight)

### Days and Months

**Days**: lunes, martes, miércoles, jueves, viernes, sábado, domingo
**Months**: enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre

Date format: el 15 de mayo (the 15th of May). Days and months are NOT capitalised in Spanish.`,
      q: '¿Cuántas personas hay? "Hay doscientas ___ personas." Which form completes this?',
      options: ['doscientos', 'doscientas', 'docientos', 'doscient'],
      correct: 1,
      explanation: '"Personas" is feminine, so the number must agree: doscientas (feminine) not doscientos (masculine). Spanish hundreds (200–900) have gender agreement: doscientos libros (m) but doscientas personas (f). This is one of the few places where Spanish numbers change form.',
    },
    fr: {
      subtitle: 'French numbers — the vigesimal system for 70-99 — and formal greeting protocols',
      terms: [
        { term: 'The Vigesimal Gap: 70–99', definition: 'French does not have unique words for 70, 80, or 90. Instead: soixante-dix (60+10=70), soixante et onze (71), soixante-douze (72)... quatre-vingts (4×20=80), quatre-vingt-un (81)... quatre-vingt-dix (90), quatre-vingt-onze (91)... This system is a relic of Celtic counting and is one of the first shocks for French learners.' },
        { term: 'Bonjour protocol', definition: 'In France, greeting someone before speaking to them is a firm social expectation. Entering a shop without "Bonjour" is considered rude. Leaving without "Au revoir" / "Bonne journée" is equally so. The greeting is not optional social lubrication — it is a required social ritual.' },
        { term: 'La bise', definition: 'The French cheek-kiss greeting. Number of kisses varies by region (1 in some areas, 2 in Paris, 3–4 in the south). Between women and between mixed pairs — usually. Between men: handshake in most professional/first-meeting contexts, la bise among close friends. Never assume; follow the other person\'s lead.' },
        { term: 'Enchanté(e)', definition: 'Nice to meet you (literally "enchanted"). Masculine speaker: enchanté. Feminine speaker: enchantée (same pronunciation). Common alternatives: ravi(e) de vous rencontrer (delighted to meet you — formal), heureux(se) de vous rencontrer.' },
        { term: 'Time: Quelle heure est-il?', definition: 'Il est une heure (1:00). Il est deux heures (2:00). Il est deux heures et quart (2:15). Il est deux heures et demie (2:30). Il est trois heures moins le quart (2:45). French often uses 24-hour time formally: Il est quinze heures trente (15:30 = 3:30 PM).' },
      ],
      content: `## French Numbers & Greetings

### The Number System (with its quirks)

**1–20**:
un(e), deux, trois, quatre, cinq, six, sept, huit, neuf, dix, onze, douze, treize, quatorze, quinze, seize, dix-sept, dix-huit, dix-neuf, vingt

**Tens**:
vingt (20), trente (30), quarante (40), cinquante (50), soixante (60)

**The vigesimal problem — 70 to 99**:
- 70: soixante-dix (sixty-ten)
- 71: soixante et onze (sixty-and-eleven)
- 72: soixante-douze... 79: soixante-dix-neuf
- 80: quatre-vingts (four-twenties — NOTE the S, which drops before another number)
- 81: quatre-vingt-un... 89: quatre-vingt-neuf
- 90: quatre-vingt-dix (four-twenty-ten)
- 91: quatre-vingt-onze... 99: quatre-vingt-dix-neuf

**Note**: Belgium and Switzerland use simpler forms: septante (70), huitante/octante (80), nonante (90). If you're learning for Belgium/Switzerland, you're in luck.

**100+**:
cent (100), deux cents (200), deux cent un (201 — no S before another number), mille (1,000), un million, un milliard (billion)

### Greeting Protocols

**Daily ritual** (non-negotiable in France):
- Entering anywhere: "Bonjour" / "Bonsoir" (evening)
- Leaving anywhere: "Au revoir" / "Bonne journée" / "Bonne soirée"
- In an elevator/lift with strangers: "Bonjour" is expected

**Meeting someone**:
- Formal: Bonjour, je m'appelle [name]. Enchanté(e).
- Comment vous appelez-vous? → Je m'appelle...
- D'où venez-vous? → Je viens de [city/country].

**Casual**:
- Salut! Ça va? → Ça va bien, merci. Et toi?
- Quoi de neuf? (What's new?) → Pas grand-chose (Not much)
- À tout à l'heure (see you later today) / À demain (see you tomorrow)

### Telling Time

- Quelle heure est-il? / Il est quelle heure?
- Il est midi (noon) / Il est minuit (midnight)
- Il est une heure du matin (1 AM)
- Il est treize heures (1 PM — 24h format, common in France)
- Il est dix heures et quart (10:15)
- Il est dix heures et demie (10:30)
- Il est onze heures moins vingt (10:40 — "11 minus 20")

### Days and Months

**Days**: lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche
**Months**: janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre

Date: le 14 juillet (14th July — Bastille Day). No capitalisation for days/months.`,
      q: 'How do you say 93 in French?',
      options: ['nonante-trois', 'soixante-treize', 'quatre-vingt-treize', 'quatre-vingts-treize'],
      correct: 2,
      explanation: '93 = quatre-vingt-treize (4×20 + 13). The S is dropped from "vingts" when followed by another number. "Nonante-trois" is used in Belgium/Switzerland but not in France. "Soixante-treize" = 73. This vigesimal counting system (base 20 from 80) is the most notorious quirk of French numbers.',
    },
    pt: {
      subtitle: 'Portuguese numbers, the difference between BP and EP greetings, and tudo bem exchanges',
      terms: [
        { term: '1–10: um/uma dois/duas três quatro cinco seis sete oito nove dez', definition: 'Note gender agreement in 1 and 2: um livro (m) / uma casa (f); dois rapazes (m) / duas raparigas (f). This gender agreement in numbers 1 and 2 is consistent in both BP and EP.' },
        { term: 'Tudo bem? / Tudo bom?', definition: 'The quintessential Brazilian Portuguese greeting exchange. "Tudo bem?" (All well?) → "Tudo bem!" or "Tudo bom!" Response can also be: "Tudo ótimo!" (Everything great), "Mais ou menos" (so-so), "Tudo certo" (all good). In EP: "Como está?" is more standard for first meetings.' },
        { term: 'Olá vs Oi vs Alô', definition: '"Olá" — standard greeting, both BP and EP. "Oi" — very common informal greeting in Brazil, rare in Portugal. "Alô" — used when answering the phone in Brazil (like "hello?" on a call). "Estou?" or "Sim?" — EP phone greeting. Knowing which to use marks fluency in context.' },
        { term: 'Por favor / Obrigado(a) / De nada', definition: 'Please / Thank you / You\'re welcome. The critical rule: obrigado if the speaker is male, obrigada if female — regardless of who you\'re thanking. "De nada" = you\'re welcome (BP). "De nada" / "Não tem de quê" (EP). "Por nada" also used in BP informally.' },
        { term: 'Cento vs Cem', definition: 'Cem = exactly 100. Cento = 100+ (cento e um = 101, cento e vinte = 120). This distinction is Portuguese-specific. Duzentos/as (200), trezentos/as (300), quatrocentos/as (400), quinhentos/as (500) — note the irregular "quinhentos" for 500 (not "cincocentos").' },
      ],
      content: `## Portuguese Numbers & Greetings

### Numbers 1–1000

**1–10**: um/uma, dois/duas, três, quatro, cinco, seis, sete, oito, nove, dez
**11–20**: onze, doze, treze, quatorze (BP) / catorze (EP), quinze, dezesseis (BP) / dezasseis (EP), dezessete, dezoito, dezenove, vinte
**Tens**: vinte, trinta, quarenta, cinquenta, sessenta, setenta, oitenta, noventa, cem/cento

**Hundreds** (with gender):
duzentos/as (200), trezentos/as (300), quatrocentos/as (400), quinhentos/as (500), seiscentos/as (600), setecentos/as (700), oitocentos/as (800), novecentos/as (900), mil (1,000)

**Compound numbers**: vinte e um (21), trinta e dois (32), cento e quinze (115).
The "e" (and) is used between all elements in Portuguese, unlike Spanish.

### BP Greeting Exchanges

**Standard**:
- Oi! / Olá! Tudo bem? → Tudo bem! E você?
- Tudo bom? → Tudo ótimo, obrigado/a!
- Como vai? → Vou bem, e você?

**First meeting**:
- Prazer em conhecê-lo/la (pleasure to meet you — m/f object)
- Muito prazer! (much pleasure — simpler)
- Como você se chama? → Me chamo [name]. / Meu nome é [name].
- De onde você é? → Sou de [city].

**Farewells**:
- Tchau! (BP — from Italian "ciao") / Adeus (EP — more formal/permanent-feeling)
- Até logo / Até mais / Até amanhã
- Boa noite (good night — greeting OR farewell in the evening)

### EP Greeting Exchanges

- Bom dia / Boa tarde / Boa noite
- Como está? → Estou bem, obrigado/a. E o senhor/a senhora?
- Como se chama? → Chamo-me [name].
- De onde é? → Sou de [city].
- Adeus / Até logo / Com licença (excuse me)

### Days and Months

**Days (BP)**: domingo, segunda-feira, terça-feira, quarta-feira, quinta-feira, sexta-feira, sábado
(Note: Portuguese weekdays from Mon-Fri = "second fair" through "sixth fair" — feira = market day)
**Months**: janeiro, fevereiro, março, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro

### Telling Time
- Que horas são? / Que horas são agora?
- São duas horas. (It's 2:00) — plural "são"
- É uma hora. (It's 1:00) — singular "é"
- São três e meia. (3:30)
- São quatro e quinze / quarto. (4:15)`,
      q: 'A female speaker finishes a meal and wants to thank the waiter. What does she say?',
      options: ['Muito obrigado!', 'Muito obrigada!', 'Muito obrigade!', 'Muito obrigados!'],
      correct: 1,
      explanation: 'In Portuguese, "obrigado/obrigada" agrees with the SPEAKER\'s gender, not the recipient. A female speaker always says "obrigada" regardless of who she thanks. "Obrigado" = male speaker. "Obrigados" = mixed or male group. This is a core Portuguese rule and a common mistake for learners from Spanish (where "gracias" has no gender).',
    },
    it: {
      subtitle: 'Italian numbers, the piacere exchange, and time expressions',
      terms: [
        { term: '1–10: uno due tre quattro cinque sei sette otto nove dieci', definition: 'Uno becomes "un" before masculine nouns (un caffè) and "una" before feminine (una birra). "Un\'" before feminine nouns starting with vowel (un\'amica). Tre (3) takes an accent when at the end of a compound: ventitré (23), trentatré (33).' },
        { term: '11–20: Special Italian forms', definition: 'Undici (11), dodici (12), tredici (13), quattordici (14), quindici (15), sedici (16), diciassette (17), diciotto (18), diciannove (19), venti (20). 17, 18, 19 merge differently: di-ciassette, di-ciotto, di-cianno-ve.' },
        { term: 'Piacere! / Molto piacere!', definition: '"Piacere" (pleasure) = nice to meet you. Response: "Piacere mio" (the pleasure is mine) or simply "Piacere!" back. "Molto piacere" (much pleasure) is more emphatic. This exchange is accompanied by a handshake on first meeting; close friends/family use la bacio (kiss on cheeks).' },
        { term: 'Come stai? vs Come sta?', definition: '"Come stai?" = How are you? (informal, tu). "Come sta?" = How are you? (formal, Lei). Responses: "Bene, grazie!" (Well, thanks!), "Molto bene" (Very well), "Così così" (So-so), "Non c\'è male" (Not bad — lit. "there\'s no bad"), "Male" (Bad), "Benissimo!" (Excellent!).' },
        { term: 'Che ore sono? / Che ora è?', definition: '"Che ore sono?" = What time is it? (lit. "what hours are they?"). "Sono le tre" (It\'s 3:00). "È l\'una" (It\'s 1:00 — singular). "Sono le quattro e mezza" (4:30). "Sono le cinque e un quarto" (5:15). "Sono le sei meno un quarto" (5:45). Italy uses both 12h and 24h time.' },
      ],
      content: `## Italian Numbers & Greetings

### Numbers 1–1000

**1–20**:
uno, due, tre, quattro, cinque, sei, sette, otto, nove, dieci,
undici, dodici, tredici, quattordici, quindici, sedici, diciassette, diciotto, diciannove, venti

**Tens**:
venti (20), trenta (30), quaranta (40), cinquanta (50), sessanta (60), settanta (70), ottanta (80), novanta (90)

**Compounds**: Drop final vowel of ten before uno/otto:
- ventuno (21), ventotto (28) — NOT "ventIUno"
- trentuno, trentotto, quarantuno...
- Add accent to TRE when final: ventitré (23), trentatré (33)

**Hundreds**: cento (100), duecento (200), trecento (300)... novecento (900), mille (1,000), duemila (2,000) — "mille" becomes "mila" in plural.

### Meeting People

**First meeting** (prima conoscenza):
- Ciao! / Salve! / Buongiorno!
- Mi chiamo [name]. (My name is...)
- Come si chiama? (formal) / Come ti chiami? (informal)
- Piacere! → Piacere mio! / Molto piacere!
- Di dove sei? → Sono di [city]. / Vengo da [country].

**Asking how someone is**:
- Come stai? (informal) / Come sta? (formal)
- Tutto bene? (Is everything well?)
- Responses: Bene! / Molto bene! / Così così / Non c'è male / Benissimo!
- Always return: E tu? / E Lei?

**Farewells**:
- Arrivederci (formal goodbye — "till we see each other again")
- Ciao (informal hello AND goodbye)
- A presto! (See you soon!)
- A domani! (See you tomorrow!)
- Buona giornata! / Buona serata! (Have a good day/evening!)

### Telling Time

- Che ore sono? (What time is it? — lit. "what hours are they?")
- Sono le otto. (It's 8:00)
- È l'una. (It's 1:00 — singular)
- È mezzogiorno. (It's noon)
- È mezzanotte. (It's midnight)
- Sono le tre e mezza. (3:30)
- Sono le quattro e un quarto. (4:15)
- Sono le cinque meno un quarto. (4:45 — "5 minus a quarter")

### Days and Months

**Days**: lunedì, martedì, mercoledì, giovedì, venerdì, sabato, domenica
**Months**: gennaio, febbraio, marzo, aprile, maggio, giugno, luglio, agosto, settembre, ottobre, novembre, dicembre

Italian date format: il 2 giugno (2nd June). No article for the 1st: il primo giugno OR 1° giugno.`,
      q: 'How do you say "It\'s 3:00" in Italian?',
      options: ['È le tre.', 'Sono le tre.', 'È tre ore.', 'Sono tre.'],
      correct: 1,
      explanation: '"Sono le tre" — plural because 3:00 refers to "le tre ore" (the three hours). The verb "essere" is plural (sono) for all hours except 1:00, noon, and midnight. "È l\'una" (singular — 1:00). "È mezzogiorno" (noon). "È mezzanotte" (midnight). The pattern: singular for one thing, plural for multiple.',
    },
    zh: {
      subtitle: 'Mandarin numbers 1–10,000, measure words, and the nǐ hǎo family of greetings',
      terms: [
        { term: '0–10: líng yī èr sān sì wǔ liù qī bā jiǔ shí', definition: '零 líng (0), 一 yī (1), 二 èr (2), 三 sān (3), 四 sì (4), 五 wǔ (5), 六 liù (6), 七 qī (7), 八 bā (8), 九 jiǔ (9), 十 shí (10). These 11 characters + 百 bǎi (100) + 千 qiān (1,000) + 万 wàn (10,000) cover all numbers. Mandarin numbers are completely regular — no vigesimal quirks.' },
        { term: 'Two Ways to Say "Two": 二 vs 两', definition: '二 (èr) is used in counting and in compound numbers: 十二 (12), 二十 (20), 二百 (200). 两 (liǎng) is used with measure words and time: 两个人 (two people), 两点 (2 o\'clock), 两百 (also acceptable for 200 in speech). Never say "二个人" — the measure word triggers 两.' },
        { term: 'Measure Words (量词 liàngcí)', definition: 'Mandarin requires a measure word (classifier) between a number and a noun. The generic measure word is 个 (gè): 一个人 (one person), 三个苹果 (three apples). Specific measures: 本 (běn) for books, 张 (zhāng) for flat things (paper, tables), 条 (tiáo) for long flexible things (fish, road, trousers), 杯 (bēi) for cups.' },
        { term: '你好 Nǐ hǎo and its family', definition: '你好 (nǐ hǎo) = Hello (informal singular). 您好 (nín hǎo) = Hello (formal/respectful — 您 is the polite "you"). 你们好 (nǐmen hǎo) = Hello (to a group). 大家好 (dàjiā hǎo) = Hello everyone. Response to 你好: 你好! (same back) or 你也好 (you too).' },
        { term: '你吃了吗? Nǐ chī le ma?', definition: '"Have you eaten?" — a traditional Chinese greeting equivalent to "How are you?" It originated when food security was less certain. The expected response is "吃了" (chī le — I\'ve eaten) not a literal account of meals. Modern urban Chinese more often use 你好 or ask 你最近怎么样? (How have you been lately?).' },
      ],
      content: `## Mandarin Numbers & Greetings

### The Number System (Beautifully Regular)

**0–10**: 零(0) 一(1) 二(2) 三(3) 四(4) 五(5) 六(6) 七(7) 八(8) 九(9) 十(10)

**11–99**: Completely regular — just combine:
- 11 = 十一 (shí yī — ten-one)
- 20 = 二十 (èr shí — two-ten)
- 35 = 三十五 (sān shí wǔ — three-ten-five)
- 99 = 九十九 (jiǔ shí jiǔ)

**100s**: 百 (bǎi)
- 100 = 一百 (yì bǎi)
- 256 = 二百五十六 (èr bǎi wǔ shí liù)
- Note: 一 (yī) becomes yì (4th tone) before 4th tone syllables: 一百 yì bǎi

**1,000s**: 千 (qiān)
- 1,000 = 一千 (yì qiān)
- 2,500 = 两千五百 (liǎng qiān wǔ bǎi)

**10,000**: 万 (wàn) — Chinese has a unique unit for 10,000
- 10,000 = 一万 (yí wàn)
- 100,000 = 十万 (shí wàn — ten ten-thousands)
- 1,000,000 = 一百万 (yì bǎi wàn — one hundred ten-thousands)

**Zero in compounds**: 零 (líng) is inserted when a middle position is zero:
- 205 = 二百零五 (two hundred zero five)
- 1,008 = 一千零八 (one thousand zero eight)

### Measure Words: Non-Negotiable

Number + Measure Word + Noun (always this order):
| Measure | Used for | Example |
|---------|---------|---------|
| 个 gè | people, generic objects | 一个人 (one person) |
| 本 běn | books, notebooks | 三本书 (three books) |
| 张 zhāng | flat things | 一张纸 (one sheet of paper) |
| 条 tiáo | long flexible things | 两条鱼 (two fish) |
| 杯 bēi | cups/glasses | 一杯水 (one glass of water) |
| 碗 wǎn | bowls | 两碗饭 (two bowls of rice) |
| 件 jiàn | clothing items, matters | 三件事 (three things/matters) |

### Greeting Exchanges

**Standard greetings**:
- 你好 Nǐ hǎo → 你好! (Hello / Hello back)
- 您好 Nín hǎo (formal — use with elders, strangers)
- 你好吗? Nǐ hǎo ma? (How are you? — somewhat formal/textbook)
- 最近怎么样? Zuìjìn zěnmeyàng? (How have you been lately? — natural)
- Response: 还好 hái hǎo (still good/okay), 挺好的 tǐng hǎo de (pretty good), 一般般 yìbānbān (so-so)

**Meeting someone**:
- 你叫什么名字? Nǐ jiào shénme míngzì? (What's your name?)
- 我叫 [name]. Wǒ jiào... (My name is...)
- 你是哪里人? Nǐ shì nǎlǐ rén? (Where are you from? lit. "you are where-person?")
- 我是美国人 Wǒ shì Měiguó rén. (I'm American — lit. "Beautiful Country person")

**Farewells**: 再见 zàijiàn (goodbye), 拜拜 bāibāi (bye-bye — very common informally), 回头见 huítóu jiàn (see you later)`,
      q: 'You want to buy "two books" in Chinese. Which is correct?',
      options: ['二书', '两书', '两本书', '二本书'],
      correct: 2,
      explanation: '两本书 (liǎng běn shū). Two rules: (1) before measure words, use 两 (liǎng) not 二 (èr). (2) A measure word is required between the number and noun — 本 (běn) is the measure word for books. "二书" and "两书" both omit the measure word. "二本书" uses the wrong form of "two" (二 is for counting/compounds, not for "two of something").',
    },
    ja: {
      subtitle: 'Japanese number systems (two of them), counters, and the ohayō/konnichiwa/konbanwa triad',
      terms: [
        { term: 'Two Number Systems: Native vs. Sino-Japanese', definition: 'Japanese has two parallel number systems. Sino-Japanese (on-yomi, from Chinese): ichi, ni, san, shi, go, roku, shichi, hachi, kyū/ku, jū. Native Japanese (kun-yomi): hitotsu, futatsu, mittsu, yottsu, itsutsu, muttsu, nanatsu, yattsu, kokonotsu, tō (10). Native numbers 1–10 are used with certain counters and in some set expressions. Sino-Japanese is used for most counting.' },
        { term: 'Counters (助数詞 josūshi)', definition: 'Like Chinese, Japanese requires a counter word between a number and a noun. 一本 (ippon) = one long thing (pencil, bottle). 一枚 (ichimai) = one flat thing (paper, stamp). 一冊 (issatsu) = one bound book. 一匹 (ippiki) = one small animal. 一頭 (ittō) = one large animal. The counter can change the pronunciation of the preceding number (euphonic change).' },
        { term: 'Euphonic Changes', definition: 'Numbers change pronunciation before certain counters: 一 ichi → ip- before -pon, -satsu, -piki. 六 roku → rop- before -pon. 八 hachi → hap- before -pon, -satsu. 十 jū → jup-/jip- before -pon. These changes happen because certain consonant combinations are avoided in Japanese phonology. They must be memorised per counter.' },
        { term: 'Ohayō / Konnichiwa / Konbanwa', definition: 'The three time-based greetings: おはよう(ございます) Ohayō (gozaimasu) = Good morning (gozaimasu adds formality). こんにちは Konnichiwa = Hello/Good afternoon (used late morning through late afternoon). こんばんは Konbanwa = Good evening. Konnichiwa is NOT used for friends in the morning — use ohayō.' },
        { term: 'お元気ですか Ogenki desu ka?', definition: '"Are you well?" — formal equivalent of "How are you?" Used with people you haven\'t seen in a while or in formal contexts. Response: 元気です、ありがとうございます (Genki desu, arigatō gozaimasu — I\'m well, thank you). Casual: 元気? Genki? → 元気! Genki! (Well? → Well!)' },
      ],
      content: `## Japanese Numbers & Greetings

### Two Number Systems

**Sino-Japanese** (used for most counting, money, time, dates):
1=いち (ichi), 2=に (ni), 3=さん (san), 4=し/よん (shi/yon), 5=ご (go),
6=ろく (roku), 7=しち/なな (shichi/nana), 8=はち (hachi), 9=く/きゅう (ku/kyū), 10=じゅう (jū)

Note: 4 and 7 and 9 have two readings each. Avoid し (shi = death) and く (ku = suffering) in unlucky contexts — use よん (yon) and なな (nana) and きゅう (kyū) instead.

**Larger numbers**: 百 hyaku (100), 千 sen (1,000), 万 man (10,000)
- 100 = hyaku, 200 = nihyaku, 300 = sanbyaku (euphonic: by- not hy-)
- 1,000 = sen, 2,000 = nisen, 3,000 = sanzen (euphonic change)
- 10,000 = ichiman, 100,000 = jūman, 1,000,000 = hyakuman

**Native Japanese** (1–10 only, with -tsu ending):
ひとつ (hitotsu), ふたつ (futatsu), みっつ (mittsu), よっつ (yottsu), いつつ (itsutsu),
むっつ (muttsu), ななつ (nanatsu), やっつ (yattsu), ここのつ (kokonotsu), とお (tō)

Native numbers are used with generic objects when the specific counter is unknown, or in set expressions.

### Key Counters

| Counter | For | 1 | 2 | 3 |
|---------|-----|---|---|---|
| 本 (-hon) | long thin objects | いっぽん (ippon) | にほん (nihon) | さんぼん (sanbon) |
| 枚 (-mai) | flat objects | いちまい | にまい | さんまい |
| 冊 (-satsu) | books | いっさつ (issatsu) | にさつ | さんさつ |
| 個 (-ko) | small objects | いっこ (ikko) | にこ | さんこ |
| 人 (-nin) | people | ひとり (hitori) | ふたり (futari) | さんにん |
| 台 (-dai) | machines/vehicles | いちだい | にだい | さんだい |

Note: 一人 (one person) = hitori, 二人 (two people) = futari — native Japanese forms.

### Greeting System

**Time-based greetings** (always match time of day):
- おはよう Ohayō = Good morning (casual)
- おはようございます Ohayō gozaimasu = Good morning (formal)
- こんにちは Konnichiwa = Hello/Good afternoon (~10am–5pm)
- こんばんは Konbanwa = Good evening (~5pm+)
- おやすみ(なさい) Oyasumi (nasai) = Good night (going to sleep)

**How are you**:
- お元気ですか? Ogenki desu ka? (formal — haven't seen in a while)
- 元気? Genki? (casual)
- 最近どう? Saikin dō? (How have you been lately? — casual)
- Response: 元気です！ (Formal) / 元気！ (Casual)

**Introductions**:
- はじめまして Hajimemashite (Nice to meet you — first meeting only)
- [Name]と申します [Name] to mōshimasu (My name is... — formal, humble)
- [Name]です [Name] desu (I'm [name] — neutral)
- どうぞよろしく Dōzo yoroshiku (Please treat me well / Nice to meet you)
- よろしくおねがいします Yoroshiku onegaishimasu (formal version)

**Farewells**:
- さようなら Sayōnara (formal/permanent goodbye — overused by English learners)
- またね Mata ne (See you / Casual goodbye)
- じゃあね Jā ne (Bye then — very casual)
- お先に Osaki ni (I'm leaving first — said to colleagues when leaving work)`,
      q: 'What is the Japanese counter for "three pencils"?',
      options: ['三本 (sanhon)', 'さんぼん (sanbon)', '三枚 (sanmai)', '三個 (sanko)'],
      correct: 1,
      explanation: 'Long thin objects (pencils, pens, bottles, trees) use the counter 本 (-hon/-bon/-pon). Three = さんぼん (sanbon) — note the euphonic change from -hon to -bon after san. The counter 枚 (mai) is for flat objects (paper, stamps, shirts). 個 (ko) is for small round/generic objects. The counter changes the number\'s pronunciation: 一本 = ippon, 二本 = nihon, 三本 = sanbon, 六本 = roppon, 八本 = happon.',
    },
    ko: {
      subtitle: 'Korean two number systems, counters, and annyeonghaseyo in context',
      terms: [
        { term: 'Sino-Korean Numbers (일 이 삼...)', definition: '일(1) 이(2) 삼(3) 사(4) 오(5) 육(6) 칠(7) 팔(8) 구(9) 십(10). Used for: dates, months, minutes, money, phone numbers, addresses, floor numbers. 십일(11), 이십(20), 삼십(30)... 백(100), 천(1,000), 만(10,000).' },
        { term: 'Native Korean Numbers (하나 둘 셋...)', definition: '하나(1) 둘(2) 셋(3) 넷(4) 다섯(5) 여섯(6) 일곱(7) 여덟(8) 아홉(9) 열(10). Used for: counting objects with counters, age (informal), hours on the clock. Only go up to 99 — after that, Sino-Korean takes over. When followed by a counter, 하나→한, 둘→두, 셋→세, 넷→네.' },
        { term: 'Counters (의존명사)', definition: '개 (gae) — generic counter for objects. 명 (myeong) or 사람 (saram) — for people. 마리 (mari) — for animals. 권 (gwon) — for books. 장 (jang) — for flat things. 잔 (jan) — for cups/glasses. 병 (byeong) — for bottles. Native Korean numbers are used with these counters: 두 개 (two objects), 세 명 (three people).' },
        { term: '안녕하세요 Annyeonghaseyo', definition: 'The standard greeting: "Are you at peace?" (lit. 안녕 = peace, 하세요 = are you/do you). Used morning-evening with strangers, acquaintances, anyone deserving respect. Formal: 안녕하십니까 Annyeong hasimnikka. Casual (friends, juniors): 안녕 Annyeong. As a farewell: 안녕히 가세요 (to someone leaving), 안녕히 계세요 (to someone staying).' },
        { term: 'Age and Respect Culture', definition: 'Korean culture places high importance on age in social interaction. Asking someone\'s age early in a relationship is normal — it determines whether you use 존댓말 (jondaemal — formal speech) or 반말 (banmal — casual speech). First meeting: always use formal speech until invited to speak casually. The difference is not just politeness — verb endings change completely.' },
      ],
      content: `## Korean Numbers & Greetings

### Two Number Systems — Rules for Each

**Sino-Korean** (일, 이, 삼...):
일(1) 이(2) 삼(3) 사(4) 오(5) 육/륙(6) 칠(7) 팔(8) 구(9) 십(10)
십일(11), 십이(12)... 이십(20), 이십일(21)...
백(100), 천(1,000), 만(10,000), 십만(100,000), 백만(1,000,000)

**Use Sino-Korean for**:
- Dates: 삼월 이십오일 (March 25th — 3rd month, 25th day)
- Minutes: 삼십 분 (30 minutes)
- Money: 오천 원 (5,000 won)
- Phone numbers: read digit by digit
- Floor numbers: 이 층 (2nd floor)
- Age (formal): 이십오 살 (25 years old — formal)

**Native Korean** (하나, 둘, 셋...):
하나(1) 둘(2) 셋(3) 넷(4) 다섯(5) 여섯(6) 일곱(7) 여덟(8) 아홉(9) 열(10)
열하나(11), 열둘(12)... 스물(20), 서른(30), 마흔(40), 쉰(50), 예순(60), 일흔(70), 여든(80), 아흔(90)

**Use Native Korean for**:
- Counting objects with counters: 두 개 (two items)
- Hours: 두 시 (2 o'clock)
- Age (informal): 스물다섯 살 (25 years old — casual)

**Before counters**, native numbers 1-4 contract: 하나→한, 둘→두, 셋→세, 넷→네
Example: 한 개 (one item), 두 명 (two people), 세 마리 (three animals)

### Key Counters

| Counter | Pronunciation | Used for |
|---------|--------------|---------|
| 개 | gae | generic objects |
| 명 | myeong | people (neutral/formal) |
| 분 | bun | people (respectful) |
| 마리 | mari | animals |
| 권 | gwon | books |
| 장 | jang | flat things (paper, tickets) |
| 잔 | jan | cups/glasses |
| 병 | byeong | bottles |
| 벌 | beol | sets of clothing |

### The Greeting System

**안녕하세요** (Annyeonghaseyo) = standard greeting, all times of day
- Response: 안녕하세요! (same back) or 네, 안녕하세요!

**Formal**: 안녕하십니까 (Annyeong hasimnikka) — very formal, job interviews, official settings

**Casual**: 안녕 (Annyeong) — friends, younger people, close relationships only

**Goodbye** — two forms based on who moves:
- 안녕히 가세요 (Annyeonghi gaseyo) — "go peacefully" — said to the person LEAVING
- 안녕히 계세요 (Annyeonghi gyeseyo) — "stay peacefully" — said to the person STAYING
- Casual: 잘 가 (Jal ga — go well), 잘 있어 (Jal isseo — stay well)

**Introductions**:
- 처음 뵙겠습니다 Cheoeum boepgesseumnida (Formal: Nice to meet you for the first time)
- 만나서 반갑습니다 Mannaseo bangapseumnida (Nice to meet you)
- 이름이 뭐예요? Ireumi mwoyeyo? (What's your name? — polite informal)
- 저는 [name]이에요/예요 Jeoneun [name]ieyo/yeyo (I'm [name])

**How are you**:
- 잘 지내셨어요? Jal jinaesyeosseoyo? (Have you been well? — formal)
- 잘 지냈어요? Jal jinaesseoyo? (Have you been well? — polite informal)
- 어떻게 지내세요? Eotteoke jinaeseyo? (How are you getting along?)`,
      q: 'You want to say "three cups of coffee" in Korean. Which number system and counter do you use?',
      options: [
        'Sino-Korean: 삼 잔 (sam jan)',
        'Native Korean: 세 잔 (se jan)',
        'Either: 세 잔 or 삼 잔 are both correct',
        'Native Korean: 셋 잔 (set jan)',
      ],
      correct: 1,
      explanation: '세 잔 — Native Korean numbers are used for counting objects with counters. 잔 (jan) is the counter for cups/glasses. The native number for 3 is 셋, but before a counter it contracts to 세 (하나→한, 둘→두, 셋→세, 넷→네). Using the Sino-Korean 삼 (sam) with 잔 is incorrect in natural speech. "셋 잔" is wrong because the contracted form 세 is required before counters.',
    },
    hi: {
      subtitle: 'Hindi numbers 1–100, namaste in context, and the aap/tum/tu respect system',
      terms: [
        { term: '1–10: ek do teen chaar paanch chheh saat aath nau das', definition: 'एक(1) दो(2) तीन(3) चार(4) पाँच(5) छह(6) सात(7) आठ(8) नौ(9) दस(10). Hindi numbers from 11–99 are mostly irregular — each must be memorised individually. This is one of the larger memorisation challenges in Hindi. A chart approach works best.' },
        { term: 'Teen Levels of "You": aap / tum / tu', definition: 'Hindi has three forms of "you": आप (āp) — formal/respectful, used with elders, strangers, anyone you want to show respect; तुम (tum) — informal, used with friends, younger people; तू (tū) — intimate OR rude depending on context (close family, very close friends, or deliberately disrespectful). Always start with āp with new people.' },
        { term: 'नमस्ते Namaste', definition: 'The universal Hindi greeting — works morning to night, formal to casual, hello and goodbye. Accompanied by the gesture of palms pressed together at chest (anjali mudra). Meaning: "I bow to the divine in you." The final E is voiced: na-mas-TE not "namasty." Can also say नमस्कार Namaskar (slightly more formal).' },
        { term: 'आप कैसे हैं? Āp kaise hain?', definition: '"How are you?" (formal — using āp). Response: मैं ठीक हूँ, धन्यवाद (Main ṭhīk hūṃ, dhanyavād — I\'m fine, thank you). Or: बहुत अच्छा (bahut acchā — very good), एकदम ठीक (ekdam ṭhīk — absolutely fine). Informal (tum): तुम कैसे हो? Tum kaise ho?' },
        { term: 'Irregular numbers 11–19', definition: 'These must be memorised: ग्यारह (gyārah — 11), बारह (bārah — 12), तेरह (terah — 13), चौदह (caudah — 14), पंद्रह (pandrah — 15), सोलह (solah — 16), सत्रह (satrah — 17), अठारह (aṭhārah — 18), उन्नीस (unnīs — 19), बीस (bīs — 20). The logic becomes more visible from 21 onwards.' },
      ],
      content: `## Hindi Numbers & Greetings

### The Numbers (A Memorisation Task)

Hindi numbers are notoriously irregular in 11-99. Here is the full picture:

**1–10**: एक(1) दो(2) तीन(3) चार(4) पाँच(5) छह(6) सात(7) आठ(8) नौ(9) दस(10)

**11–20** (all irregular):
ग्यारह(11) बारह(12) तेरह(13) चौदह(14) पंद्रह(15) सोलह(16) सत्रह(17) अठारह(18) उन्नीस(19) बीस(20)

**21–30**:
इक्कीस(21) बाईस(22) तेईस(23) चौबीस(24) पच्चीस(25) छब्बीस(26) सत्ताईस(27) अट्ठाईस(28) उनतीस(29) तीस(30)

**31–40**:
इकतीस(31) बत्तीस(32) तैंतीस(33) चौंतीस(34) पैंतीस(35) छत्तीस(36) सैंतीस(37) अड़तीस(38) उनतालीस(39) चालीस(40)

**Tens**:
बीस(20) तीस(30) चालीस(40) पचास(50) साठ(60) सत्तर(70) अस्सी(80) नब्बे(90) सौ(100)

**Hundreds and above**:
एक सौ (100), दो सौ (200)... एक हज़ार (1,000), दस हज़ार (10,000), एक लाख (100,000), दस लाख (1,000,000), एक करोड़ (10,000,000)

Note: Hindi uses the South Asian numbering system with its own units: लाख (lākh = 100,000), करोड़ (karoṛ = 10,000,000). These are used constantly in Indian media and commerce.

### The Three Forms of "You"

| Form | Script | Use | Example |
|------|--------|-----|---------|
| आप āp | formal | elders, strangers, respect | आप कैसे हैं? (How are you — formal) |
| तुम tum | informal | friends, peers, younger | तुम कैसे हो? (How are you — informal) |
| तू tū | intimate/rude | very close OR disrespectful | तू कैसा है? (close friend OR insult) |

Default rule: always use āp with new people. Wait for them to invite informality.

### Greeting Exchanges

**नमस्ते Namaste** — universal (formal + informal, hello + goodbye):
- Accompany with palms together at chest
- Response: नमस्ते! (same back)
- Variants: नमस्कार Namaskār (slightly more formal)

**How are you**:
- आप कैसे/कैसी हैं? Āp kaise/kaisī hain? (formal, m/f)
- तुम कैसे/कैसी हो? Tum kaise/kaisī ho? (informal)
- क्या हाल है? Kyā hāl hai? (What's up? / How's it going?)
- सब ठीक? Sab ṭhīk? (Everything okay? — very casual)

**Responses**:
- मैं ठीक हूँ Main ṭhīk hūṃ (I'm fine)
- बहुत अच्छा Bahut acchā (Very good — m) / बहुत अच्छी (f)
- ठीक-ठाक Ṭhīk-ṭhāk (So-so — like French "comme ci comme ça")
- आपका शुक्रिया Āpkā śukriyā / धन्यवाद dhanyavād (Thank you — formal)

**Introductions**:
- आपका नाम क्या है? Āpkā nām kyā hai? (What is your name? — formal)
- मेरा नाम [name] है Main [name] hūṃ (My name is...)
- आप कहाँ से हैं? Āp kahāṃ se hain? (Where are you from?)
- आपसे मिलकर खुशी हुई Āpse milkar khuśī huī (Nice to meet you)

**Days and time**:
- Days: सोमवार, मंगलवार, बुधवार, गुरुवार, शुक्रवार, शनिवार, रविवार
- कितने बजे हैं? Kitne baje hain? (What time is it? — lit. "how many strokes?")
- दो बजे हैं Do baje hain (It's 2 o'clock)`,
      q: 'Meeting your friend\'s grandmother for the first time, what do you say?',
      options: [
        'तुम कैसी हो? (Tum kaisī ho?)',
        'नमस्ते! आप कैसी हैं? (Namaste! Āp kaisī hain?)',
        'हाय! सब ठीक? (Hi! Sab ṭhīk?)',
        'तू कैसी है? (Tū kaisī hai?)',
      ],
      correct: 1,
      explanation: 'With an elder you are meeting for the first time, always use आप (āp) — the formal/respectful "you." The greeting "Namaste! Āp kaisī hain?" uses the correct formal register. तुम (tum) is informal — appropriate for friends and peers, but not an elder you just met. तू (tū) with a stranger/elder is disrespectful. The feminine form of कैसे is कैसी since the grandmother is female.',
    },
    de: {
      subtitle: 'German numbers, the formal/informal address divide, and Guten Morgen protocols',
      terms: [
        { term: 'Numbers and Gender: ein/eine', definition: 'German "one" agrees with gender: ein Mann (m), eine Frau (f), ein Kind (n). Unlike English, this affects all articles and adjectives in German. In compound numbers: einundzwanzig (21), einunddreißig (31) — note "dreißig" not "dreizig" for 30.' },
        { term: 'Reversed Compound Numbers', definition: 'German compound numbers 21–99 are said in reverse order: einundzwanzig (one-and-twenty = 21), dreiundvierzig (three-and-forty = 43). This is the same system as older English ("four and twenty blackbirds"). Written as one word: zweiundachtzig (82).' },
        { term: 'Sie vs. du: The Critical Divide', definition: 'German "Sie" (capital S) = formal "you" — used with strangers, professionals, elders, anyone in a formal context. "du" (lowercase) = informal "you" — friends, family, children, colleagues who have explicitly offered du. Mixing these up is a serious social error. "Darf ich Sie duzen?" (May I use "du" with you?) is how the transition is offered.' },
        { term: 'Guten Morgen / Guten Tag / Guten Abend', definition: 'Good morning (until ~10am) / Good day/afternoon (~10am–6pm) / Good evening (after ~6pm). In Bavaria and Austria: "Grüß Gott" (Greet God — traditional Catholic greeting). Informal: "Hallo!" (universal), "Hi!" (increasingly common). "Tschüs" = informal goodbye. "Auf Wiedersehen" = formal goodbye (lit. "until we see again").' },
        { term: 'Wie geht es Ihnen? / Wie geht\'s?', definition: '"How are you?" — formal (Ihnen) and informal (\'s = es). Responses: Gut, danke (Well, thanks), Sehr gut (Very well), Es geht (It goes/okay), Nicht so gut (Not so well), Danke, und Ihnen/dir? (Thanks, and you? — formal/informal). Germans often give honest answers rather than reflexive "fine."' },
      ],
      content: `## German Numbers & Greetings

### Numbers

**1–12** (unique words):
eins(1), zwei(2), drei(3), vier(4), fünf(5), sechs(6), sieben(7), acht(8), neun(9), zehn(10), elf(11), zwölf(12)

**13–19**: dreizehn, vierzehn, fünfzehn, sechzehn (not sechszehn), siebzehn (not siebenzehn), achtzehn, neunzehn

**Tens**: zwanzig(20), dreißig(30), vierzig(40), fünfzig(50), sechzig(60), siebzig(70), achtzig(80), neunzig(90)

**Compound numbers 21–99** (reversed, one word):
einundzwanzig(21), zweiundzwanzig(22)... neunundneunzig(99)

**100+**: hundert(100), zweihundert(200)... tausend(1,000), zweitausend(2,000)
Million, Milliarde (billion — different from American "billion")

**Phone numbers**: Germans often say numbers in pairs — 089 / 34 56 78 → "null acht neun, vier und dreißig, sechs und fünfzig, acht und siebzig"

### Sie vs. du: The Social Contract

This is not optional politeness — it is a grammatical and social system:

| Feature | Sie (formal) | du (informal) |
|---------|-------------|--------------|
| "You" | Sie | du |
| Verb (sein) | Sie sind | du bist |
| "Your" | Ihr / Ihre | dein / deine |
| Context | Strangers, professionals, elders | Friends, family, children |

Offering du: "Wir können auch du sagen" (We can also say du) or "Darf ich Sie duzen?" — the person of higher status or age offers this first.

### Greeting System

**Formal time-based greetings**:
- Guten Morgen! (Good morning — until ~10am)
- Guten Tag! (Good day — main daytime greeting)
- Guten Abend! (Good evening — from ~6pm)
- Gute Nacht! (Good night — going to sleep)

**Regional**:
- Grüß Gott! (Bavaria, Austria — "Greet God")
- Servus! (Bavaria, Austria — hello and goodbye, very casual)
- Moin! (Northern Germany — any time of day)

**Informal universal**: Hallo! / Hi!

**How are you**:
- Wie geht es Ihnen? (formal) → Gut, danke. Und Ihnen?
- Wie geht's? (casual) → Gut, danke! Und dir?
- Alles gut? (Everything good? — casual) → Ja, alles gut!

**Goodbyes**:
- Auf Wiedersehen (formal — see you again)
- Tschüs / Tschüss (informal — bye)
- Bis dann! (Until then / See you)
- Bis bald! (See you soon)
- Ciao! (increasingly common in cities)

**Introductions**:
- Wie heißen Sie? (formal) / Wie heißt du? (informal) — What's your name?
- Ich heiße [name]. / Mein Name ist [name].
- Woher kommen Sie? / Woher kommst du? — Where are you from?
- Ich komme aus [city/country].
- Freut mich! (Nice to meet you — lit. "It pleases me")`,
      q: 'How do you say 43 in German?',
      options: ['Vierzig-drei', 'Dreiundvierzig', 'Vierzigdrei', 'Dreizig und vier'],
      correct: 1,
      explanation: 'German compound numbers are said with the unit first, then "und" (and), then the ten: drei (3) + und + vierzig (40) = dreiundvierzig (43). This reversed order applies to all numbers 21–99 and they are written as one word. "Dreißig" (30) has an irregular spelling — ß not z+i+g.',
    },
    nl: {
      subtitle: 'Dutch numbers, the informal greeting culture, and dag/hallo/doei',
      terms: [
        { term: 'Numbers and the -tig Pattern', definition: 'Dutch tens: twintig(20), dertig(30), veertig(40), vijftig(50), zestig(60), zeventig(70), tachtig(80), negentig(90). Most end in -tig (like English -ty). Tachtig (80) is irregular. Compound numbers: eenentwintig(21) — reversed like German but sometimes written separately in informal use.' },
        { term: 'Hallo! / Hoi! / Dag!', definition: '"Hallo" = Hello (standard). "Hoi" = Hi (very casual, very common in NL). "Dag!" = both Hello and Goodbye (versatile — lit. "day"). "Goedemorgen" (good morning), "Goedemiddag" (good afternoon), "Goedenavond" (good evening) — all three are somewhat formal; Hallo/Hoi are far more common in daily life.' },
        { term: 'Hoe gaat het? / Alles goed?', definition: '"How is it going?" / "Everything well?" Dutch greetings are often brief and casual. "Goed, dankjewel" (Good, thank you). "Gaat wel" (It goes — neutral/okay). "Prima" (Fine/Great). "Niet zo goed" (Not so good). Dutch directness means you may get an honest answer, not a reflexive "fine."' },
        { term: 'jij/jou vs. u', definition: '"Jij/jou" = informal "you" (very common in modern Dutch). "U" = formal "you" (used with elders, customers in formal service contexts, official settings). Modern Dutch has largely moved toward "jij" even in semi-formal situations — "u" is increasingly reserved for very formal or older usage, especially in the Netherlands. Belgian Dutch (Flemish) uses "u" more freely.' },
        { term: 'Doei! / Tot ziens!', definition: '"Doei!" = Bye! (very casual — the most common farewell in informal Dutch, especially NL). "Tot ziens" = Until we see (formal goodbye). "Tot later" = see you later. "Dag!" = Bye! (also used as both hello and goodbye). "Welterusten" = Good night / Sleep well.' },
      ],
      content: `## Dutch Numbers & Greetings

### Numbers

**1–10**: één(1), twee(2), drie(3), vier(4), vijf(5), zes(6), zeven(7), acht(8), negen(9), tien(10)

**11–19**: elf(11), twaalf(12), dertien(13), veertien(14), vijftien(15), zestien(16), zeventien(17), achttien(18), negentien(19)

**Tens**: twintig(20), dertig(30), veertig(40), vijftig(50), zestig(60), zeventig(70), tachtig(80 — irregular), negentig(90), honderd(100)

**Compound 21–99** (unit + en + ten, one word):
eenentwintig(21), tweeëntwintig(22)... negenennegentg(99)
Note: double vowel collision gets a diaeresis: tweeëntwintig (not tweeen-)

**100+**: honderd(100), tweehonderd(200)... duizend(1,000), twee duizend(2,000)
miljoen(1,000,000), miljard(1,000,000,000)

**Telephone/practical**: Dutch phone numbers are often read in pairs or individually. "06 12 34 56 78" → "nul zes, twaalf, vierendertig, zesenvijftig, achtenzeventig."

### Greeting Culture (Casual-First)

Dutch culture is generally informal and direct. Formal address is less pervasive than in German or French:

**Any time of day**:
- Hallo! → Hallo!
- Hoi! (very casual, very common) → Hoi!
- Dag! (hello/goodbye) → Dag!

**Time-based** (more formal, less common in daily use):
- Goedemorgen / Goemorgen (Good morning)
- Goedemiddag (Good afternoon)
- Goedenavond (Good evening)

**How are you**:
- Hoe gaat het (met je/u)? → Goed, dankjewel! En met jou/u?
- Alles goed? → Ja, prima! / Gaat wel.
- Hoe is het? → Niet slecht! (Not bad!)

**Introductions**:
- Hoe heet je? / Hoe heet u? (What's your name? — informal/formal)
- Ik heet [name]. / Mijn naam is [name].
- Waar kom je vandaan? (Where are you from?)
- Ik kom uit [city/country].
- Aangenaam (kennis te maken)! (Nice to meet you! — lit. "pleasant to make acquaintance")

**Farewells**:
- Doei! (bye — very common informal NL)
- Tot ziens! (Goodbye — formal)
- Tot later! / Tot snel! (See you later/soon)
- Dag! (hello AND goodbye)
- Welterusten! (Good night / Sleep well)`,
      q: 'How do you write "52" in Dutch?',
      options: ['Vijftigen-twee', 'Tweeenvijftig', 'Twee en vijftig', 'Vijftig-twee'],
      correct: 1,
      explanation: 'Dutch compound numbers 21–99 are written unit + en + ten, as one word: twee (2) + en + vijftig (50) = tweeënvijftig (52). The diaeresis on ë appears when two identical vowels collide: "twee-en" → "tweeën" to show the E is pronounced separately. This compound-number reversal (unit before ten) mirrors German and older English.',
    },
    ru: {
      subtitle: 'Russian numbers 1–1000, the two words for "you," and Zdravstvuyte in formal context',
      terms: [
        { term: '1–10: odin dva tri chetyre pyat shest sem vosem devyat desyat', definition: 'один(1) два(2) три(3) четыре(4) пять(5) шесть(6) семь(7) восемь(8) девять(9) десять(10). Numbers 1 and 2 have gender agreement: один стол (m), одна книга (f), одно окно (n); два стола (m), две книги (f). Numbers 5–20 require genitive plural.' },
        { term: 'Case Government of Numbers', definition: '1 (один) + nominative singular: один стол (one table). 2–4 + genitive singular: два стола (two tables — gen. sg. not pl.). 5–20 + genitive plural: пять столов (five tables — gen. pl.). This three-way split is one of the first grammar challenges when Russian numbers meet nouns.' },
        { term: 'Ты vs. Вы', definition: '"Ты" (ty) = informal "you" — friends, family, children, close colleagues. "Вы" (Vy, capital V) = formal "you" — strangers, elders, superiors, official contexts. Also used as plural "you" (like English "you all"). Russian social convention: using ты with a stranger is presumptuous; wait to be invited or until the other person uses it.' },
        { term: 'Здравствуйте / Привет', definition: '"Здравствуйте" (Zdravstvuyte — formal) = Hello / Good day. Literally: "Be healthy (plural/formal)." Notoriously hard to pronounce: the first В is typically silent in natural speech — "ZDRA-stvuy-tye." "Привет" (Privet) = Hi (informal). "Добрый день" (Dobry den\' — Good day), "Доброе утро" (Dobroye utro — Good morning), "Добрый вечер" (Dobry vecher — Good evening).' },
        { term: 'Как дела? / Как вы поживаете?', definition: '"Как дела?" (Kak dela? — How are things? / How are you? — casual). "Как вы поживаете?" (Kak vy pozhivayete? — How are you? — formal). Responses: Хорошо (khorosho — good), Отлично (otlichno — excellent), Нормально (normal\'no — normally/okay — very common Russian response), Неплохо (neplo\'kho — not bad), Плохо (plokho — bad — Russians may actually say this).' },
      ],
      content: `## Russian Numbers & Greetings

### Numbers

**1–20**: один(1) два(2) три(3) четыре(4) пять(5) шесть(6) семь(7) восемь(8) девять(9) десять(10) одиннадцать(11) двенадцать(12) тринадцать(13) четырнадцать(14) пятнадцать(15) шестнадцать(16) семнадцать(17) восемнадцать(18) девятнадцать(19) двадцать(20)

**Tens**: двадцать(20) тридцать(30) сорок(40 — irregular) пятьдесят(50) шестьдесят(60) семьдесят(70) восемьдесят(80) девяносто(90 — irregular) сто(100)

**Note**: сорок (40) and девяносто (90) are irregular — no pattern.

**Compound numbers**: двадцать один(21), тридцать два(32)... — said forward, unlike German.

**Hundreds**: сто(100) двести(200) триста(300) четыреста(400) пятьсот(500) шестьсот(600) семьсот(700) восемьсот(800) девятьсот(900) тысяча(1,000)

**Large numbers**: тысяча(1,000), миллион(1,000,000), миллиард(1,000,000,000)

### Number + Noun Case Agreement

This is essential from the start:
- 1 → nominative singular: один стол, одна книга, одно слово
- 2, 3, 4 → genitive singular: два стола, три книги, четыре слова
- 5–20 → genitive plural: пять столов, десять книг, двадцать слов
- 21 → resets to nominative singular: двадцать один стол
- 22, 23, 24 → genitive singular again: двадцать два стола

### Greeting System

**Formal (Вы register)**:
- Здравствуйте! (Zdravstvuyte!) → Здравствуйте!
- Добрый день! (Good day! — noon to evening)
- Доброе утро! (Good morning!)
- Добрый вечер! (Good evening!)
- Как вы поживаете? → Спасибо, хорошо. А вы?

**Informal (ты register)**:
- Привет! (Hi!) → Привет!
- Здравствуй (singular informal — less common than Привет)
- Как дела? → Хорошо! / Нормально. / Неплохо. А ты?
- Как ты? → Да так, ничего (So-so, nothing special — very common)

**Introductions**:
- Как вас зовут? (formal — What are you called?)
- Как тебя зовут? (informal)
- Меня зовут [name]. (My name is... — lit. "They call me...")
- Очень приятно! (Very pleasant — Nice to meet you!)
- Откуда вы? / Откуда ты? (Where are you from?)
- Я из [city/country]. (I'm from...)

**Farewells**:
- До свидания (Do svidaniya — formal goodbye — "until the meeting")
- Пока (Poka — bye — very casual)
- До встречи (Until we meet — semi-formal)
- Спокойной ночи (Good night)`,
      q: 'Five tables in Russian: "пять ___." Which form of "table" (стол) is needed?',
      options: ['стол (nominative singular)', 'стола (genitive singular)', 'столы (nominative plural)', 'столов (genitive plural)'],
      correct: 3,
      explanation: 'Numbers 5 and above require the genitive plural. "Стол" (table) in genitive plural = "столов." So: пять столов (five tables). For 2-4: два стола (genitive singular). For 1: один стол (nominative singular). This case system resets: 21 → nominative singular (двадцать один стол), 22–24 → genitive singular, 25+ → genitive plural.',
    },
    ar: {
      subtitle: 'Arabic numbers, the dual number system, and As-salamu alaykum in context',
      terms: [
        { term: 'Arabic Numerals vs. Eastern Arabic Numerals', definition: 'The "Arabic numerals" we use in English (1 2 3 4 5 6 7 8 9 0) actually came to Europe via Arabic. But in many Arab countries, a different numeral system is used: ٠١٢٣٤٥٦٧٨٩ (Eastern Arabic or Indic numerals). In Egypt and the Maghreb, Western (European) numerals are common. MSA textbooks use both — learn to recognise Eastern Arabic numerals.' },
        { term: 'Arabic Number Words', definition: '١ = واحد (wāḥid), ٢ = اثنان (ithnān), ٣ = ثلاثة (thalātha), ٤ = أربعة (arbaʿa), ٥ = خمسة (khamsa), ٦ = ستة (sitta), ٧ = سبعة (sabʿa), ٨ = ثمانية (thamāniya), ٩ = تسعة (tisʿa), ١٠ = عشرة (ʿashara). Numbers 3-10 show gender polarity — the number is masculine when the noun is feminine and vice versa.' },
        { term: 'Gender Polarity in Numbers', definition: 'Arabic numbers 3–10 have a peculiar feature: the number takes the OPPOSITE gender of the counted noun. "Three books" — كتاب (book) is masculine → ثلاثة كتب (thalātha kutub — the number is feminine). "Three girls" — بنت (girl) is feminine → ثلاث بنات (thalāth banāt — the number is masculine). This counterintuitive rule must be memorised.' },
        { term: 'السلام عليكم As-salāmu ʿalaykum', definition: '"Peace be upon you" — the Islamic greeting used across the Arab world and Muslim communities globally. Response: وعليكم السلام wa-ʿalaykum as-salām ("And upon you peace"). This exchange is used between Muslims. Non-Muslims in Arab countries typically use مرحبا (marḥaban — welcome/hi) or أهلاً (ahlan — hi/welcome) as greetings.' },
        { term: 'كيف حالك؟ Kayfa ḥāluk?', definition: '"How is your condition/state?" — How are you? (addressing male: ḥāluk; female: ḥālik; plural: ḥālukum). Response: بخير، شكراً (bi-khayr, shukran — well, thanks), الحمد لله (al-ḥamdu lillāh — Praise be to God — the most common Arabic response to "how are you," used by Muslims and Arab Christians alike).' },
      ],
      content: `## Arabic Numbers & Greetings

### Arabic Numerals — Two Scripts

**Eastern Arabic numerals** (used in many Arab countries):
٠=0, ١=1, ٢=2, ٣=3, ٤=4, ٥=5, ٦=6, ٧=7, ٨=8, ٩=9

**Number words 1–10**:
| Num | Masc (with fem noun) | Fem (with masc noun) |
|-----|---------------------|---------------------|
| 1 | واحد wāḥid | واحدة wāḥida |
| 2 | اثنان ithnān | اثنتان ithnatān |
| 3 | ثلاثة thalātha | ثلاث thalāth |
| 4 | أربعة arbaʿa | أربع arbaʿ |
| 5 | خمسة khamsa | خمس khams |
| 6 | ستة sitta | ست sitt |
| 7 | سبعة sabʿa | سبع sabʿ |
| 8 | ثمانية thamāniya | ثماني thamānī |
| 9 | تسعة tisʿa | تسع tisʿ |
| 10 | عشرة ʿashara | عشر ʿashr |

**The gender polarity rule**: For 3-10, the form used depends on the OPPOSITE gender of the noun counted.

**Tens**: عشرون(20) ثلاثون(30) أربعون(40) خمسون(50) ستون(60) سبعون(70) ثمانون(80) تسعون(90) مئة(100) ألف(1,000)

### The Dual Number (المثنى al-muthannā)

Arabic has a DUAL form — a special grammatical number for exactly two of something, distinct from singular AND plural:
- كتاب (kitāb — book, singular)
- كتابان (kitābān — two books, dual — nominative)
- كتابين (kitābayn — two books, dual — accusative/genitive)

The dual is formed by adding -ān/-ayn to the singular. This applies to nouns, adjectives, and pronouns. Numbers 2 are rarely used before nouns in formal Arabic — the dual form of the noun suffices.

### Greeting System

**السلام عليكم As-salāmu ʿalaykum** (universal Muslim greeting):
- Response: وعليكم السلام Wa-ʿalaykum as-salām

**Neutral greetings** (non-religious, usable by all):
- مرحباً Marḥaban (Welcome/Hi) → أهلاً وسهلاً Ahlan wa-sahlan (Welcome! — response)
- أهلاً Ahlan (Hi) → أهلاً بك Ahlan bika (m) / biki (f)
- صباح الخير Ṣabāḥ al-khayr (Good morning — lit. "morning of goodness")
  → صباح النور Ṣabāḥ an-nūr (Morning of light — response)
- مساء الخير Masāʾ al-khayr (Good evening) → مساء النور Masāʾ an-nūr

**How are you** (MSA):
- كيف حالك؟ Kayfa ḥāluk? (m) / ḥālik? (f) — How are you?
- كيف الأحوال؟ Kayfa al-aḥwāl? (How are things? — lit. "how are the conditions?")
- Response: بخير، شكراً Bi-khayr, shukran (Well, thank you)
- الحمد لله Al-ḥamdu lillāh (Praise be to God — most common response)

**Introductions**:
- ما اسمك؟ Mā ismuk? (What's your name? — m address) / Mā ismuki? (f address)
- اسمي [name]. Ismī [name]. (My name is...)
- من أين أنت؟ Min ayna anta? (m) / anti? (f) — Where are you from?
- أنا من [city]. Anā min [city]. (I'm from...)
- تشرفنا Tasharrafnā (Honoured to meet you — formal)
- فرصة سعيدة Furṣa saʿīda (Happy occasion — nice to meet you)`,
      q: 'How do you say "three books" in Arabic? (كتاب = kitāb, masculine noun)',
      options: [
        'ثلاثة كتب (thalātha kutub — feminine number with masculine noun)',
        'ثلاث كتب (thalāth kutub — masculine number with masculine noun)',
        'اثنان كتاب (ithnān kitāb)',
        'كتابان (kitābān)',
      ],
      correct: 0,
      explanation: 'Arabic gender polarity: for numbers 3-10, the number takes the OPPOSITE gender of the noun. كتاب (book) is masculine, so the number for "three" takes the FEMININE form: ثلاثة (thalātha). "ثلاثة كتب" = three books. This counterintuitive rule is one of the distinctive features of Arabic number grammar. كتابان = the dual form (exactly two books).',
    },
    sw: {
      subtitle: 'Swahili numbers, noun classes, and the habari/jambo greeting system',
      terms: [
        { term: 'Numbers 1–10: moja mbili tatu nne tano sita saba nane tisa kumi', definition: 'moja(1), mbili(2), tatu(3), nne(4), tano(5), sita(6), saba(7), nane(8), tisa(9), kumi(10). Numbers 1–5 and 8 are Bantu-origin; 6, 7, 9 are Arabic loanwords. Compounds: kumi na moja(11), kumi na mbili(12)... ishirini(20), thelathini(30)...' },
        { term: 'Habari? / Jambo?', definition: '"Habari?" = What news? / How are you? — the standard informal greeting. "Nzuri" (Good) is the standard response, but also: "Safi" (Clean/Great), "Salama" (Peaceful/Fine), "Vizuri" (Well). "Jambo?" = Hello (used mainly with tourists/foreigners — native speakers say Habari). "Sijambo" = I have no problem (fine — response to Jambo).' },
        { term: 'Karibu / Karibuni', definition: '"Karibu" = Welcome / Come in / You\'re welcome (singular). "Karibuni" = Welcome (plural). Also used as "you\'re welcome" after someone thanks you. "Karibu sana" = You\'re very welcome. "Karibu" is one of the most-heard words in East Africa — ubiquitous hospitality expression.' },
        { term: 'Asante / Asante sana', definition: 'Thank you / Thank you very much. From Arabic "شكر" via Swahili phonology. Response: "Karibu" (you\'re welcome) or "Sawa" (okay). "Ahsante" is a variant heard in parts of Tanzania. "Nashukuri" (I give thanks) is a more formal/elevated form.' },
        { term: 'Noun Classes in Swahili', definition: 'Swahili has approximately 8-15 noun classes (genders) that affect verb agreement, adjective agreement, and number words. Numbers 1-5 and 8 take noun class prefixes: m-moja (one person), wa-wili (two people), ki-moja (one thing in ki-class). This is the core complexity of Swahili grammar.' },
      ],
      content: `## Swahili Numbers & Greetings

### Numbers

**1–10**: moja(1), mbili(2), tatu(3), nne(4), tano(5), sita(6), saba(7), nane(8), tisa(9), kumi(10)

**11–19**: kumi na moja(11), kumi na mbili(12)... kumi na tisa(19)

**Tens**: ishirini(20), thelathini(30), arobaini(40), hamsini(50), sitini(60), sabini(70), themanini(80), tisini(90), mia(100)

**Compounds**: ishirini na moja (21), thelathini na tano (35)

**100+**: mia moja (100), mia mbili (200)... elfu moja (1,000), elfu mbili (2,000)
milioni moja (1,000,000)

**Number + noun class agreement** (numbers 1–5 and 8 take prefixes):
- Person class (m-/wa-): mtu mmoja (one person), watu wawili (two people)
- Thing class (ki-/vi-): kitu kimoja (one thing), vitu vitatu (three things)
- Other classes follow their own prefix patterns

The good news: numbers 6, 7, 9, and 10 (sita, saba, tisa, kumi) do NOT take prefixes — they are invariable Arabic loanwords.

### Greeting System

**Habari** (the core greeting):
- Habari? (What news? — general)
- Habari yako? (What's your news? — singular "your")
- Habari za asubuhi? (Morning news? — Good morning)
- Habari za jioni? (Evening news? — Good evening)
- Habari za leo? (Today's news? — How's today?)
- Responses: Nzuri (Good), Safi (Clean/Great), Salama (Peaceful), Vizuri (Well)

**Jambo** (tourist-friendly greeting):
- Jambo! → Sijambo! (I'm fine — lit. "I have no problem")
- Mambo! (What's up? — very casual, youth) → Poa! / Safi! / Fiti! (Cool/Good/Fine)

**Religious greetings** (in Muslim communities — coastal East Africa):
- Assalamu alaikum → Wa alaikum assalam

**Formal/respectful**:
- Shikamoo (greeting to elders — lit. "I hold your feet") → Marahaba (response — lit. "welcome")
- This exchange is expected when greeting elders in Tanzania and Kenya

**Introductions**:
- Jina lako nani? (What is your name? — lit. "name of you who?")
- Jina langu ni [name]. (My name is...)
- Unatoka wapi? (Where do you come from?)
- Ninatoka [city/country]. (I come from...)
- Ninafurahi kukujua (I'm glad to know you — nice to meet you)

**Useful phrases**:
- Tafadhali (Please)
- Asante / Asante sana (Thank you / Thank you very much)
- Karibu / Karibu sana (Welcome / You're very welcome)
- Samahani (Excuse me / Sorry)
- Sawa (Okay / Alright)
- Sawa sawa (Alright alright — totally fine)`,
      q: 'What is the appropriate response when someone says "Habari?" to you in Swahili?',
      options: ['Jambo!', 'Nzuri / Salama / Safi (Good / Peaceful / Clean)', 'Sijambo', 'Karibu'],
      correct: 1,
      explanation: '"Habari?" means "What news?" — it\'s asking how you are. The responses are words meaning good/well: Nzuri (good), Salama (peaceful/fine), Safi (clean/great), Vizuri (well). "Sijambo" is the response to "Jambo?" (not Habari). "Karibu" means welcome/you\'re welcome. "Jambo!" is a greeting, not a response to Habari.',
    },
    ht: {
      subtitle: 'Haitian Creole numbers, bonjou/bonswa, and the kijan ou rele exchange',
      terms: [
        { term: 'Numbers: en de twa kat senk sis sèt uit nèf dis', definition: 'en/youn(1), de(2), twa(3), kat(4), senk(5), sis(6), sèt(7), uit(8), nèf(9), dis(10). Haitian Creole numbers derive from French but are heavily simplified phonologically. "Vingt" (20) in French → "ven" in Creole. Compound: onz(11), douz(12), trèz(13), katòz(14), kenz(15), sèz(16), disèt(17), dizuit(18), diznèf(19), ven(20).' },
        { term: 'Bonjou / Bonswa', definition: '"Bonjou" = Good morning/Hello (daytime — from French "bonjour"). "Bonswa" = Good evening/Hello (evening — from French "bonsoir"). These are the two main time-based greetings. There is no single all-purpose "hello" — time of day matters. "Salut" is also used informally. "Alo" when answering the phone.' },
        { term: 'Kijan ou rele? / Kijan w rele?', definition: '"What are you called? / What\'s your name?" — the standard introduction question. "Kijan" = how/what. "Ou/w" = you. "Rele" = call (yourself). Response: "Mwen rele [name]" (I am called [name]) or "Mwen se [name]" (I am [name]).' },
        { term: 'Kijan ou ye? / Sa k ap fèt?', definition: '"How are you?" (formal) / "What\'s happening?" (casual). Responses: "Mwen byen" (I\'m well), "Pa pi mal" (Not worse — so-so/okay, very common), "Anfòm" (In form/Great), "Konsa konsa" (Like this like this — so-so). "Mèsi" (Thank you). "Pa gen pwoblèm" (No problem).' },
        { term: 'Mèsi / Souple', definition: 'Thank you / Please. "Mèsi anpil" = Thank you very much (anpil = a lot). "Souple" = please (from French "s\'il vous plaît" contracted). "De ryen" = You\'re welcome (from French "de rien"). "Padkwa" (pas de quoi) = Don\'t mention it.' },
      ],
      content: `## Haitian Creole Numbers & Greetings

### Numbers

**1–10**: en/youn(1), de(2), twa(3), kat(4), senk(5), sis(6), sèt(7), uit(8), nèf(9), dis(10)

**11–19**: onz(11), douz(12), trèz(13), katòz(14), kenz(15), sèz(16), disèt(17), dizuit(18), diznèf(19)

**Tens**: ven(20), trant(30), karant(40), senkant(50), swasant(60), swasanndis(70), katreven(80), katrevendis(90), san(100)

Note: Like French, Creole uses vigesimal counting for 70, 80, 90:
- 70 = swasanndis (60+10)
- 80 = katreven (4×20)
- 90 = katrevendis (4×20+10)

**Compounds**: venteyen(21 — formal) / ven e en (21 — common), vandede(22)...

**100+**: san(100), de san(200), twa san(300)... mil(1,000), de mil(2,000)

**Using numbers**:
- No measure words required (unlike Chinese/Japanese/Korean)
- No gender agreement on numbers (unlike French/Spanish)
- Simply: de chat (two cats), twa kay (three houses)

### Greeting System

**Time-based** (the core system):
- Bonjou! (Good morning/Hello — daytime) → Bonjou!
- Bonswa! (Good evening — from afternoon onward) → Bonswa!
- Salut! (Hi! — informal, any time)
- Alo (Hello — phone only)

**How are you**:
- Kijan ou ye? / Kijan w ye? (How are you? — formal/informal)
- Sa k ap fèt? / Sa k ap fèt avèk ou? (What's happening? / What's happening with you?)
- Koman ou ye? (How are you? — alternate form)

**Responses**:
- Mwen byen, mèsi (I'm well, thank you)
- Pa pi mal (Not worse — very common Haitian response = so-so/okay)
- Anfòm (In form — great)
- Konsa konsa (So-so — lit. "like this like this")
- Mèsi Bondye (Thank God — religious response, very common)

**Introductions**:
- Kijan ou rele? / Kijan w rele? (What's your name?)
- Mwen rele [name]. (My name is...)
- Ki kote ou soti? (Where are you from? — lit. "which place you come from?")
- Mwen soti [city/country]. (I'm from...)
- Kontan rankontre ou! (Happy to meet you!)

**Farewells**:
- Orevwa (Goodbye — from French "au revoir")
- Nap wè (We'll see / See you — very common informal)
- Pase yon bon jounen (Have a good day)
- Pase yon bon nuit (Have a good night)

**Essential courtesy**:
- Mèsi / Mèsi anpil (Thank you / Thank you very much)
- Souple (Please)
- Eskize mwen (Excuse me / I'm sorry)
- Pa gen pwoblèm (No problem)
- Dakò (Okay / Agreed — from French "d'accord")`,
      q: 'It\'s 7pm in Port-au-Prince. How do you greet someone you pass on the street?',
      options: ['Bonjou!', 'Bonswa!', 'Alo!', 'Salut, kijan ou ye?'],
      correct: 1,
      explanation: '"Bonswa!" is the correct greeting for the evening — it replaces "Bonjou" once the afternoon begins (roughly from midday/2pm onward, depending on speaker). "Bonjou" is for morning/daytime. "Alo" is only for phone calls. "Salut, kijan ou ye?" is casual and fine, but "Bonswa" alone is the standard time-appropriate greeting here.',
    },
  }

  const d = data[lang.code]
  return {
    id: `lang-${lang.code}-numbers`,
    track: 'language',
    title: `${lang.name}: Numbers & Greetings`,
    subtitle: d.subtitle,
    level: 'Basic',
    xp: 200,
    duration: 35,
    module,
    content: d.content,
    keyTerms: d.terms,
    quiz: [{
      q: d.q,
      options: d.options,
      correct: d.correct,
      explanation: d.explanation,
    }],
    certArea: `${lang.name} Basic Communication`,
    courseObjective: `Count, tell time, and conduct basic greeting exchanges in ${lang.name}`,
    moduleObjective: `Handle introductions and number-based transactions with confidence`,
  }
}

function buildCoreVocabModule(lang: LangEntry, module: number): Course {
  const data: Record<string, {
    subtitle: string; content: string; terms: { term: string; definition: string }[];
    q: string; options: string[]; correct: number; explanation: string
  }> = {
    es: {
      subtitle: 'Build a 500-word survival vocabulary for real Spanish conversations',
      terms: [
        { term: 'la casa', definition: 'the house' },
        { term: 'el agua', definition: 'water (feminine noun, but el)' },
        { term: 'querer', definition: 'to want / to love' },
        { term: 'necesitar', definition: 'to need' },
        { term: 'el mercado', definition: 'the market / grocery store' },
      ],
      content: `## Core Spanish Vocabulary

### The 50 Most-Used Nouns

**People & Relationships**
- la persona (person), la gente (people — collective), el hombre (man), la mujer (woman)
- el niño/la niña (boy/girl), el amigo/la amiga (friend), la familia (family)
- el señor/la señora (Mr./Mrs./sir/ma'am — polite address)

**Places**
- la casa (house/home), el trabajo (work/workplace), la tienda (store), el mercado (market)
- la calle (street), el restaurante (restaurant), el baño (bathroom), la escuela (school)
- el hospital (hospital), el banco (bank), el aeropuerto (airport)

**Time**
- el tiempo (time/weather), el día (day), la noche (night), la semana (week), el año (year)
- hoy (today), mañana (tomorrow/morning), ayer (yesterday)

**Food & Drink**
- el agua (water — note: feminine but uses el), la comida (food/meal), la carne (meat)
- el pan (bread), el arroz (rice), la leche (milk), el café (coffee)
- las verduras (vegetables), las frutas (fruit — collective)

### The 50 Most-Used Verbs

**Essential Actions**
- ser/estar (to be — permanent/temporary), tener (to have), hacer (to do/make)
- ir (to go), venir (to come), querer (to want/love), poder (to be able to/can)
- saber (to know a fact), conocer (to know a person/place), ver (to see)
- hablar (to speak), comer (to eat), beber (to drink), dormir (to sleep)
- trabajar (to work), vivir (to live), pensar (to think), creer (to believe)
- necesitar (to need), buscar (to look for), encontrar (to find), dar (to give)
- llevar (to carry/wear/take), traer (to bring), poner (to put), salir (to leave/go out)

### High-Frequency Adjectives

**Opposites to master first**
- grande/pequeño (big/small), bueno/malo (good/bad), nuevo/viejo (new/old)
- caro/barato (expensive/cheap), fácil/difícil (easy/difficult)
- rápido/lento (fast/slow), cerca/lejos (near/far — also adverbs)
- caliente/frío (hot/cold), limpio/sucio (clean/dirty)

### Survival Phrases Built from Core Vocab

\`\`\`
¿Dónde está el baño?     Where is the bathroom?
Necesito ayuda.          I need help.
¿Cuánto cuesta?          How much does it cost?
No entiendo.             I don't understand.
¿Puede repetir?          Can you repeat?
Tengo hambre/sed.        I'm hungry/thirsty.
¿Dónde puedo comprar...? Where can I buy...?
Quiero [noun], por favor. I want [noun], please.
\`\`\`

### False Friends — Danger Zone

| Spanish | Looks like | Actually means |
|---------|-----------|----------------|
| embarazada | embarrassed | pregnant |
| realizar | to realize | to carry out/achieve |
| actualmente | actually | currently/at present |
| molestar | to molest | to bother/annoy |
| sensible | sensible | sensitive |

### Word-Building Patterns

**-ción/-sión = English -tion** (almost always feminine)
- nación, situación, información, comunicación, conversación

**-mente = English -ly** (adverb suffix)
- rápidamente (quickly), fácilmente (easily), normalmente (normally)

**-ero/-era = person who does X**
- panadero/a (baker), enfermero/a (nurse), camarero/a (waiter)`,
      q: '¿Cuál es la diferencia entre "saber" y "conocer"?',
      options: [
        'They are interchangeable synonyms',
        'Saber = factual knowledge/skills; Conocer = familiarity with people/places',
        'Saber is formal, conocer is informal',
        'Saber is used in Spain, conocer in Latin America',
      ],
      correct: 1,
      explanation: '"Saber" is used for knowing facts, information, or how to do something (Sé hablar español — I know how to speak Spanish; Sé que es tarde — I know it\'s late). "Conocer" is used for being acquainted with a person, place, or thing (Conozco a María — I know María; Conozco Madrid — I know/am familiar with Madrid).',
    },
    fr: {
      subtitle: 'Master the 500 words that power 80% of everyday French',
      terms: [
        { term: 'la maison', definition: 'the house' },
        { term: 'savoir', definition: 'to know (a fact or skill)' },
        { term: 'connaître', definition: 'to know (a person or place)' },
        { term: 'il faut', definition: 'it is necessary / one must' },
        { term: 'quand même', definition: 'still / all the same / anyway' },
      ],
      content: `## Core French Vocabulary

### High-Frequency Nouns

**Abstract essentials** (often used in impersonal constructions)
- le temps (time/weather), la vie (life), le monde (world/people — tout le monde = everyone)
- la chose (thing), la fois (time/instance — une fois = once), le genre (kind/sort)
- l'endroit (place/spot), le truc (thing — informal), la façon (way/manner)

**Daily Objects**
- la maison (house), la voiture (car), le téléphone (phone), l'ordinateur (computer)
- la table (table), la chaise (chair), la fenêtre (window), la porte (door)
- le vêtement (clothing — usually plural: les vêtements), le livre (book)

**Body & Health**
- la tête (head), la main (hand), le cœur (heart/core), le dos (back), les yeux (eyes — pl. of œil)

### Verb Groups & High-Frequency Verbs

**Irregular essentials** (must be memorized)
- être (to be), avoir (to have), aller (to go), faire (to do/make), venir (to come)
- pouvoir (can/to be able), vouloir (to want), devoir (must/to have to), savoir (to know)
- dire (to say), voir (to see), prendre (to take), mettre (to put), partir (to leave)

**Key -er verbs** (regular, use as templates)
- parler (speak), aimer (like/love), chercher (look for), trouver (find), penser (think)
- habiter (live/reside), travailler (work), manger (eat), appeler (call)

### The il faut Construction

"Il faut" (from falloir) is one of the most used French constructions:
- Il faut partir. (One must leave / We need to leave.)
- Il faut que tu viennes. (You need to come — triggers subjunctive)
- Il me faut une heure. (I need an hour — literally "an hour is necessary to me")

### French Filler Words & Connectors

Learning these makes you sound immediately more natural:
- donc (so/therefore), alors (so/then/well), quand même (still/anyway)
- en fait (in fact/actually), par contre (on the other hand), pourtant (yet/however)
- d'accord / OK (okay), c'est-à-dire (that is to say/i.e.), du coup (so/as a result — very common in speech)
- Voilà! (There it is! / That's it!), Bref (In short / Anyway)

### False Friends

| French | Looks like | Actually means |
|--------|-----------|----------------|
| actuellement | actually | currently |
| éventuellement | eventually | possibly/perhaps |
| sensible | sensible | sensitive |
| large | large | wide |
| lecture | lecture | reading |`,
      q: 'Which construction expresses "it is necessary to leave" in French?',
      options: ['C\'est nécessaire partir', 'Il faut partir', 'On doit à partir', 'Il est nécessaire partir'],
      correct: 1,
      explanation: '"Il faut" + infinitive is the standard impersonal construction for necessity. "Il faut partir" = one must leave / it is necessary to leave. The verb after "il faut" takes the plain infinitive (no preposition). "Il est nécessaire" requires "de" before the infinitive: "Il est nécessaire de partir."',
    },
    pt: {
      subtitle: 'Build practical vocabulary for Brazilian and European Portuguese contexts',
      terms: [
        { term: 'saudade', definition: 'longing/nostalgia (unique Portuguese concept)' },
        { term: 'ficar', definition: 'to stay / to become / to be located' },
        { term: 'já', definition: 'already / now / right away (context-dependent)' },
        { term: 'mesmo', definition: 'same / indeed / really (very versatile)' },
        { term: 'tudo bem', definition: 'everything is fine / all good' },
      ],
      content: `## Core Portuguese Vocabulary

### Unique Portuguese Words

**Saudade** — Portugal's famous untranslatable word: a melancholic longing for something or someone absent or past. Tenho saudades de você (I miss you — lit. "I have saudades of you").

**Ficar** — Brazil's most versatile verb (to stay, become, be located, hook up with — context decides):
- Fica aqui! (Stay here!)
- Ficou vermelho. (He turned red / became red)
- Onde fica o banheiro? (Where is the bathroom?)

### High-Frequency Vocabulary

**Time expressions**
- agora (now), já (already/right now), logo (soon/right away — BP), depois (after/later)
- hoje (today), amanhã (tomorrow), ontem (yesterday), sempre (always), nunca (never)

**Essential verbs**
- ser/estar (to be), ter (to have), fazer (to do/make), ir (to go), vir (to come)
- poder (can), querer (to want), precisar (to need), saber (to know — fact)
- falar (to speak), comer (to eat), beber (to drink), morar (to live/reside — BP)
- trabalhar (to work), gostar (to like — + de: Gosto de música), ver (to see)

**Brazil-specific vs European Portuguese**
| Concept | Brazilian | European |
|---------|-----------|----------|
| Bus | ônibus | autocarro |
| Train | trem | comboio |
| Bathroom | banheiro | casa de banho |
| Smartphone | celular | telemóvel |
| To pick up | pegar | apanhar |

### Word Intensifiers

Portuguese loves intensifiers:
- muito (very/much), bastante (quite/enough), super (super — colloquial BP)
- mesmo (really: Gostei mesmo! = I really liked it!)
- que (what a! — Que bonito! = How beautiful!)

### Contractions You Must Know

Preposition + article contractions are mandatory in writing:
- em + o/a = no/na (in the)
- de + o/a = do/da (of/from the)
- a + o/a = ao/à (to the)
- por + o/a = pelo/pela (by/through the)`,
      q: 'In Brazilian Portuguese, how would you ask "Where is the bathroom?"',
      options: ['Onde é a casa de banho?', 'Onde fica o banheiro?', 'Onde está o autocarro?', 'Onde é o banheiro?'],
      correct: 1,
      explanation: 'In Brazilian Portuguese: "banheiro" (not "casa de banho" which is European), and "ficar" is used for location of places: "Onde fica o banheiro?" The verb "ficar" for location is very natural in Brazilian Portuguese, though "onde é" also works.',
    },
    it: {
      subtitle: 'Absorb the vocabulary patterns that make Italian intuitive for learners',
      terms: [
        { term: 'bello/bella', definition: 'beautiful / nice (also used as filler: bello!)' },
        { term: 'allora', definition: 'so / then / well (extremely common filler)' },
        { term: 'dai!', definition: 'come on! / oh please! (interjection)' },
        { term: 'magari', definition: 'maybe / if only / I wish' },
        { term: 'prego', definition: 'you\'re welcome / please / go ahead / here you are' },
      ],
      content: `## Core Italian Vocabulary

### The Italian Way: Expressiveness First

Italian core vocabulary is inseparable from gesture and expression. Words like "allora," "dai," "bello," and "magari" do enormous work in conversation.

**Allora** — Italy's most-used word. Means "so / then / well / now":
- Allora, cosa facciamo? (So, what are we doing?)
- Allora! (Well then! / About time!)

**Dai!** — Encouragement, frustration, disbelief:
- Dai, sbrigati! (Come on, hurry up!)
- Dai, non è possibile! (Come on, that's not possible!)

**Magari** — One of Italian's most beautiful words:
- Magari vengo. (Maybe I'll come.)
- Magari! (If only! / I wish! — said alone)

### High-Frequency Verbs

- essere/stare (to be — permanent/temporary, similar to Spanish), avere (to have)
- fare (to do/make — extremely versatile), andare (to go), venire (to come)
- potere (can), volere (to want), dovere (must), sapere (to know — fact)
- mangiare (to eat), bere (to drink), parlare (to speak), vedere (to see)
- sentire (to hear/feel/smell), capire (to understand — isc verb), piacere (to please/like)
- cercare (to look for), trovare (to find), dare (to give), prendere (to take)

### Piacere: How Italian Expresses "Liking"

Italian flips the subject and object: "to please" instead of "to like":
- Mi piace la pizza. (I like pizza — lit. "pizza pleases to me")
- Mi piacciono i film. (I like movies — plural: piacciono)
- Ti piace? (Do you like it?)
- Le piace molto l'Italia. (She likes Italy a lot)

### Essential Adjectives & Their Position

Most adjectives follow the noun (unlike French/English):
- una macchina italiana (an Italian car)
- un libro interessante (an interesting book)

BUT a handful precede: bello, brutto, buono, cattivo, grande, piccolo, giovane, vecchio, nuovo

**Bello** contracts before nouns like the definite article:
- un bel ragazzo (a handsome boy), bei capelli (beautiful hair), bello zaino (nice backpack)

### Prego — Italy's Most Versatile Word

Single word, many meanings:
- You're welcome (after grazie)
- Please / go ahead (after you!)
- Here you are (handing something)
- Please, come in!
- May I help you? (in shops)`,
      q: 'How do you say "I like music" in Italian?',
      options: ['Io amo la musica', 'Mi piace la musica', 'Mi piacciono la musica', 'Io voglio la musica'],
      correct: 1,
      explanation: '"Mi piace la musica" — Italian uses piacere (to please) rather than a direct "like" verb. Singular thing → piace (mi piace), plural things → piacciono (mi piacciono i film). The person who likes is the indirect object (mi = to me), the liked thing is the subject.',
    },
    zh: {
      subtitle: 'Master the 500 characters that unlock 80% of written Chinese',
      terms: [
        { term: '一下', definition: 'yīxià — a bit / for a moment (softens requests)' },
        { term: '可以', definition: 'kěyǐ — can / may / it\'s okay' },
        { term: '没关系', definition: 'méi guānxi — no worries / it\'s fine / never mind' },
        { term: '怎么', definition: 'zěnme — how / why (how to, how come)' },
        { term: '应该', definition: 'yīnggāi — should / ought to' },
      ],
      content: `## Core Chinese Vocabulary

### The 100 Most-Used Characters

Learning these 100 characters unlocks reading of ~50% of written Chinese:

**Top 20 characters** (memorize first):
的(de — particle), 一(yī — one), 是(shì — to be), 在(zài — at/in/exist), 我(wǒ — I/me), 有(yǒu — have/there is), 他(tā — he), 这(zhè — this), 不(bù — not), 了(le — completed action particle), 人(rén — person), 中(zhōng — middle/China), 来(lái — come), 上(shàng — up/above/on), 大(dà — big), 为(wèi/wéi — for/be), 和(hé — and), 国(guó — country), 地(dì/de — ground/particle), 到(dào — arrive/to)

### Essential Grammar Words

**Particles** — these tiny words signal grammar:
- 的 (de) — possessive/adjective: 我的书 (my book), 漂亮的女孩 (beautiful girl)
- 了 (le) — completed action: 我吃了 (I ate / I've eaten)
- 吗 (ma) — yes/no question marker: 你好吗？(Are you well?)
- 呢 (ne) — "what about...?": 你呢？(And you? / What about you?)
- 吧 (ba) — suggestion/assumption: 走吧 (Let's go), 你是学生吧 (You're a student, right?)

### High-Frequency Verbs & Structures

- 有 (yǒu) — to have / there is: 我有一本书 / 这里有咖啡
- 是 (shì) — to be (identity): 我是学生
- 在 (zài) — to be at / location: 我在家 (I'm at home)
- 要 (yào) — to want / will / need: 我要水 / 我要去
- 可以 (kěyǐ) — can / may: 可以用英文吗？(Can I use English?)
- 应该 (yīnggāi) — should: 你应该休息 (You should rest)
- 觉得 (juéde) — to think/feel (opinion): 我觉得很好

### The 一下 Softener

Adding 一下 after a verb makes requests gentler:
- 等一下 (wait a moment — the most useful phrase)
- 帮我一下 (help me a bit)
- 看一下 (take a look)
- 说一下 (say/explain a bit)

### Measure Words — The Core 10

Every countable noun needs a measure word:
- 个 (gè) — general purpose (人/苹果/问题)
- 本 (běn) — bound books: 一本书
- 张 (zhāng) — flat things: 一张纸/桌子/票
- 条 (tiáo) — long flexible: 一条鱼/裤子/路
- 杯 (bēi) — cups/glasses: 一杯水/咖啡
- 瓶 (píng) — bottles: 一瓶水/啤酒
- 件 (jiàn) — items/matters: 一件事/衣服
- 双 (shuāng) — pairs: 一双鞋/筷子`,
      q: 'What does 一下 add to a verb?',
      options: [
        'It makes the verb past tense',
        'It indicates the action will happen once only',
        'It softens the request, making it more polite or casual',
        'It intensifies the action',
      ],
      correct: 2,
      explanation: '一下 (yīxià) after a verb softens and casualizes a request or action. "等" (wait) is a command; "等一下" (wait a moment) is friendlier. It also implies briefly or a little: "看一下" = take a quick look. This tiny addition transforms many commands into natural, polite requests.',
    },
    ja: {
      subtitle: 'Build the vocabulary core that powers everyday Japanese interaction',
      terms: [
        { term: 'なんか', definition: 'nanka — something like / somehow (filler word)' },
        { term: 'ちょっと', definition: 'chotto — a little / just a moment / (soft refusal)' },
        { term: 'やっぱり', definition: 'yappari — as expected / just as I thought / after all' },
        { term: 'なるほど', definition: 'naruhodo — I see / that makes sense' },
        { term: 'でも', definition: 'demo — but / however (very common connector)' },
      ],
      content: `## Core Japanese Vocabulary

### The Indispensable Filler Words

These words make Japanese sound natural — use them constantly:

**ちょっと (chotto)** — one of Japanese's most flexible words:
- ちょっと待ってください (please wait a moment)
- ちょっと高い (a little expensive)
- ちょっと... (soft refusal — "that's a bit...")

**やっぱり / やはり (yappari/yahari)** — "as I expected / after all":
- やっぱり東京は大きいね (Tokyo really is big, as expected)
- やっぱり行かない (I've decided not to go after all)

**なるほど (naruhodo)** — shows comprehension: "I see, that makes sense"

**なんか (nanka)** — filler, "like / somehow / kind of":
- なんかおかしい (something seems off)

### High-Frequency Verbs

**Group 1 (-u verbs)**: 書く(kaku-write), 読む(yomu-read), 聞く(kiku-listen/ask), 飲む(nomu-drink), 買う(kau-buy), 行く(iku-go), 来る→irregular, 話す(hanasu-speak)

**Group 2 (-ru verbs)**: 食べる(taberu-eat), 見る(miru-see), 起きる(okiru-wake up), 寝る(neru-sleep), いる(iru-exist/animate), 着る(kiru-wear upper body)

**Irregular**: する(suru-do/make), くる(kuru-come)

### Essential Nouns by Category

**Time**: 今(ima-now), 今日(kyō-today), 明日(ashita-tomorrow), 昨日(kinō-yesterday), 毎日(mainichi-every day), 朝(asa-morning), 夜(yoru-night)

**Places**: 家(ie/uchi-house/home), 学校(gakkō-school), 仕事(shigoto-work), 駅(eki-station), お店(omise-store), 病院(byōin-hospital)

**People**: 人(hito-person), 友達(tomodachi-friend), 家族(kazoku-family), 先生(sensei-teacher), 子供(kodomo-child)

### Te-form for Connected Speech

The て-form links actions and creates requests:
- 食べて + ください = 食べてください (please eat)
- 食べて + いる = 食べている (is eating — progressive)
- 食べて + から = 食べてから (after eating)

### Politeness Levels in Vocabulary

Same concept, different registers:
| Plain | Polite (masu) | Humble/Honorific |
|-------|--------------|-----------------|
| 食べる | 食べます | いただく (humble) / 召し上がる (honorific) |
| 言う | 言います | 申す (humble) / おっしゃる (honorific) |
| いる | います | おる (humble) / いらっしゃる (honorific) |`,
      q: 'What does ちょっと... (said with a trailing voice) typically signal?',
      options: [
        'Enthusiasm or strong agreement',
        'A polite soft refusal or hesitation',
        'A request for repetition',
        'Surprise at new information',
      ],
      correct: 1,
      explanation: 'In Japanese culture, direct refusals are often avoided. Saying "ちょっと..." with a trailing voice is a standard soft refusal — "that\'s a little..." left unfinished. The listener understands it means "no" or "that\'s difficult." This applies to declining invitations, requests, or expressing inability without the bluntness of a direct "no."',
    },
    ko: {
      subtitle: 'Build the vocabulary that powers everyday Korean conversations',
      terms: [
        { term: '아무튼/어쨌든', definition: 'anyway / regardless (conversation filler)' },
        { term: '그냥', definition: 'just / simply / for no reason' },
        { term: '좀', definition: 'a little / please (softener — very versatile)' },
        { term: '진짜', definition: 'really / truly (colloquial intensifier)' },
        { term: '되다', definition: 'to become / to be okay / to work out (very versatile)' },
      ],
      content: `## Core Korean Vocabulary

### 되다 — Korean's Most Versatile Verb

되다 (doeda) rivals Chinese 可以 for versatility:
- 됩니다 / 돼요 (It's okay / It works / That's fine)
- 안 돼요 (It's not okay / You can't / It doesn't work)
- 어떻게 됐어요? (How did it turn out?)
- 한국어가 되다 (to be able to speak Korean — to become Korean)
- 내일 되세요? (Does tomorrow work for you?)

### 좀 — The Essential Softener

좀 (jom) added to a request makes it polite and natural:
- 잠깐만요 (just a moment) → 잠깐만 좀 기다려 주세요 (please wait just a moment)
- 도와주세요 → 좀 도와주실 수 있어요? (could you help me a bit?)
- 이거 좀 봐요 (take a look at this)

### High-Frequency Verbs

**Essential action verbs**:
- 하다 (hada — do/make — also turns nouns into verbs: 공부하다=study, 일하다=work)
- 가다 (kada — go), 오다 (oda — come), 있다 (itda — exist/have), 없다 (eopda — not exist/not have)
- 보다 (boda — see/watch/try), 먹다 (meokda — eat), 마시다 (masida — drink)
- 말하다 (malhada — speak/say), 듣다 (deutda — listen), 알다 (alda — know)
- 모르다 (moreuda — not know), 사다 (sada — buy), 주다 (juda — give)

### -하다 Verbs — The Cheat Code

Hundreds of nouns + 하다 = verbs:
- 공부(study) + 하다 = 공부하다 (to study)
- 일(work) + 하다 = 일하다 (to work)
- 사랑(love) + 하다 = 사랑하다 (to love)
- 전화(phone call) + 하다 = 전화하다 (to call)

This pattern works with almost any Sino-Korean noun action word.

### Topic vs Subject Particles

The most important grammar distinction for natural Korean:
- 은/는 (topic — what the sentence is about, or contrast): 저는 학생이에요
- 이/가 (subject — new info, emphasis, existence): 고양이가 있어요 (there is a cat)
- When in doubt with "I am...": use 저는/나는

### Time Vocabulary

- 지금 (jigeum — now), 오늘 (oneul — today), 내일 (naeil — tomorrow), 어제 (eoje — yesterday)
- 아까 (akka — a little while ago), 나중에 (najunge — later), 언제 (eonje — when)
- 항상/늘 (always), 가끔 (sometimes), 절대 (never — + negative verb)`,
      q: 'How would you politely say "it\'s not okay / you can\'t do that" using 되다?',
      options: ['됩니다', '안 돼요', '되고 싶어요', '못 됩니다'],
      correct: 1,
      explanation: '"안 돼요" (an dwaeyo) uses 안 (the negation adverb) + 되다. It means "it\'s not okay / you can\'t / it doesn\'t work." This is extremely common and natural — used by parents to children, in rules, or whenever something is not permitted or doesn\'t work out. "됩니다" is the formal affirmative, "되고 싶어요" means "I want to become."',
    },
    hi: {
      subtitle: 'Build Hindustani vocabulary that bridges Hindi and Urdu registers',
      terms: [
        { term: 'बस', definition: 'bas — enough / just / that\'s it (also: bus)' },
        { term: 'थोड़ा', definition: 'thoraa — a little / a bit' },
        { term: 'अभी', definition: 'abhī — right now / just now' },
        { term: 'वैसे', definition: 'vaise — by the way / actually / normally' },
        { term: 'लगना', definition: 'lagnaa — to seem / to feel / to be attached' },
      ],
      content: `## Core Hindi Vocabulary

### Hindustani Core — Shared Hindi-Urdu Vocabulary

The most practical approach: learn Hindustani (the shared spoken base) before diving into either formal Hindi (Sanskrit-heavy) or Urdu (Persian/Arabic-heavy):

**Core vocabulary common to both**:
- पानी/paani (water), खाना/khaana (food/to eat), घर/ghar (home), काम/kaam (work)
- आना/aanaa (to come), जाना/jaanaa (to go), करना/karnaa (to do), होना/honaa (to be/happen)
- देखना/dekhnaa (to see), सुनना/sunnaa (to hear), बोलना/bolnaa (to speak)

### लगना (lagnaa) — A Uniquely Useful Verb

लगना has multiple meanings navigated by context:
- मुझे लगता है... (I think / it seems to me...)
- ठंड लग रही है (I'm feeling cold — lit. "cold is seeming")
- वो अच्छा लगता है (He seems nice / I like him)
- कितना लगेगा? (How much will it cost/take? — lit. "how much will it seem?")

### Essential Postpositions

Hindi uses postpositions (come AFTER nouns, unlike English prepositions):
- में (mein — in): घर में (in the house)
- पर / पे (par/pe — on/at): मेज़ पर (on the table)
- को (ko — to/for/at): मुझको / मुझे (to me), उसको (to him/her)
- से (se — from/with/by): दिल्ली से (from Delhi), मेरे से (by me)
- के लिए (ke liye — for): मेरे लिए (for me)
- का/के/की (kaa/ke/kii — of/possession — changes with gender/number)

### High-Frequency Time Expressions

- अभी (abhī — right now), थोड़ी देर में (in a little while)
- कल (kal — yesterday AND tomorrow — context decides!)
- परसों (parso — day before yesterday AND day after tomorrow)
- हमेशा (hameshaa — always), कभी नहीं (kabhī nahīn — never)
- पहले (pahle — before/first/earlier), बाद में (baad mein — after/later)

### Verb Endings: A Quick Map

Hindi verbs agree with subject in gender and number (perfective) or just number (imperfective):

Infinitive: करना (karnaa — to do)
- Present: करता/करती हूँ (m/f: I do)
- Progressive: कर रहा/रही हूँ (I am doing)
- Perfective: किया/की (m/f singular done)`,
      q: 'In Hindi, what does कल mean?',
      options: [
        'Always "yesterday"',
        'Always "tomorrow"',
        'Both "yesterday" and "tomorrow" — context decides',
        'The current day / today',
      ],
      correct: 2,
      explanation: 'कल (kal) means BOTH "yesterday" and "tomorrow" in Hindi — context and tense make it clear. Similarly, परसों (parso) means both "the day before yesterday" AND "the day after tomorrow." This is a distinctive feature of Hindi time vocabulary. "आज" (aaj) is "today."',
    },
    de: {
      subtitle: 'Master German\'s compound logic and build a 500-word productive vocabulary',
      terms: [
        { term: 'das Handy', definition: 'mobile/cell phone (false cognate — not handy!)' },
        { term: 'eigentlich', definition: 'actually / in principle / really' },
        { term: 'doch', definition: 'yes (contradicting a negative) / after all / but (modal particle)' },
        { term: 'mal', definition: 'just / once (softens commands: Komm mal her = just come here)' },
        { term: 'das Fernweh', definition: 'wanderlust / longing for distant places' },
      ],
      content: `## Core German Vocabulary

### German Compound Words — The Building System

German creates new nouns by stacking existing ones. Learn components, not just compounds:

**Root components to learn first**:
- das Haus (house) → Hausaufgabe (homework), Haushalt (household), Krankenhaus (hospital)
- die Zeit (time) → Freizeit (free time), Zeitung (newspaper), gleichzeitig (simultaneously)
- das Leben (life) → Lebensmittel (groceries), Lebensqualität (quality of life)
- die Arbeit (work) → Arbeitsplatz (workplace), Arbeitslosigkeit (unemployment)
- das Wasser (water) → Wasserfall (waterfall), Wasserhahn (faucet)

### Modal Particles — What Makes German Sound German

These untranslatable words add nuance. They're common in speech but ignored in textbooks:

**doch** — contradicts a negative, or adds insistence:
- "Du kommst nicht?" "Doch!" (You're not coming? — Yes I am! [contradicting])
- Komm doch! (Just come! / Do come!)

**mal** — softens commands, makes them casual:
- Komm mal her. (Come here — just / for a moment)
- Schau mal! (Just look! / Look here!)

**eigentlich** — "actually / in principle" (often signals a soft contradiction):
- Eigentlich wollte ich nicht kommen. (I actually didn't want to come.)

**halt/eben** — "just / simply / that's just how it is":
- Das ist halt so. (That's just how it is.)

### das Handy — Famous False Friend

Das Handy = mobile phone (NOT an adjective meaning convenient). German imported many English words with changed meanings:
- das Smartphone = Smartphone (same)
- das Laptop = laptop (same)
- das Notebook = notebook computer
- der Computer = computer

### High-Frequency Verbs

- sein (to be), haben (to have), werden (will/to become), können (can), müssen (must)
- machen (to do/make), gehen (to go), kommen (to come), sehen (to see)
- sagen (to say), geben (to give), nehmen (to take), wissen (to know — fact)
- finden (to find), denken (to think), glauben (to believe), kennen (to know — person)`,
      q: 'If someone says "Du machst das nicht richtig," how would you contradict them in German?',
      options: ['Ja!', 'Nein!', 'Doch!', 'Nicht!'],
      correct: 2,
      explanation: '"Doch!" is the answer. In German, "ja" (yes) cannot contradict a negative statement — it would mean you agree you\'re doing it wrong. "Doch" is specifically used to contradict a negative assertion: "You\'re not doing it right." → "Doch! (Yes I am!)" This distinction (ja vs doch) has no equivalent in English and is essential for natural German.',
    },
    nl: {
      subtitle: 'Build Dutch vocabulary using its Germanic roots and English cognates',
      terms: [
        { term: 'gezellig', definition: 'cozy / convivial / pleasant (untranslatable Dutch concept)' },
        { term: 'gewoon', definition: 'normal / just / simply (very common filler)' },
        { term: 'al', definition: 'already / even (used far more than English "already")' },
        { term: 'even', definition: 'just / for a moment (softener: even wachten = just wait)' },
        { term: 'eigenlijk', definition: 'actually / in fact (like German eigentlich)' },
      ],
      content: `## Core Dutch Vocabulary

### Gezellig — The Dutch Concept

**Gezellig** (pronounced roughly heh-ZEL-ikh) has no English equivalent: a cozy, warm, pleasant atmosphere or gathering. It describes a café, a good friend visit, a board game evening:
- Dat is zo gezellig! (That is so cozy/lovely!)
- Een gezellig avondje (a pleasant evening)
- Gezellig, hoor! (How lovely! — hoor is a softening particle)

### English Cognates — Your Shortcut

Dutch shares more vocabulary with English than any other language (both Germanic):
- water (water), huis (house), man (man), vrouw (woman — cf. "frau")
- boek (book), dag (day — also "goodbye"), nacht (night), hand (hand)
- groot (great/big), klein (small — cf. "little/lil"), oud (old), nieuw (new)
- eten (to eat — cf. "eat"), drinken (to drink), slapen (to sleep — cf. "sleep")
- werken (to work), zien (to see), horen (to hear), weten (to know — cf. "wit/wisdom")

### Modal Particles — Like German

Dutch also uses modal particles extensively:
**even** — softens: Wacht even (just wait), Ik bel even terug (I'll just call back)
**gewoon** — "just / simply / normally": Dat doe je gewoon niet (you just don't do that)
**al** — "already" used much more freely than English: Ben je al klaar? (Are you done already?)
**hoor** — friendly reassurance at end: Dat geeft niet, hoor! (No worries!)
**toch** — like German doch: Je doet het toch! (But you ARE doing it!)

### High-Frequency Verbs

- zijn (to be), hebben (to have), worden (to become/will — auxiliary), kunnen (can)
- moeten (must), willen (to want), mogen (may/to be allowed)
- gaan (to go), komen (to come), zien (to see), zeggen (to say)
- maken (to make/do), denken (to think), weten (to know — fact), kennen (to know — person)
- vinden (to find/to think: Ik vind het leuk = I find it fun = I like it)

### Vinden — The Dutch "Like"

Like Italian piacere, Dutch vinden (to find) is used for opinions:
- Ik vind het leuk. (I find it nice → I like it)
- Hoe vind je Nederland? (What do you think of the Netherlands?)
- Ik vind het geweldig! (I find it great → I think it's great!)`,
      q: 'What does "gezellig" describe?',
      options: [
        'The Dutch tradition of paying separately (going Dutch)',
        'A cozy, warm, pleasant atmosphere or social gathering',
        'Being overly frugal or careful with money',
        'The Dutch directness in communication',
      ],
      correct: 1,
      explanation: '"Gezellig" describes a cozy, convivial, warm atmosphere or gathering — untranslatable into English with a single word. It\'s central to Dutch culture and used constantly: a café can be gezellig, a visit with friends, a candlelit dinner. Understanding it is key to understanding Dutch social values.',
    },
    ru: {
      subtitle: 'Build Russian vocabulary with attention to aspect, case patterns and register',
      terms: [
        { term: 'ничего', definition: 'nichego — nothing / not bad / it\'s okay (very versatile)' },
        { term: 'вообще', definition: 'voobshche — in general / at all / actually' },
        { term: 'просто', definition: 'prosto — simply / just / easy' },
        { term: 'значит', definition: 'znachit — so / it means / that means (filler)' },
        { term: 'нет/да', definition: 'nyet/da — no/yes (да also confirms/agrees mid-sentence)' },
      ],
      content: `## Core Russian Vocabulary

### Ничего — Maximum Versatility

Ничего (nichego) literally means "nothing" but functions as:
- Ничего. (It's nothing / No big deal / It's okay)
- Ничего себе! (Wow! / No way! — lit. "nothing to oneself")
- Как дела? — Ничего. (How are you? — Not bad / Okay)
- Он ничего. (He's not bad / He's fine-looking)

### High-Frequency Verbs (with aspects)

Every Russian verb has imperfective (ongoing/repeated) and perfective (completed) aspect:

| Imperfective | Perfective | Meaning |
|-------------|-----------|---------|
| говорить | сказать | to speak / to say |
| делать | сделать | to do / to make |
| идти/ходить | пойти | to go (on foot) |
| брать | взять | to take |
| давать | дать | to give |
| смотреть | посмотреть | to watch/look |
| читать | прочитать | to read |
| писать | написать | to write |

### Motion Verbs — Directional Pairs

Russian has separate verbs for going one-way vs habitual/multi-directional:
- идти (going somewhere now, on foot) vs ходить (go habitually / walk around)
- ехать (going now, by vehicle) vs ездить (go habitually / travel around)
- лететь (flying now) vs летать (fly habitually)

### Essential Filler Words

- вообще (voobshche) — "in general / at all / actually": Вообще-то, я не знаю (Actually, I don't know)
- просто (prosto) — "simply/just": Это просто (It's simple), Просто скажи (Just say it)
- значит (znachit) — "so/that means" (filler while thinking): Значит... (So...)
- короче (koroche) — "in short / to cut to the chase" (very colloquial)
- ладно (ladno) — "okay / alright / fine" (agreement or resignation)

### да in the Middle of Sentences

Да doesn't only mean "yes" — it marks agreement, understanding, or emphasis mid-sentence:
- Да, конечно (Yes, of course)
- Да нет (Well no / Not really — paradoxical but common)
- Да ты что! (No way! / You're kidding! — lit. "yes, you what!")`,
      q: 'What is the difference between идти and ходить?',
      options: [
        'идти is formal, ходить is colloquial',
        'идти means going somewhere specific now; ходить means habitual/round-trip/general motion',
        'идти is past tense, ходить is present',
        'They are interchangeable synonyms',
      ],
      correct: 1,
      explanation: 'Russian motion verbs come in directional pairs. идти (determinate) = going to a specific place in one direction right now: "Я иду в магазин" (I\'m going to the store). ходить (indeterminate) = habitual, round-trip, or aimless movement: "Я хожу в магазин каждый день" (I go to the store every day). This distinction applies to all motion verbs: ехать/ездить (vehicle), лететь/летать (flying).',
    },
    ar: {
      subtitle: 'Build Modern Standard Arabic vocabulary with roots-based learning strategies',
      terms: [
        { term: 'يعني', definition: 'yaʿni — it means / like / you know (universal filler)' },
        { term: 'بس', definition: 'bass — but / just / enough (colloquial)' },
        { term: 'إن شاء الله', definition: 'inshallah — God willing / hopefully / maybe' },
        { term: 'الحمد لله', definition: 'alhamdulillah — praise God / thank God (used like "I\'m fine")' },
        { term: 'طبعاً', definition: 'tabʿan — of course / naturally' },
      ],
      content: `## Core Arabic Vocabulary

### The Root System — Your Vocabulary Superpower

Arabic builds words from 3-4 letter roots. Learn one root = learn a family:

**Root ك-ت-ب (k-t-b) = writing**:
- كَتَبَ (kataba) — he wrote
- كِتَاب (kitāb) — book
- مَكْتَبَة (maktaba) — library / bookstore
- مَكْتَب (maktab) — desk / office
- كَاتِب (kātib) — writer
- كِتَابَة (kitāba) — writing (noun)
- مَكْتُوب (maktūb) — written / letter / destiny

**Root د-ر-س (d-r-s) = studying**:
- دَرَسَ (darasa) — he studied
- دَرْس (dars) — lesson
- مَدْرَسَة (madrasa) — school
- مُدَرِّس (mudarris) — teacher
- دِرَاسَة (dirāsa) — study (noun)

### Universal Filler: يعني (yaʿni)

يعني literally means "it means" but functions as universal filler throughout the Arab world:
- يعني... (like... / I mean... / you know...)
- إيه يعني؟ (What does that mean? / What do you mean? — Egyptian)
- يعني كويس (somewhat good / so-so)

### Essential Expressions

**إن شاء الله (inshallah)** — "God willing" — used for:
- Future plans (replacing "will"): بكرة إن شاء الله (tomorrow, God willing)
- Polite maybe/avoidance: سأحاول إن شاء الله (I'll try, God willing)
- Genuine hope: إن شاء الله تتعافى سريعاً (I hope you recover soon)

**الحمد لله (alhamdulillah)** — "praise God":
- Standard response to كيف حالك?: الحمد لله بخير (Praise God, I'm well)
- After eating, finishing, recovering: الحمد لله (Thank God / I'm grateful)

### High-Frequency MSA Verbs

- ذَهَبَ (dhahaba — went), جَاءَ (jāʾa — came), قَالَ (qāla — said)
- أَرَادَ (arāda — wanted), اسْتَطَاعَ (istaṭāʿa — was able to)
- عَرَفَ (ʿarafa — knew), فَهِمَ (fahima — understood)
- رَأَى (raʾā — saw), سَمِعَ (samiʿa — heard)
- أَخَذَ (akhadha — took), أَعْطَى (aʿṭā — gave)`,
      q: 'From the root ك-ت-ب, which word means "library"?',
      options: ['كَاتِب (kātib)', 'كِتَاب (kitāb)', 'مَكْتَبَة (maktaba)', 'مَكْتَب (maktab)'],
      correct: 2,
      explanation: 'مَكْتَبَة (maktaba) = library/bookstore. The pattern مَفْعَلَة often indicates a place associated with the root\'s activity. مَكْتَب (maktab, same pattern without feminine ending) = desk/office. كِتَاب (kitāb) = book, كَاتِب (kātib) = writer. The root system lets you decode new words even before learning them.',
    },
    sw: {
      subtitle: 'Build Swahili vocabulary using its noun class system as a memory framework',
      terms: [
        { term: 'sawa', definition: 'okay / fine / equal / it\'s fine' },
        { term: 'basi', definition: 'so / therefore / okay then / bus' },
        { term: 'kabisa', definition: 'completely / absolutely / exactly' },
        { term: 'tu', definition: 'just / only (postpositive: mimi tu = just me)' },
        { term: 'kidogo', definition: 'a little / small (from -dogo: small)' },
      ],
      content: `## Core Swahili Vocabulary

### Sawa — The Universal Agreement Word

**Sawa** (from Arabic sawā — equal) is Swahili's most useful agreement word:
- Sawa! (Okay! / Agreed! / That's fine!)
- Sawa sawa (Exactly equal / perfectly fine — reduplication intensifies)
- Si sawa (Not okay / Not equal / Unfair)

### The Noun Class System as Vocabulary Tool

Swahili has 8+ noun classes, each with a prefix pattern. Learn the prefix → instantly recognize the word type:

**M-/Wa- class (people)**:
- mtu (person), watu (people), mwalimu (teacher), walimu (teachers)
- mtoto (child), watoto (children), mzee (elder), wazee (elders)

**Ki-/Vi- class (things — often tools/languages)**:
- kitu (thing), vitu (things), kitabu (book), vitabu (books)
- kiswahili (the Swahili language), kiingereza (English language), kifaransa (French)

**M-/Mi- class (trees, plants, body parts)**:
- mti (tree), miti (trees), mkono (hand/arm), mikono (hands)
- moyo (heart), miili (bodies — of mwili)

**U- class (abstract/uncountable)**:
- upendo (love), ujuzi (skill/knowledge), umoja (unity — from the Kenyan motto)

### Essential High-Frequency Vocabulary

**Verbs** (infinitive with ku-):
- kusema (to say/speak), kusikia (to hear), kuona (to see), kujua (to know)
- kwenda (to go), kuja (to come), kufanya (to do/make), kupenda (to love/like)
- kulala (to sleep), kula (to eat), kunywa (to drink), kufanya kazi (to work)

**Time**:
- sasa (now), leo (today), kesho (tomorrow), jana (yesterday)
- asubuhi (morning), jioni (evening), usiku (night), mchana (daytime)

**Intensifiers & Connectors**:
- sana (very/a lot: asante sana = thank you very much), kidogo (a little)
- kabisa (completely), tu (just/only), lakini (but), kwa sababu (because)
- basi (so/therefore — transitions), hata (even/until), pia (also/too)`,
      q: 'Which Swahili prefix marks words relating to people (singular/plural)?',
      options: ['Ki-/Vi-', 'M-/Wa-', 'U-/—', 'M-/Mi-'],
      correct: 1,
      explanation: 'The M-/Wa- class is the human class: mtu (one person) → watu (people), mtoto (child) → watoto (children), mwalimu (teacher) → walimu (teachers). Learning this pattern lets you instantly recognize and form plurals of words referring to people. Ki-/Vi- is for things/languages, M-/Mi- is for trees/plants, U- is for abstract nouns.',
    },
    ht: {
      subtitle: 'Build Haitian Creole vocabulary using its French origins and unique grammar',
      terms: [
        { term: 'menm', definition: 'same / even / self (mwen menm = myself, menm jan = same way)' },
        { term: 'toujou', definition: 'always / still / yet' },
        { term: 'deja', definition: 'already (from French déjà)' },
        { term: 'oke / dakò', definition: 'okay / agreed (dakò from French d\'accord)' },
        { term: 'vrèman', definition: 'really / truly (from French vraiment)' },
      ],
      content: `## Core Haitian Creole Vocabulary

### French Roots, Simplified

About 90% of Haitian Creole vocabulary comes from French — but sounds and forms changed systematically:

**Predictable sound changes** (French → Creole):
- French nasal vowels often become -n: bon → bon (same!), main → men (hand)
- French -tion becomes -syon: nation → nasyon, conversation → konvèsasyon
- French silent letters drop: est → se, manger → manje, parler → pale

**Core vocabulary with French origins**:
- manje (eat — French manger), bwè (drink — French boire), dòmi (sleep — French dormir)
- pale (speak — French parler), wè (see — French voir), tande (hear — French entendre)
- achte (buy — French acheter), vann (sell — French vendre), travay (work — French travailler)

### No Verb Conjugation — Tense Markers

Creole doesn't conjugate verbs — markers before the verb do the work:

| Marker | Meaning | Example |
|--------|---------|---------|
| (nothing) | simple present/general | Mwen manje (I eat / I'm eating) |
| ap | progressive | Mwen ap manje (I am eating) |
| te | past | Mwen te manje (I ate) |
| pral | near future | Mwen pral manje (I'm going to eat) |
| ta | conditional | Mwen ta manje (I would eat) |

### High-Frequency Nouns

**People**: moun (person/people — singular and plural!), fanmi (family), zanmi (friend — from French "les amis"), timoun (children), gason (man/boy), fi (girl/woman)

**Time**: kounye a (now), jodi a (today), demen (tomorrow), yè (yesterday), toujou (always), pafwa (sometimes), jamè (never)

**Essential words**: bagay (thing — very versatile: yon bagay = a thing), kote (place/where), jan (way/how), rezon (reason), pwoblèm (problem), solisyon (solution)

### Definite Article — After the Noun

Unlike French, Creole's definite article comes AFTER the noun:
- liv la (the book — la is definite article)
- kay la (the house)
- moun nan (the person — nan after nasal sounds)
- timoun yo (the children — yo for plurals)

Indefinite: yon (a/an) comes BEFORE: yon liv (a book), yon kay (a house)`,
      q: 'How do you express the past tense in Haitian Creole?',
      options: [
        'By changing the verb ending (like -ed in English)',
        'By placing the marker "te" before the verb',
        'By using a conjugated form of "être" (to be)',
        'By adding a particle after the verb',
      ],
      correct: 1,
      explanation: 'Haitian Creole uses pre-verbal tense markers instead of conjugation. "te" before a verb marks past tense: "Mwen manje" (I eat) → "Mwen te manje" (I ate). This applies to ALL verbs — no irregular past forms exist. Other markers: "ap" (progressive: I am eating), "pral" (near future: I am going to eat), "ta" (conditional: I would eat).',
    },
  }

  const d = data[lang.code]
  return {
    id: `lang-${lang.code}-vocab`,
    track: 'language',
    title: `${lang.name}: Core Vocabulary`,
    subtitle: d.subtitle,
    level: 'Basic',
    xp: 250,
    duration: 45,
    module,
    content: d.content,
    keyTerms: d.terms,
    quiz: [{
      q: d.q,
      options: d.options,
      correct: d.correct,
      explanation: d.explanation,
    }],
    certArea: `${lang.name} Basic Communication`,
    courseObjective: `Build a productive 500-word ${lang.name} vocabulary across key domains`,
    moduleObjective: `Recognize and use the most frequent words with correct context`,
  }
}

function buildDailyLifeModule(lang: LangEntry, module: number): Course {
  const data: Record<string, {
    subtitle: string; content: string; terms: { term: string; definition: string }[];
    q: string; options: string[]; correct: number; explanation: string
  }> = {
    es: {
      subtitle: 'Navigate real Spanish-speaking environments with confidence',
      terms: [
        { term: 'el horario', definition: 'the schedule / timetable' },
        { term: 'hacer cola', definition: 'to stand in line / queue (lit. to make a tail)' },
        { term: 'el recibo', definition: 'the receipt' },
        { term: 'pedir', definition: 'to ask for / to order (request)' },
        { term: 'a ver', definition: 'let\'s see / well (filler to think)' },
      ],
      content: `## Spanish Daily Life Language

### At the Market / Tienda

\`\`\`
¿Tiene...? / ¿Hay...?      Do you have...?
¿Cuánto es/cuesta?         How much is it?
¿Me puede dar...?          Can you give me...? / May I have...?
Un kilo de... / Una bolsa de...   A kilo of... / A bag of...
¿Algo más?                 Anything else?
Nada más, gracias.         Nothing else, thank you.
¿Me da una bolsa?          Can I get a bag?
\`\`\`

### At a Restaurant

\`\`\`
Una mesa para dos, por favor.     A table for two, please.
¿Qué recomienda?                  What do you recommend?
Para mí, [dish].                  For me, [dish].
Sin [ingredient], por favor.      Without [ingredient], please.
¿Está incluido el servicio?       Is service/tip included?
La cuenta, por favor.             The check, please.
\`\`\`

### Transportation

**Getting around**:
- ¿Dónde está la parada de [autobús/metro]? (Where is the bus/metro stop?)
- ¿Este bus va a [place]? (Does this bus go to [place]?)
- ¿A qué hora sale/llega? (What time does it leave/arrive?)
- Un billete/boleto de ida y vuelta (A round-trip ticket)
- Ida y vuelta vs solo ida (Round trip vs one way)

### At the Doctor / Farmacia

\`\`\`
Me duele [body part].        [Body part] hurts. (lit. [part] hurts me)
Tengo fiebre/tos/dolor.      I have a fever/cough/pain.
¿Tiene algo para...?         Do you have something for...?
\`\`\`

### Time & Schedules

Spanish-speaking countries vary on punctuality:
- En punto (exactly/on the dot): a las tres en punto
- De la mañana/tarde/noche (AM/PM specifics): 3 de la tarde = 3pm
- Siesta culture: many shops close 2-5pm
- La hora española: social events start 1-2 hours "late" by northern European standards`,
      q: '¿Cómo se dice "the check, please" when finishing a meal in Spanish?',
      options: ['El billete, por favor', 'La cuenta, por favor', 'El recibo, por favor', 'El pago, por favor'],
      correct: 1,
      explanation: '"La cuenta, por favor" is the standard way to request the bill in a restaurant. "La cuenta" = the bill/check in restaurant context (though it also means account). "El recibo" is more a receipt for shopping. "El billete" is a ticket or banknote. In some Latin American countries you might also hear "¿Nos trae la cuenta?" (Could you bring us the check?).',
    },
    fr: {
      subtitle: 'Handle French daily interactions with the politeness levels that matter',
      terms: [
        { term: 'S\'il vous plaît', definition: 'please (formal) / excuse me (to get attention)' },
        { term: 'Je voudrais', definition: 'I would like (polite want — use this in shops)' },
        { term: 'Ça marche', definition: 'that works / okay (colloquial confirmation)' },
        { term: 'C\'est combien?', definition: 'how much is it?' },
        { term: 'En espèces / par carte', definition: 'in cash / by card' },
      ],
      content: `## French Daily Life Language

### The French Politeness System

France has strong politeness norms. Getting this right matters more than perfect grammar:

**In shops and restaurants**: always open with "Bonjour" before any request. Starting directly with "Je voudrais..." without a greeting is considered rude.

The magic formula:
\`\`\`
Bonjour, [Madame/Monsieur].
Je voudrais / J'aimerais [item], s'il vous plaît.
Merci. Au revoir!
\`\`\`

**Je voudrais** (I would like) vs **je veux** (I want): always use je voudrais in shops/restaurants.

### At the Boulangerie (Bakery)

\`\`\`
Une baguette, s'il vous plaît.           A baguette, please.
Pas trop cuite / bien cuite.             Not too baked / well-done.
Un croissant au beurre, s'il vous plaît. A butter croissant, please.
C'est tout, merci.                       That's all, thank you.
\`\`\`

### Transport

- Un ticket de métro (a metro ticket), un carnet (book of 10 tickets)
- Compostez votre billet! (Validate/stamp your ticket! — in France you must stamp regional train tickets)
- Prochain arrêt: [name] (Next stop: [name])
- Correspondance (transfer/connection)

### At the Doctor / Pharmacie

- J'ai mal à [body part]: J'ai mal à la tête (I have a headache — lit. I have pain to the head)
- J'ai de la fièvre (I have a fever), une toux (a cough), un rhume (a cold)
- Avez-vous quelque chose contre...? (Do you have something for...?)
- Sur ordonnance / sans ordonnance (prescription only / over the counter)`,
      q: 'Why should you say "Bonjour" before making a request in a French shop?',
      options: [
        'It is grammatically required in French',
        'It is a legal requirement in some regions of France',
        'French politeness norms require greeting before requesting — skipping it is considered rude',
        'It helps the shopkeeper understand your accent better',
      ],
      correct: 2,
      explanation: 'In France, going directly to a request without first greeting the person is considered impolite — the equivalent of ignoring someone\'s existence. Always say "Bonjour [Madame/Monsieur]" when entering a shop or approaching a counter. This cultural norm is more important to locals than whether your French is perfect.',
    },
    pt: {
      subtitle: 'Navigate Brazilian Portuguese in real shopping, dining, and transport contexts',
      terms: [
        { term: 'tem?', definition: 'do you have? (short for você tem?) — very common' },
        { term: 'tudo certo?', definition: 'all good? / everything okay? (casual check-in)' },
        { term: 'pode ser', definition: 'it can be / sure / that works' },
        { term: 'à vista / no cartão', definition: 'in cash / by card' },
        { term: 'parcelado', definition: 'in installments (Brazil\'s common payment method)' },
      ],
      content: `## Brazilian Portuguese Daily Life

### The Brazilian Communication Style

Brazil is generally warm, informal, and friendly. Brazilians often shorten and simplify:
- Você → cê (spoken: "Cê quer?" instead of "Você quer?")
- Está → tá (agreement/okay: "Tá bom!" = "That's good/okay!")
- Para → pra (going to/for): "Vou pra casa" (I'm going home)

### Shopping & Commerce

\`\`\`
Tem [item]?                    Do you have [item]?
Quanto custa? / Qual o preço?  How much? / What's the price?
Aceita cartão?                 Do you accept cards?
Pode parcelar?                 Can I pay in installments?
Em quantas vezes?              In how many installments?
Fica com o troco.              Keep the change.
Pode me dar uma nota fiscal?   Can I have a receipt?
\`\`\`

**Parcelamento** (installment payments) is a Brazilian institution — even small purchases can be split into 2x, 3x, 6x sem juros (without interest) or com juros (with interest).

### At the Padaria / Lanchonete

\`\`\`
Um café com leite, por favor.       A coffee with milk, please.
Um pão de queijo.                   A cheese bread ball.
Pra comer aqui ou pra levar?        To eat here or to take away?
Pra levar / pra viagem.             To take away.
\`\`\`

### Transportation

- Ponto de ônibus (bus stop — BP), metrô (metro)
- Qual ônibus vai para [neighborhood]? (Which bus goes to [area]?)
- Desça na próxima parada, por favor. (Get off at the next stop, please — to driver)
- Uber / aplicativo (rideshare app — very dominant in Brazil)
- Tem como ir de metrô? (Can I get there by metro?)`,
      q: 'If a Brazilian says "pode parcelar?", what are they asking about?',
      options: [
        'Whether the product comes in parts/pieces',
        'Whether they can pay in installments',
        'Whether you accept foreign currency',
        'Whether there is a discount available',
      ],
      correct: 1,
      explanation: '"Pode parcelar?" asks if payment can be split into installments. Parcelamento is central to Brazilian commerce — it\'s extremely common to pay for goods and services in monthly installments (parcelas), often interest-free (sem juros) for 2-12 months. Understanding this question is essential for shopping in Brazil.',
    },
    it: {
      subtitle: 'Master the Italian daily rituals and social scripts that define la dolce vita',
      terms: [
        { term: 'l\'aperitivo', definition: 'pre-dinner drinks + snacks (social ritual, ~6-8pm)' },
        { term: 'il coperto', definition: 'cover charge at Italian restaurants' },
        { term: 'figurati!', definition: 'don\'t mention it! / of course! (after grazie)' },
        { term: 'ci siamo', definition: 'we\'re here / here we are / we made it' },
        { term: 'ci vuole', definition: 'it takes / it requires (impersonal: ci vuole un\'ora)' },
      ],
      content: `## Italian Daily Life Language

### The Bar — Italian Social Hub

The Italian "bar" is not primarily a drinking establishment — it's a café/coffee bar, the social center of Italian daily life:

\`\`\`
Un caffè, per favore.          An espresso, please. (caffè = espresso by default)
Un caffè macchiato.            Espresso with a drop of milk.
Un cappuccino.                 Cappuccino (morning only — Italians don't drink it after noon).
Al banco / al tavolo.          At the counter / at a table. (Counter = cheaper!)
Quant'è? / Quanto viene?       How much is it?
\`\`\`

**Cultural rule**: In Italy, cappuccino after a meal is a tourist marker. Order espresso after lunch or dinner.

### At the Restaurant

\`\`\`
Un tavolo per due, per favore.     A table for two, please.
Il menù, per favore.               The menu, please.
Cosa consiglia?                    What do you recommend?
Cos'è [dish]?                      What is [dish]?
È incluso il coperto?              Is the cover charge included?
Il conto, per favore.              The check, please.
\`\`\`

**Il coperto**: Italy's restaurant cover charge (typically €1-3 per person) for bread and the table setup. Normal and legal — not a tip.

### L'Aperitivo — The Sacred Hour

Aperitivo (roughly 6-8pm) is Italy's social hour: Aperol Spritz, Campari, or Negroni with free snacks. In Milan and Bologna, aperitivo snacks can be a full meal.
- Facciamo l'aperitivo? (Shall we do aperitivo?)
- Offro io! (I'm buying! / My treat!)

### Ci Vuole — Expressing Duration/Requirement

Ci vuole (singular) / ci vogliono (plural) = "it takes / it requires":
- Ci vuole un'ora. (It takes an hour.)
- Ci vogliono due ore. (It takes two hours.)
- Quanto ci vuole? (How long does it take?)`,
      q: 'What is "il coperto" at an Italian restaurant?',
      options: [
        'The tip / gratuity',
        'A cover charge for bread and the table setup',
        'A mandatory service charge that replaces tipping',
        'The menu cover / the price list',
      ],
      correct: 1,
      explanation: '"Il coperto" (the cover) is a per-person charge at Italian restaurants (typically €1-3) that covers bread and the table setting. It\'s normal and legal — not hidden. It does not replace a tip (though tipping is less expected in Italy than in the US). Seeing "coperto €2" on your bill is standard; not seeing it at all also happens.',
    },
    zh: {
      subtitle: 'Navigate Chinese daily life with the transaction language and social scripts locals use',
      terms: [
        { term: '扫码', definition: 'sǎo mǎ — scan the QR code (ubiquitous in China)' },
        { term: '打包', definition: 'dǎ bāo — to pack up / take away / doggy bag' },
        { term: '几位？', definition: 'jǐ wèi? — how many people? (in a restaurant)' },
        { term: '加微信', definition: 'jiā Wēixìn — add on WeChat (standard way to exchange contacts)' },
        { term: '附近', definition: 'fùjìn — nearby / in the vicinity' },
      ],
      content: `## Chinese Daily Life Language

### China's Mobile-First Economy

Most daily transactions in China happen through smartphones. Key vocabulary:

**Payment**:
- 扫码付款 (sǎo mǎ fùkuǎn) — scan QR code to pay
- 微信支付 / 支付宝 (Wēixìn Zhīfù / Zhīfùbǎo) — WeChat Pay / Alipay
- 现金 (xiànjīn) — cash (increasingly rare, always accepted but sometimes surprising)

**Social contact**:
- 加一下微信 (jiā yīxià Wēixìn) — let's add each other on WeChat (standard contact exchange)
- 我的微信是 [ID] (My WeChat ID is...)
- 发微信 (fā Wēixìn) — send a WeChat message

### At the Restaurant

\`\`\`
几位？          Jǐ wèi? (How many people — lit. how many [polite counter for people])
两位。          Liǎng wèi. (Two people.)
点菜。          Diǎn cài. (Order food — signal to waiter)
这个怎么样？    Zhège zěnmeyàng? (How is this one? / Is this good?)
不要辣/香菜。   Bù yào là/xiāngcài. (No spicy / no cilantro.)
打包。          Dǎ bāo. (Pack up / to-go box.)
买单！/ 结账！  Mǎidān! / Jiézhàng! (Check please!)
\`\`\`

### Bargaining & Shopping

In markets (less so in malls):
\`\`\`
多少钱？           Duōshǎo qián? (How much?)
太贵了！           Tài guì le! (Too expensive!)
便宜一点？         Piányí yīdiǎn? (A little cheaper?)
最少多少？         Zuì shǎo duōshǎo? (What's the minimum/lowest price?)
我考虑一下。       Wǒ kǎolǜ yīxià. (I'll think about it — often signals walking away)
\`\`\`

### Transportation

- 打车 (dǎ chē) — hail a taxi / take a ride (colloquial), 叫滴滴 (jiào Dīdī) — call a DiDi (rideshare)
- 去[place]，多少钱？(How much to go to [place]? — taxi)
- 下一站 (xià yī zhàn) — next stop
- 换乘 (huànchéng) — transfer (metro/bus)`,
      q: 'What does 打包 (dǎ bāo) mean when said at the end of a Chinese meal?',
      options: [
        'Split the bill between everyone',
        'Pack up the leftovers / to-go box',
        'Scan the QR code to pay',
        'Bring the check immediately',
      ],
      correct: 1,
      explanation: '打包 (dǎ bāo — literally "pack up") means to put leftovers in a to-go box. It\'s very normal in Chinese restaurants to take home leftover food — there\'s no social awkwardness. You can also order 打包 or 外带 (wàidài) to get takeaway/takeout food.',
    },
    ja: {
      subtitle: 'Navigate Japanese daily environments with the keigo and practical scripts you need',
      terms: [
        { term: 'お願いします', definition: 'onegaishimasu — please (for requests — more formal than kudasai)' },
        { term: 'すみません', definition: 'sumimasen — excuse me / I\'m sorry / thank you (for attention)' },
        { term: 'いらっしゃいませ', definition: 'irasshaimase — welcome! (formal greeting in shops)' },
        { term: '〜でいいです', definition: '~de ii desu — [X] is fine / [X] will do' },
        { term: '一人で / 二人で', definition: 'hitoride / futaride — alone / as two people' },
      ],
      content: `## Japanese Daily Life Language

### Entering Any Shop or Restaurant

Japanese staff greet customers with いらっしゃいませ (irasshaimase) — no response needed, a nod is fine.

**At a restaurant**:
\`\`\`
一人/二人/三人です。  Hitori/futari/sannin desu. (Party of 1/2/3.)
禁煙席をお願いします。 Kin'enseki wo onegaishimasu. (Non-smoking section please.)
これをください。      Kore wo kudasai. (This one please — pointing at menu)
おすすめは何ですか？  Osusume wa nan desu ka? (What do you recommend?)
お会計をお願いします。 Okaikei wo onegaishimasu. (Check please.)
別々でお願いします。  Betsubetsu de onegaishimasu. (Separate checks please.)
\`\`\`

### Convenience Stores (コンビニ) — The Life Essential

Japanese convenience stores (Lawson, 7-Eleven, FamilyMart) are remarkable:
- Point cards: ポイントカードはお持ちですか？ (Do you have a point card?)
- Standard response when you don't: 大丈夫です (daijōbu desu — I'm fine/no thanks)
- Eating in: イートインスペースを使います (I'll use the eat-in space)
- Bag: 袋はいりますか？ (Do you need a bag?) → いります/いりません (yes/no)

### Transportation

\`\`\`
[Place]まで、一枚ください。   One ticket to [place], please.
[Place]に行きたいんですが。   I want to go to [place]... (seeking help)
何番線ですか？                Which platform number?
乗り換えはどこですか？        Where do I transfer?
\`\`\`

### The すみません Signal

すみません (sumimasen) is Japan's most versatile word:
- Excuse me (to get attention in a restaurant — ちょっとすみません!)
- I'm sorry (for a minor trouble)
- Thank you (for someone going out of their way — more sincere than arigatō for some)
- Pardon me (bumping into someone)`,
      q: 'At a Japanese restaurant, how do you signal that you want the check?',
      options: [
        'お会計をお願いします (Okaikei wo onegaishimasu)',
        'いらっしゃいませ (Irasshaimase)',
        'すみません、何ですか？(Sumimasen, nan desu ka?)',
        'また来ます (Mata kimasu)',
      ],
      correct: 0,
      explanation: '"お会計をお願いします" (okaikei wo onegaishimasu) = "The check, please." お会計 (okaikei) is the polite form of 会計 (kaikei — accounting/bill). In busy restaurants you may need to raise your hand and say "すみません！お会計！" (Sumimasen! Okaikei!) to get attention. Calling out to the staff directly like this is more accepted in Japan than in some other countries.',
    },
    ko: {
      subtitle: 'Handle Korean daily transactions with the correct speech levels for each situation',
      terms: [
        { term: '주세요', definition: 'juseyo — please give me (polite request — the most useful word)' },
        { term: '얼마예요?', definition: 'eolmayeyo? — how much is it?' },
        { term: '괜찮아요', definition: 'gwaenchanayo — it\'s okay / I\'m fine / no problem' },
        { term: '포장이요', definition: 'pojangiyo — to-go / take out (in a café or restaurant)' },
        { term: '영수증', definition: 'yeongsujeung — receipt' },
      ],
      content: `## Korean Daily Life Language

### 주세요 — The Essential Request Word

주세요 (juseyo — please give me) turns any noun into a polite request:
- 물 주세요. (Water please.)
- 메뉴 주세요. (Menu please.)
- 영수증 주세요. (Receipt please.)
- 이거 주세요. (This one please — pointing)

### At a Korean Restaurant

\`\`\`
몇 분이세요?          Myeot buniseyo? (How many people?)
두 명이요.            Du myeongiyo. (Two people.)
이거 뭐예요?          Igeo mwoyeyo? (What is this?)
하나/둘 주세요.       Hana/dul juseyo. (One/two please — using native numbers for quantity)
맵지 않게 해주세요.   Maepji ankke haejuseyo. (Please make it not spicy.)
반반으로 해주세요.    Banbanuro haejuseyo. (Half and half please — for fried chicken!)
계산해 주세요.        Gyesanhaejuseyo. (Please process the payment / bill please.)
\`\`\`

### Café Culture

Korea has one of the world's highest café densities. Key vocabulary:
\`\`\`
아메리카노 한 잔 주세요.    An Americano please. (잔 = counter for drinks)
차갑게요 / 따뜻하게요.      Cold/hot please.
여기서 드실 건가요? / 포장이요?  Eating here or to-go?
포장이요. / 여기서요.        To-go / Here.
테이크아웃이요.             Takeout please. (English loanword)
\`\`\`

### Public Transport

- 어디서 갈아타요? (Eodiseo garataayo? — Where do I transfer?)
- [Place]까지 얼마예요? (How much to [place]?)
- T-money (rechargeable transport card used on all Korean public transit)
- 다음 정거장은 [name]입니다 (Next stop is [name])

### 괜찮아요 — The All-Purpose Okay

괜찮아요 (gwaenchanayo) covers many situations:
- Are you okay? 괜찮아요? / Yes, I'm fine: 네, 괜찮아요.
- Would you like some? 드실래요? → 괜찮아요 (No thank you — soft refusal)
- Is [X] okay with you? → 괜찮아요 (That's fine by me)`,
      q: 'How do you politely order "one Americano to go" at a Korean café?',
      options: [
        '아메리카노 한 잔, 포장이요.',
        '아메리카노 하나 주세요, 가져가요.',
        '커피 주세요, 나가요.',
        '아메리카노 한 개, 가지고 가세요.',
      ],
      correct: 0,
      explanation: '"아메리카노 한 잔, 포장이요." — 잔 is the counter for cups/drinks, 포장이요 (pojangiyo) means to-go/takeout. The staff will often ask "여기서 드실 건가요, 포장이요?" (For here or to go?) and you answer "포장이요." The full order: "아메리카노 한 잔 주세요. 포장이요." is natural and complete.',
    },
    hi: {
      subtitle: 'Manage everyday Hindi transactions and social interactions across registers',
      terms: [
        { term: 'कितने का है?', definition: 'kitne kaa hai? — how much is it?' },
        { term: 'एक मिनट', definition: 'ek minat — one moment / just a minute' },
        { term: 'ठीक है', definition: 'theek hai — it\'s okay / fine / alright / deal' },
        { term: 'चलिए', definition: 'chaliye — let\'s go / shall we? (polite invitation to proceed)' },
        { term: 'बताइए', definition: 'bataiye — please tell me / go ahead (inviting someone to speak)' },
      ],
      content: `## Hindi Daily Life Language

### At the Market / Dukaan (दुकान)

\`\`\`
यह कितने का है?          Yah kitne kaa hai? (How much is this?)
थोड़ा कम करो।            Thoraa kam karo. (Reduce a little — bargaining, informal)
थोड़ा कम कीजिए।          Thoraa kam kijiye. (Please reduce a little — polite)
पक्का?                   Pakkaa? (For sure? / Is that final? — confirmation)
ठीक है, दे दो।            Theek hai, de do. (Okay, give it to me — informal)
पैसे कैसे देने हैं?         Paise kaise dene hain? (How should I pay? — cash/card)
\`\`\`

### Transportation

\`\`\`
[Place] जाना है।          [Place] jaanaa hai. (I want/need to go to [place].)
[Place] तक कितना लगेगा?   How much will it cost to [place]?
मीटर से चलो।             Meeter se chalo. (Go by meter — taxi instruction)
यहाँ रोको।                Yahaan roko. (Stop here.)
अगला मोड़ लेना।           Aglaa mod lenaa. (Take the next turn.)
\`\`\`

### At a Dhaba / Restaurant

\`\`\`
क्या-क्या है?             Kyaa-kyaa hai? (What do you have? — asking menu)
दाल-चावल/रोटी-सब्जी।     Dal-rice / bread-vegetable. (The standard desi meal)
तीखा मत करना।            Teekha mat karnaa. (Don't make it spicy.)
पानी लाइए।                Paani laiye. (Please bring water — polite.)
बिल लाइए।                 Bill laiye. (Please bring the bill.)
\`\`\`

### Addressing People Correctly

- दादी/नानी (daadii/naanii — paternal/maternal grandmother)
- दादा/नाना (daadaa/naanaa — paternal/maternal grandfather)
- भैया (bhaiyaa — elder brother / respectful address for any elder male)
- दीदी (diidii — elder sister / respectful address for any elder female)
- जी (jii — respect suffix: अच्छा जी, हाँ जी — adds deference)

Addressing shopkeepers, auto drivers, and strangers with भैया or दीदी + जी is extremely natural and warm in India.`,
      q: 'You\'re in a Delhi auto-rickshaw and want to stop. What do you say?',
      options: ['रुकिए यहाँ!', 'यहाँ रोको।', 'बंद करो।', 'ठहरिए!'],
      correct: 1,
      explanation: '"यहाँ रोको" (Yahaan roko) is the natural, direct way to say "stop here" to an auto-rickshaw or taxi driver. "रुकिए यहाँ" (rukiye yahaan) is more polite/formal (the aap form). Both work — "यहाँ रोको" is what most passengers actually say in daily usage. "बंद करो" means "close/turn off."',
    },
    de: {
      subtitle: 'Navigate German daily life with its formalities, bureaucracy, and directness',
      terms: [
        { term: 'Das macht...', definition: 'That comes to... / That makes... (total price)' },
        { term: 'Getrennt oder zusammen?', definition: 'Separate or together? (bill question)' },
        { term: 'Stimmt so!', definition: 'Keep the change! (lit. that\'s right like this)' },
        { term: 'Ich hätte gern...', definition: 'I would like... (polite order — hätte = conditional)' },
        { term: 'Was darf\'s sein?', definition: 'What can I get you? (in shops/bakeries)' },
      ],
      content: `## German Daily Life Language

### German Directness and Formality

Germans communicate directly — no small talk before business in most contexts. However, formal address (Sie) is important with strangers, authorities, and in professional settings.

**Siezen vs Duzen**:
- Sie (formal you) — strangers, shop staff, officials, professional acquaintances
- du (informal) — friends, family, young people, colleagues (after offer to use du)
- The offer: "Wir können uns gern duzen." (We can use du with each other.)

### At the Bäckerei / Café

\`\`\`
Was darf's sein?              What can I get you? (bakery standard)
Ich hätte gern ein Brötchen.  I would like a roll.
Zum Mitnehmen bitte.          To take away, please.
Das macht [price].            That comes to [price].
Stimmt so! / Stimmt!          Keep the change!
\`\`\`

**Rounding up** as a tip is normal in Germany (round to the next euro or add ~10%). Tipping system is different from US: 5-10% is generous, exact change signals displeasure.

### German Bureaucracy (Behördendeutsch)

Germany has significant administrative culture. Essential:
- Termin (appointment — almost everything requires one: Arzt, Ausländerbehörde, Einwohnermeldeamt)
- Anmeldung (residence registration — mandatory within 14 days of moving)
- Krankenkasse (health insurance — required by law)
- Bitte füll das Formular aus. (Please fill out the form.)

### Transport

\`\`\`
Einmal nach [place], bitte.           One ticket to [place], please.
Hin und zurück / Einfach.            Round trip / One way.
Auf welchem Gleis?                    On which platform/track?
Anschluss / Umsteigen in [station].   Connection / Transfer at [station].
Bitte einsteigen!                     All aboard! (Please board!)
\`\`\``,
      q: 'How does "Stimmt so!" function as a tip in Germany?',
      options: [
        'You say it when handing over a pre-calculated tip amount',
        'You say it to indicate the price shown is correct',
        'You say it to signal "keep the change" when paying',
        'It means "that\'s too much" and you want change',
      ],
      correct: 2,
      explanation: '"Stimmt so!" (literally "that\'s right like this") is said when you hand over money and don\'t want change — you\'re rounding up as a tip. For example, a €4.20 coffee, you hand over €5 and say "Stimmt so!" meaning "keep the €0.80." It\'s the standard German tipping method rather than leaving bills on the table.',
    },
    nl: {
      subtitle: 'Navigate Dutch daily life and its directness, cycling culture, and practical norms',
      terms: [
        { term: 'doe maar', definition: 'just do it / go ahead / I\'ll have (ordering in shops)' },
        { term: 'alsjeblieft / alstublieft', definition: 'please / here you go (tu/vous forms)' },
        { term: 'tikkie', definition: 'a payment request (Tikkie = popular Dutch split-bill app)' },
        { term: 'pinnen', definition: 'to pay by PIN/debit card' },
        { term: 'gezellig!', definition: 'how lovely/cozy! (social approval)' },
      ],
      content: `## Dutch Daily Life Language

### Dutch Directness — Valued, Not Rude

The Netherlands values direct communication. "Doe maar" (just do it) rather than elaborate formulations:
- In bakeries: "Een brood, doe maar." (A loaf, please — lit. "just do it / go ahead")
- "Doe maar gewoon, dan doe je al gek genoeg." (Just act normal, that's crazy enough — Dutch proverb about humility)

### At the Supermarkt / Winkel

\`\`\`
Heeft u [item]?              Do you have [item]? (formal)
Heb je [item]?               Do you have [item]? (informal)
Hoeveel kost het?            How much does it cost?
Wilt u pinnen of contant?    Do you want to pay by card or cash?
Ik wil pinnen.               I want to pay by card.
Kan ik een tasje krijgen?    Can I get a bag?
\`\`\`

### Going Dutch — The Tikkie

The Netherlands' reputation for splitting bills is real. The Tikkie app (from ABN AMRO) is how Dutch people instantly send payment requests after group activities:
- Ik stuur je een Tikkie. (I'll send you a Tikkie / payment request.)
- Kan je de Tikkie betalen? (Can you pay the Tikkie?)
- Normal to split costs precisely, even among friends.

### Cycling Vocabulary

The Netherlands has more bikes than people. Cyclists have right of way:
- fiets (bicycle), fietsen (to cycle), fietspad (cycle path — stay off it if walking!)
- rijbewijs (driver's license), OV-chipkaart (public transport card)
- Pas op voor de fietsers! (Watch out for cyclists!)

### Transport

\`\`\`
Een enkeltje/retour naar [place].  A single/return to [place].
Welk spoor?                        Which platform/track?
Instappen alstublieft!             All aboard please!
Volgende halte: [name].            Next stop: [name].
\`\`\``,
      q: 'What is a "Tikkie" in Dutch daily life?',
      options: [
        'A small tip left at restaurants',
        'A payment request app used to split bills between Dutch people',
        'The Dutch word for a taxi or rideshare',
        'A traditional Dutch snack sold at street stands',
      ],
      correct: 1,
      explanation: 'Tikkie is a Dutch payment request app — you send someone a link requesting them to pay their share. It\'s become so ubiquitous in the Netherlands that "een Tikkie sturen" (sending a Tikkie) is standard social vocabulary. "Going Dutch" (splitting costs exactly) is genuinely practiced in the Netherlands, and Tikkie is the technological tool for it.',
    },
    ru: {
      subtitle: 'Navigate Russian daily transactions with the practical language for shops, transport, and service',
      terms: [
        { term: 'сколько стоит?', definition: 'skol\'ko stoit? — how much does it cost?' },
        { term: 'дайте, пожалуйста', definition: 'daite, pozhaluista — please give me (standard shop request)' },
        { term: 'пробить чек', definition: 'probit\' chek — to ring up / print the receipt' },
        { term: 'касса', definition: 'kassa — cashier / register / ticket office' },
        { term: 'мне нужно', definition: 'mne nuzhno — I need (lit. to me is necessary)' },
      ],
      content: `## Russian Daily Life Language

### At the Shop / Магазин

Russian shopping often involves a counter system where you ask for items:
\`\`\`
Дайте, пожалуйста, [item].      Please give me [item].
Покажите, пожалуйста.           Please show me (pointing to something behind glass).
Сколько стоит?                  How much does it cost?
Взвесьте, пожалуйста.           Please weigh it. (at food markets)
Пакет нужен?                    Do you need a bag? (cashier asking)
Можно карточкой?                Can I pay by card?
\`\`\`

**Важно (important)**: в России often say дайте (give me) where English speakers say "I would like." This sounds blunt in English but is completely normal in Russian.

### Transport

\`\`\`
Один / два билета до [place].   One/two tickets to [place].
На каком пути? / На какой платформе?   Which track/platform?
Следующая станция — [name].     Next station — [name].
Мне выходить на следующей?      Do I get off at the next stop?
До [place] далеко?               Is [place] far?
\`\`\`

**Маршрутка (marshrutka)**: shared minibus taxis still common in many Russian cities. "Скажите, когда [place]" (tell me when [place]).

### At the Doctor / Аптека

\`\`\`
Мне нужно к врачу.              I need to see a doctor.
У меня болит [body part].       My [body part] hurts.
У меня температура.             I have a fever.
Есть что-нибудь от [condition]? Do you have something for [condition]?
По рецепту / без рецепта.       By prescription / over the counter.
\`\`\`

### The Касса System

In Russia, the cashier (касса) is often separate from where you pick up goods:
1. Choose what you want, get a price
2. Go to the кассa and pay, get a чек (receipt)
3. Return to the counter with the чек to collect your goods
(Common in old-style Soviet-era shops and some markets)`,
      q: 'In a Russian shop, is saying "дайте" (give me) considered rude?',
      options: [
        'Yes — always use "я хочу" (I want) instead',
        'No — it\'s the completely standard, normal way to request items in a shop',
        'Only in Moscow — in other cities it\'s rude',
        'Yes — you must say "я бы хотел" (I would like) to be polite',
      ],
      correct: 1,
      explanation: '"Дайте, пожалуйста" (give me, please) is the standard, normal way to request items in Russian shops and service contexts. Russian does not use the elaborate conditional softening ("I would like") that English uses. The pожалуйста (please) provides sufficient politeness. Foreign learners who avoid "дайте" for sounding too direct will sound unnatural.',
    },
    ar: {
      subtitle: 'Navigate Arabic-speaking environments with practical transaction language and cultural scripts',
      terms: [
        { term: 'بكم هذا؟', definition: 'bikam hādhā? — how much is this?' },
        { term: 'غالي', definition: 'ghālī — expensive' },
        { term: 'أعطني', definition: 'aʿṭinī — give me (standard request in shops)' },
        { term: 'من فضلك', definition: 'min faḍlak/faḍlik — please (m/f — lit. from your grace)' },
        { term: 'تفضل/تفضلي', definition: 'tafaḍḍal/tafaḍḍalī — here you go / come in / please (m/f hospitality)' },
      ],
      content: `## Arabic Daily Life Language

### Hospitality Culture — تفضل (Tafaḍḍal)

Arab hospitality is legendary. تفضل (tafaḍḍal, m) / تفضلي (tafaḍḍalī, f) is used constantly:
- Come in! (at a door)
- Here you are! (handing something)
- Please, help yourself! (offering food/drink)
- Please, go ahead! (in a queue)

Refusing hospitality:
- شكراً، أنا بخير (shukran, ana bikhayr) — Thank you, I'm fine
- بارك الله فيك (bāraka Allāh fīk) — May God bless you (warm refusal)

### At the Market / سوق (Sūq)

\`\`\`
بكم هذا؟          Bikam hādhā? (How much is this?)
غالي جداً!         Ghālī jiddan! (Very expensive!)
خفف السعر.        Khaffif as-siʿr. (Reduce the price.)
آخر سعر كام؟      Ākhir siʿr kām? (What's the final price? — mixed MSA/colloquial)
هذا مقبول.         Hādhā maqbūl. (This is acceptable.)
خذ / أعطني.       Khudh / Aʿṭinī. (Take / Give me.)
\`\`\`

**Note**: In souqs and informal markets, bargaining is expected. In modern malls and chain shops, prices are fixed.

### Transport

\`\`\`
إلى [place] كم؟           Ilā [place] kam? (How much to [place]?)
أوقفني هنا.               Awqifnī hunā. (Stop me here — to taxi driver)
أين محطة المترو؟           Ayna maḥaṭṭat al-mitrū? (Where is the metro station?)
\`\`\`

### Essential Polite Expressions

- من فضلك (min faḍlak, m) / من فضلك (min faḍlik, f) — Please (lit. from your grace)
- لو سمحت (law samaḥt, m/f) — If you please / Excuse me (more colloquial, widely used)
- عفواً (ʿafwan) — Excuse me / You're welcome / Pardon
- لا شكر على واجب (lā shukr ʿalā wājib) — Don't mention it (lit. no thanks for a duty)`,
      q: 'What does تفضل (tafaḍḍal) mean when someone hands you something at their home?',
      options: [
        'Please leave / farewell',
        'This is expensive',
        'Please / here you go / come in (a hospitality expression)',
        'I don\'t understand you',
      ],
      correct: 2,
      explanation: 'تفضل (tafaḍḍal, m) / تفضلي (tafaḍḍalī, f) is one of the most important Arab hospitality words — meaning "here you go / please / come in / help yourself" depending on context. When someone hands you tea, food, or an item: تفضل. When opening a door: تفضل. When inviting someone to sit: تفضل. It signals warmth and generosity.',
    },
    sw: {
      subtitle: 'Handle Swahili market transactions, greetings, and social scripts across East Africa',
      terms: [
        { term: 'bei gani?', definition: 'what is the price? (bei = price, gani = what kind)' },
        { term: 'punguza', definition: 'reduce / lower (the price — bargaining verb)' },
        { term: 'ngapi?', definition: 'how many? / how much? (quantity)' },
        { term: 'nzuri', definition: 'good / nice / fine / beautiful (very versatile)' },
        { term: 'pole pole', definition: 'slowly / take it easy (reduplication for "very slowly")' },
      ],
      content: `## Swahili Daily Life Language

### Market Language — Soko (Market)

\`\`\`
Bei gani? / Ni pesa ngapi?    How much? (price/how many pesa?)
Ghali sana!                   Very expensive!
Punguza kidogo.               Reduce a little.
Bei ya mwisho ni ngapi?       What is the final price?
Nitanunua.                    I will buy it.
Asante, bado naangalia.       Thank you, I'm still looking.
\`\`\`

### Greetings — The Social Foundation

Swahili greetings are elaborate and important — rushing them is rude:
\`\`\`
Habari yako?       How are you? (standard)
Nzuri, asante.     Fine, thank you.
Habari za nyumbani? How is the home/family?
Habari za kazi?    How is work?
Mambo vipi?        What's up? / How are things? (casual, young people)
Poa!               Cool! / Great! (Kenyan youth slang response to mambo)
Safi!              Clean! / Great! (also Kenyan response)
\`\`\`

### Ubuntu Philosophy in Language

Swahili reflects communal values: asking about family and wellbeing before getting to business is the norm, not optional:
- Pole (sorry — used to express sympathy for ANY difficulty, large or small)
- Pole sana (very sorry — for significant misfortune)
- Hongera! (Congratulations!)
- Karibu / Karibu sana (welcome / very welcome)

### Transport

\`\`\`
Nenda [place].              Go to [place] (to matatu/taxi driver).
Simama hapa.                Stop here.
Panda / Shuka.              Get on / Get off.
Stendi iko wapi?            Where is the bus stop/stand?
\`\`\`

**Matatu**: shared minibuses in Kenya/Tanzania. Ubiquitous. Negotiate or check the fare before boarding.

### Pole Pole (Slowly Slowly)

Africa's famous concept of time. Pole pole (slowly, without rush) is a value, not just a description. "Haraka haraka haina baraka" (rushing has no blessing) is a well-known Swahili proverb.`,
      q: 'You\'re at a Nairobi market and the vendor says an item costs too much. What do you say to bargain?',
      options: [
        'Asante sana, kwaheri',
        'Ghali sana, punguza kidogo',
        'Nzuri, nitanunua sasa hivi',
        'Habari za nyumbani?',
      ],
      correct: 1,
      explanation: '"Ghali sana, punguza kidogo" — "Very expensive, reduce a little." Ghali = expensive, sana = very, punguza = reduce/lower, kidogo = a little. Bargaining (kupiga bei) is expected and normal in African markets. Saying "asante sana, kwaheri" (thank you, goodbye) and starting to walk away is another effective bargaining technique.',
    },
    ht: {
      subtitle: 'Navigate Haitian daily life with the practical Creole that Haitians actually speak',
      terms: [
        { term: 'konbyen?', definition: 'how much? (kombyen in some spellings)' },
        { term: 'chè', definition: 'expensive / dear (from French cher)' },
        { term: 'bese pri a', definition: 'lower the price (bargaining)' },
        { term: 'pa gen pwoblèm', definition: 'no problem / no worries' },
        { term: 'kite m gade', definition: 'let me look / let me see' },
      ],
      content: `## Haitian Creole Daily Life Language

### At the Mache (Market)

\`\`\`
Sa a konbyen?               How much is this?
Sa a chè twòp!              This is too expensive!
Ba m yon ti bese.           Give me a little reduction.
Bese pri a.                 Lower the price.
Mwen pap peye konsa.        I won't pay that much.
OK, mwen pran l.            OK, I'll take it.
Ban mwen monnen mwen.       Give me my change.
\`\`\`

**Market dynamics**: Bargaining is normal and expected at Haitian outdoor markets (mache). Fixed prices in formal shops.

### Money & Payments

An important Haitian complexity: two parallel currency systems:
- **Goud/Gourdes** (HTG) — the official currency
- **Dola Ayisyen / Haitian Dollar** — an informal unit = 5 gourdes (a legacy of when 1 HTG = 1 USD)

When someone says a price in "dola," multiply by 5 to get gourdes. Always clarify: "Sa a nan goud ou nan dola?" (Is that in gourdes or dollars?)

### Transport

\`\`\`
Tap-tap pou [place] ki kote? Where is the tap-tap for [place]?
Desann la.                   Get off here / drop me here.
Konbyen pou [place]?         How much to [place]?
\`\`\`

**Tap-tap**: Haiti's colorfully painted shared taxis — the main transport. Fixed routes, informal stops.
**Moto-taxi**: motorcycle taxis (very fast, widely used)

### Politeness & Social Scripts

\`\`\`
Eskize mwen.          Excuse me / I'm sorry.
Souple.               Please (from French "s'il vous plaît").
Mèsi anpil.           Thank you very much.
Ou pa bezwen.         You shouldn't have (receiving a gift/favor).
Bondye beni ou.       God bless you (common warm closing).
\`\`\`

### Essential Survival Phrase

"Mwen pa konprann" (I don't understand) — "Pale dousman souple" (Please speak slowly).
Haitians are generally warm with foreigners attempting Creole.`,
      q: 'In Haiti, if a price is given in "dola ayisyen," how do you convert to gourdes?',
      options: [
        'Divide by 5',
        'Multiply by 5',
        'The rate changes daily — check the market',
        'They are equal — 1 dola = 1 goud',
      ],
      correct: 1,
      explanation: 'Multiply by 5: 1 Haitian dollar = 5 gourdes. This is a fixed informal convention, not an exchange rate. So if someone says "100 dola," that\'s 500 gourdes. This dual system is a historical legacy and trips up visitors constantly. Always ask: "Sa a nan goud ou nan dola?" (Is that in gourdes or [Haitian] dollars?) to avoid confusion.',
    },
  }

  const d = data[lang.code]
  return {
    id: `lang-${lang.code}-daily`,
    track: 'language',
    title: `${lang.name}: Daily Life`,
    subtitle: d.subtitle,
    level: 'Masters',
    xp: 300,
    duration: 50,
    module,
    content: d.content,
    keyTerms: d.terms,
    quiz: [{
      q: d.q,
      options: d.options,
      correct: d.correct,
      explanation: d.explanation,
    }],
    certArea: `${lang.name} Practical Communication`,
    courseObjective: `Handle real-world ${lang.name} interactions in shops, restaurants, and transport`,
    moduleObjective: `Conduct daily transactions independently in ${lang.name}-speaking environments`,
  }
}

function buildGrammarMasteryModule(lang: LangEntry, module: number): Course {
  const data: Record<string, {
    subtitle: string; content: string; terms: { term: string; definition: string }[];
    q: string; options: string[]; correct: number; explanation: string
  }> = {
    es: {
      subtitle: 'Master the subjunctive and tense system that separates intermediate from advanced Spanish',
      terms: [
        { term: 'el subjuntivo', definition: 'the subjunctive mood — for doubt, emotion, desire, hypotheticals' },
        { term: 'el pretérito', definition: 'preterite — completed past action (hablé = I spoke)' },
        { term: 'el imperfecto', definition: 'imperfect — ongoing/habitual past (hablaba = I used to speak/was speaking)' },
        { term: 'el condicional', definition: 'conditional — would (hablaría = I would speak)' },
        { term: 'aunque', definition: 'even though / although — triggers subjunctive with uncertainty' },
      ],
      content: `## Spanish Grammar Mastery

### The Subjunctive — Why It Exists

The subjunctive isn't a tense — it's a mood that signals subjectivity: wishes, doubts, emotions, unreality.

**The WEIRDO triggers**: Wish, Emotion, Impersonal expressions, Recommendations, Doubt/Denial, Ojalá
- Quiero que **vengas**. (I want you to come — wish, two subjects)
- Espero que **esté** bien. (I hope he/she is well — emotion)
- Es importante que **estudies**. (It's important that you study — impersonal)
- Dudo que **sea** verdad. (I doubt it's true — doubt)
- Ojalá **llegue** a tiempo. (I hope he arrives on time — ojalá always triggers subjunctive)

**No subjunctive when same subject**: Quiero venir. (I want to come — same person, infinitive used)

### Preterite vs Imperfect — The Core Distinction

The most important Spanish tense contrast:
| Preterite | Imperfect |
|-----------|-----------|
| Completed, specific action | Ongoing, habitual, background |
| Ayer **comí** pizza. | De niño, **comía** pizza todos los días. |
| **Llegué** a las 3. | **Eran** las 3 cuando llegué. |
| Interrupting action | Background action being interrupted |

**Memory trick**: preterite = click (specific moment), imperfect = movie (scene setting)

### Ser vs Estar — The Deep Rules

Beyond "permanent vs temporary":
- **Ser**: identity, origin, time, material, possession, passive voice agent
- **Estar**: location, condition/state, progressive, result of change

Tricky cases: ser muerto = to be dead (permanent state after dying), estar muerto = is dead (current condition)

### The Conditional and Si-Clauses

Hypotheticals follow strict patterns:
- Real: Si **tengo** dinero, **compraré** (present → future)
- Unreal present: Si **tuviera** dinero, **compraría** (imperfect subj → conditional)
- Unreal past: Si **hubiera tenido** dinero, **habría comprado** (pluperfect subj → conditional perfect)`,
      q: 'Which sentence correctly uses the subjunctive?',
      options: [
        'Sé que ella está aquí.',
        'Quiero que ella esté aquí.',
        'Ella está aquí para que yo sé.',
        'Es cierto que ella esté aquí.',
      ],
      correct: 1,
      explanation: '"Quiero que ella esté aquí" — the subjunctive (esté) is triggered by querer (wish) with two different subjects (I want / she is). "Sé que ella está aquí" uses indicative — saber (to know) is certain, not subjunctive. "Es cierto que" also uses indicative (certainty). "Para que" does trigger subjunctive, but "sé" would be wrong — it should be "para que yo sepa."',
    },
    fr: {
      subtitle: 'Master French tense-mood system, agreement rules, and the subjonctif',
      terms: [
        { term: 'le subjonctif', definition: 'subjunctive mood — for necessity, doubt, emotion' },
        { term: 'le passé composé', definition: 'compound past — with avoir/être + past participle' },
        { term: "l'imparfait", definition: 'imperfect — ongoing/habitual past states and actions' },
        { term: 'le conditionnel', definition: 'conditional — would / polite requests' },
        { term: "l'accord du participe passé", definition: 'past participle agreement — complex French rule' },
      ],
      content: `## French Grammar Mastery

### Passé Composé vs Imparfait

The French past tense split mirrors Spanish:
| Passé Composé | Imparfait |
|--------------|-----------|
| Completed event (happened once) | Ongoing state / habitual action |
| J'**ai mangé** à midi. | Je **mangeais** à midi chaque jour. |
| Il **est arrivé**. | Il **faisait** beau quand il est arrivé. |

**Être verbs** (DR MRS VANDERTRAMP + reflexives) form passé composé with être and agree:
Elle **est allée**. Ils **sont partis**. Elle **s'est levée**.

### Past Participle Agreement

One of French's trickiest rules:
- With **avoir**: agree with preceding direct object (if any): La lettre que j'**ai écrite** (written — agree with "lettre" f.sg.)
- With **être**: always agree with subject: Elles **sont arrivées**.

### The Subjunctive in French

Triggered by: necessity (il faut que), emotion (être content que), doubt (douter que), wish (vouloir que)

**Key irregular subjunctive forms**:
- être → soit, soient
- avoir → ait, aient
- aller → aille, aillent
- faire → fasse, fassent
- pouvoir → puisse, puissent

Examples:
- Il faut que tu **sois** là. (You need to be there.)
- Je veux qu'il **fasse** beau. (I want it to be nice out.)

### Conditional and Hypotheticals

- Si + present → future: Si tu **viens**, je **serai** là.
- Si + imparfait → conditionnel: Si tu **venais**, je **serais** là.
- Si + plus-que-parfait → conditionnel passé: Si tu **étais venu**, j'**aurais été** là.`,
      q: 'La lettre que j\'ai ____. Which form is correct?',
      options: ['écrit', 'écrite', 'écrits', 'écrites'],
      correct: 1,
      explanation: '"La lettre que j\'ai écrite" — the past participle écrit agrees with "la lettre" (feminine singular) because it is the direct object that PRECEDES the verb avoir in the passé composé. This is the "preceding direct object agreement" rule: when a direct object comes before avoir + past participle, the participle agrees with that object in gender and number.',
    },
    pt: {
      subtitle: 'Master the Portuguese subjunctive, the personal infinitive, and tense distinctions',
      terms: [
        { term: 'o infinitivo pessoal', definition: 'personal infinitive — unique to Portuguese, inflected by person' },
        { term: 'o pretérito perfeito', definition: 'simple past (fiz = I did) — completed action' },
        { term: 'o imperfeito', definition: 'imperfect (fazia = I used to do) — ongoing/habitual past' },
        { term: 'o futuro do subjuntivo', definition: 'future subjunctive — common in Portuguese (rare in Spanish)' },
        { term: 'o conjuntivo', definition: 'the subjunctive mood (EP term; BP uses subjuntivo)' },
      ],
      content: `## Portuguese Grammar Mastery

### The Personal Infinitive — Unique to Portuguese

No other major language has this. The infinitive inflects by person:

| Person | Personal Infinitive (falar) |
|--------|---------------------------|
| eu | falar |
| tu | falares |
| ele/ela | falar |
| nós | falarmos |
| vós | falardes |
| eles/elas | falarem |

Used when the infinitive has its own subject different from the main clause:
- É importante **falarmos** sobre isso. (It's important for us to talk about this.)
- Antes de **saíres**, liga para mim. (Before you leave, call me.)

### The Future Subjunctive — Active in Portuguese

Portuguese uses the future subjunctive constantly (Spanish uses it only in fixed phrases):
- Quando **chegar**, me liga. (When you arrive, call me.) ← future subj, not present
- Se **quiser** vir, venha. (If you want to come, come.)
- Onde **estiver**, estarei pensando em você. (Wherever you are, I'll be thinking of you.)

Formation: from the 3rd person plural preterite, drop the -ram: fizeram → fizer-, falaram → falar-

### Preterite vs Imperfect (same as Spanish)

- Pretérito perfeito: fiz, fui, comi — completed, specific
- Imperfeito: fazia, ia, comia — habitual, background, ongoing

### Ser vs Estar (like Spanish but with differences)

European Portuguese uses estar more for location; Brazilian Portuguese uses ficar:
- EP: A farmácia está na rua principal.
- BP: A farmácia fica na rua principal.`,
      q: 'Which sentence uses the future subjunctive correctly?',
      options: [
        'Quando chegará, me liga.',
        'Quando chegar, me liga.',
        'Quando chegue, me liga.',
        'Quando chegasse, me liga.',
      ],
      correct: 1,
      explanation: '"Quando chegar, me liga" — when quando (when) introduces a future condition, Portuguese uses the future subjunctive (chegar), not the future indicative (chegará) or present subjunctive (chegue). This is one of Portuguese\'s most distinctive features — Spanish uses the present indicative in the same structure: "Cuando llegues" (Spanish subjunctive) vs "Cuando chegar" (Portuguese future subjunctive).',
    },
    it: {
      subtitle: 'Master Italian\'s subjunctive, conditional, and the pronoun system',
      terms: [
        { term: 'il congiuntivo', definition: 'the subjunctive — for doubt, wish, emotion, concession' },
        { term: 'il condizionale', definition: 'conditional — would (parlerei = I would speak)' },
        { term: 'il trapassato', definition: 'pluperfect — had done (avevo fatto = I had done)' },
        { term: 'i pronomi combinati', definition: 'combined pronouns (me lo, te lo, glielo...)' },
        { term: 'il passato prossimo vs remoto', definition: 'near vs remote past — regional usage varies' },
      ],
      content: `## Italian Grammar Mastery

### The Congiuntivo — When to Use It

Italian subjunctive triggers:
- After verbs of opinion (credere, pensare, sperare, credere): Credo che **venga**.
- After verbs of emotion (essere contento che, dispiacere che): Sono contento che tu **sia** qui.
- After verbs of doubt/denial: Non credo che **sia** vero.
- After impersonal expressions: È importante che tu **studi**.
- After concessive conjunctions: benché, sebbene, nonostante (+ subjunctive always)

**Key irregular congiuntivo**:
- essere → sia, sia, sia, siamo, siate, siano
- avere → abbia, abbia, abbia, abbiamo, abbiate, abbiano
- fare → faccia, stare → stia, andare → vada

### Passato Prossimo vs Passato Remoto

A crucial regional divide:
- **Northern Italy**: passato prossimo for all past events (like French passé composé)
- **Southern Italy/Sicily**: passato remoto for past events (even recent ones)
- **Standard**: passato prossimo = recent/relevant past; passato remoto = distant past

This means "I ate" is "ho mangiato" in Milan, "mangiai" in Palermo — both correct in their regions.

### Combined Pronouns

Italian stacks indirect + direct pronouns, and they fuse:
- mi + lo = me lo (me + it): Me lo dai? (Can you give it to me?)
- ti + la = te la: Te la do. (I'll give it to you.)
- gli/le + lo = glielo: Glielo dico. (I'll tell it to him/her.)
- ci + ne = ce ne: Ce ne sono tre. (There are three of them [for us/here].)

### The Conditional for Politeness

Italian uses conditional much like French for polite requests:
- Vorrei un caffè. (I would like a coffee.)
- Potrei avere il menù? (Could I have the menu?)
- Dovresti studiare di più. (You should study more.)`,
      q: 'Which construction always requires the subjunctive (congiuntivo)?',
      options: [
        'After "so che" (I know that)',
        'After "benché" (although/even though)',
        'After "perché" (because/why)',
        'After "quando" (when)',
      ],
      correct: 1,
      explanation: '"Benché" (although/even though) always triggers the subjunctive: "Benché sia stanco, continuo a lavorare" (Although I am tired, I continue to work). Concessive conjunctions — benché, sebbene, nonostante, malgrado, quantunque — always require congiuntivo. "So che" (I know that) takes indicative (certainty). "Perché" with indicative means "because"; with subjunctive it means "so that." "Quando" takes indicative.',
    },
    zh: {
      subtitle: 'Master Chinese grammar patterns: aspect particles, complements, and the ba-construction',
      terms: [
        { term: '把 (bǎ)', definition: 'disposal construction — moves object before verb for emphasis on action\'s result' },
        { term: '被 (bèi)', definition: 'passive marker — indicates something was done to the subject' },
        { term: '结果补语', definition: 'resultative complement — verb + result: 写完 (finish writing), 学会 (learn successfully)' },
        { term: '趋向补语', definition: 'directional complement: 进来 (come in), 出去 (go out), 上来 (come up)' },
        { term: '连...都/也...', definition: 'even... construction: 连孩子都知道 (even children know)' },
      ],
      content: `## Chinese Grammar Mastery

### The 把 (bǎ) Construction

把 moves the object before the verb to emphasize the verb's effect on the object. Use when: the verb has a result complement, there's disposal of a specific object.

**Structure**: Subject + 把 + Object + Verb + Complement
- 我把书放在桌子上了。(I put the book on the table.)
- 他把作业做完了。(He finished the homework — lit. completed it.)
- 请把门关上。(Please close the door — lit. shut it closed.)

Cannot use 把 with: unspecific objects, verbs of perception (看/听), stative verbs (是/有/在).

### Resultative Complements

Verb + result suffix shows what happens as a result:
- 写完 (finish writing), 听懂 (understand by listening), 做好 (do well/complete)
- 看见 (see — successful seeing), 找到 (find — succeed in finding)
- 写错 (write incorrectly), 说错 (say wrongly)

Negation with 没: 我没写完 (I didn't finish writing). Potential with 得/不: 写得完 (can finish) / 写不完 (can't finish).

### The 被 (bèi) Passive

Chinese passive with 被:
- 窗户被风吹开了。(The window was blown open by the wind.)
- 他被老师批评了。(He was criticized by the teacher.)

Note: 被 often has negative connotation — things happening TO you. For neutral passives, Chinese often just uses active voice with unspecified subject.

### Aspect Particles: 了/着/过

- 了 (le): completed action or change of state: 我吃了 (I've eaten), 他来了 (he's come)
- 着 (zhe): ongoing state: 门开着 (the door is open — ongoing state), 她笑着说 (she said smiling)
- 过 (guo): past experience: 我去过北京 (I've been to Beijing — at some point in the past)`,
      q: 'When is the 把 construction required?',
      options: [
        'Whenever the sentence has a direct object',
        'When a specific object undergoes a verb with a resultative complement or disposal',
        'Only in formal written Chinese',
        'When expressing the passive voice',
      ],
      correct: 1,
      explanation: '把 is used when a specific, definite object is disposed of by a verb + resultative/directional complement, or when emphasis is on how the action affected the object. "把书放桌上" (put the book on the table) requires 把 because the action has a result/location. You cannot use 把 with unspecific objects ("I eat rice" → 我吃饭, no 把), stative verbs, or perception verbs.',
    },
    ja: {
      subtitle: 'Master Japanese grammar: conditionals, politeness levels, and complex sentence patterns',
      terms: [
        { term: 'て-form connections', definition: 'て/で form — links actions, creates requests, and progressive' },
        { term: '〜たら/〜ば/〜と/〜なら', definition: 'four conditional forms — each with distinct nuance' },
        { term: '〜ようになる', definition: 'to come to (gradually): 話せるようになった (became able to speak)' },
        { term: '〜てしまう', definition: 'do completely / accidentally / regrettably' },
        { term: '敬語 (keigo)', definition: 'honorific language — sonkeigo (respect) + kenjōgo (humble)' },
      ],
      content: `## Japanese Grammar Mastery

### Four Conditionals — Choosing the Right One

Japanese has four conditional forms; choosing wrong sounds unnatural:

**〜たら** — most versatile; results, hypotheticals, past conditions:
- 雨が降ったら、行きません。(If it rains, I won't go.)
- 家に帰ったら、電話して。(When you get home, call me.)

**〜ば** — formal; logical consequence:
- お金があれば、旅行できる。(If I had money, I could travel.)

**〜と** — automatic consequence; facts, instructions:
- 春になると、桜が咲く。(When spring comes, cherry blossoms bloom.)
- 左に曲がると、駅があります。(Turn left, and there's the station.)

**〜なら** — conditional on stated topic/assumption:
- 東京に行くなら、浅草がいいよ。(If you're going to Tokyo, Asakusa is good.)

### 〜てしまう — The "Unfortunate Completion"

〜てしまう / 〜ちゃう (spoken) indicates:
1. Unfortunate or regrettable completion: 財布を忘れてしまった (I forgot my wallet, unfortunately)
2. Complete/thorough completion: 全部食べてしまった (I ate everything up)
3. Action against better judgment: また寝てしまった (I fell asleep again)

### Keigo (敬語) — Honorific Language

Essential for professional Japanese:

**Sonkeigo** (尊敬語) — elevates listener's actions:
- 言う → おっしゃる (to say), 来る → いらっしゃる (to come), 食べる → 召し上がる (to eat)

**Kenjōgo** (謙譲語) — lowers speaker's actions:
- 言う → 申す (to say), 行く → 参る (to go), 食べる → いただく (to eat/receive)

**Teineigo** (丁寧語) — baseline polite: -masu/-desu forms

### 〜ようになる — Gradual Change

Expresses coming to be able to do something:
- 日本語が話せるようになりました。(I've become able to speak Japanese.)
- 毎日走るようになった。(I've come to run every day — new habit formed.)`,
      q: 'Which conditional would you use to give a tourist directions: "Turn left and there\'s the station"?',
      options: ['〜たら form: 左に曲がったら、駅があります', '〜と form: 左に曲がると、駅があります', '〜ば form: 左に曲がれば、駅があります', '〜なら form: 左に曲がるなら、駅があります'],
      correct: 1,
      explanation: '〜と is used for automatic/inevitable results and instructions/directions: "do X and Y will certainly follow." 左に曲がると、駅があります = "Turn left, and there will be (certainly) a station." This is the natural form for giving directions. 〜たら would work but is less natural for inevitable facts. 〜ば is too formal for casual directions. 〜なら doesn\'t fit the directional context.',
    },
    ko: {
      subtitle: 'Master Korean grammar: the topic/subject contrast, speech levels, and complex connectors',
      terms: [
        { term: '은/는 vs 이/가', definition: 'topic vs subject particles — the most important distinction' },
        { term: '-아/어서 vs -으니까', definition: 'two causal connectors with different pragmatic uses' },
        { term: '-겠-', definition: 'intentional future / inference / politeness marker' },
        { term: '-(으)면', definition: 'conditional: if / when' },
        { term: '간접화법', definition: 'indirect speech — quotation patterns (-다고, -냐고, -라고)' },
      ],
      content: `## Korean Grammar Mastery

### Topic (은/는) vs Subject (이/가) — The Core Distinction

This contrast shapes all Korean sentences:

**은/는 (topic)**: what the sentence is about; signals contrast or shared knowledge:
- 저는 학생이에요. (As for me, I'm a student — introducing myself)
- 저는 고기를 안 먹어요. (As for me, I don't eat meat — contrast with others)

**이/가 (subject)**: new information, neutral sentences, existence:
- 비가 와요. (Rain is falling — neutral subject)
- 이/가 after predicate 있다/없다: 시간이 있어요 (there is time)

When a noun is both topic and subject, use 은/는 for "as for X" and 이/가 when X is new/emphasized.

### Causal Connectors: -아/어서 vs -(으)니까

Both mean "because," but usage differs:
**-아/어서**: neutral cause; cannot be used with imperatives/suggestions:
- 배가 아파서 못 왔어요. (I couldn't come because my stomach hurt.)
- ✗ 배가 아파서 쉬세요. (wrong — suggestion with -아서)

**-(으)니까**: reason for a request/command; speaker's justification:
- 배가 아프니까 쉬세요. (Since your stomach hurts, please rest.)
- 여기서 하니까 더 편해요. (Since we're doing it here, it's more convenient.)

### -겠- — The Versatile Marker

-겠- shows: intention (first person), inference (second/third person), politeness:
- 제가 하겠습니다. (I will do it — intentional, formal)
- 덥겠어요. (It must be hot — inference from context)
- 알겠습니다. (I understand / I will comply — formal acknowledgment)

### Indirect Speech Patterns

Korean indirect speech requires different endings:
- Statement: -다고 해요 / -다고 했어요: 왔다고 해요 (They say he came)
- Question: -냐고 물어봤어요: 어디 가냐고 물어봤어요 (asked where I was going)
- Command: -(으)라고 했어요: 빨리 오라고 했어요 (told me to come quickly)`,
      q: 'Why is -아/어서 wrong in "배가 아파서 쉬세요"?',
      options: [
        'The verb stem is irregular',
        '-아/어서 cannot precede imperatives or suggestions — use -(으)니까 instead',
        'The tense is incorrect',
        'The subject particle should be different',
      ],
      correct: 1,
      explanation: '-아/어서 expresses a neutral sequential/causal relationship but cannot be followed by commands (-(으)세요), suggestions (-(으)ㄹ까요), or requests. When you want to give a reason FOR a request, use -(으)니까. "배가 아프니까 쉬세요" (Please rest, since your stomach hurts) is correct. This constraint is one of the most tested Korean grammar points.',
    },
    hi: {
      subtitle: 'Master Hindi\'s postposition system, aspect, and the passive oblique constructions',
      terms: [
        { term: 'कर्ता + को = experiencer', definition: 'indirect subject with को: मुझे पसंद है (I like — lit. to me is liked)' },
        { term: 'वाला/-वाली', definition: 'wālā — the one who / the [type]: दूध वाला = milkman, जाने वाला = about to go' },
        { term: 'होना vs रहना', definition: 'to be — होना (general being), रहना (continuous/residing)' },
        { term: 'ने construction', definition: 'ने marks agent in perfective transitive — verb agrees with object' },
        { term: 'चाहिए', definition: 'chaahiye — should / want / is needed: मुझे पानी चाहिए (I need water)' },
      ],
      content: `## Hindi Grammar Mastery

### The ने Construction — Perfective Transitive

Hindi's most confusing rule for learners: in perfective tenses with transitive verbs, the subject takes ने and the verb agrees with the object, not the subject.

**Structure**: Subject + ने + Object + Verb (agrees with object)

- मैंने किताब पढ़ी। (I read the book — किताब is f.sg., so verb is पढ़ी f.sg.)
- उसने खाना खाया। (He/she ate the food — खाना is m.sg., so खाया m.sg.)
- हमने फिल्में देखीं। (We saw films — फिल्में is f.pl., so देखीं f.pl.)

**No ने with intransitive verbs**: मैं गई। (I went — f.) — no ने because जाना is intransitive.

### Experiencer Constructions with को

Many mental/physical states use को + experiencer as indirect subject:
- मुझे पसंद है / मुझे पसंद नहीं है (I like / I don't like — lit. to me is liked)
- मुझे भूख लगी है (I'm hungry — lit. hunger has struck to me)
- मुझे ठंड लग रही है (I'm feeling cold)
- आपको क्या चाहिए? (What do you need/want? — lit. to you what is needed)
- उसे पता है (He/she knows — lit. to him/her is known)

### -वाला (Wālā) — Maximum Versatility

-वाला attaches to nouns, verbs, and adjectives:
- दूध वाला (milk person — milkman), रिक्शा वाला (rickshaw driver)
- जाने वाला हूँ (I'm about to go — about-to-go person)
- लाल वाली (the red one — f., referring to an item)

### Aspectual Distinctions

Hindi marks aspect through auxiliary verb chains:
- Simple: मैं खाता/खाती हूँ (I eat — imperfective habitual)
- Progressive: मैं खा रहा/रही हूँ (I am eating — in progress)
- Perfective: मैंने खाया/खाई (I ate — completed)
- Perfect: मैं खा चुका/चुकी हूँ (I have already eaten — completed with finality)`,
      q: 'मैंने किताब ___। How does the verb agree?',
      options: [
        'पढ़ा (masculine singular — agreeing with मैंने)',
        'पढ़ी (feminine singular — agreeing with किताब)',
        'पढ़े (masculine plural)',
        'पढ़ीं (feminine plural)',
      ],
      correct: 1,
      explanation: 'पढ़ी — with ने construction, the verb agrees with the OBJECT (किताब = book, feminine singular), not the subject (मैंने). This is the fundamental rule: in perfective transitive constructions, subject takes ने, and verb agrees with object\'s gender and number. किताब is feminine singular, so the verb is पढ़ी (f.sg.).',
    },
    de: {
      subtitle: 'Master German cases, the Konjunktiv, and word order rules',
      terms: [
        { term: 'der Konjunktiv II', definition: 'subjunctive II — for hypotheticals and polite requests (würde + inf / wäre / hätte)' },
        { term: 'der Genitiv', definition: 'genitive case — possession/of (des Mannes, der Frau)' },
        { term: 'das Partizip II', definition: 'past participle — used in Perfekt and passive (gemacht, gegangen)' },
        { term: 'Passiv', definition: 'passive voice — werden + Partizip II (Das Buch wird gelesen)' },
        { term: 'Infinitivkonstruktionen', definition: 'zu + infinitive constructions: es ist wichtig, zu lernen' },
      ],
      content: `## German Grammar Mastery

### The Four Cases — Practical Application

| Case | Function | der/die/das changes |
|------|----------|-------------------|
| Nominativ | subject | der/die/das |
| Akkusativ | direct object | den/die/das (only der → den) |
| Dativ | indirect object / after certain prepositions | dem/der/dem/den |
| Genitiv | possession / after certain prepositions | des/der/des |

**Akkusativ prepositions** (always acc): durch, für, gegen, ohne, um, bis, entlang
**Dativ prepositions** (always dat): aus, bei, mit, nach, seit, von, zu, ab, gegenüber
**Two-way prepositions** (dat = location WHERE, acc = direction WHERE TO): an, auf, in, über, unter, neben, zwischen, vor, hinter

### Konjunktiv II — For Hypotheticals and Politeness

Essential for polite speech and hypotheticals:
- Ich **hätte** gern einen Kaffee. (I would like a coffee — polite order)
- Das **wäre** schön. (That would be nice.)
- Wenn ich Zeit **hätte**, **würde** ich kommen. (If I had time, I would come.)
- Könnten Sie mir helfen? (Could you help me? — sehr höflich)

**Common forms**: wäre (were/would be), hätte (would have), könnte (could), würde (would — general)

### The Passive Voice

German passive = werden + Partizip II:
- Das Buch **wird gelesen**. (The book is being read.)
- Das Buch **wurde gelesen**. (The book was read.)
- Das Buch **ist gelesen worden**. (The book has been read.)

**Von** introduces the agent: Das Buch wurde **von ihm** gelesen.

### Word Order Rules

German verb placement is strict:
1. Main clause: verb in position 2 always: **Heute** **gehe** ich ins Kino.
2. Subordinate clause: verb goes to END: ..., weil ich **ins Kino gehe**.
3. Modal + infinitive: modal in position 2, infinitive at end: Ich **kann** heute **kommen**.
4. Perfekt: auxiliary in position 2, participle at end: Ich **bin** gestern **gegangen**.`,
      q: 'Which preposition always takes the dative case?',
      options: ['für', 'durch', 'mit', 'um'],
      correct: 2,
      explanation: '"Mit" (with) always takes the dative case: mit dem Mann (with the man), mit der Frau (with the woman). "Für" (for), "durch" (through), and "um" (around/at) always take the accusative. A key mnemonic for dative prepositions: "aus, bei, mit, nach, seit, von, zu" — these seven always govern dative.',
    },
    nl: {
      subtitle: 'Master Dutch word order, de/het distinction, and the verb system',
      terms: [
        { term: 'de vs het', definition: 'the — de (common gender) vs het (neuter); must be memorized per noun' },
        { term: 'de V2-regel', definition: 'verb-second rule: verb always in position 2 in main clauses' },
        { term: 'het werkwoord splitsen', definition: 'separable verbs: aankomen → ik kom aan (I arrive)' },
        { term: 'hebben vs zijn', definition: 'perfective auxiliary — hebben (most verbs) or zijn (motion/change)' },
        { term: 'de bijzin', definition: 'subordinate clause — verb goes to the end' },
      ],
      content: `## Dutch Grammar Mastery

### De vs Het — The Unsolvable Problem

Dutch has two definite articles: de (common gender) and het (neuter). Rules exist but have many exceptions. The safest approach: mark articles when learning new nouns.

**Patterns that help** (not rules, guidelines):
- het: all diminutives (-je endings: het meisje, het jongetje), all verb-derived nouns (het eten, het schrijven), most 2-syllable words with prefixes ge-/be-/ver-/ont-
- de: most other nouns, all plural nouns use de regardless

**Indefinite article**: een (a/an) — no gender distinction: een man, een vrouw, een kind.

### The V2 Rule — Verb Always Second

In any main clause, the finite verb is always in position 2, regardless of what starts the sentence:
- Ik **ga** morgen naar huis. (I go home tomorrow.)
- Morgen **ga** ik naar huis. (Tomorrow I go home — verb still 2nd!)
- Op maandag **werk** ik niet. (On Monday I don't work.)

### Separable Verbs

Many Dutch verbs split: prefix goes to end in main clauses:
- aankomen (to arrive): De trein **komt** om 10 uur **aan**.
- opbellen (to call): Ik **bel** je morgen **op**.
- uitmaken (to matter / to break up): Dat **maakt** niet **uit**. (That doesn't matter.)

In subordinate clauses: they rejoin — ..., omdat de trein aankomt.

### Hebben vs Zijn (Perfect Auxiliary)

- **Hebben** (most verbs): Ik heb gegeten. (I have eaten.)
- **Zijn** (motion with destination, change of state): Ik ben gegaan. (I have gone.) / Hij is gekomen. (He has come.) / Ze is gevallen. (She has fallen.)

### Subordinate Clause Word Order

Verb goes to the END: ..., omdat ik morgen **werk**. (...because I work tomorrow.)
With modals: modal goes last, infinitive just before: ..., omdat ik morgen moet **werken**.`,
      q: 'Which word order is correct for the sentence "Tomorrow I go to the store"?',
      options: ['Ik ga morgen naar de winkel.', 'Morgen ik ga naar de winkel.', 'Morgen ga ik naar de winkel.', 'Morgen naar de winkel ga ik.'],
      correct: 2,
      explanation: '"Morgen ga ik naar de winkel" — the V2 rule: when the sentence starts with an adverb (morgen = tomorrow), the subject and verb invert so the verb remains in position 2. Morgen(1) ga(2) ik(3)... If the sentence starts with the subject: "Ik ga morgen naar de winkel" (verb still position 2). Both are correct; "Morgen ik ga" is wrong because it puts the verb in position 3.',
    },
    ru: {
      subtitle: 'Master Russian case system, aspect, and subordinate clause patterns',
      terms: [
        { term: 'падежи (padeji)', definition: 'the six cases — nominative, accusative, genitive, dative, instrumental, prepositional' },
        { term: 'вид глагола', definition: 'verb aspect — imperfective (ongoing) vs perfective (completed)' },
        { term: 'который', definition: 'kotoryy — which/that (relative pronoun, declines for gender/case)' },
        { term: 'чтобы', definition: 'chtoby — in order to / so that (triggers past tense in subclause)' },
        { term: 'краткая форма', definition: 'short-form adjectives — used predicatively: он рад (he is glad)' },
      ],
      content: `## Russian Grammar Mastery

### The Six Cases — Functional Summary

| Case | Primary Function | Key Prepositions |
|------|-----------------|-----------------|
| Именительный (Nom.) | Subject | — |
| Родительный (Gen.) | Possession / "of" / negation / after числа | без, до, из, от, у |
| Дательный (Dat.) | Indirect object / experiencer | к, по |
| Винительный (Acc.) | Direct object / direction | в, на (direction) |
| Творительный (Instr.) | Instrument / with / by / professions | с, за, под, над, между |
| Предложный (Prep.) | Location / topic (о/об) | в, на (location), о/об, при |

**Key pattern**: в/на + accusative = direction (going TO); в/на + prepositional = location (being AT)
- Я иду в магазин. (I'm going TO the store.) → Accusative
- Я в магазине. (I'm AT the store.) → Prepositional

### Aspect in Complex Sentences

Aspect choice changes meaning significantly:
- Когда я **читал** книгу, он пришёл. (While I was reading, he arrived — imperfective, ongoing)
- Когда я **прочитал** книгу, он пришёл. (After I finished reading, he arrived — perfective, sequential)

### Чтобы + Past Tense for Purpose

Purpose clauses use чтобы + past tense (not a true past — it's subjunctive-like):
- Он позвонил, **чтобы** я **знал**. (He called so that I would know.)
- Я учу русский, **чтобы** **понимать** фильмы. (I study Russian to understand films — infinitive when same subject)

### Short-Form Adjectives

Adjectives in predicate position often use short forms:
- Он рад. (He is glad — short form vs радый doesn't exist as long form)
- Она готова. (She is ready), Они правы. (They are right)
- Long vs short in predicate: Он больной (he's a sick person) vs Он болен (he is sick right now)`,
      q: 'Why does "Я иду в магазин" use accusative but "Я в магазине" uses prepositional?',
      options: [
        'They are different prepositions with different case requirements',
        'В + accusative indicates direction/destination; в + prepositional indicates location/being at',
        'The first is present tense, the second is past tense',
        'Магазин has a different spelling in each case by coincidence',
      ],
      correct: 1,
      explanation: 'в/на are two-way prepositions in Russian: with accusative they indicate direction (going TO), with prepositional they indicate location (being AT). В магазин (acc.) = going to the store. В магазине (prep.) = being/located in the store. This в + acc vs в + prep contrast is fundamental to Russian preposition usage.',
    },
    ar: {
      subtitle: 'Master Arabic\'s dual, broken plurals, and the verb-subject agreement system',
      terms: [
        { term: 'المثنى (al-muthanná)', definition: 'the dual — special form for exactly two: كتابان (two books)' },
        { term: 'جمع التكسير', definition: 'broken plural — internal vowel change: كتاب → كُتُب (book → books)' },
        { term: 'الإضافة (al-iḍāfa)', definition: 'construct state — two nouns in genitive chain: كتاب الطالب (the student\'s book)' },
        { term: 'الفعل المضارع', definition: 'present/imperfect tense — يكتب (he writes/is writing)' },
        { term: 'الجملة الاسمية vs الفعلية', definition: 'nominal sentence (noun first) vs verbal sentence (verb first)' },
      ],
      content: `## Arabic Grammar Mastery

### Broken Plurals — No Shortcut

Arabic plurals don't follow a simple suffix pattern. Most use internal vowel changes (broken plurals):

**Common patterns**:
- CiCāC → CuCuC: كِتَاب (kitāb) → كُتُب (kutub), بَيْت → بُيُوت
- CaCīC → CiCāC: كَبِير (kabīr, big) → كِبَار, صَغِير → صِغَار
- CaCaC → أCCāC: رَجُل (rajul, man) → رِجَال, وَلَد → أَوْلَاد
- Feminin tā marbūṭa forms: مَدْرَسَة → مَدَارِس, سَفِينَة → سُفُن

**Sound plurals** (suffix only): masculine -ūna/-īna, feminine -āt: مُعَلِّمُون (male teachers), مُعَلِّمَات (female teachers)

### The Iḍāfa Construction

Two nouns in construct: first noun (mudāf) is INDEFINITE (no article), second (mudāf ilayhi) is genitive:
- كِتَابُ الطَّالِبِ (the student's book — lit. book-of the-student)
- بَيْتُ أُسْتَاذِنَا (our professor's house)
- First noun loses definite article but gets definiteness FROM the second

### Verb-Subject Agreement

Arabic verbs agree with subject in person, gender, number — but when verb PRECEDES subject, only singular agreement:
- Verb-first: **جَاءَ** الطُلَّابُ. (The students came — singular jāʾa even with plural subject)
- Subject-first: الطُلَّابُ **جَاءُوا**. (The students came — full plural agreement)

### Dual Formation

Dual (exactly two) adds -āni (nom.) or -ayni (acc./gen.):
- كِتَابٌ → كِتَابَانِ (two books — nom.) / كِتَابَيْنِ (acc./gen.)
- بِنْتٌ → بِنْتَانِ (two girls), يَوْمٌ → يَوْمَانِ (two days)
- Most duals in spoken Arabic have been replaced by the number + singular`,
      q: 'In the iḍāfa كتاب الطالب, why does كتاب have no article?',
      options: [
        'It is indefinite — meaning "a student\'s book" not "the student\'s book"',
        'The first noun in iḍāfa never takes the definite article; it gets definiteness from the second noun',
        'كتاب is always written without the article in Modern Standard Arabic',
        'It is in the genitive case which removes the article',
      ],
      correct: 1,
      explanation: 'In the iḍāfa (construct state), the first noun (mudāf) NEVER takes the definite article — even though the phrase is definite if the second noun is definite. Definiteness "passes" from the second noun through the construction: كتاب الطالب = THE student\'s book (definite, because الطالب is definite), but كتاب has no ال. Adding ال to the first noun is a grammar error.',
    },
    sw: {
      subtitle: 'Master Swahili\'s agreement system, tense markers, and relative clauses',
      terms: [
        { term: 'upatano (agreement)', definition: 'noun class agreement — every adjective/verb/relative must agree with its noun\'s class' },
        { term: 'kiambishi awali', definition: 'prefix — the agreement prefix that changes with noun class' },
        { term: '-a- vs -li- vs -ta-', definition: 'present / past / future tense markers in Swahili verbs' },
        { term: 'vivumishi (adjectives)', definition: 'Swahili adjectives take the noun class prefix: mtu mzuri, watu wazuri' },
        { term: 'ngeli (noun class)', definition: 'the grammatical class of a Swahili noun, which determines all agreement' },
      ],
      content: `## Swahili Grammar Mastery

### The Agreement System — Everything Agrees

In Swahili, everything agrees with the noun class. This is the central grammar fact:

**M-/Wa- class (people)**:
- mtu **mzuri** (a good person), watu **wazuri** (good people)
- mtu **anakuja** (the person is coming), watu **wanakuja** (the people are coming)

**Ki-/Vi- class (things/languages)**:
- kitu **kizuri** (a good thing), vitu **vizuri** (good things)
- kitu **kinakuja** — kinaenda — kilikwenda (thing is coming — is going — went)

**M-/Mi- class (trees)**:
- mti **mzuri** (a beautiful tree), miti **mizuri** (beautiful trees)

The prefix changes throughout: adjective, verb subject marker, relative marker, object marker — all reflect the noun class.

### Tense Marker System

Swahili marks tense with infixes:
- **-a-** (present/general): Ninakula. (I am eating / I eat.)
- **-li-** (past): Nilikula. (I ate.)
- **-ta-** (future): Nitakula. (I will eat.)
- **-me-** (perfect/current relevance): Nimekula. (I have eaten — still full.)
- **-ja-** (negative perfect): Sijala. (I haven't eaten yet.)
- **-ki-** (conditional/while): Nikila, ninaona vizuri. (While eating, I see well.)

### Relative Clauses

Swahili relative clauses use a relative infix that agrees with the noun class:
- mtu **anayekuja** (the person who is coming — M class: -anaye-)
- kitu **kinachokuja** (the thing that is coming — Ki class: -kinacho-)
- watu **wanaokuja** (the people who are coming — Wa class: -wanao-)

### Negation Patterns

Negation prefixes change with tense and class:
- Present: **Si**nakula (I don't eat — si- replaces ni-)
- Past: **Haku**la / **Hani**kula (didn't eat)
- Perfect: **Sija**kula (haven't eaten yet — -ja- = negative perfect)`,
      q: 'How does the adjective "good" (-zuri) change between mtu (person) and kitu (thing)?',
      options: [
        'It stays the same: mtu zuri, kitu zuri',
        'Mtu mzuri, kitu kizuri — the prefix changes to match the noun class',
        'Mtu mzuri, kitu vizuri — only plural changes',
        'Adjectives never change in Swahili',
      ],
      correct: 1,
      explanation: 'Swahili adjectives take an agreement prefix matching the noun\'s class: M-/Wa- class → m-/w- prefix (mtu mzuri, watu wazuri), Ki-/Vi- class → ki-/vi- prefix (kitu kizuri, vitu vizuri), M-/Mi- class → m-/mi- prefix (mti mzuri, miti mizuri). Every adjective, every verb subject marker, every relative marker adjusts to the noun\'s class. This agreement system is the core of Swahili grammar.',
    },
    ht: {
      subtitle: 'Master Haitian Creole\'s clean grammar: tense markers, the -an suffix, and complex constructions',
      terms: [
        { term: 'pou + verb', definition: 'subjunctive-like: pou mwen ale (for me to go / so that I go)' },
        { term: '-an suffix (nan/lan)', definition: 'definite article suffix: kay la, moun nan — position after noun' },
        { term: 'se...ki/ke', definition: 'cleft sentence focus: Se mwen ki fè sa (It is I who did it)' },
        { term: 'genyen/gen', definition: 'to have / there is (gen in speech): Gen dlo? (Is there water?)' },
        { term: 'fòk / dwe', definition: 'must / should: Fòk ou ale (you must go), Ou dwe etidye (you should study)' },
      ],
      content: `## Haitian Creole Grammar Mastery

### The Tense System — Clean and Regular

Unlike French, Creole has NO conjugation. Six tense/aspect markers:

| Marker | Tense | Example |
|--------|-------|---------|
| (none) | habitual/general | Mwen manje poul. (I eat chicken.) |
| ap | progressive | Mwen ap manje. (I am eating.) |
| te | past | Mwen te manje. (I ate.) |
| pral | near future | Mwen pral manje. (I'm going to eat.) |
| ta | conditional | Mwen ta manje. (I would eat.) |
| te ap | past progressive | Mwen te ap manje. (I was eating.) |
| te pral | past future | Mwen te pral manje. (I was going to eat.) |

### Definite Article — Post-Nominal

Definite articles follow the noun (unique in the region):
- **la** after most consonants and vowels: liv **la** (the book), tab **la** (the table)
- **lan** after n/m/ng: moun **nan** (the person), chen **nan** (the dog)
- **an** after nasal consonants: moun **an** (alternate)
- **yo** for definite plural: liv **yo** (the books), moun **yo** (the people)

Indefinite: yon before noun: yon liv (a book), yon moun (a person)

### Pou — The Subjunctive-Like Construction

Pou + pronoun + verb expresses purpose, requirement, or subjunctive-like meaning:
- Li vle **pou mwen ale**. (He wants me to go — lit. he wants for me to go)
- **Pou** ou konprann, ou dwe pratike. (For you to understand, you must practice.)
- **Fòk** ou ale. (You must go — obligation)

### Se...ki/ke — Cleft Sentences for Focus

Creole frequently uses cleft constructions for emphasis:
- Se **mwen** ki fè sa. (It's ME who did that.)
- Se **jodi a** ke li vini. (It's TODAY that he's coming.)
- Se **pou ou** mwen travay. (It's FOR YOU that I work.)

### Genyen (Gen in Speech) — To Have / There Is

Genyen (gen in spoken Creole) covers both "to have" and "there is/are":
- Mwen gen yon liv. (I have a book.)
- Gen dlo? (Is there water? — Gen or Genyen?)
- Pa gen pwoblèm. (No problem — there is no problem.)`,
      q: 'How do you say "I was eating" (past progressive) in Haitian Creole?',
      options: ['Mwen te manje', 'Mwen ap manje', 'Mwen te ap manje', 'Mwen pral te manje'],
      correct: 2,
      explanation: '"Mwen te ap manje" — past progressive combines te (past marker) + ap (progressive marker). The combination te + ap creates past progressive: "I was eating." Separately: "mwen te manje" = I ate (simple past), "mwen ap manje" = I am eating (present progressive). Haitian Creole\'s tense system stacks markers cleanly and regularly.',
    },
  }

  const d = data[lang.code]
  return {
    id: `lang-${lang.code}-grammar`,
    track: 'language',
    title: `${lang.name}: Grammar Mastery`,
    subtitle: d.subtitle,
    level: 'Masters',
    xp: 400,
    duration: 60,
    module,
    content: d.content,
    keyTerms: d.terms,
    quiz: [{
      q: d.q,
      options: d.options,
      correct: d.correct,
      explanation: d.explanation,
    }],
    certArea: `${lang.name} Grammar`,
    courseObjective: `Master the grammatical structures that define B1/B2 proficiency in ${lang.name}`,
    moduleObjective: `Apply complex tense, mood, and agreement rules accurately in context`,
  }
}

function buildAdvancedMasteryModule(lang: LangEntry, module: number): Course {
  const data: Record<string, {
    subtitle: string; content: string; terms: { term: string; definition: string }[];
    q: string; options: string[]; correct: number; explanation: string
  }> = {
    es: {
      subtitle: 'Reach C1/C2 Spanish through register, style, and discourse-level command',
      terms: [
        { term: 'no obstante', definition: 'however / nevertheless (formal written)' },
        { term: 'si bien', definition: 'although / even though (formal concession)' },
        { term: 'cabe destacar', definition: 'it is worth highlighting (academic register)' },
        { term: 'a efectos de', definition: 'for the purposes of (legal/administrative)' },
        { term: 'según lo estipulado', definition: 'as stipulated (contractual/legal language)' },
      ],
      content: `## Advanced Spanish: C1/C2 Mastery

### Register and Style

C1/C2 Spanish means controlling multiple registers:

**Formal written** (academic, legal, journalistic):
- No obstante, cabe señalar que... (However, it should be noted that...)
- A tenor de los datos disponibles... (In light of the available data...)
- En virtud de lo anterior... (By virtue of the above...)
- Se pone de manifiesto que... (It becomes clear that...)

**Spoken formal** (presentations, professional):
- En lo que respecta a... (With regard to...)
- Quisiera hacer hincapié en... (I would like to emphasize...)

**Colloquial/regional variation**:
- Spain: tío/tía, mola, guay, vale, es que...
- Mexico: güey/wey, chido, órale, ándale
- Argentina: che, boludo, copado, boludo

### Complex Sentence Structures

**Concessive clauses** (B2/C1):
- Aunque + subjunctive (uncertainty/hypothesis): Aunque **venga**, no le abriré.
- Aunque + indicative (known fact, conceding): Aunque **viene**, no le abriré.
- A pesar de (que) + subjunctive/indicative
- Por más que + subjunctive: Por más que lo **intente**, no lo logrará.
- Si bien (formal written): Si bien es cierto que...

**Conditional perfects**:
- Si lo **hubiera sabido**, lo **habría** hecho diferente.
- De **haberlo** sabido... (formal alternative to si + pluperfect)

### Aspectual Nuances in Past Tenses

At C1, the contrast goes deeper:
- Preterite interrupts imperfect: Leía cuando **sonó** el teléfono.
- Preterite sequence: **Llegué**, **comí**, **salí**.
- Imperfect for diplomatic past: ¿Qué **quería**? (What did you want? — softer than ¿qué quiere?)

### Nominalizations — Academic Language

Spanish academic writing relies on nominalized verbs:
- desarrollar → el desarrollo (development)
- implementar → la implementación (implementation)
- establecer → el establecimiento (establishment)
Prefer: "El desarrollo de nuevas tecnologías..." over "Desarrollar nuevas tecnologías..."`,
      q: 'What is the difference between "aunque venga" and "aunque viene"?',
      options: [
        'No difference — both are equally correct',
        '"Aunque venga" (subjunctive) = hypothetical/uncertain; "aunque viene" (indicative) = known fact being conceded',
        '"Aunque venga" is past, "aunque viene" is present',
        '"Aunque venga" is formal, "aunque viene" is informal',
      ],
      correct: 1,
      explanation: 'Aunque + subjunctive signals uncertainty or hypothesis about the conceded fact: "aunque venga" = even if he comes (uncertain if he will). Aunque + indicative concedes a known fact: "aunque viene" = even though he is coming (it\'s established that he comes). This distinction is a key C1 marker — choosing the wrong mood changes the meaning significantly.',
    },
    fr: {
      subtitle: 'Achieve C1/C2 French with formal registers, nuanced conditionals, and discourse markers',
      terms: [
        { term: 'certes', definition: 'certainly / admittedly (formal concession opener)' },
        { term: 'nonobstant', definition: 'notwithstanding (legal/formal — equivalent of nonobstant)' },
        { term: 'il convient de', definition: 'it is appropriate to / one should (formal register)' },
        { term: 'en l\'occurrence', definition: 'in this case / as it happens' },
        { term: 'quoique', definition: 'although / even though (always + subjunctive)' },
      ],
      content: `## Advanced French: C1/C2 Mastery

### Formal and Academic Registers

French formal writing has distinctive markers:

**Discourse organizers**:
- Certes, ... cependant / néanmoins (Admittedly, ... however/nonetheless)
- D'une part... d'autre part... (On one hand... on the other hand...)
- Force est de constater que... (One must acknowledge that...)
- Il y a lieu de se demander si... (One must wonder whether...)
- À cet égard (In this regard), à ce titre (in this capacity/respect)

**Hedging and academic stance**:
- Il semblerait que + subjonctif (It would seem that...)
- On pourrait arguer que... (One could argue that...)
- Il convient de nuancer... (One must nuance / It is appropriate to qualify...)

### The Subjonctif Passé

Past subjunctive for completed actions in subj. contexts:
- Bien qu'il **soit parti** tôt... (Although he had left early...)
- Je regrette qu'elle n'**ait pas pu** venir. (I regret that she couldn't come.)

### Conditional and Past Conditional in Journalism

Journalistic use of conditional = alleged/unverified information:
- Le président **serait** malade. (The president is reportedly ill — not confirmed)
- Les négociations **auraient** repris. (Negotiations would have reportedly resumed.)
This "conditionnel journalistique" is essential for reading French news.

### Le Style Indirect Libre

A literary technique: third-person narration slips into character's thoughts without quotation marks:
- Elle parti sans rien dire. Que faire? Son mari ne comprendrait jamais.
(The final two sentences are in the character's consciousness — no "she thought that")`,
      q: 'A French news article says "Le suspect serait à l\'étranger." What does this imply?',
      options: [
        'The suspect will definitely be abroad',
        'The information is alleged or unverified — the conditional signals non-confirmation',
        'The suspect would like to be abroad',
        'This is past tense — the suspect was abroad',
      ],
      correct: 1,
      explanation: 'French journalism uses the conditional tense to signal unverified or alleged information. "Le suspect serait à l\'étranger" = "The suspect is reportedly/allegedly abroad" — the journalist cannot confirm it as fact. This "conditionnel journalistique" is distinct from the hypothetical conditional. Reading French news without knowing this convention leads to misunderstanding the certainty level of reported facts.',
    },
    pt: {
      subtitle: 'Master Brazilian Portuguese register, mesóclise, and advanced tense usage',
      terms: [
        { term: 'mesóclise', definition: 'object pronoun inserted into future/conditional verb: dar-me-á' },
        { term: 'de forma que', definition: 'so that / in such a way that' },
        { term: 'conquanto', definition: 'although / even though (formal subjunctive trigger)' },
        { term: 'porquanto', definition: 'because / inasmuch as (formal causal)' },
        { term: 'outrossim', definition: 'furthermore / moreover (legal/formal)' },
      ],
      content: `## Advanced Portuguese: C1/C2 Mastery

### Mesóclise — The Literary Pronoun Position

In formal written Portuguese (especially European), when a sentence begins with the verb in future or conditional, the object pronoun is inserted INTO the verb:
- Dar-**me**-á os documentos. (He will give me the documents — formal EP)
- Tratar-**se**-ia de um erro. (It would be a matter of an error — formal)

In Brazilian Portuguese, mesóclise is now archaic in speech; Brazilians use proclisis: Me dará, Me daria.
European Portuguese still uses mesóclise in formal writing and official documents.

### The Inflected Infinitive at C1 Level

The personal (inflected) infinitive signals sophisticated usage:
- É necessário **lermos** os documentos antes de assinarmos. (We need to read the documents before signing.)
- A possibilidade de **serem** aprovadas as propostas... (The possibility of the proposals being approved...)
- Para **melhorarmos** o sistema, precisamos de dados. (For us to improve the system, we need data.)

### Distinguishing Formal Registers

**Legal/contractual Portuguese** (Português Jurídico):
- O ora presente (the present party)
- nos termos do disposto (under the terms of the provision)
- sem prejuízo do exposto (without prejudice to the above)
- ex-vi do artigo (by virtue of the article)

**Academic Portuguese**:
- No que diz respeito a... (Regarding...)
- Cumpre assinalar que... (It should be noted that...)
- Depreende-se que... (One can infer that / It follows that...)

### Future Subjunctive in High Register

While present in everyday speech, the future subjunctive becomes essential in formal/legal writing:
- Quem **tiver** interesse, pode candidatar-se. (Whoever has interest may apply.)
- Quando **for** possível, informe-nos. (When it is possible, inform us.)
- Desde que **seja** aprovado... (As long as it is approved...)`,
      q: 'What is mesóclise and when is it used?',
      options: [
        'A Brazilian slang term for mixing Portuguese and English',
        'Inserting an object pronoun into a future or conditional verb form — formal written Portuguese',
        'The European Portuguese name for the subjunctive mood',
        'A punctuation rule in Portuguese legal documents',
      ],
      correct: 1,
      explanation: 'Mesóclise is the insertion of an object pronoun between a verb stem and its future (-ei/-ás/-á) or conditional (-ia/-ias) ending: dar-me-á (he will give me), fazer-lhe-ia (he would do for him/her). It occurs when the verb begins a sentence (European rule: no proclisis at sentence start). Now archaic in Brazilian speech but essential in European formal writing.',
    },
    it: {
      subtitle: 'Achieve C1/C2 Italian with literary tenses, complex clause types, and stylistic register',
      terms: [
        { term: 'il congiuntivo imperfetto', definition: 'imperfect subjunctive — se fossi ricco (if I were rich)' },
        { term: 'il trapassato prossimo', definition: 'pluperfect — avevo fatto (I had done)' },
        { term: 'il congiuntivo trapassato', definition: 'pluperfect subjunctive — se avessi saputo (if I had known)' },
        { term: 'pur + gerundio', definition: 'although/while (V-ing): pur sapendolo, non disse niente' },
        { term: 'laddove', definition: 'where / whereas / in cases where (formal written)' },
      ],
      content: `## Advanced Italian: C1/C2 Mastery

### The Full Conditional System

Italian hypotheticals follow a rigid four-type pattern:

**Type 1 — Possible/likely (reality)**:
Se **vieni**, **vengo** anch'io. (If you come, I'll come too — present/future)

**Type 2 — Unlikely/hypothetical present**:
Se **venissi**, **verrei** anch'io. (If you came, I would come too — imperfect subj./conditional)

**Type 3 — Impossible past**:
Se **fossi venuto**, **sarei venuto** anch'io. (If you had come, I would have come too — pluperfect subj./conditional perfect)

**Mixed type** (C1 marker — past cause, present consequence):
Se **fossi venuto** ieri, **sarei** qui adesso. (If you had come yesterday, you would be here now.)

### Congiuntivo Imperfetto — Literary Register

The imperfect subjunctive is essential in literary/formal Italian:
- Benché **fosse** tardi, continuò a lavorare. (Although it was late, he kept working.)
- Credevo che **venisse**. (I thought he was coming — past belief about present)
- Come se **sapesse** tutto. (As if he knew everything.)

### Pur + Gerundio — Concessive Gerund

A sophisticated construction expressing "although/while doing":
- **Pur capendo** il problema, non so come risolverlo. (Although I understand the problem, I don't know how to solve it.)
- **Pur non sapendo** l'italiano, si arrangiò. (Even without knowing Italian, he managed.)

### Literary and Journalistic Registers

**Journalistic Italian**:
- stando a quanto riportato (according to reports)
- sarebbero stati fermati (they are reported to have been stopped — conditional for unverified)
- fonti vicine a... (sources close to...)

**Academic**:
- È d'uopo rilevare che... (It is necessary to note that... — very formal)
- A tal proposito (In this regard), al riguardo (regarding this)`,
      q: 'Which hypothesis type does "Se fossi venuto ieri, saresti qui adesso" belong to?',
      options: [
        'Type 1 — possible/real condition',
        'Type 2 — unlikely present condition',
        'Type 3 — impossible past condition',
        'Mixed type — past cause with present consequence',
      ],
      correct: 3,
      explanation: 'This is a mixed conditional: "Se fossi venuto ieri" (if you had come yesterday) = past condition with pluperfect subjunctive (Type 3 past), but "saresti qui adesso" (you would be here now) = present consequence with present conditional (Type 2 present result). Mixing the two clause types is a C1/C2 marker because it requires understanding that the cause was in the past while the consequence is felt in the present.',
    },
    zh: {
      subtitle: 'Achieve C1/C2 Chinese with formal registers, chengyu, and written vs spoken distinction',
      terms: [
        { term: '成语 (chéngyǔ)', definition: '4-character idioms from classical Chinese — essential for educated writing' },
        { term: '书面语 (shūmiànyǔ)', definition: 'written language — formal register with distinct vocabulary from spoken' },
        { term: '口语 (kǒuyǔ)', definition: 'spoken language — colloquial register' },
        { term: '文言文 (wényánwén)', definition: 'classical Chinese — source of chengyu and formal expressions' },
        { term: '约定俗成', definition: 'yuēdìng-súchéng: established by convention (chengyu example)' },
      ],
      content: `## Advanced Chinese: C1/C2 Mastery

### Chengyu (成语) — The Cultural Literacy Markers

Four-character classical Chinese idioms are everywhere in formal speech and writing. Each has a classical story origin:

**Commonly used chengyu**:
- 半途而废 (bàntú érfèi) — give up halfway (lit. half-road-and-abandon)
- 自相矛盾 (zìxiāng máodùn) — self-contradictory (from the spear-shield paradox story)
- 马到成功 (mǎ dào chénggōng) — instant success (lit. horse arrives, success achieved — auspicious)
- 一石二鸟 (yī shí èr niǎo) — kill two birds with one stone
- 画蛇添足 (huà shé tiān zú) — add feet to a snake (do something unnecessary and ruin it)
- 叶公好龙 (yègōng hào lóng) — like dragons in theory but not in practice (inauthentic enthusiasm)

### Written vs Spoken Register

Formal written Chinese (书面语) differs significantly from speech:

| Spoken (口语) | Written (书面语) |
|--------------|---------------|
| 但是 (but) | 然而 / 然则 |
| 因为...所以 (because...so) | 由于...因此/故 |
| 很多 (many/much) | 诸多 / 大量 |
| 说 (say) | 表示 / 指出 / 强调 |
| 用 (use) | 运用 / 采用 / 利用 |
| 知道 (know) | 了解 / 掌握 / 认识到 |

### Classical Grammar in Modern Written Chinese

Some classical structures persist in formal writing:
- 其 (qí) for 他的/她的: 其后果不堪设想 (The consequences are unimaginable.)
- 乃 (nǎi) for 是/才: 此乃当务之急 (This is the urgent matter at hand.)
- 之 (zhī) for 的: 历史之重要性 (The importance of history — written)
- 于 (yú) for 在/对/从: 有益于社会 (Beneficial to society)

### The Four-Character Pattern

Chinese formal writing strongly favors four-character phrases (四字格):
- Instead of 这个问题很重要, formal: 此问题至关重要
- Instead of 我们要努力, formal: 我们应当竭尽全力`,
      q: 'What does 画蛇添足 mean, and when would you use it?',
      options: [
        'To paint a beautiful picture; used as a compliment',
        'To do something unnecessary that ruins the result; used when someone over-elaborates or adds pointless extras',
        'To complete a difficult task; used for encouragement',
        'To make a snake harmless; used for defusing tense situations',
      ],
      correct: 1,
      explanation: '画蛇添足 (lit. "draw a snake add feet") comes from a story where people competed to draw a snake, and the winner, having time left, added feet — disqualifying himself because snakes have no feet. It means "to do something unnecessary that ruins a good result" or "to add superfluous details." Use it when someone over-explains, adds unnecessary steps, or elaborates beyond what is needed.',
    },
    ja: {
      subtitle: 'Achieve C1/C2 Japanese with literary grammar, keigo mastery, and written register',
      terms: [
        { term: '〜ものの', definition: 'although/even though (written: 努力したものの、成功しなかった)' },
        { term: '〜にすぎない', definition: 'nothing more than / merely (それは推測にすぎない)' },
        { term: '〜をめぐって', definition: 'concerning/surrounding (問題をめぐる議論)' },
        { term: '四字熟語', definition: 'four-character compounds (similar function to Chinese chengyu)' },
        { term: '候文 (そうろうぶん)', definition: 'classical epistolary style — seen in formal correspondence' },
      ],
      content: `## Advanced Japanese: C1/C2 Mastery

### Written Language vs Spoken Language

Japanese has a significant written-spoken divide:

**Written formal markers**:
- ある (aru) instead of いる for humans (very formal/literary)
- であります instead of です/ます (highly formal — military/bureaucratic origin)
- 〜を〇〇と呼ぶ instead of 〜と言う (to call X "Y" — written style)

**Classical grammar still in use**:
- 〜ず (classical negative): 知らず知らずのうちに (without knowing)
- 〜べき (should/must): 忘れるべからず (must not forget — classical imperative)
- 〜こそ (emphatic particle): 今こそ行動すべき時だ (Now is precisely the time to act)

### Complex Connectives at C1/C2

**Concessive**:
- 〜ものの: 努力したものの、結果は出なかった (Although I tried hard, the results didn't come.)
- 〜にもかかわらず: 反対にもかかわらず、実施された (Despite opposition, it was implemented.)
- 〜とはいえ: 専門家とはいえ、間違える (Even being an expert, one makes mistakes.)

**Conditional/provisional**:
- 〜ならば (formal たら/なら): 可能ならば、ご連絡ください
- 〜とすれば: 彼が正しいとすれば、私が間違っている (If he is right, then I am wrong)

### Four-Character Compounds (四字熟語)

Like Chinese chengyu, Japanese 四字熟語:
- 一石二鳥 (いっせきにちょう) — kill two birds with one stone (borrowed from Chinese)
- 以心伝心 (いしんでんしん) — telepathy/heart-to-heart communication
- 七転八起 (ななころびやおき) — fall seven times, rise eight (perseverance)
- 臨機応変 (りんきおうへん) — adapt to circumstances flexibly

### Humble/Honorific Mastery

Full keigo system at C1:
- Offering: ご説明いたします / 申し上げます
- Asking: ご確認いただけますでしょうか (Could I ask you to confirm...)
- Receiving: いただきます / ちょうだいします
- Giving (to superior): 差し上げます`,
      q: 'What does 〜ものの add to a sentence compared to 〜けれども?',
      options: [
        'They are identical in meaning and usage',
        '〜ものの is more formal/literary and specifically concedes a point before noting a contrasting or disappointing result',
        '〜ものの is only used in questions',
        '〜ものの is stronger — it completely contradicts the first clause',
      ],
      correct: 1,
      explanation: '〜ものの is a formal/literary concessive that acknowledges the first clause but signals that the expected or hoped-for result didn\'t follow: "努力したものの、成功しなかった" (Although I made effort, I didn\'t succeed — the effort is acknowledged, but the expected positive result is denied). 〜けれども is the more casual and general "but/although." 〜ものの specifically carries a nuance of concession + disappointed expectation.',
    },
    ko: {
      subtitle: 'Achieve C1/C2 Korean with formal registers, complex grammar, and written language patterns',
      terms: [
        { term: '-(으)ㄹ수록', definition: 'the more X, the more Y: 많이 먹을수록 건강해진다' },
        { term: '-는 반면에', definition: 'on the other hand / whereas (contrast connector)' },
        { term: '-(으)ㄹ 뿐만 아니라', definition: 'not only... but also' },
        { term: '존댓말 완전체', definition: 'full honorific system — haeyoche, haeyoche, formal formal levels' },
        { term: '-다고 볼 수 있다', definition: 'it can be seen/said that — academic hedging' },
      ],
      content: `## Advanced Korean: C1/C2 Mastery

### Written vs Spoken Register

Korean has a significant written-spoken divide:

**Written formal (문어체)**:
- Sentence endings: -다/ㄴ다 (plain form — used in newspapers, books)
- 하다 verbs: 나타낸다, 이루어진다 (present plain form)
- Connectives: 따라서 (therefore), 그러나 (however — formal version of 그런데), 반면에 (on the other hand)
- Hedging: -다고 볼 수 있다 (it can be viewed as), -다고 할 수 있다 (one can say)

**Spoken formal (구어체)**:
- Sentence endings: -어요/-습니다
- Connectives: 그래서 (so), 근데 (but), 아니면 (or)

### Complex Grammar Patterns

**-(으)ㄹ수록** — "the more X, the more Y":
- 한국어를 공부할수록 재미있어진다. (The more you study Korean, the more interesting it becomes.)
- 갈수록 어려워진다. (It gets harder as it goes / the further you go, the harder it becomes.)

**-는 반면에** — "whereas / on the other hand":
- 북쪽은 추운 반면에 남쪽은 따뜻하다. (While the north is cold, the south is warm.)

**-(으)ㄹ 뿐만 아니라** — "not only X but also Y":
- 한국어를 잘할 뿐만 아니라 중국어도 유창하다. (Not only is he good at Korean, but also fluent in Chinese.)

### Four Speech Levels in Practice

Korean's speech levels from informal to formal:
1. 해체 (haeyoche) — casual between friends: 먹어? 가?
2. 해요체 (haeyoche formal) — polite everyday: 먹어요, 가요
3. 합쇼체 (hapssyo) — formal/professional: 먹습니까, 갑니다
4. 하게체 / 하오체 — archaic/literary (found in classic texts)

Written journalism uses 한다체 (simple declarative plain form):
- 한국 경제가 성장하고 있다. (The Korean economy is growing.)`,
      q: 'Which ending would appear in a Korean newspaper article about economic growth?',
      options: ['경제가 성장하고 있어요 (polite form)', '경제가 성장하고 있다 (plain written form)', '경제가 성장하고 있지 (casual form)', '경제가 성장하고 있습니다 (formal speech form)'],
      correct: 1,
      explanation: 'Korean journalism and formal writing use the 한다체 (plain declarative form ending in -다): "경제가 성장하고 있다." This is neither the polite everyday form (-어요) nor the formal speech form (-습니다) — it\'s a distinct written register used in newspapers, academic writing, and books. Understanding this register is essential for reading Korean media.',
    },
    hi: {
      subtitle: 'Achieve C1/C2 Hindi with formal registers, classical influence, and complex constructions',
      terms: [
        { term: 'चाहे...चाहे', definition: 'whether...or: चाहे बारिश हो चाहे धूप (whether rain or shine)' },
        { term: 'मानो', definition: 'as if / as though: वो मानो सो रहा हो (as if he were sleeping)' },
        { term: 'के बावजूद', definition: 'despite / in spite of (formal concessive)' },
        { term: 'तत्सम शब्द', definition: 'Sanskrit-derived formal vocabulary (vs तद्भव colloquial forms)' },
        { term: 'यथासंभव', definition: 'as far as possible / to the extent possible (formal compound)' },
      ],
      content: `## Advanced Hindi: C1/C2 Mastery

### Sanskrit Register vs Colloquial

Formal Hindi draws heavily on Sanskrit (तत्सम words), while colloquial uses simplified forms:

| Formal/Written | Colloquial | Meaning |
|----------------|-----------|---------|
| स्वास्थ्य | सेहत | health |
| विद्यालय | स्कूल | school |
| अध्यापक | टीचर / मास्टर | teacher |
| पुस्तक | किताब | book |
| कार्यालय | ऑफिस | office |
| अतिथि | मेहमान | guest |
| प्रसन्न | खुश | happy |

Formal speeches, news, and official documents use the Sanskrit register. Spoken Hindi uses the Persian/Arabic/English-derived forms.

### Complex Concessive Constructions

**चाहे...चाहे** (whether...or):
- चाहे बारिश हो, चाहे धूप, मैं जाऊँगा। (Whether it rains or shines, I'll go.)
- चाहे कोई माने या न माने... (Whether anyone believes it or not...)

**के बावजूद** (despite):
- मुश्किलों के बावजूद, उन्होंने हार नहीं मानी। (Despite difficulties, they didn't give up.)

**मानो** (as if — triggers subjunctive-like form):
- वो बोल रहा था मानो सब कुछ जानता **हो**। (He was speaking as if he knew everything.)

### Formal Written Hindi Connectives

- इसलिए / अतः (therefore — इसलिए spoken, अतः formal written)
- परंतु / किंतु (but — formal written; vs लेकिन in speech)
- तथापि (nevertheless/yet — very formal)
- यद्यपि...तथापि (although...yet — formal paired connective)
- फलतः / परिणामस्वरूप (as a result / consequently — formal)

### Compound Verbs at C1

Hindi compound verbs convey aspect and completion:
- खा लेना (eat up — completion for self): मैंने खाना खा लिया।
- खा देना (eat on behalf/for other): उसने बच्चे को खाना खिला दिया।
- खा जाना (eat up — often regrettably): उसने सब खाना खा गया।`,
      q: 'In formal Hindi, which word would replace "लेकिन" (but)?',
      options: ['और', 'परंतु / किंतु', 'इसलिए', 'यानी'],
      correct: 1,
      explanation: '"परंतु" or "किंतु" are the formal/written equivalents of spoken "लेकिन" (but). This distinction reflects Hindi\'s diglossia: formal/written Hindi uses Sanskrit-derived words while spoken Hindi uses Persian/Arabic-derived or colloquial forms. Similarly, formal "अतः" replaces spoken "इसलिए" (therefore), and "तथापि" replaces "फिर भी" (nevertheless).',
    },
    de: {
      subtitle: 'Achieve C1/C2 German with Konjunktiv I, complex subordination, and written register',
      terms: [
        { term: 'der Konjunktiv I', definition: 'subjunctive I — indirect speech: Er sagte, er sei krank' },
        { term: 'das Zustandspassiv', definition: 'statal passive: Das Fenster ist geöffnet (state, not action)' },
        { term: 'Genitivkonstruktionen', definition: 'genitive chains: die Lösung des Problems der steigenden Preise' },
        { term: 'die Nominalisierung', definition: 'nominalization — turning verbs into nouns for formal style' },
        { term: 'Konzessivsatz', definition: 'concessive clause: obwohl / wenngleich / auch wenn / selbst wenn' },
      ],
      content: `## Advanced German: C1/C2 Mastery

### Konjunktiv I — Indirect Speech

Konjunktiv I (not II) is used in formal/journalistic indirect speech:
- Direct: Er sagt: "Ich bin krank." → Indirect: Er sagt, er **sei** krank.
- Sie berichtete, das Experiment **habe** Erfolg gehabt.
- Dem Bericht zufolge **seien** die Verhandlungen gescheitert.

Formation: er sei (be), er habe (have), er werde (become) — from present stems.
When Konj. I = indicative, use Konj. II instead: er sagt, er **käme** (not komme, as komme = indicative).

### Zustands vs Vorgangspassiv

Two passive types in German:
- **Vorgangspassiv** (action): Das Fenster **wird geöffnet**. (The window is being opened — process)
- **Zustandspassiv** (result/state): Das Fenster **ist geöffnet**. (The window is open — resulting state)

### Nominalization — Formal Written Style

German academic and business writing relies heavily on nominalized verbs (similar to Spanish):
- verbessern → die Verbesserung (improvement)
- scheitern → das Scheitern (the failing)
- gelingen → das Gelingen (success)

Prefer: "Die Verbesserung der Effizienz..." over "Wenn die Effizienz verbessert wird..."

### Concessive Clause Variations

Each has slightly different nuance:
- **obwohl** (although — most common, any register)
- **wenngleich / obgleich** (although — formal/written)
- **auch wenn** (even if — allows hypothetical)
- **selbst wenn** (even if — stronger concession: even in the most extreme case)
- **trotzdem** (nevertheless — main clause connector, not subordinating)

### Genitive Chains

German formal writing allows complex genitive stacking:
- die Kosten der Sanierung des Gebäudes (the costs of the renovation of the building)
- im Rahmen der Umsetzung der neuen Strategie (in the context of the implementation of the new strategy)`,
      q: 'What is the difference between "Konjunktiv I" and "Konjunktiv II" in German?',
      options: [
        'Konjunktiv I is past, Konjunktiv II is present',
        'Konjunktiv I is for indirect speech reporting; Konjunktiv II is for hypotheticals and polite requests',
        'Konjunktiv I is spoken, Konjunktiv II is written',
        'They are interchangeable — regional variants of the same mood',
      ],
      correct: 1,
      explanation: 'Konjunktiv I is specifically for reporting what someone said without endorsing it (indirect speech): "Er sagte, er sei krank" = He said he was/is sick (I\'m just reporting, not confirming). Konjunktiv II is for hypotheticals, wishes, and polite requests: "Wenn ich Zeit hätte, würde ich kommen" (If I had time I would come). Both are subjunctive moods but serve completely different functions.',
    },
    nl: {
      subtitle: 'Achieve C1/C2 Dutch with formal register, indirect speech, and complex subordination',
      terms: [
        { term: 'de onvoltooid tegenwoordige tijd conjunctief', definition: 'Dutch subjunctive — rare but used in fixed phrases: leve de koning!' },
        { term: 'nominalisering', definition: 'nominalization — het verbeteren → de verbetering' },
        { term: 'de verkorte bijzin', definition: 'reduced/abbreviated clause with infinitive or participle' },
        { term: 'desalniettemin', definition: 'nevertheless / nonetheless (formal)' },
        { term: 'hetgeen', definition: 'which / that (formal relative pronoun — refers to entire clause)' },
      ],
      content: `## Advanced Dutch: C1/C2 Mastery

### Formal Written Register

Dutch formal writing has distinctive markers:

**Formal connectives**:
- desalniettemin / nondestanmin (nevertheless — formal)
- voorts / tevens (furthermore / also — formal)
- derhalve / bijgevolg (therefore — formal)
- evenwel (however — formal)
- teneinde (in order to — formal, followed by te + inf.)

**Nominalization** (like German):
- verbeteren → de verbetering (improvement)
- beslissen → de beslissing (decision)
- uitvoeren → de uitvoering (execution/implementation)

### Indirect Speech

Dutch indirect speech with dat-clauses:
- Hij zei dat hij **ziek was**. (He said he was sick — indicative, same tense)
- Ze vertelde dat ze **zou komen**. (She said she would come — conditional)

Dutch does NOT have a distinct subjunctive for indirect speech (unlike German Konjunktiv I). Use indicative or conditional as appropriate.

### The Relative Pronoun System

- **die** (common gender antecedent): de man **die** komt (the man who comes)
- **dat** (het-word antecedent): het boek **dat** ik lees (the book that I read)
- **hetgeen** (formal, refers to entire clause): Hij vertrok vroeg, **hetgeen** ons verraste. (He left early, which surprised us.)
- **wat** (refers to clauses or indefinite/superlative): alles **wat** hij zei (everything he said), het eerste **wat** hij deed (the first thing he did)

### Complex Clause Structures

Dutch formal writing uses long nominal phrases:
- de door de minister aangekondigde maatregelen (the measures announced by the minister)
- een op internationaal niveau erkende specialist (an internationally recognized specialist)

The participial attributive phrase follows: **article** + **past participle modifier** + **noun**.`,
      q: 'What does "hetgeen" do in the sentence "Hij vertrok vroeg, hetgeen ons verraste"?',
      options: [
        'It means "because" — giving the reason for leaving',
        'It is a formal relative pronoun referring back to the entire preceding clause',
        'It introduces a contrast with what was expected',
        'It means "although" and connects a concessive clause',
      ],
      correct: 1,
      explanation: '"Hetgeen" is a formal relative pronoun that refers to an entire preceding clause or proposition (not just a noun). "Hij vertrok vroeg, hetgeen ons verraste" = "He left early, which surprised us" — hetgeen refers to the fact that he left early. This is distinct from die/dat which refer to specific nouns. In less formal writing, "wat" fulfills a similar function.',
    },
    ru: {
      subtitle: 'Achieve C1/C2 Russian with literary style, complex subordination, and formal registers',
      terms: [
        { term: 'тем не менее', definition: 'nevertheless / however (formal connector)' },
        { term: 'в соответствии с', definition: 'in accordance with (legal/formal)' },
        { term: 'вследствие', definition: 'as a result of / due to (formal causal)' },
        { term: 'краткие причастия', definition: 'short-form participles: написан, сделано, известен' },
        { term: 'деепричастный оборот', definition: 'adverbial participle phrase: придя домой, он сел' },
      ],
      content: `## Advanced Russian: C1/C2 Mastery

### Деепричастие (Adverbial Participle) — Formal/Literary

Деепричастия are verbal adverbs (gerunds) that must share their subject with the main verb:
- **Придя** домой, он сел за стол. (Having come home, he sat down.) — perfective
- **Читая** книгу, она слушала музыку. (Reading the book, she listened to music.) — imperfective

The subject of both actions must be the same — Russian literary style requires this.
**Cannot write**: Придя домой, стол был накрыт. (Wrong — table can't "come home")

### Причастный оборот (Participial Phrase)

Participial phrases modify nouns, placed after the noun they modify:
- студент, **сдавший** экзамен (the student who passed the exam — active past participle)
- вопрос, **решённый** комитетом (the question decided by the committee — passive past)
- книга, **написанная** известным автором (the book written by a famous author)

### Formal Written Connectives

Formal Russian has a rich stock of connectives:
- Тем не менее (nevertheless), несмотря на то что (despite the fact that)
- В соответствии с (in accordance with), ввиду (in view of), вследствие (as a result of)
- Надлежит отметить (it should be noted — official), следует подчеркнуть (one should emphasize)
- Вышеупомянутый / нижеследующий (the above-mentioned / the following — official documents)

### Short Passive Participles in Writing

Short form passive participles are heavily used in formal writing:
- Проблема **решена**. (The problem has been solved.)
- Документ **подписан**. (The document is signed.)
- Задание **выполнено**. (The assignment is completed.)
- Переговоры **приостановлены**. (Negotiations are suspended.)

These are the grammatical heart of Russian formal/bureaucratic writing.`,
      q: 'Why is "Придя домой, стол был накрыт" grammatically wrong in Russian?',
      options: [
        'The tense of the participle is incorrect',
        'The subject of the деепричастие (coming home) must be the same as the subject of the main verb — the table cannot come home',
        'Passive voice cannot be used after деепричастие',
        'The participle должна быть perfective in this case',
      ],
      correct: 1,
      explanation: 'Деепричастный оборот requires the same subject throughout: the deponent action and the main action must both belong to the same grammatical subject. "Придя домой" means "having come home" — the one who comes home must be the same one in the main verb. "Стол был накрыт" (the table was set) has a different subject — the table. This is a firm Russian grammar rule, and violating it is a mark of poor style.',
    },
    ar: {
      subtitle: 'Achieve C1/C2 Arabic with formal MSA style, the I\'rab system, and literary constructions',
      terms: [
        { term: 'الإعراب (al-iʿrāb)', definition: 'case marking system — nominative (ḍamma), accusative (fatḥa), genitive (kasra)' },
        { term: 'المصدر (al-maṣdar)', definition: 'verbal noun — the infinitive equivalent: الكتابة، الدراسة' },
        { term: 'الحال (al-ḥāl)', definition: 'circumstantial accusative — describes state when action occurs: جاء مبتسماً' },
        { term: 'التمييز (at-tamyīz)', definition: 'specification/distinction accusative — عشرون طالباً' },
        { term: 'أسلوب الشرط المركب', definition: 'compound conditional — if...then constructions in MSA' },
      ],
      content: `## Advanced Arabic: C1/C2 Mastery

### The I'rab System (Case Endings)

Classical and formal MSA marks cases with short vowels (though often dropped in speech):
- **مَرْفُوع** (nominative — ḍamma -u): subject, predicate: الطَّالِبُ ذَكِيٌّ. (The student is intelligent.)
- **مَنْصُوب** (accusative — fatḥa -a): direct object, adverbials: قَرَأَ الطَّالِبُ الكِتَابَ.
- **مَجْرُور** (genitive — kasra -i): after prepositions and in iḍāfa: في البَيْتِ، كِتَابُ الطَّالِبِ.

Nunation (tanwīn) adds -n sound: كِتَابٌ (a book, nom.), كِتَاباً (a book, acc.), كِتَابٍ (a book, gen.)

### The Masdar — Arabic's Verbal Noun

The maṣdar (verbal noun) carries the root meaning and is essential for formal writing:
- كَتَبَ (to write) → الكِتَابَة (writing)
- درس (to study) → الدِّرَاسَة (studying/study)
- سَافَرَ (to travel) → السَّفَر (traveling/travel)
- أَقَامَ (to establish) → الإِقَامَة (establishment/staying)

Masdar is preferred over verb forms in formal writing: "بَعْدَ الدِّرَاسَة" (after the study) rather than "بَعْدَ أَنْ نَدْرُسَ" (after we study).

### The Ḥāl (Circumstantial Accusative)

The ḥāl describes the state of a person when the action occurs:
- جَاءَ مَاشِياً. (He came walking — on foot.)
- خَرَجَ مُبْتَسِماً. (He left smiling.)
- وَقَفَ صَامِتاً. (He stood silent.)
The ḥāl is always in the accusative and typically a present active participle.

### Formal Connective Discourse

- أَمَّا... فَـ (as for X... then Y — topic-comment structure)
- لاَ سِيَّمَا (especially / particularly — frequent in formal Arabic)
- بِصَرْفِ النَّظَرِ عَنْ (regardless of)
- فَضْلاً عَنْ (in addition to / not to mention)
- جَدِيرٌ بِالذِّكْرِ أَنَّ (it is worth mentioning that — formal opener)`,
      q: 'What case does a noun take after a preposition in Arabic?',
      options: ['Nominative (ḍamma)', 'Accusative (fatḥa)', 'Genitive (kasra)', 'It depends on the specific preposition'],
      correct: 2,
      explanation: 'In Arabic, all prepositions govern the genitive case (مَجْرُور — marked by kasra ـِ or tanwīn -in). This is absolute: في البَيْتِ (in the house), مِنَ المَدْرَسَةِ (from the school), إِلَى المَكْتَبِ (to the office). There are no Arabic prepositions that take accusative (unlike some cases in other case-marked languages). The genitive case is also used in the iḍāfa construction.',
    },
    sw: {
      subtitle: 'Achieve C1/C2 Swahili with formal register, complex tenses, and discourse-level language',
      terms: [
        { term: 'ingawa / ijapokuwa', definition: 'although / even though (concessive)' },
        { term: '-ngali-', definition: 'unreal conditional past tense marker: ningalikuja (I would have come)' },
        { term: 'hivyo', definition: 'thus / so / in that way (discourse connector)' },
        { term: 'hata hivyo', definition: 'nevertheless / even so' },
        { term: 'kwani', definition: 'because / for (formal causal — more literary than kwa sababu)' },
      ],
      content: `## Advanced Swahili: C1/C2 Mastery

### The Ngali Conditional — Unreal Past

Swahili has a specific past unreal conditional marker -ngali-:
- **Ningalikuja** kama ningejua. (I would have come if I had known.)
- **Angalifanya** vizuri kama angesoma zaidi. (He would have done well if he had studied more.)
- Compare: **ningekuja** (I would come — present unreal) vs **ningalikuja** (I would have come — past unreal)

### Complex Tense Marker Combinations

Advanced Swahili combines tense markers:
- **-me-** perfect: Nimefika. (I have arrived — present relevance)
- **-sha-** completed before now: Nimeshasoma. (I have already read.)
- **-ki-** narrative consecutive: Akaingia, akaketi, akasema... (He entered, sat, said... — narrative sequence)
- **-ka-** consecutive (follows on from -li-): Alikuja **akakaa**. (He came and sat — sequence)
- **-nge-** present hypothetical: Ningekuwa na pesa, ningenunua. (If I had money, I would buy.)

### Formal Written Swahili

**Formal discourse markers**:
- Hata hivyo (however/nevertheless), kwa hivyo (therefore/thus)
- Kwa upande mwingine (on the other hand), zaidi ya hayo (furthermore)
- Kwa muhtasari (in summary), kwa kumalizia (in conclusion)
- Ni vyema kutambua kwamba (it is good to acknowledge that)

**Formal vs Colloquial**:
| Colloquial | Formal |
|-----------|--------|
| lakini | hata hivyo / bali |
| kwa sababu | kwani / kwa kuwa |
| nadhani | ninaamini / ninahisi |
| sawa | ni kweli / ndivyo ilivyo |

### The Ki- Conditional in Narrative

The -ki- tense creates conditional or temporal clauses and is essential in Swahili literature:
- Ukifanya kazi ngumu, **utafaulu**. (If you work hard, you will succeed.)
- Akisimama, **nimsalimie**. (When he stops, greet him for me — instruction)`,
      q: 'What is the difference between -nge- and -ngali- in Swahili?',
      options: [
        'They are synonymous — regional variants',
        '-nge- marks present/future unreal hypothesis; -ngali- marks past unreal (counterfactual past)',
        '-nge- is used with animate subjects, -ngali- with inanimate',
        '-ngali- is the formal version of -nge-',
      ],
      correct: 1,
      explanation: '-nge- marks present or future hypothetical (unreal) conditions: "Ningekuwa na pesa, ningenunua" (If I had money [now], I would buy). -ngali- marks PAST counterfactual: "Ningalikuwa na pesa, ningelinunua" (If I had had money [then], I would have bought). The distinction parallels Spanish present-unreal (si tuviera) vs past-unreal (si hubiera tenido).',
    },
    ht: {
      subtitle: 'Achieve C1/C2 Haitian Creole with formal registers, literature, and discourse-level language',
      terms: [
        { term: 'malgre sa', definition: 'despite that / nevertheless (discourse connector)' },
        { term: 'poutèt', definition: 'because of / due to (more formal than paske)' },
        { term: 'anfèt', definition: 'in fact / actually (from French "en fait")' },
        { term: 'se pou', definition: 'it is necessary that / one must (formal obligation)' },
        { term: 'jan... jan', definition: 'as X as Y / the more X the more Y' },
      ],
      content: `## Advanced Haitian Creole: C1/C2 Mastery

### Formal vs Colloquial Register

Haitian Creole has a formal register used in government, education, and literature:

**Formal discourse markers**:
- Anfèt (in fact / actually), pi plis (moreover / furthermore)
- Poutèt sa (for that reason / therefore), malgre sa (despite that)
- Sepandan (however — from French "cependant"), poutan (yet/however)
- Se pou nou rekonèt ke... (We must acknowledge that...)

**Formal vs Colloquial vocabulary**:
| Colloquial | Formal |
|-----------|--------|
| paske | poutèt / akòz |
| men | sepandan / poutan |
| konsa | nan sans sa a |
| mwen panse | mwen kwè / mwen konsidere |

### Complex Conditional Constructions

Advanced Creole conditionals:
- Si + past (te): Si mwen te la, mwen **ta** ede ou. (If I had been there, I would have helped you.)
- Double past hypothetical: Si mwen **te** la, mwen **ta te** ede ou. (If I had been there, I would have helped.)

**Jan...jan** (the more...the more):
- Jan ou travay plis, **jan** ou aprann plis. (The more you work, the more you learn.)

### Haitian Literature and Oral Tradition

Haitian Creole has a rich literary tradition:
**Proverbs (pawòl granmoun)**:
- "Dèyè mòn gen mòn." (Beyond mountains there are mountains — challenges are endless)
- "Sak vid pa kanpe." (An empty sack cannot stand upright — you can't function without sustenance)
- "Bourik travay, chwal galonnen." (The donkey works, the horse gets the medal — others profit from your labor)

**Code-switching reality**: Educated Haitians constantly switch between Creole and French. Understanding this diglossic context is essential at C1/C2 — when to use which language and why is a social literacy marker.

### Discourse Level: Argumentation

**Thesis → Support → Concession → Conclusion** in formal Creole:
- Pouvwa: Mwen kwè ke... (I believe that...)
- Sipò: Dapre... / Anfèt... (According to... / In fact...)
- Konsesyon: Malgre sa, gen moun ki di ke... (Despite that, some say that...)
- Konklizyon: Poutèt sa, nou kapab di ke... (For that reason, we can say that...)`,
      q: 'What does the Haitian proverb "Dèyè mòn gen mòn" mean?',
      options: [
        'Mountains are dangerous and should be avoided',
        'Beyond mountains there are mountains — every challenge overcome reveals new challenges ahead',
        'The mountains protect Haiti from its enemies',
        'Success is found only by crossing the mountains',
      ],
      correct: 1,
      explanation: '"Dèyè mòn gen mòn" (beyond mountains there are mountains) expresses that life\'s challenges are endless — solving one problem reveals another. It is one of Haiti\'s most famous proverbs, often interpreted as a realistic but resilient worldview. It can also be read positively: there is always more to discover, always another horizon. Knowing Haitian proverbs is a mark of cultural and linguistic C1/C2 literacy.',
    },
  }

  const d = data[lang.code]
  return {
    id: `lang-${lang.code}-advanced`,
    track: 'language',
    title: `${lang.name}: Advanced Mastery`,
    subtitle: d.subtitle,
    level: 'PhD',
    xp: 500,
    duration: 75,
    module,
    content: d.content,
    keyTerms: d.terms,
    quiz: [{
      q: d.q,
      options: d.options,
      correct: d.correct,
      explanation: d.explanation,
    }],
    certArea: `Advanced ${lang.name}`,
    courseObjective: `Achieve C1/C2 ${lang.name} proficiency with control of register, nuance, and complex structures`,
    moduleObjective: `Produce and interpret advanced ${lang.name} text at professional and literary register`,
  }
}

function buildNextGenCourse(lang: LangEntry, module: number): Course {
  return {
    id: `lang-${lang.code}-nextgen`,
    track: 'language',
    title: `${lang.name}: AI-Powered Fluency`,
    subtitle: `Use AI tools, NLP insights, and language technology to accelerate and maintain ${lang.name} fluency`,
    level: 'Next-Gen AI',
    xp: 600,
    duration: 90,
    module,
    content: `## AI-Powered ${lang.name} Learning

### Why Language AI Changes Everything

Traditional language learning: study grammar rules → memorize vocabulary → practice with textbooks.

AI-assisted learning: immerse in real content → get instant explanations → generate custom practice → receive real-time correction.

The result: learners reach conversational fluency 3-5x faster when using AI tools effectively.

### Using AI Tutors Effectively

**Best practices for AI conversation practice**:
1. **Role-play real scenarios**: "You are a shopkeeper in [city]. I am a customer buying vegetables. Respond only in ${lang.name}."
2. **Error correction mode**: "Correct every grammar mistake I make and explain why."
3. **Explain like I'm a native**: "Use this sentence in 5 different ways a native speaker might say it."
4. **Cultural context**: "Why would a native ${lang.name} speaker say [X] instead of [Y] here?"

**Prompt templates for ${lang.name} practice**:
\`\`\`
"Continue this ${lang.name} conversation: [your text]"
"Translate and explain why each word choice is natural: [your sentence]"
"What are 5 ways to say [concept] in ${lang.name}? Include formality levels."
"Write a short dialogue in ${lang.name} between [two people in a scenario]. Then explain vocabulary choices."
\`\`\`

### Speech Recognition and TTS Tools

**AI pronunciation feedback**:
- Record yourself speaking ${lang.name}
- Use AI speech-to-text to see what it "heard" — divergence = pronunciation to fix
- TTS tools can model native-speed natural speech at adjustable rates

**Immersive listening**:
- Podcast + AI transcript: listen, then read AI-generated transcript
- Shadow native speakers: listen → pause → repeat → compare
- Auto-generated comprehension questions from any content

### Vocabulary Acquisition with AI

**Spaced repetition + AI context**:
- AI generates example sentences using YOUR vocabulary list in contexts relevant to YOU
- Context-rich learning: not just "the word means X" but "here's how it appears in 5 different registers"

**Word frequency analysis**:
- AI can analyze any text and identify vocabulary above your level
- Rank unknown words by frequency in the corpus you're targeting (newspapers, social media, academic)

### Language Models as Grammar Checkers

AI grammar checking goes beyond spell-check:
- "Is this sentence natural? How would a native speaker write it?"
- "What's the difference between these two sentences? Which one sounds more fluent?"
- "Does this word choice fit the register I'm aiming for?"

### Building a Daily AI Practice Routine

**The 20-minute daily AI immersion**:
1. (5 min) AI-generated reading: brief text at your level + comprehension questions
2. (5 min) Write 3 sentences about your day → AI corrects + suggests improvements
3. (5 min) AI conversation practice on a topic you chose
4. (5 min) Review: AI creates a flashcard from today's errors

**Weekly milestones**:
- Record a 2-minute spoken summary → AI transcript analysis
- Write a paragraph → get register and fluency feedback
- Have a 10-minute uninterrupted conversation with AI, then request error analysis`,
    keyTerms: [
      { term: 'spaced repetition', definition: 'algorithm that schedules reviews at optimal intervals for long-term retention' },
      { term: 'comprehensible input', definition: 'Krashen\'s i+1 theory: language slightly above your current level is optimal for acquisition' },
      { term: 'shadowing', definition: 'language practice technique: listen and repeat simultaneously to improve prosody and fluency' },
      { term: 'register', definition: 'the level of formality in language appropriate to social context' },
      { term: 'interlanguage', definition: 'the evolving internal linguistic system of a language learner between L1 and target L2' },
    ],
    quiz: [{
      q: `Which AI practice technique gives you the most direct feedback on your ${lang.name} pronunciation?`,
      options: [
        'Reading AI-generated grammar explanations',
        'Speaking and checking if AI speech recognition transcribed you correctly',
        'Generating vocabulary lists with AI',
        'Having AI translate texts for you',
      ],
      correct: 1,
      explanation: `Recording yourself speaking ${lang.name} and checking how accurately AI speech recognition transcribes you gives direct pronunciation feedback — divergence between what you said and what was transcribed points to specific phonemes or patterns to work on. This is especially powerful because AI speech recognition is trained on native speech, so it shows where your accent deviates from native patterns.`,
    }],
    certArea: `${lang.name} AI-Assisted Learning`,
    courseObjective: `Leverage AI tools to accelerate and sustain ${lang.name} fluency at any level`,
    moduleObjective: `Build a personalized AI-powered ${lang.name} learning system that fits your goals`,
  }
}

const allLanguageCourses: Course[] = []
const SCRIPT_LANGS = ['ja', 'ko', 'ru', 'ar', 'hi']
let _moduleCounter = 1

for (const lang of LANGS) {
  if (SCRIPT_LANGS.includes(lang.code)) {
    allLanguageCourses.push(buildScriptModule(lang, _moduleCounter++))
  }
  allLanguageCourses.push(buildSoundsModule(lang, _moduleCounter++))
  allLanguageCourses.push(buildNumbersGreetingsModule(lang, _moduleCounter++))
  allLanguageCourses.push(buildCoreVocabModule(lang, _moduleCounter++))
  allLanguageCourses.push(buildDailyLifeModule(lang, _moduleCounter++))
  allLanguageCourses.push(buildGrammarMasteryModule(lang, _moduleCounter++))
  allLanguageCourses.push(buildAdvancedMasteryModule(lang, _moduleCounter++))
  allLanguageCourses.push(buildNextGenCourse(lang, _moduleCounter++))
}

export const languageCoursesFull: Course[] = allLanguageCourses
