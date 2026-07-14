export type LanguageCode = 'zh' | 'es' | 'fr' | 'en' | 'nl' | 'de' | 'ru' | 'ja' | 'ar' | 'pt' | 'hi' | 'ko' | 'it' | 'sw'

export type ProfLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'PhD'

export interface VocabItem {
  word: string
  pronunciation: string
  meaning: string
  scenario: string
  exampleSentence: string
  exampleTranslation: string
  audioText: string
}

export interface GrammarPoint {
  rule: string
  explanation: string
  examples: { target: string; translation: string }[]
}

export interface SpecialChar {
  char: string
  name: string
  tip: string
}

export interface Lesson {
  id: string
  level: ProfLevel
  levelLabel: string
  title: string
  subtitle: string
  duration: string
  xp: number
  vocab: VocabItem[]
  grammar: GrammarPoint[]
  dialogueLines: { speaker: string; text: string; translation: string }[]
  challenge: { prompt: string; answer: string; hint: string }[]
}

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
  voiceName: string
  specialChars: SpecialChar[]
  script: string
  tagline: string
  lessons: Lesson[]
}

export const LANGUAGES: Language[] = [
  // ── MANDARIN CHINESE ──────────────────────────────────────────────────
  {
    code: 'zh',
    name: 'Mandarin Chinese',
    nativeName: '普通话',
    flag: '🇨🇳',
    voiceName: 'zh-CN-XiaoxiaoNeural',
    script: 'Simplified Chinese + Pinyin',
    tagline: '1.1 billion speakers. The language of the future.',
    specialChars: [
      { char: '你', name: 'nǐ (you)', tip: 'Most common pronoun' },
      { char: '好', name: 'hǎo (good)', tip: 'Used in greetings' },
      { char: '是', name: 'shì (is/am/are)', tip: 'The "to be" verb' },
      { char: '不', name: 'bù (no/not)', tip: 'Negation particle' },
      { char: '我', name: 'wǒ (I/me)', tip: 'First person pronoun' },
      { char: '的', name: 'de (possessive)', tip: 'Like apostrophe-s in English' },
      { char: '吗', name: 'ma (question)', tip: 'Turns statement into yes/no question' },
      { char: '请', name: 'qǐng (please)', tip: 'Also means "invite"' },
    ],
    lessons: [
      {
        id: 'zh-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'First Words: Survive Day One',
        subtitle: 'Tones, greetings, numbers & the art of not offending anyone',
        duration: '18 m',
        xp: 150,
        vocab: [
          {
            word: '你好',
            pronunciation: 'nǐ hǎo',
            meaning: 'Hello',
            scenario: 'You walk into a Beijing tea shop and the owner looks up.',
            exampleSentence: '你好！欢迎！',
            exampleTranslation: 'Hello! Welcome!',
            audioText: '你好，欢迎',
          },
          {
            word: '谢谢',
            pronunciation: 'xiè xiè',
            meaning: 'Thank you',
            scenario: 'The waiter brings your order. One phrase makes all the difference.',
            exampleSentence: '谢谢你！',
            exampleTranslation: 'Thank you!',
            audioText: '谢谢你',
          },
          {
            word: '对不起',
            pronunciation: 'duì bu qǐ',
            meaning: 'I\'m sorry / Excuse me',
            scenario: 'You accidentally step on someone\'s foot on the Shanghai metro.',
            exampleSentence: '对不起，我不知道。',
            exampleTranslation: 'I\'m sorry, I didn\'t know.',
            audioText: '对不起，我不知道',
          },
          {
            word: '多少钱',
            pronunciation: 'duō shǎo qián',
            meaning: 'How much money / What\'s the price?',
            scenario: 'You\'re at a street market eyeing a silk scarf.',
            exampleSentence: '这个多少钱？',
            exampleTranslation: 'How much is this?',
            audioText: '这个多少钱',
          },
          {
            word: '我听不懂',
            pronunciation: 'wǒ tīng bù dǒng',
            meaning: 'I don\'t understand',
            scenario: 'The taxi driver is giving you rapid directions. This phrase saves you.',
            exampleSentence: '对不起，我听不懂。请慢说。',
            exampleTranslation: 'Sorry, I don\'t understand. Please speak slowly.',
            audioText: '对不起，我听不懂，请慢一点说',
          },
        ],
        grammar: [
          {
            rule: 'The Four Tones',
            explanation: 'Mandarin has 4 tones + a neutral tone. The same syllable "ma" means mother (mā, flat), hemp (má, rising), horse (mǎ, dipping), scold (mà, falling). Getting tones wrong doesn\'t just cause confusion — it can completely change meaning. Practice each tone with a hand gesture: flat hand for 1st, rising for 2nd, dip and rise for 3rd, sharp drop for 4th.',
            examples: [
              { target: 'mā (妈) — 1st tone: flat high', translation: 'mother' },
              { target: 'má (麻) — 2nd tone: rising', translation: 'hemp/numb' },
              { target: 'mǎ (马) — 3rd tone: dip then rise', translation: 'horse' },
              { target: 'mà (骂) — 4th tone: sharp fall', translation: 'to scold' },
            ],
          },
          {
            rule: 'Subject-Verb-Object (SVO)',
            explanation: 'Chinese sentence structure is SVO — same as English! The biggest difference: time expressions come before the verb, not after. And adjectives always come BEFORE the noun they describe, just like English.',
            examples: [
              { target: '我吃饭。Wǒ chī fàn.', translation: 'I eat rice/food. (lit: I eat rice)' },
              { target: '她明天来。Tā míngtiān lái.', translation: 'She tomorrow comes. (She comes tomorrow)' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: '你好！请问，这个多少钱？', translation: 'Hello! Excuse me, how much is this?' },
          { speaker: 'Vendor', text: '你好！这个五十块。', translation: 'Hello! This one is 50 yuan.' },
          { speaker: 'You', text: '太贵了！三十块可以吗？', translation: 'Too expensive! Can you do 30 yuan?' },
          { speaker: 'Vendor', text: '好吧，四十块，最低了！', translation: 'Fine, 40 yuan — that\'s the lowest!' },
          { speaker: 'You', text: '谢谢！', translation: 'Thank you!' },
        ],
        challenge: [
          { prompt: 'How do you say "How much is this?" in Mandarin?', answer: '这个多少钱', hint: 'Zhège duōshǎo qián — three words' },
          { prompt: 'What does 你好 mean and how is it pronounced?', answer: 'Hello — nǐ hǎo', hint: 'The most basic greeting — third tone, third tone' },
          { prompt: 'Type the character for "I/me" in Chinese', answer: '我', hint: 'Wǒ — it looks like a person holding something' },
        ],
      },
      {
        id: 'zh-A2',
        level: 'A2',
        levelLabel: 'Elementary',
        title: 'Daily Life: Ordering, Directions, Time',
        subtitle: 'Navigate food, transport & telling time without a translator',
        duration: '20 m',
        xp: 175,
        vocab: [
          {
            word: '我要',
            pronunciation: 'wǒ yào',
            meaning: 'I want / I\'ll have',
            scenario: 'You\'re ordering at a dim sum restaurant in Guangzhou.',
            exampleSentence: '我要一杯茶和两个饺子。',
            exampleTranslation: 'I want one cup of tea and two dumplings.',
            audioText: '我要一杯茶和两个饺子',
          },
          {
            word: '在哪里',
            pronunciation: 'zài nǎ lǐ',
            meaning: 'Where is...?',
            scenario: 'You need the bathroom at a high-speed rail station.',
            exampleSentence: '洗手间在哪里？',
            exampleTranslation: 'Where is the bathroom?',
            audioText: '请问，洗手间在哪里',
          },
          {
            word: '现在几点',
            pronunciation: 'xiànzài jǐ diǎn',
            meaning: 'What time is it now?',
            scenario: 'Your phone died and you need to catch a train.',
            exampleSentence: '请问现在几点？',
            exampleTranslation: 'Excuse me, what time is it?',
            audioText: '请问，现在几点了',
          },
        ],
        grammar: [
          {
            rule: 'Measure Words (量词)',
            explanation: 'In Chinese, you can\'t just say "two books" — you need a measure word between the number and noun. 一本书 (yī běn shū) — one [volume] book. 一张纸 (yī zhāng zhǐ) — one [sheet] paper. 个 (gè) is the default measure word when you\'re unsure.',
            examples: [
              { target: '三个苹果 — sān gè píngguǒ', translation: 'three [piece] apples' },
              { target: '两本书 — liǎng běn shū', translation: 'two [volume] books' },
              { target: '一杯水 — yī bēi shuǐ', translation: 'one [cup] water' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: '不好意思，洗手间在哪里？', translation: 'Excuse me, where is the bathroom?' },
          { speaker: 'Staff', text: '在那边，左转就是。', translation: 'Over there — turn left and you\'ll see it.' },
          { speaker: 'You', text: '谢谢！对了，现在几点？', translation: 'Thank you! By the way, what time is it?' },
          { speaker: 'Staff', text: '现在两点半。', translation: 'It\'s 2:30 now.' },
        ],
        challenge: [
          { prompt: 'How do you say "Where is the bathroom?"', answer: '洗手间在哪里', hint: 'Xǐshǒujiān zài nǎlǐ' },
          { prompt: 'What measure word do you use for books?', answer: '本', hint: 'Běn — used for bound volumes' },
        ],
      },
      {
        id: 'zh-B1',
        level: 'B1',
        levelLabel: 'Intermediate',
        title: 'Business & Social: Hold Your Own in a Meeting',
        subtitle: 'Professional vocabulary, expressing opinions & the art of face (面子)',
        duration: '22 m',
        xp: 200,
        vocab: [
          {
            word: '我认为',
            pronunciation: 'wǒ rènwéi',
            meaning: 'I think / I believe',
            scenario: 'You\'re in a business meeting in Shenzhen and want to share your view diplomatically.',
            exampleSentence: '我认为这个方案有一些问题，但是我们可以改进。',
            exampleTranslation: 'I think this plan has some issues, but we can improve it.',
            audioText: '我认为这个方案有一些问题，但是我们可以改进',
          },
          {
            word: '面子',
            pronunciation: 'miànzi',
            meaning: 'Face / Social status / Dignity',
            scenario: 'Understanding this concept will change every interaction you have in Chinese culture.',
            exampleSentence: '在中国，给别人面子很重要。',
            exampleTranslation: 'In China, giving others face is very important.',
            audioText: '在中国文化里，面子非常重要',
          },
          {
            word: '合同',
            pronunciation: 'hétong',
            meaning: 'Contract / Agreement',
            scenario: 'Closing a deal with a Chinese partner.',
            exampleSentence: '请把合同发给我看看。',
            exampleTranslation: 'Please send me the contract to review.',
            audioText: '请把合同发给我看一看',
          },
        ],
        grammar: [
          {
            rule: 'The 把 (bǎ) construction',
            explanation: '把 moves the object before the verb to emphasize what happens to the object. Used when an action has a specific effect on the object. 我吃了饭 (I ate) vs 我把饭吃了 (I ate up the rice — emphasizing it\'s finished).',
            examples: [
              { target: '我把作业做完了。', translation: 'I finished (completed) the homework.' },
              { target: '请把窗户关上。', translation: 'Please close (shut) the window.' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Partner', text: '王先生，您对我们的合作方案怎么看？', translation: 'Mr. Wang, what do you think of our cooperation plan?' },
          { speaker: 'You', text: '我认为基本方向是对的。不过，有几个细节我想进一步讨论。', translation: 'I think the basic direction is right. However, there are a few details I\'d like to discuss further.' },
          { speaker: 'Partner', text: '当然，请说。', translation: 'Of course, please go ahead.' },
        ],
        challenge: [
          { prompt: 'Translate: "I think this plan needs improvement."', answer: '我认为这个方案需要改进', hint: '我认为 + 这个方案 + 需要改进' },
        ],
      },
      {
        id: 'zh-B2',
        level: 'B2',
        levelLabel: 'Upper Intermediate',
        title: 'Fluent Conversations: Argument, Humor & Nuance',
        subtitle: 'Chengyu idioms, expressing complex ideas & understanding slang',
        duration: '25 m',
        xp: 225,
        vocab: [
          {
            word: '马到成功',
            pronunciation: 'mǎ dào chéng gōng',
            meaning: 'Immediate success (lit: horse arrives, success follows)',
            scenario: 'Wishing someone luck before a big presentation or venture.',
            exampleSentence: '祝你马到成功！',
            exampleTranslation: 'Wishing you immediate success!',
            audioText: '祝你马到成功，一切顺利',
          },
          {
            word: '不好意思',
            pronunciation: 'bù hǎo yì si',
            meaning: 'Embarrassed / Excuse me / I feel bad about...',
            scenario: 'The Swiss Army knife of social phrases — used to apologize, to ask for something, or to acknowledge awkwardness.',
            exampleSentence: '不好意思，我能问你一个问题吗？',
            exampleTranslation: 'I feel bad interrupting, but may I ask you a question?',
            audioText: '不好意思，我可以打扰你一下吗',
          },
        ],
        grammar: [
          {
            rule: '成语 (Chéngyǔ) — Four-character idioms',
            explanation: 'Chengyu are 4-character idioms from classical Chinese, each with a story behind it. Using them correctly signals sophisticated Chinese. 马到成功 (immediate success), 一石二鸟 (kill two birds with one stone), 水落石出 (truth emerges when water recedes). Learn 5 chengyu relevant to your field and use them deliberately.',
            examples: [
              { target: '一箭双雕 yī jiàn shuāng diāo', translation: 'Kill two birds with one arrow (achieve two goals at once)' },
              { target: '画蛇添足 huà shé tiān zú', translation: 'Draw a snake and add feet (ruin something by over-doing it)' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Friend', text: '你的普通话越来越好了！', translation: 'Your Mandarin is getting better and better!' },
          { speaker: 'You', text: '哪里哪里，还差得远呢。不过谢谢你的鼓励！', translation: 'Not really, I still have a long way to go. But thank you for the encouragement!' },
        ],
        challenge: [
          { prompt: 'What does 马到成功 literally mean? What does it actually mean?', answer: 'Literally: horse arrives, success follows. Actually: immediate/guaranteed success', hint: 'A classical blessing for ventures' },
        ],
      },
      {
        id: 'zh-C1',
        level: 'C1',
        levelLabel: 'Advanced',
        title: 'Precision & Power: Writing and Speaking Formally',
        subtitle: 'Formal registers, written Chinese vs spoken & classical references',
        duration: '28 m',
        xp: 250,
        vocab: [
          {
            word: '鉴于',
            pronunciation: 'jiànyú',
            meaning: 'In view of / Given that (formal)',
            scenario: 'Writing a formal business proposal or report.',
            exampleSentence: '鉴于市场情况，我们建议调整策略。',
            exampleTranslation: 'In view of the market situation, we recommend adjusting the strategy.',
            audioText: '鉴于目前的市场情况，我们建议调整整体策略',
          },
        ],
        grammar: [
          {
            rule: 'Written vs Spoken Chinese — the gap',
            explanation: 'Written Chinese (书面语 shūmiànyǔ) and spoken Chinese (口语 kǒuyǔ) differ significantly in vocabulary and structure. 吃饭 → 用餐 (formal dining). 很多 → 大量 (formal: a large amount). 因为 → 由于 (formal: due to). C1 speakers switch registers fluently depending on context.',
            examples: [
              { target: '很多人 → 大量人员', translation: 'Many people (spoken) → A large number of people (written)' },
              { target: '因为 → 由于/鉴于', translation: 'Because (spoken) → Due to / In light of (formal written)' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Executive', text: '请问您对这次合作的长期规划有什么看法？', translation: 'What is your view on the long-term plans for this cooperation?' },
          { speaker: 'You', text: '鉴于双方的互补优势，我认为深化战略合作不仅必要，而且时机成熟。', translation: 'Given both parties\' complementary strengths, I believe deepening strategic cooperation is not only necessary but that the timing is right.' },
        ],
        challenge: [
          { prompt: 'Rewrite in formal register: 因为市场变了，我们要改变方法。', answer: '鉴于市场形势的变化，我们有必要调整策略', hint: '鉴于 replaces 因为 in formal writing' },
        ],
      },
      {
        id: 'zh-C2',
        level: 'C2',
        levelLabel: 'Mastery',
        title: 'Native-Level Expression: Rhetoric, Literature & Philosophy',
        subtitle: 'Classical texts, literary allusions & the poetry of the Chinese language',
        duration: '30 m',
        xp: 275,
        vocab: [
          {
            word: '己所不欲，勿施于人',
            pronunciation: 'jǐ suǒ bù yù, wù shī yú rén',
            meaning: 'Do not impose on others what you yourself do not want',
            scenario: 'Confucius\' formulation of the Golden Rule — quote this in the right context and the room goes quiet.',
            exampleSentence: '正如孔子所言：己所不欲，勿施于人。',
            exampleTranslation: 'As Confucius said: Do not impose on others what you yourself do not want.',
            audioText: '己所不欲，勿施于人——这是孔子的黄金法则',
          },
        ],
        grammar: [
          {
            rule: 'Classical Chinese (文言文)',
            explanation: 'Classical Chinese uses single characters where modern Chinese uses two-character words, active voice, and relies on context for meaning. 知之为知之，不知为不知，是知也 (Knowing what you know and knowing what you don\'t know — that is wisdom). C2 speakers can read classical texts and understand their modern relevance.',
            examples: [
              { target: '学而时习之，不亦说乎', translation: 'To learn and practice what one has learned — is that not a pleasure? (Confucius)' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Scholar', text: '你认为孔孟之道在现代商业中还有价值吗？', translation: 'Do you think Confucian philosophy still has value in modern business?' },
          { speaker: 'You', text: '我认为有。"己所不欲，勿施于人"本质上就是现代的利益相关者管理理论。', translation: 'I believe so. "Do not impose on others what you yourself do not want" is essentially modern stakeholder management theory.' },
        ],
        challenge: [
          { prompt: 'What is the Confucian Golden Rule and when would you use it?', answer: '己所不欲，勿施于人 — in ethical or philosophical discussions, or when drawing a principle from Chinese culture', hint: 'One of the most quoted classical phrases in Chinese' },
        ],
      },
      {
        id: 'zh-PhD',
        level: 'PhD',
        levelLabel: 'PhD — Cultural Mastery',
        title: 'China\'s Mental Model: How 5,000 Years of History Shapes Every Interaction',
        subtitle: 'Confucianism, collectivism, Guanxi & why China negotiates the way it does',
        duration: '35 m',
        xp: 300,
        vocab: [
          {
            word: '关系',
            pronunciation: 'guānxi',
            meaning: 'Relationships / Connections / The network that makes things happen',
            scenario: 'You want to do business in China. Without guanxi, you don\'t have a deal — you have a proposal.',
            exampleSentence: '在中国做生意，关系比合同更重要。',
            exampleTranslation: 'In China, relationships matter more than contracts.',
            audioText: '在中国做生意，关系网络是最重要的基础',
          },
          {
            word: '和谐',
            pronunciation: 'héxié',
            meaning: 'Harmony / Social cohesion',
            scenario: 'The organizing principle behind Chinese society — understanding this explains everything from conflict avoidance to political rhetoric.',
            exampleSentence: '中国文化非常重视社会和谐。',
            exampleTranslation: 'Chinese culture places great emphasis on social harmony.',
            audioText: '和谐是中国社会文化的核心价值观',
          },
        ],
        grammar: [
          {
            rule: 'Discourse-Level Chinese: Framing Arguments',
            explanation: 'PhD-level communication is about framing — the same content packaged in a culturally appropriate structure. Chinese formal argument structure: state the historical precedent → describe the current situation → propose the solution → link it back to shared values (harmony, mutual benefit). Contrast with Western structure (claim → evidence → conclusion).',
            examples: [
              { target: 'Western: "Our data shows X, therefore we recommend Y."', translation: 'Chinese: "In our long history of cooperation, [precedent]. Given today\'s situation, [context]. I believe the path forward is [solution], which serves our shared vision of [harmony/mutual benefit]."' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Partner', text: '我们在商业上合作已经三年了，我希望我们的关系能更进一步。', translation: 'We\'ve been business partners for three years. I hope our relationship can deepen further.' },
          { speaker: 'You', text: '我完全同意。在我看来，真正的合作建立在相互信任和共同价值观上，而不仅仅是合同条款。关系才是根本。', translation: 'I completely agree. In my view, genuine cooperation is built on mutual trust and shared values, not just contract terms. Relationships are the foundation.' },
        ],
        challenge: [
          { prompt: 'Explain Guanxi in one powerful sentence', answer: 'Guanxi (关系) is the network of reciprocal relationships that determines what gets done in China — the social capital that makes doors open before contracts are signed', hint: 'Think: it\'s not what you know, it\'s who you know... taken to a philosophical system' },
        ],
      },
    ],
  },
  // ── SPANISH ───────────────────────────────────────────────────────────
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    voiceName: 'es-ES-ElviraNeural',
    script: 'Latin alphabet + special characters',
    tagline: '500+ million speakers. 21 countries. One language, infinite worlds.',
    specialChars: [
      { char: 'á', name: 'a with acute', tip: 'Stressed vowel — hablá vs habla' },
      { char: 'é', name: 'e with acute', tip: 'Changes stress: café, qué' },
      { char: 'í', name: 'i with acute', tip: 'Common in past tense: comí (I ate)' },
      { char: 'ó', name: 'o with acute', tip: 'Habló — he/she spoke' },
      { char: 'ú', name: 'u with acute', tip: 'Tú (you) vs tu (your)' },
      { char: 'ñ', name: 'eñe', tip: 'A completely different letter — español, señor, año' },
      { char: '¿', name: 'inverted question mark', tip: 'Opens every question in Spanish' },
      { char: '¡', name: 'inverted exclamation', tip: 'Opens exclamations — ¡Hola! ¡Vamos!' },
    ],
    lessons: [
      {
        id: 'es-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'Hola Mundo: Survive Your First Day',
        subtitle: 'Greetings, numbers, colors & ordering food like a local',
        duration: '18 m',
        xp: 150,
        vocab: [
          {
            word: '¿Cómo estás?',
            pronunciation: 'KO-mo es-TAS',
            meaning: 'How are you? (informal)',
            scenario: 'You bump into your new Spanish neighbor in the hallway.',
            exampleSentence: '¡Hola! ¿Cómo estás?',
            exampleTranslation: 'Hi! How are you?',
            audioText: '¡Hola! ¿Cómo estás?',
          },
          {
            word: 'Por favor',
            pronunciation: 'por fa-VOR',
            meaning: 'Please',
            scenario: 'Ordering at a tapas bar in Barcelona.',
            exampleSentence: 'Una cerveza, por favor.',
            exampleTranslation: 'One beer, please.',
            audioText: 'Una cerveza, por favor',
          },
          {
            word: '¿Dónde está...?',
            pronunciation: 'DON-de es-TA',
            meaning: 'Where is...?',
            scenario: 'Lost in Madrid and need to find the metro.',
            exampleSentence: '¿Dónde está el metro?',
            exampleTranslation: 'Where is the metro?',
            audioText: '¿Dónde está el metro, por favor?',
          },
          {
            word: 'No entiendo',
            pronunciation: 'no en-TYEN-do',
            meaning: 'I don\'t understand',
            scenario: 'A rapid-fire response from a local leaves you blank.',
            exampleSentence: 'Lo siento, no entiendo. ¿Puede repetir?',
            exampleTranslation: 'Sorry, I don\'t understand. Can you repeat?',
            audioText: 'Lo siento, no entiendo. ¿Puede repetir más despacio?',
          },
          {
            word: 'La cuenta, por favor',
            pronunciation: 'la KWEN-ta, por fa-VOR',
            meaning: 'The check, please',
            scenario: 'After a great meal — the phrase that ends every restaurant visit.',
            exampleSentence: '¿Nos puede traer la cuenta, por favor?',
            exampleTranslation: 'Could you bring us the check, please?',
            audioText: '¿Nos puede traer la cuenta, por favor?',
          },
        ],
        grammar: [
          {
            rule: 'Gendered nouns (el/la)',
            explanation: 'Every Spanish noun is masculine (el) or feminine (la). As a general rule: nouns ending in -o are masculine, nouns ending in -a are feminine. But there are exceptions (el mapa, la foto). The article agrees with the noun: el libro (the book, masc), la mesa (the table, fem).',
            examples: [
              { target: 'el hombre / la mujer', translation: 'the man / the woman' },
              { target: 'el perro / la perra', translation: 'the dog (masc) / the dog (fem)' },
              { target: 'el problema (exception!)', translation: 'the problem — ends in -a but masculine' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: '¡Buenas tardes! Una mesa para dos, por favor.', translation: 'Good afternoon! A table for two, please.' },
          { speaker: 'Waiter', text: '¡Claro que sí! ¿Por aquí, les parece bien?', translation: 'Of course! Over here, does that work for you?' },
          { speaker: 'You', text: 'Perfecto. ¿Qué recomienda usted?', translation: 'Perfect. What do you recommend?' },
          { speaker: 'Waiter', text: 'El ceviche está delicioso hoy.', translation: 'The ceviche is delicious today.' },
        ],
        challenge: [
          { prompt: 'How do you ask for the check in Spanish?', answer: 'La cuenta, por favor', hint: 'La cuenta = the bill/check' },
          { prompt: 'What is the Spanish for "Where is the bathroom?"', answer: '¿Dónde está el baño?', hint: 'Dónde está + el baño' },
          { prompt: 'Type the Spanish character that doesn\'t exist in English:', answer: 'ñ', hint: 'The N with a tilde — in español, año, señor' },
        ],
      },
      {
        id: 'es-B1',
        level: 'B1',
        levelLabel: 'Intermediate',
        title: 'Real Conversations: Work, Love & Conflict',
        subtitle: 'Ser vs Estar, subjunctive basics & expressing emotions',
        duration: '22 m',
        xp: 200,
        vocab: [
          {
            word: 'Estar de acuerdo',
            pronunciation: 'es-TAR de a-KWER-do',
            meaning: 'To agree',
            scenario: 'In a meeting where you want to validate a colleague\'s point before adding yours.',
            exampleSentence: 'Estoy de acuerdo contigo, aunque creo que podemos ir más lejos.',
            exampleTranslation: 'I agree with you, though I think we can go further.',
            audioText: 'Estoy completamente de acuerdo contigo en ese punto',
          },
          {
            word: 'Dar en el clavo',
            pronunciation: 'dar en el KLA-vo',
            meaning: 'To hit the nail on the head',
            scenario: 'Your colleague makes the exact point that cracked the problem.',
            exampleSentence: '¡Diste en el clavo! Eso es exactamente el problema.',
            exampleTranslation: 'You hit the nail on the head! That\'s exactly the problem.',
            audioText: '¡Diste exactamente en el clavo! Eso es el problema central',
          },
        ],
        grammar: [
          {
            rule: 'Ser vs Estar — the hardest thing in Spanish',
            explanation: 'Both mean "to be" — but they\'re not interchangeable. Ser: permanent or essential characteristics (identity, origin, profession). Estar: temporary states, location, emotions. "Soy cansado" (wrong) — that would mean "being tired is my essence." "Estoy cansado" — right, it\'s a current state.',
            examples: [
              { target: 'Soy médico. (profession)', translation: 'I am a doctor.' },
              { target: 'Estoy enfermo hoy. (temporary state)', translation: 'I am sick today.' },
              { target: 'La casa es grande. (characteristic)', translation: 'The house is big.' },
              { target: 'La casa está sucia. (current state)', translation: 'The house is dirty (right now).' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Colleague', text: '¿Qué piensas del nuevo proyecto?', translation: 'What do you think of the new project?' },
          { speaker: 'You', text: 'Creo que la dirección está bien, pero me preocupa el presupuesto. ¿Tú qué opinas?', translation: 'I think the direction is right, but the budget worries me. What do you think?' },
        ],
        challenge: [
          { prompt: 'Which do you use — ser or estar — for emotions?', answer: 'Estar — because emotions are temporary states', hint: 'Estoy feliz, estoy triste, estoy emocionado' },
        ],
      },
      {
        id: 'es-PhD',
        level: 'PhD',
        levelLabel: 'PhD — Cultural Mastery',
        title: 'Latin Culture, Identity & the Spanish-Speaking World',
        subtitle: 'Regional differences, colonial history, Magical Realism & why Spanish matters more than you think',
        duration: '35 m',
        xp: 300,
        vocab: [
          {
            word: 'Madrugada',
            pronunciation: 'ma-dru-GA-da',
            meaning: 'The early hours of the morning (roughly 2am-6am)',
            scenario: 'No other language has a dedicated word for this time. When you use it, Spanish speakers feel seen.',
            exampleSentence: 'Seguimos conversando hasta la madrugada.',
            exampleTranslation: 'We kept talking until the early hours of the morning.',
            audioText: 'Seguimos hablando y riendo hasta la madrugada',
          },
          {
            word: 'Sobremesa',
            pronunciation: 'so-bre-ME-sa',
            meaning: 'The time spent talking after a meal (lit: "on the table")',
            scenario: 'In Spain and Latin America, the meal isn\'t over when the food is done — the conversation is the point.',
            exampleSentence: 'La sobremesa duró tres horas — nadie quería irse.',
            exampleTranslation: 'The after-dinner conversation lasted three hours — nobody wanted to leave.',
            audioText: 'La sobremesa es una de las tradiciones más hermosas de la cultura española',
          },
        ],
        grammar: [
          {
            rule: 'Spanish across 21 countries — vosotros vs ustedes, tú vs vos',
            explanation: 'Spain uses vosotros (you-plural informal). Latin America uses ustedes for everything. Argentina and Uruguay use vos instead of tú (vos tenés instead of tú tienes). Chilean Spanish drops final consonants and has unique slang. Mexican Spanish has heavy indigenous (Nahuatl) influence. Understanding regional variation signals true fluency.',
            examples: [
              { target: 'Spain: ¿Vosotros queréis café?', translation: 'Do you all want coffee?' },
              { target: 'Latin America: ¿Ustedes quieren café?', translation: 'Do you all want coffee? (same, different word)' },
              { target: 'Argentina: Vos tenés razón.', translation: 'You\'re right. (vos = tú in Río de la Plata Spanish)' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Host', text: 'Quédate un rato más — la sobremesa es lo mejor del día.', translation: 'Stay a while longer — the after-dinner conversation is the best part of the day.' },
          { speaker: 'You', text: 'Con mucho gusto. Hay pocas cosas mejores que una buena sobremesa con buena compañía.', translation: 'With pleasure. There are few things better than a good after-dinner conversation in good company.' },
        ],
        challenge: [
          { prompt: 'What is "sobremesa" and why does it have no English equivalent?', answer: 'The time spent talking after a meal — English has no word for it because the culture of lingering over conversation after eating is less embedded', hint: 'Some untranslatable words reveal what a culture values' },
        ],
      },
    ],
  },
  // ── FRENCH ────────────────────────────────────────────────────────────
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    voiceName: 'fr-FR-DeniseNeural',
    script: 'Latin alphabet + diacritical marks',
    tagline: 'The language of diplomacy, fashion & 300 million people.',
    specialChars: [
      { char: 'é', name: 'e aigu', tip: 'Sharp "ay" sound — café, été' },
      { char: 'è', name: 'e grave', tip: 'Open "eh" sound — père, mère' },
      { char: 'ê', name: 'e circumflex', tip: 'Often signals a historical "s" — fête (feast), forêt (forest)' },
      { char: 'à', name: 'a grave', tip: 'Distinguishes à (at/to) from a (has)' },
      { char: 'â', name: 'a circumflex', tip: 'Pâté, château — elongated sound' },
      { char: 'ç', name: 'c cédille', tip: 'Makes c soft before a, o, u — français, ça' },
      { char: 'ù', name: 'u grave', tip: 'Only in où (where) — distinguishes from ou (or)' },
      { char: 'ï', name: 'i tréma', tip: 'Indicates vowels pronounced separately — naïf, Noël' },
    ],
    lessons: [
      {
        id: 'fr-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'Bonjour Paris: First Words in the Language of Love',
        subtitle: 'Greetings, café culture & surviving the formality gap',
        duration: '18 m',
        xp: 150,
        vocab: [
          {
            word: 'Enchanté(e)',
            pronunciation: 'on-shon-TAY',
            meaning: 'Delighted (to meet you)',
            scenario: 'Meeting a French business contact for the first time — "Nice to meet you" is weak; this is the real greeting.',
            exampleSentence: 'Bonjour, je suis Jordan. Enchanté !',
            exampleTranslation: 'Hello, I\'m Jordan. Delighted to meet you!',
            audioText: 'Bonjour, je m\'appelle Jordan. Enchanté de vous rencontrer.',
          },
          {
            word: 'S\'il vous plaît',
            pronunciation: 'seel voo PLAY',
            meaning: 'Please (formal)',
            scenario: 'At a Parisian café — "s\'il vous plaît" to the waiter, every time.',
            exampleSentence: 'Un café, s\'il vous plaît.',
            exampleTranslation: 'A coffee, please.',
            audioText: 'Un café crème, s\'il vous plaît',
          },
          {
            word: 'Je ne comprends pas',
            pronunciation: 'zhuh nuh kom-PRON pa',
            meaning: 'I don\'t understand',
            scenario: 'The Parisian speaks too fast. This phrase is your lifeline.',
            exampleSentence: 'Pardon, je ne comprends pas. Pouvez-vous répéter lentement ?',
            exampleTranslation: 'Excuse me, I don\'t understand. Can you repeat slowly?',
            audioText: 'Pardon, je ne comprends pas. Pouvez-vous parler plus lentement?',
          },
        ],
        grammar: [
          {
            rule: 'Tu vs Vous',
            explanation: 'French has two words for "you": tu (informal, singular) and vous (formal, or plural). Using tu with a stranger or superior is a social error. In Paris especially, vous is the default until you\'re explicitly invited to use tu ("On se tutoie?" — "Shall we use tu?"). In younger circles and Southern France, tu is more common earlier.',
            examples: [
              { target: 'Tu es prêt ? (to a friend)', translation: 'Are you ready?' },
              { target: 'Vous êtes prêt ? (to a boss/stranger)', translation: 'Are you ready? (formal)' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: 'Bonjour ! Un café et un croissant, s\'il vous plaît.', translation: 'Good morning! A coffee and a croissant, please.' },
          { speaker: 'Barista', text: 'Bien sûr. Pour emporter ou sur place ?', translation: 'Of course. To take away or here?' },
          { speaker: 'You', text: 'Sur place, merci.', translation: 'Here, thank you.' },
          { speaker: 'Barista', text: 'Voilà ! Bonne journée.', translation: 'There you go! Have a good day.' },
        ],
        challenge: [
          { prompt: 'What\'s the difference between tu and vous?', answer: 'Tu is informal/singular; vous is formal or plural — use vous with strangers and authority figures', hint: 'The formal/informal distinction matters enormously in French culture' },
          { prompt: 'Type the French special character for "français"', answer: 'ç', hint: 'C with a cedilla — makes the c sound soft' },
        ],
      },
      {
        id: 'fr-PhD',
        level: 'PhD',
        levelLabel: 'PhD — Cultural Mastery',
        title: 'La Francophonie: Empire, Influence & Intellectual Tradition',
        subtitle: 'French philosophy, Francophone Africa, the Académie française & why France defends its language like a fortress',
        duration: '35 m',
        xp: 300,
        vocab: [
          {
            word: 'L\'esprit de l\'escalier',
            pronunciation: 'les-PREE duh les-kal-YAY',
            meaning: 'The wit of the staircase — the perfect comeback you think of after leaving the argument',
            scenario: 'An untranslatable concept the French gave the world. When you know this, you think in French.',
            exampleSentence: 'C\'est toujours après coup qu\'on trouve la répartie parfaite — l\'esprit de l\'escalier.',
            exampleTranslation: 'It\'s always after the fact that you find the perfect retort — the wit of the staircase.',
            audioText: 'L\'esprit de l\'escalier — cette répartie parfaite qu\'on trouve toujours trop tard',
          },
          {
            word: 'Joie de vivre',
            pronunciation: 'zhwa duh VEE-vruh',
            meaning: 'Joy of living — an exuberant enjoyment of life',
            scenario: 'The concept France exported to the world — and the one they live most fully.',
            exampleSentence: 'Ce qui me frappe chez les Français, c\'est leur véritable joie de vivre.',
            exampleTranslation: 'What strikes me about French people is their genuine joie de vivre.',
            audioText: 'La joie de vivre, c\'est l\'art français de célébrer les petits plaisirs de l\'existence',
          },
        ],
        grammar: [
          {
            rule: 'The Subjunctive — French philosophers\' secret weapon',
            explanation: 'The subjunctive mood expresses doubt, desire, emotion, and subjectivity. It\'s used far more in French than English. Je veux que tu viennes (I want you to come — subjunctive). Il faut que vous soyez là (You must be there). Mastering the subjunctive is what separates B2 speakers from C1+.',
            examples: [
              { target: 'Il faut que je parte. (subjunctive of partir)', translation: 'I must leave.' },
              { target: 'Bien qu\'il soit intelligent... (subjunctive of être)', translation: 'Although he is intelligent...' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Host', text: 'La France défend sa langue avec passion. Qu\'en pensez-vous ?', translation: 'France defends its language passionately. What do you think?' },
          { speaker: 'You', text: 'Je trouve ça admirable. La langue n\'est pas seulement un outil de communication — c\'est le récipient de toute une vision du monde. Protéger le français, c\'est protéger une façon de penser.', translation: 'I find it admirable. Language isn\'t just a communication tool — it\'s the container of an entire worldview. Protecting French means protecting a way of thinking.' },
        ],
        challenge: [
          { prompt: 'Explain "l\'esprit de l\'escalier" and give a personal example', answer: 'The perfect comeback you only think of after leaving — e.g., the brilliant response to a criticism that hits you on the way home', hint: 'An untranslatable concept that proves language shapes thought' },
        ],
      },
    ],
  },
  // ── ENGLISH ───────────────────────────────────────────────────────────
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    voiceName: 'en-GB-SoniaNeural',
    script: 'Latin alphabet',
    tagline: 'The language of global business, science & the internet. Master it at PhD level.',
    specialChars: [],
    lessons: [
      {
        id: 'en-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'English Foundations: Sound, Rhythm & Basic Structure',
        subtitle: 'Phonics, the most common 300 words & what textbooks never teach',
        duration: '18 m',
        xp: 150,
        vocab: [
          {
            word: 'Nevertheless',
            pronunciation: 'nev-er-the-LESS',
            meaning: 'Despite what was just said; however; all the same',
            scenario: 'Acknowledging a problem while pivoting to a positive — a power word in professional writing.',
            exampleSentence: 'The market was difficult. Nevertheless, we exceeded our targets.',
            exampleTranslation: 'The market was difficult. But — despite all of that — we exceeded our targets.',
            audioText: 'The market conditions were challenging. Nevertheless, we exceeded our targets by fifteen percent.',
          },
          {
            word: 'To elaborate',
            pronunciation: 'el-AB-or-ate',
            meaning: 'To explain in more detail; to expand on',
            scenario: 'After making a key point in a presentation or meeting.',
            exampleSentence: 'Allow me to elaborate on the second point.',
            exampleTranslation: 'Let me explain the second point in more depth.',
            audioText: 'Allow me to elaborate on the key findings from our research.',
          },
        ],
        grammar: [
          {
            rule: 'The article problem (a/an/the)',
            explanation: 'Many languages don\'t have articles, making this one of the hardest English concepts for non-natives. A/an: indefinite — any one of many. The: definite — a specific one we both know about. "I saw a dog" (any dog). "I saw the dog" (the specific dog we discussed). Zero article: for general statements about categories — "Dogs are loyal."',
            examples: [
              { target: 'I need a pen. (any pen)', translation: 'Not a specific pen — just any one will do' },
              { target: 'Give me the pen. (specific)', translation: 'The one we both know about' },
              { target: 'Pens are useful. (general)', translation: 'The category of pens in general' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Interviewer', text: 'Tell me about yourself.', translation: 'Describe your background, skills and what drives you.' },
          { speaker: 'You', text: 'I\'m a tech entrepreneur focused on building tools that solve real problems. I\'ve spent the last three years at the intersection of AI and financial technology.', translation: '' },
          { speaker: 'Interviewer', text: 'Interesting. Could you elaborate on that?', translation: '' },
          { speaker: 'You', text: 'Of course. I\'d be happy to walk you through my most recent project.', translation: '' },
        ],
        challenge: [
          { prompt: 'When do you use "a" vs "the"?', answer: 'A/an = indefinite (any one of many); the = definite (specific, both parties know which one)', hint: 'Think of it as introducing vs referring back to something' },
        ],
      },
      {
        id: 'en-PhD',
        level: 'PhD',
        levelLabel: 'PhD — Mastery',
        title: 'English at the Highest Level: Rhetoric, Style & the Written Voice',
        subtitle: 'Oratory techniques, sentence rhythm, register-shifting & writing that makes people stop scrolling',
        duration: '35 m',
        xp: 300,
        vocab: [
          {
            word: 'Verisimilitude',
            pronunciation: 'veh-ris-ih-MIL-ih-tood',
            meaning: 'The appearance of being true or real',
            scenario: 'In creative writing, film critique, or discussing how narratives work.',
            exampleSentence: 'The film\'s power came from its verisimilitude — every detail felt lived-in and real.',
            exampleTranslation: 'The film was powerful because it felt completely real and true.',
            audioText: 'The novel\'s extraordinary verisimilitude made readers forget they were reading fiction.',
          },
          {
            word: 'Liminal',
            pronunciation: 'LIM-in-al',
            meaning: 'Relating to a transitional phase; threshold; in-between state',
            scenario: 'In discussions about change, transitions, or ambiguous states — a word that signals sophisticated thinking.',
            exampleSentence: 'We\'re in a liminal moment — the old systems have broken down but the new ones haven\'t yet emerged.',
            exampleTranslation: 'We\'re at a threshold — between what was and what will be.',
            audioText: 'We exist in a liminal space between the collapse of old certainties and the emergence of new ones.',
          },
        ],
        grammar: [
          {
            rule: 'Sentence rhythm: the Gettysburg Address technique',
            explanation: 'Powerful English writing varies sentence length deliberately. Long sentences build complexity and rhythm. Short ones land. The Gettysburg Address averages 26 words per sentence — but the most memorable line ("...and that government of the people, by the people, for the people, shall not perish from the earth") uses parallel structure (of/by/for the people) for impact. Master: vary length, use parallel structure, and end on the strongest word.',
            examples: [
              { target: 'This is the challenge. We face it alone. We face it with history\'s weight on our shoulders. And we will not blink.', translation: 'Rhythm: medium, short, long, punchy close — each sentence has a different effect' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Host', text: 'What distinguishes truly great writing from merely competent writing?', translation: '' },
          { speaker: 'You', text: 'Competent writing conveys information. Great writing creates an experience. The difference is almost entirely rhythm, specificity, and a willingness to trust the reader with complexity. Verisimilitude, if you want a single word.', translation: '' },
        ],
        challenge: [
          { prompt: 'Use "liminal" in a sentence about your current stage of life or career', answer: 'Any sentence correctly using liminal to describe a transitional, in-between state', hint: 'Think: what threshold are you currently crossing?' },
        ],
      },
    ],
  },
  // ── GERMAN ────────────────────────────────────────────────────────────
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    voiceName: 'de-DE-KatjaNeural',
    script: 'Latin alphabet + Umlauts + Eszett',
    tagline: 'The language of engineering, philosophy & precision.',
    specialChars: [
      { char: 'ä', name: 'a-umlaut', tip: 'Like the "e" in "bed" — Männer, schläft' },
      { char: 'ö', name: 'o-umlaut', tip: 'Round lips like "oh", say "eh" — schön, hören' },
      { char: 'ü', name: 'u-umlaut', tip: 'Round lips like "oo", say "ee" — über, Tür' },
      { char: 'Ä', name: 'A-umlaut', tip: 'Capital version — Äpfel (apples)' },
      { char: 'Ö', name: 'O-umlaut', tip: 'Capital version — Österreich (Austria)' },
      { char: 'Ü', name: 'U-umlaut', tip: 'Capital version — Über (over/above)' },
      { char: 'ß', name: 'Eszett / sharp S', tip: 'Always a double-s sound — Straße, weiß, heiß' },
    ],
    lessons: [
      {
        id: 'de-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'Guten Tag: Structure, Cases & Surviving Germany',
        subtitle: 'Greetings, the 3 genders, formal culture & word order',
        duration: '18 m',
        xp: 150,
        vocab: [
          {
            word: 'Entschuldigung',
            pronunciation: 'ent-SHOOL-dee-goong',
            meaning: 'Excuse me / Sorry',
            scenario: 'A 5-syllable word that\'s your most important survival tool in any German city.',
            exampleSentence: 'Entschuldigung, wo ist der Bahnhof?',
            exampleTranslation: 'Excuse me, where is the train station?',
            audioText: 'Entschuldigung, könnten Sie mir sagen, wo der Bahnhof ist?',
          },
          {
            word: 'Bitte',
            pronunciation: 'BIT-tuh',
            meaning: 'Please / Here you go / You\'re welcome / Pardon?',
            scenario: 'The most versatile word in German — it does the job of four English phrases.',
            exampleSentence: 'Bitte, nehmen Sie Platz.',
            exampleTranslation: 'Please, have a seat.',
            audioText: 'Bitte, nehmen Sie doch Platz',
          },
          {
            word: 'Schadenfreude',
            pronunciation: 'SHA-den-froy-duh',
            meaning: 'Pleasure at another\'s misfortune (a German word the world borrowed)',
            scenario: 'The word English borrowed from German because English didn\'t have one. Understanding it unlocks German psychology.',
            exampleSentence: 'Das ist echte Schadenfreude — er lacht über sein Pech.',
            exampleTranslation: 'That\'s real schadenfreude — he\'s laughing at his misfortune.',
            audioText: 'Schadenfreude ist die Freude über das Unglück anderer — ein typisch menschliches Gefühl',
          },
        ],
        grammar: [
          {
            rule: 'Three genders: der / die / das',
            explanation: 'German has three grammatical genders — masculine (der), feminine (die), neuter (das). Unlike Spanish, there\'s less phonological pattern — you must memorize the article with every noun. Der Mann (the man), die Frau (the woman), das Kind (the child). The only reliable rule: compound nouns take the gender of the last component.',
            examples: [
              { target: 'der Tisch (table), die Lampe (lamp), das Buch (book)', translation: 'All arbitrary — just memorize them' },
              { target: 'das Auto + die Bahn = die Autobahn', translation: 'Compound takes last word\'s gender — die' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: 'Guten Morgen! Entschuldigung, sprechen Sie Englisch?', translation: 'Good morning! Excuse me, do you speak English?' },
          { speaker: 'Local', text: 'Ja, ein bisschen. Was brauchen Sie?', translation: 'Yes, a little. What do you need?' },
          { speaker: 'You', text: 'Ich suche den Hauptbahnhof. Ist es weit?', translation: 'I\'m looking for the main train station. Is it far?' },
          { speaker: 'Local', text: 'Nein, nur fünf Minuten zu Fuß. Geradeaus und dann links.', translation: 'No, just five minutes on foot. Straight ahead and then left.' },
        ],
        challenge: [
          { prompt: 'What are the three German articles for masculine, feminine, and neuter?', answer: 'der (masculine), die (feminine), das (neuter)', hint: 'Each noun has a gender — you must memorize it' },
          { prompt: 'What does "Schadenfreude" mean, and why did English borrow it?', answer: 'Pleasure at someone else\'s misfortune — English had no single word for this concept', hint: 'German compound words are famously precise' },
        ],
      },
      {
        id: 'de-PhD',
        level: 'PhD',
        levelLabel: 'PhD — Cultural Mastery',
        title: 'German Thought: Kant, Nietzsche & Why Philosophy Sounds Better in German',
        subtitle: 'Philosophical vocabulary, compound word logic & the German mind',
        duration: '35 m',
        xp: 300,
        vocab: [
          {
            word: 'Weltanschauung',
            pronunciation: 'VELT-an-shau-oong',
            meaning: 'Worldview — a comprehensive conception of the world and one\'s place in it',
            scenario: 'When discussing someone\'s fundamental beliefs or philosophy — a word without a precise English equivalent.',
            exampleSentence: 'Seine Weltanschauung wurde durch seine Kindheitserfahrungen geformt.',
            exampleTranslation: 'His worldview was shaped by his childhood experiences.',
            audioText: 'Eine kohärente Weltanschauung zu entwickeln ist das Ziel der Philosophie',
          },
          {
            word: 'Zeitgeist',
            pronunciation: 'TSAIT-gaist',
            meaning: 'The spirit of the times — the defining mood of an era',
            scenario: 'Describing the cultural/intellectual atmosphere of a period — another German word the world borrowed.',
            exampleSentence: 'KI ist der Zeitgeist unserer Epoche.',
            exampleTranslation: 'AI is the zeitgeist of our era.',
            audioText: 'Die Künstliche Intelligenz prägt den Zeitgeist unserer Zeit wie keine andere Technologie',
          },
        ],
        grammar: [
          {
            rule: 'The German compound word — infinite precision',
            explanation: 'German builds new words by combining existing ones. Donaudampfschifffahrtsgesellschaft (Danube steamship company). Fingerspitzengefühl (fingertip feeling = intuition). Verschlimmbessern (making something worse while trying to improve it). This isn\'t a quirk — it\'s a feature. German thought tends toward precision and compound words are its tool.',
            examples: [
              { target: 'Fernweh (fern=distant, weh=ache)', translation: 'Longing for distant places — wanderlust' },
              { target: 'Torschlusspanik (gate-closing-panic)', translation: 'The fear that time is running out — "last chance" panic' },
              { target: 'Fingerspitzengefühl (fingertip-feeling)', translation: 'Instinctive sensitivity to a situation; tact' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Professor', text: 'Was ist Ihrer Meinung nach die wichtigste philosophische Frage unserer Zeit?', translation: 'In your opinion, what is the most important philosophical question of our time?' },
          { speaker: 'You', text: 'Ich glaube, es ist die Frage nach Bewusstsein und Autonomie im Zeitalter der KI. Wie Kant es ausdrücken würde: Was dürfen wir hoffen, wenn Maschinen denken können?', translation: 'I believe it\'s the question of consciousness and autonomy in the age of AI. As Kant might put it: what may we hope for, when machines can think?' },
        ],
        challenge: [
          { prompt: 'Create a German compound word for "the anxiety of making a decision too early"', answer: 'Entscheidungsfrühpessimismus or similar creative compound — any coherent combination works', hint: 'Entscheidung=decision, früh=early, Angst=anxiety — combine them German-style' },
        ],
      },
    ],
  },
  // ── DUTCH ─────────────────────────────────────────────────────────────
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    voiceName: 'nl-NL-ColetteNeural',
    script: 'Latin alphabet',
    tagline: '23 million speakers. The closest major language to English. Learn faster than you think.',
    specialChars: [
      { char: 'ij', name: 'IJ digraph', tip: 'Often written as one character — treated as a single vowel, capitalized as IJ not Ij' },
      { char: 'é', name: 'e aigu', tip: 'Used in borrowed words — café, idée' },
      { char: 'ë', name: 'e tréma', tip: 'Signals two separate vowels — geëerd, coëxistentie' },
      { char: 'ï', name: 'i tréma', tip: 'Naïef, Israëli — separate vowel sounds' },
    ],
    lessons: [
      {
        id: 'nl-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'Hallo Nederland: Dutch for English Speakers',
        subtitle: 'The good news: Dutch and English are cousins — here\'s how to use that',
        duration: '18 m',
        xp: 150,
        vocab: [
          {
            word: 'Alsjeblieft',
            pronunciation: 'als-yuh-BLEEFT',
            meaning: 'Please (informal) / Here you go',
            scenario: 'Handing something to someone OR asking for something politely — same word for both in Dutch.',
            exampleSentence: 'Een koffie, alsjeblieft.',
            exampleTranslation: 'A coffee, please.',
            audioText: 'Één koffie, alsjeblieft',
          },
          {
            word: 'Gezellig',
            pronunciation: 'khuh-ZEL-likh',
            meaning: 'Cozy / Convivial / A warm, pleasant atmosphere',
            scenario: 'The Dutch concept the world keeps trying to describe — like Danish hygge but more social.',
            exampleSentence: 'Wat een gezellig feestje!',
            exampleTranslation: 'What a lovely/cozy party!',
            audioText: 'Wat een gezellige avond — ik voel me echt thuis hier',
          },
          {
            word: 'Spreekt u Engels?',
            pronunciation: 'sprekt oo ENG-uls',
            meaning: 'Do you speak English?',
            scenario: 'In the Netherlands, the answer is almost always yes — but asking in Dutch earns enormous respect.',
            exampleSentence: 'Spreekt u Engels? Mijn Nederlands is niet zo goed.',
            exampleTranslation: 'Do you speak English? My Dutch isn\'t very good.',
            audioText: 'Spreekt u ook Engels? Mijn Nederlands is nog niet zo goed',
          },
        ],
        grammar: [
          {
            rule: 'Dutch and English cognates',
            explanation: 'Dutch is the closest major living language to English. Hundreds of words are nearly identical: water=water, wind=wind, hand=hand, man=man, arm=arm, winter=winter, warm=warm, fish=vis (almost!), house=huis. The grammar is harder (de/het articles, verb-at-end in subordinate clauses) but vocabulary acquisition is dramatically faster than any other language for English speakers.',
            examples: [
              { target: 'Ik drink water. (I drink water)', translation: 'Identical word order, identical vocab' },
              { target: 'Het huis is groot. (The house is big)', translation: 'Huis=house, groot=great/big' },
              { target: 'De man heeft een hand. (The man has a hand)', translation: 'Man=man, heeft=has, hand=hand' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: 'Goedemorgen! Heeft u een fiets te huur?', translation: 'Good morning! Do you have a bicycle for rent?' },
          { speaker: 'Shop owner', text: 'Ja, voor hoe lang?', translation: 'Yes, for how long?' },
          { speaker: 'You', text: 'Voor één dag, alsjeblieft.', translation: 'For one day, please.' },
          { speaker: 'Shop owner', text: 'Dat is tien euro. Gezellig fietsen!', translation: 'That\'s ten euros. Enjoy your cycle!' },
        ],
        challenge: [
          { prompt: 'What does "gezellig" mean and why is it untranslatable?', answer: 'A warm, cozy, convivial atmosphere or feeling — no English word captures the social + physical coziness combined', hint: 'It can describe a place, a gathering, or a feeling' },
        ],
      },
      {
        id: 'nl-PhD',
        level: 'PhD',
        levelLabel: 'PhD — Cultural Mastery',
        title: 'The Dutch Golden Age & Why The Netherlands Punches Above Its Weight',
        subtitle: 'Trade mentality, tolerance as policy, Dutch directness & Polder Model',
        duration: '35 m',
        xp: 300,
        vocab: [
          {
            word: 'Doe maar gewoon, dan doe je al gek genoeg',
            pronunciation: 'doo maar khuh-WOON, dan doo yuh al kek khuh-NUKH',
            meaning: 'Just act normal, that\'s already crazy enough (a core Dutch value)',
            scenario: 'The Dutch maxim that explains their culture — no showing off, no pretension, just straightforward excellence.',
            exampleSentence: 'In Nederland zeggen we: doe maar gewoon, dan doe je al gek genoeg.',
            exampleTranslation: 'In the Netherlands we say: just act normal, that\'s already crazy enough.',
            audioText: 'In de Nederlandse cultuur waarderen we bescheidenheid: doe maar gewoon, dan doe je al gek genoeg',
          },
        ],
        grammar: [
          {
            rule: 'Dutch directness in communication',
            explanation: 'The Dutch are considered the most direct communicators in the world, even more than Germans. "Your presentation was boring in the middle section" is a normal Dutch work comment. This directness is not rudeness — it\'s a form of respect. Understanding this transforms cross-cultural interactions with Dutch partners. They say what they mean; they expect you to say what you mean.',
            examples: [
              { target: '"Je presentatie was saai in het midden."', translation: '"Your presentation was boring in the middle." — Normal Dutch feedback, not an insult' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Partner', text: 'Wat vind je echt van ons nieuwe product? Wees eerlijk.', translation: 'What do you really think of our new product? Be honest.' },
          { speaker: 'You', text: 'Het concept is sterk, maar de gebruikerservaring heeft nog wat werk nodig. Kan ik je laten zien wat ik bedoel?', translation: 'The concept is strong, but the user experience still needs some work. Can I show you what I mean?' },
        ],
        challenge: [
          { prompt: 'What does "doe maar gewoon" reveal about Dutch culture?', answer: 'A deep cultural value of egalitarianism and anti-pretension — excellence is expected but showing off is not', hint: 'The Dutch Golden Age made them rich; this phrase kept them grounded' },
        ],
      },
    ],
  },
  // ── RUSSIAN ───────────────────────────────────────────────────────────
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    voiceName: 'ru-RU-SvetlanaNeural',
    script: 'Cyrillic alphabet (33 letters)',
    tagline: '260 million speakers. A new alphabet opens a new world.',
    specialChars: [
      { char: 'А', name: 'A — sounds like "ah"', tip: 'Like "a" in father' },
      { char: 'Б', name: 'B — sounds like "b"', tip: 'Same as English B' },
      { char: 'В', name: 'V — looks like B but sounds like V', tip: 'Common confusion for beginners' },
      { char: 'Г', name: 'G — sounds like "g"', tip: 'Like "g" in go' },
      { char: 'Д', name: 'D — sounds like "d"', tip: 'Like "d" in door' },
      { char: 'Е', name: 'YE — sounds like "yeh"', tip: 'Ye, as in yes' },
      { char: 'Ж', name: 'ZH — sounds like the "s" in measure', tip: 'журнал (zhurnal) = journal' },
      { char: 'Ы', name: 'Y — a sound that doesn\'t exist in English', tip: 'Say "ee" but pull your tongue back — very Russian' },
    ],
    lessons: [
      {
        id: 'ru-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'Привет: Learning Cyrillic & Your First Russian Words',
        subtitle: 'The alphabet in 20 minutes, basic greetings & why Russian is easier than it looks',
        duration: '20 m',
        xp: 165,
        vocab: [
          {
            word: 'Привет',
            pronunciation: 'pree-VYET',
            meaning: 'Hi / Hey (informal)',
            scenario: 'Meeting a Russian friend for coffee in Moscow.',
            exampleSentence: 'Привет! Как дела?',
            exampleTranslation: 'Hi! How are things?',
            audioText: 'Привет! Как ты?',
          },
          {
            word: 'Пожалуйста',
            pronunciation: 'po-ZHAH-loo-sta',
            meaning: 'Please / You\'re welcome',
            scenario: 'Ordering at a Moscow café or thanking someone — same word covers both.',
            exampleSentence: 'Кофе, пожалуйста.',
            exampleTranslation: 'Coffee, please.',
            audioText: 'Один кофе, пожалуйста',
          },
          {
            word: 'Я не понимаю',
            pronunciation: 'ya neh po-nee-MY-oo',
            meaning: 'I don\'t understand',
            scenario: 'Essential phrase for any beginner navigating Russia.',
            exampleSentence: 'Извините, я не понимаю. Говорите медленнее?',
            exampleTranslation: 'Excuse me, I don\'t understand. Could you speak slower?',
            audioText: 'Извините, я не понимаю. Пожалуйста, говорите медленнее',
          },
        ],
        grammar: [
          {
            rule: 'Cyrillic — you can learn it in 20 minutes',
            explanation: '33 letters. Many look familiar: А=A, Е=YE, О=O, К=K, М=M, Т=T. Some are false friends: В=V, Н=N, Р=R, С=S, Х=KH. Some are new: Ж=ZH, Ш=SH, Щ=SHCH, Ю=YU, Я=YA. The soft sign (Ь) softens the preceding consonant. Once you can read Cyrillic, hundreds of international words become instantly readable: ресторан (restoran), театр (teatr), университет (universitet).',
            examples: [
              { target: 'РЕСТОРАН', translation: 'Restaurant — once you read Cyrillic, this is obvious' },
              { target: 'ТАКСИ', translation: 'Taxi — same word' },
              { target: 'ИНТЕРНЕТ', translation: 'Internet — same word' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: 'Здравствуйте! Есть свободный столик?', translation: 'Hello! Do you have a free table?' },
          { speaker: 'Host', text: 'Да, вот столик у окна.', translation: 'Yes, here\'s a table by the window.' },
          { speaker: 'You', text: 'Отлично! Можно меню, пожалуйста?', translation: 'Excellent! May I have the menu, please?' },
        ],
        challenge: [
          { prompt: 'Write the Russian word for "Hello" (informal)', answer: 'Привет', hint: 'Pree-VYET — your first Cyrillic word' },
          { prompt: 'What does ТАКСИ mean in English?', answer: 'Taxi', hint: 'International words are recognizable in Cyrillic once you know the alphabet' },
        ],
      },
      {
        id: 'ru-PhD',
        level: 'PhD',
        levelLabel: 'PhD — Cultural Mastery',
        title: 'The Russian Soul: Dusha, Dostoevsky & the Psychology of a Superpower',
        subtitle: 'Душа (dusha), the White Nights, literary tradition & understanding Russia\'s self-image',
        duration: '35 m',
        xp: 300,
        vocab: [
          {
            word: 'Душа',
            pronunciation: 'doo-SHA',
            meaning: 'Soul — but deeper than English "soul"',
            scenario: 'The central concept of Russian culture. When a Russian says someone has dusha, it\'s the highest compliment.',
            exampleSentence: 'У него богатая душа.',
            exampleTranslation: 'He has a rich soul. (He is a deeply feeling, genuine person)',
            audioText: 'В русской культуре душа — это самое ценное, что есть в человеке',
          },
          {
            word: 'Авось',
            pronunciation: 'ah-VOS',
            meaning: 'Perhaps / Maybe it\'ll work out / Trusting fate',
            scenario: 'A one-word philosophy — the Russian tendency to trust that things will somehow work themselves out.',
            exampleSentence: 'Авось пронесёт!',
            exampleTranslation: 'Maybe it\'ll blow over! / We\'ll get through somehow!',
            audioText: 'Авось пронесёт — это типично русское отношение к жизни',
          },
        ],
        grammar: [
          {
            rule: 'Cases — the hardest thing in Russian',
            explanation: 'Russian has 6 cases (nominative, genitive, dative, accusative, instrumental, prepositional). The same noun changes its ending depending on its role in the sentence. Книга (book, subject). Книги (of a book, genitive). Книге (to a book, dative). Книгу (book, direct object). Книгой (with a book, instrumental). О книге (about a book, prepositional). This is why Russian has flexible word order — the case ending carries the grammatical information.',
            examples: [
              { target: 'Я читаю книгу. (accusative)', translation: 'I am reading a book.' },
              { target: 'У меня нет книги. (genitive)', translation: 'I don\'t have a book.' },
              { target: 'Я думаю о книге. (prepositional)', translation: 'I\'m thinking about a book.' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Friend', text: 'Ты понимаешь русскую душу?', translation: 'Do you understand the Russian soul?' },
          { speaker: 'You', text: 'Я стараюсь. Для меня, русская душа — это способность чувствовать глубоко, страдать красиво, и всё равно верить в людей. Достоевский объяснил это лучше всех.', translation: 'I try. For me, the Russian soul is the ability to feel deeply, to suffer beautifully, and still believe in people. Dostoevsky explained it better than anyone.' },
        ],
        challenge: [
          { prompt: 'What is "Авось" and what does it reveal about Russian psychology?', answer: 'A word meaning "maybe it\'ll work out" — reveals a fatalistic trust in chance and fate, contrasting with Western emphasis on planning and control', hint: 'One word that encapsulates a philosophy' },
        ],
      },
    ],
  },
  // ── JAPANESE ──────────────────────────────────────────────────────────
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    voiceName: 'ja-JP-NanamiNeural',
    script: 'Hiragana + Katakana + Kanji',
    tagline: '125 million speakers. Three scripts. Zero excuses.',
    specialChars: [
      { char: 'あ', name: 'a (hiragana)', tip: 'The first character of hiragana — "ah"' },
      { char: 'い', name: 'i (hiragana)', tip: '"ee" sound' },
      { char: 'う', name: 'u (hiragana)', tip: '"oo" sound' },
      { char: 'え', name: 'e (hiragana)', tip: '"eh" sound' },
      { char: 'お', name: 'o (hiragana)', tip: '"oh" sound' },
      { char: 'ア', name: 'a (katakana)', tip: 'Used for foreign words — アメリカ = America' },
      { char: '私', name: 'watashi (I/me)', tip: 'The formal first-person pronoun' },
      { char: '日', name: 'sun/day/Japan', tip: 'Read "hi", "ka", or "nichi" depending on context' },
    ],
    lessons: [
      {
        id: 'ja-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'はじめまして: First Steps in Japanese',
        subtitle: 'Hiragana, greetings, keigo (politeness levels) & why context is everything',
        duration: '22 m',
        xp: 175,
        vocab: [
          {
            word: 'よろしくお願いします',
            pronunciation: 'yo-ro-shi-ku o-ne-gai shi-mas',
            meaning: 'Please treat me well / Nice to meet you / I\'m in your care',
            scenario: 'Said at first meetings, when making requests, at the end of emails — possibly the most important phrase in Japanese.',
            exampleSentence: 'はじめまして。よろしくお願いします。',
            exampleTranslation: 'Nice to meet you. I\'m in your care. (Please be good to me.)',
            audioText: 'はじめまして。どうぞよろしくお願いします。',
          },
          {
            word: 'すみません',
            pronunciation: 'su-mi-ma-sen',
            meaning: 'Excuse me / I\'m sorry / Thank you (implied)',
            scenario: 'Calling a waiter, bumping into someone, getting someone\'s attention — the universal social lubricant.',
            exampleSentence: 'すみません、水をください。',
            exampleTranslation: 'Excuse me, water please.',
            audioText: 'すみません、お水を一杯いただけますか',
          },
        ],
        grammar: [
          {
            rule: 'Japanese sentence order: SOV',
            explanation: 'Japanese is Subject-Object-Verb. The verb always goes at the end. 私は水を飲みます (I water drink). This is the opposite of English. Adjectives go before nouns (same as English). The topic marker は (wa) marks what the sentence is about. The subject marker が (ga) marks who does the action.',
            examples: [
              { target: '私は日本語を勉強します。', translation: 'I Japanese study. (I study Japanese)' },
              { target: '田中さんがケーキを食べました。', translation: 'Tanaka-san cake ate. (Tanaka-san ate cake)' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: 'はじめまして。ジョーダンと申します。よろしくお願いします。', translation: 'Nice to meet you. My name is Jordan. Please treat me well.' },
          { speaker: 'Host', text: 'こちらこそ。田中です。日本語がお上手ですね！', translation: 'Likewise. I\'m Tanaka. Your Japanese is impressive!' },
          { speaker: 'You', text: 'いいえ、まだまだです。でも、頑張ります。', translation: 'No, no — I still have a long way to go. But I\'ll do my best.' },
        ],
        challenge: [
          { prompt: 'What does よろしくお願いします mean, and when would you use it?', answer: 'Literally: please treat me well / I\'m in your care — used at first meetings, when making requests, in emails, whenever starting a relationship or asking for help', hint: 'One of the most versatile phrases in Japanese — no direct English equivalent' },
        ],
      },
    ],
  },
  // ── ARABIC ────────────────────────────────────────────────────────────
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    voiceName: 'ar-SA-ZariyahNeural',
    script: 'Arabic script — right to left',
    tagline: '400+ million speakers. The language of the Quran, algebra & 22 countries.',
    specialChars: [
      { char: 'ا', name: 'Alef', tip: 'The letter A — the first letter of the alphabet' },
      { char: 'ب', name: 'Ba', tip: 'The letter B' },
      { char: 'ت', name: 'Ta', tip: 'The letter T' },
      { char: 'ع', name: 'Ayn', tip: 'A pharyngeal consonant — no English equivalent, from deep in throat' },
      { char: 'ح', name: 'Ha', tip: 'Emphatic H — like a heavy breath' },
      { char: 'خ', name: 'Kha', tip: 'Like the "ch" in Scottish "loch"' },
      { char: 'غ', name: 'Ghayn', tip: 'Voiced version of Kha — like a gargled G' },
      { char: 'ض', name: 'Dad', tip: 'Emphatic D — Arabic is called "the language of Daad"' },
    ],
    lessons: [
      {
        id: 'ar-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'مرحبا: Arabic Script, Sounds & First Words',
        subtitle: 'Right-to-left script, the sounds English doesn\'t have & greetings that build instant trust',
        duration: '22 m',
        xp: 175,
        vocab: [
          {
            word: 'مرحبا',
            pronunciation: 'mar-HA-ba',
            meaning: 'Hello / Welcome',
            scenario: 'Walking into any shop, home, or meeting in the Arab world.',
            exampleSentence: 'مرحبا! كيف حالك؟',
            exampleTranslation: 'Hello! How are you?',
            audioText: 'مرحبا، كيف حالك اليوم؟',
          },
          {
            word: 'إن شاء الله',
            pronunciation: 'in-sha-AL-lah',
            meaning: 'If God wills / God willing — also: maybe, we\'ll see, hopefully',
            scenario: 'One of the most important phrases in Arabic culture — used constantly, across all contexts.',
            exampleSentence: 'سنلتقي غداً، إن شاء الله.',
            exampleTranslation: 'We\'ll meet tomorrow, God willing.',
            audioText: 'سنلتقي غداً إن شاء الله',
          },
          {
            word: 'شكراً جزيلاً',
            pronunciation: 'shuk-RAN ja-ZEE-lan',
            meaning: 'Thank you very much',
            scenario: 'Expressing deep gratitude — the جزيلاً makes it much more heartfelt than just شكراً.',
            exampleSentence: 'شكراً جزيلاً على كرمك.',
            exampleTranslation: 'Thank you very much for your generosity.',
            audioText: 'شكراً جزيلاً على مساعدتك',
          },
        ],
        grammar: [
          {
            rule: 'Arabic root system: the key to vocabulary',
            explanation: 'Arabic is a root-based language. Most words come from 3-letter roots. The root ك-ت-ب (k-t-b) means "writing/books": كَتَبَ (kataba) = he wrote, كِتَاب (kitaab) = book, كَاتِب (kaatib) = writer, مَكْتَب (maktab) = office/desk, مَكْتَبَة (maktaba) = library. Learn a root and you unlock 5-10 related words instantly.',
            examples: [
              { target: 'ك-ت-ب → كتاب، كاتب، مكتب، مكتبة', translation: 'k-t-b → book, writer, office/desk, library' },
              { target: 'د-ر-س → درس، مدرسة، مدرّس', translation: 'd-r-s → lesson/study, school, teacher' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: 'السلام عليكم!', translation: 'Peace be upon you! (The standard Islamic greeting)' },
          { speaker: 'Host', text: 'وعليكم السلام! أهلاً وسهلاً!', translation: 'And upon you peace! Welcome!' },
          { speaker: 'You', text: 'شكراً جزيلاً على استقبالكم الكريم.', translation: 'Thank you so much for your generous welcome.' },
        ],
        challenge: [
          { prompt: 'What is "إن شاء الله" and when is it used?', answer: '"If God wills" — used constantly in Arab culture for anything in the future, from appointments to aspirations', hint: 'Understanding this phrase transforms your understanding of Arab communication' },
          { prompt: 'What does the Arabic root ك-ت-ب relate to?', answer: 'Writing and books — كتاب (book), كاتب (writer), مكتبة (library), مكتب (office)', hint: 'Arabic roots unlock multiple words at once' },
        ],
      },
    ],
  },
  // ── PORTUGUESE ────────────────────────────────────────────────────────
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    voiceName: 'pt-BR-FranciscaNeural',
    script: 'Latin alphabet + diacritical marks',
    tagline: '260 million speakers. Brazil, Portugal, Angola, Mozambique & more.',
    specialChars: [
      { char: 'ã', name: 'a tilde (nasal)', tip: 'Nasal "ang" sound — não, maçã, irmã' },
      { char: 'õ', name: 'o tilde (nasal)', tip: 'Nasal "ong" sound — não, avião' },
      { char: 'â', name: 'a circumflex', tip: 'Closed "ah" sound — câmera' },
      { char: 'ê', name: 'e circumflex', tip: 'Closed "e" sound — você, têm' },
      { char: 'ô', name: 'o circumflex', tip: 'Closed "oh" sound — avô, pôde' },
      { char: 'ç', name: 'c cedilla', tip: 'Soft C sound before a, o, u — você, ação' },
    ],
    lessons: [
      {
        id: 'pt-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'Olá Brasil: Portuguese for the Real World',
        subtitle: 'Brazilian vs European Portuguese, saudade & the warmth of the language',
        duration: '18 m',
        xp: 150,
        vocab: [
          {
            word: 'Tudo bem?',
            pronunciation: 'TOO-doo beng',
            meaning: 'Everything good? / How\'s it going?',
            scenario: 'The most common Brazilian greeting — "Oi! Tudo bem?" is how millions of conversations start.',
            exampleSentence: 'Oi! Tudo bem com você?',
            exampleTranslation: 'Hey! Everything good with you?',
            audioText: 'Oi! Tudo bem? Como você está?',
          },
          {
            word: 'Saudade',
            pronunciation: 'sau-DA-jee (Brazilian)',
            meaning: 'A deep emotional longing for something absent — a love that remains even when the loved thing is gone',
            scenario: 'An untranslatable Portuguese concept — arguably the most famous word in the language.',
            exampleSentence: 'Tenho saudade de você.',
            exampleTranslation: 'I miss you (I have a longing for you)',
            audioText: 'Tenho tanta saudade da minha terra natal',
          },
        ],
        grammar: [
          {
            rule: 'Nasal vowels — what makes Portuguese sound like Portuguese',
            explanation: 'The nasal vowels (ã, õ, and vowels before m/n) are what give Portuguese its distinctive sound. They\'re produced by passing air through both the mouth and nose. "não" (no) is nasal. "maçã" (apple) is nasal. Brazilian Portuguese softens these sounds compared to European Portuguese. When you master nasal vowels, you start to sound genuinely Portuguese.',
            examples: [
              { target: 'Não (nowng) — no', translation: 'Nasal ão — like "now" but through your nose' },
              { target: 'Irmã (eer-MAH) — sister', translation: 'Final nasal ã' },
              { target: 'Avião (ah-vyah-OWN) — airplane', translation: 'Two nasal sounds in one word' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Friend', text: 'Oi! Tudo bem? Que saudade!', translation: 'Hey! All good? I\'ve missed you so much!' },
          { speaker: 'You', text: 'Tudo ótimo! Eu também tinha muita saudade de você!', translation: 'Everything\'s great! I\'ve missed you so much too!' },
        ],
        challenge: [
          { prompt: 'What is "saudade" and why is it considered untranslatable?', answer: 'A deep, bittersweet longing for something or someone absent — combines love, memory, absence and hope in one word that English cannot capture with a single term', hint: 'Some call it the defining emotion of Portuguese culture' },
        ],
      },
    ],
  },
  // ── HINDI ─────────────────────────────────────────────────────────────
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    voiceName: 'hi-IN-SwaraNeural',
    script: 'Devanagari script',
    tagline: '600 million speakers. The language of Bollywood, business & 1.4 billion people.',
    specialChars: [
      { char: 'अ', name: 'a', tip: 'Short "uh" sound — first letter of Devanagari' },
      { char: 'आ', name: 'aa', tip: 'Long "ah" sound' },
      { char: 'क', name: 'ka', tip: 'The letter K' },
      { char: 'ख', name: 'kha', tip: 'Aspirated K — with a puff of air' },
      { char: 'ग', name: 'ga', tip: 'The letter G' },
      { char: 'न', name: 'na', tip: 'The letter N' },
      { char: 'म', name: 'ma', tip: 'The letter M' },
      { char: 'ह', name: 'ha', tip: 'The letter H' },
    ],
    lessons: [
      {
        id: 'hi-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'नमस्ते: Hindi, Devanagari & the Art of Indian Communication',
        subtitle: 'Script basics, greetings, the head wobble decoded & cultural context',
        duration: '20 m',
        xp: 160,
        vocab: [
          {
            word: 'नमस्ते',
            pronunciation: 'na-MAS-tay',
            meaning: 'Hello / I bow to the divine in you',
            scenario: 'The greeting that carries profound respect — palms together, a slight bow.',
            exampleSentence: 'नमस्ते! आप कैसे हैं?',
            exampleTranslation: 'Hello! How are you?',
            audioText: 'नमस्ते! आप कैसे हैं?',
          },
          {
            word: 'धन्यवाद',
            pronunciation: 'dhan-ya-VAAD',
            meaning: 'Thank you (formal)',
            scenario: 'Formal gratitude — for business settings or with elders.',
            exampleSentence: 'आपकी मदद के लिए धन्यवाद।',
            exampleTranslation: 'Thank you for your help.',
            audioText: 'आपकी सहायता के लिए बहुत धन्यवाद',
          },
          {
            word: 'कोई बात नहीं',
            pronunciation: 'ko-ee BAAT na-HEEN',
            meaning: 'No problem / It\'s nothing / Don\'t mention it',
            scenario: 'The most reassuring phrase in Hindi — puts people at ease.',
            exampleSentence: 'कोई बात नहीं! मुझे खुशी हुई।',
            exampleTranslation: 'No problem! I was happy to help.',
            audioText: 'कोई बात नहीं, यह तो मेरी खुशी थी',
          },
        ],
        grammar: [
          {
            rule: 'Hindi gender: masculine and feminine',
            explanation: 'Hindi has two genders — masculine and feminine. Nouns and adjectives must agree. General rule: nouns ending in -ā (आ) are masculine, nouns ending in -ī (ई) are feminine. Verbs also change: लड़का खाता है (the boy eats — masculine verb form) vs लड़की खाती है (the girl eats — feminine verb form).',
            examples: [
              { target: 'लड़का (laɽkaa) — boy (masculine)', translation: 'Nouns ending in -aa are usually masculine' },
              { target: 'लड़की (laɽkii) — girl (feminine)', translation: 'Nouns ending in -ii are usually feminine' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: 'नमस्ते! क्या आप हिंदी बोलते हैं?', translation: 'Hello! Do you speak Hindi?' },
          { speaker: 'Local', text: 'हाँ, बोलता हूँ! आप बहुत अच्छे हिंदी बोलते हैं!', translation: 'Yes, I speak it! You speak Hindi very well!' },
          { speaker: 'You', text: 'धन्यवाद! मैं अभी सीख रहा हूँ।', translation: 'Thank you! I\'m still learning.' },
        ],
        challenge: [
          { prompt: 'What does नमस्ते literally mean?', answer: 'I bow to the divine in you — from Sanskrit namas (bow/reverence) + te (to you)', hint: 'It\'s more than just "hello" — it\'s a gesture of profound respect' },
        ],
      },
    ],
  },
  // ── KOREAN ────────────────────────────────────────────────────────────
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    voiceName: 'ko-KR-SunHiNeural',
    script: 'Hangul — the world\'s most scientifically designed alphabet',
    tagline: '80 million speakers. Hangul can be learned in a day. The rest is fascinating.',
    specialChars: [
      { char: '가', name: 'ga', tip: 'Consonant ㄱ + vowel ㅏ — builds syllable blocks' },
      { char: '나', name: 'na', tip: 'Consonant ㄴ + vowel ㅏ' },
      { char: '다', name: 'da', tip: 'The "D" block' },
      { char: '안', name: 'an', tip: 'ㅇ(silent)+ㅏ+ㄴ — a closed syllable' },
      { char: '녕', name: 'nyeong', tip: 'ㄴ+ㅛ+ㅇ — part of 안녕 (hello)' },
      { char: '하', name: 'ha', tip: 'ㅎ + ㅏ' },
      { char: '세', name: 'se', tip: 'ㅅ + ㅔ' },
      { char: '요', name: 'yo', tip: 'The polite sentence-ender — almost every polite sentence ends with 요' },
    ],
    lessons: [
      {
        id: 'ko-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: '안녕하세요: Korean, Hangul & Respect Levels',
        subtitle: 'The world\'s most logical alphabet, speech levels & K-culture context',
        duration: '20 m',
        xp: 165,
        vocab: [
          {
            word: '안녕하세요',
            pronunciation: 'an-nyeong-ha-SE-yo',
            meaning: 'Hello (formal/polite)',
            scenario: 'Standard polite greeting for anyone you\'re not close friends with.',
            exampleSentence: '안녕하세요! 저는 조던이에요.',
            exampleTranslation: 'Hello! I\'m Jordan.',
            audioText: '안녕하세요! 처음 뵙겠습니다.',
          },
          {
            word: '감사합니다',
            pronunciation: 'gam-sa-ham-NI-da',
            meaning: 'Thank you (formal)',
            scenario: 'Formal gratitude — in shops, with strangers, in professional settings.',
            exampleSentence: '도와주셔서 감사합니다.',
            exampleTranslation: 'Thank you for helping me.',
            audioText: '도와주셔서 정말 감사합니다',
          },
          {
            word: '맛있어요',
            pronunciation: 'mas-is-SEO-yo',
            meaning: 'It\'s delicious!',
            scenario: 'Say this after every Korean meal. Your host will light up.',
            exampleSentence: '정말 맛있어요! 잘 먹었습니다.',
            exampleTranslation: 'This is really delicious! Thank you for the meal.',
            audioText: '정말 맛있어요! 최고예요!',
          },
        ],
        grammar: [
          {
            rule: 'Hangul: the alphabet invented by a king',
            explanation: 'King Sejong created Hangul in 1443 specifically to improve Korean literacy. It\'s not derived from Chinese or any other script — it was scientifically designed. Consonants are shaped like the mouth position that makes the sound. It can be learned in a few hours: 14 basic consonants + 10 basic vowels = every Korean word. Once you can read Hangul, you can pronounce any Korean word.',
            examples: [
              { target: 'ㄱ looks like the back of the throat closing', translation: 'Makes the G/K sound — the shape shows where it\'s made' },
              { target: 'ㄴ looks like the tongue touching the roof of the mouth', translation: 'Makes the N sound' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'Host', text: '어서 오세요! 처음 오셨어요?', translation: 'Welcome! Is this your first time?' },
          { speaker: 'You', text: '네, 처음이에요. 한국어를 배우고 있어요.', translation: 'Yes, it\'s my first time. I\'m learning Korean.' },
          { speaker: 'Host', text: '와, 정말요? 한국어 잘 하시네요!', translation: 'Wow, really? You speak Korean well!' },
        ],
        challenge: [
          { prompt: 'What makes Hangul special compared to most writing systems?', answer: 'It was scientifically designed from scratch in 1443 — consonant shapes represent the mouth/throat position, making it the most learnable script in the world', hint: 'King Sejong designed it specifically for literacy' },
        ],
      },
    ],
  },
  // ── ITALIAN ───────────────────────────────────────────────────────────
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    voiceName: 'it-IT-ElsaNeural',
    script: 'Latin alphabet',
    tagline: 'The language of art, opera, food & la dolce vita.',
    specialChars: [
      { char: 'à', name: 'a grave', tip: 'In città, già, and some verb forms' },
      { char: 'è', name: 'e grave', tip: 'Open E — è (is), caffè, perché' },
      { char: 'é', name: 'e acute', tip: 'Closed E — perché, benché' },
      { char: 'ì', name: 'i grave', tip: 'In some words to mark stress: sì (yes)' },
      { char: 'ò', name: 'o grave', tip: 'Open O — però, andò' },
      { char: 'ù', name: 'u grave', tip: 'In più (more), giù (down)' },
    ],
    lessons: [
      {
        id: 'it-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'Ciao Italia: The Most Musical Language on Earth',
        subtitle: 'Greetings, gestures, food vocabulary & the art of bella figura',
        duration: '18 m',
        xp: 150,
        vocab: [
          {
            word: 'Prego',
            pronunciation: 'PREY-go',
            meaning: 'You\'re welcome / Please / After you / Go ahead / Here you go',
            scenario: 'The Swiss Army knife of Italian — does the work of five English phrases.',
            exampleSentence: 'Grazie! — Prego!',
            exampleTranslation: 'Thank you! — You\'re welcome!',
            audioText: 'Prego, si accomodi pure',
          },
          {
            word: 'Bella figura',
            pronunciation: 'BEL-la fi-GOO-ra',
            meaning: 'Making a good impression / Cutting a fine figure',
            scenario: 'The organizing principle of Italian social life — how you look, how you carry yourself, how you present to the world.',
            exampleSentence: 'Gli italiani tengono molto alla bella figura.',
            exampleTranslation: 'Italians care deeply about making a good impression.',
            audioText: 'In Italia, fare bella figura è importantissimo in ogni contesto sociale',
          },
          {
            word: 'Mamma mia!',
            pronunciation: 'MAM-ma MEE-a',
            meaning: 'Oh my goodness! / Wow! / What a situation!',
            scenario: 'The most famous Italian expression worldwide — used for surprise, amazement, exasperation.',
            exampleSentence: 'Mamma mia, che traffico!',
            exampleTranslation: 'Oh my goodness, what traffic!',
            audioText: 'Mamma mia, che bella giornata oggi!',
          },
        ],
        grammar: [
          {
            rule: 'Italian gender — endings tell the story',
            explanation: 'Italian nouns are masculine or feminine. Rules: nouns ending in -o are usually masculine (il libro, il vino), nouns ending in -a are usually feminine (la casa, la pasta). Nouns ending in -e can be either (il pane - bread, la classe - class). The article agrees: il/lo/un (masculine), la/una (feminine).',
            examples: [
              { target: 'il ristorante (masculine)', translation: 'the restaurant' },
              { target: 'la cucina (feminine)', translation: 'the kitchen/cuisine' },
              { target: 'l\'amico / l\'amica', translation: 'the friend (male) / the friend (female)' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: 'Buongiorno! Un caffè, per favore.', translation: 'Good morning! A coffee, please.' },
          { speaker: 'Barista', text: 'Subito! Al banco o al tavolo?', translation: 'Right away! At the bar or at a table?' },
          { speaker: 'You', text: 'Al banco, grazie.', translation: 'At the bar, thank you.' },
          { speaker: 'Barista', text: 'Ecco il suo caffè! Prego.', translation: 'Here\'s your coffee! There you go.' },
        ],
        challenge: [
          { prompt: 'What is "bella figura" and why does it matter in Italian culture?', answer: 'Making a good impression — how you look, present yourself, and behave in public. Central to Italian social values, from how you dress to how you speak', hint: 'It\'s not vanity — it\'s a form of social respect' },
        ],
      },
    ],
  },
  // ── SWAHILI ───────────────────────────────────────────────────────────
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇰🇪',
    voiceName: 'sw-KE-ZuriNeural',
    script: 'Latin alphabet',
    tagline: '200 million speakers. The language of East Africa & the African Union.',
    specialChars: [],
    lessons: [
      {
        id: 'sw-A1',
        level: 'A1',
        levelLabel: 'Absolute Beginner',
        title: 'Jambo: Swahili, Ubuntu & the Language of East Africa',
        subtitle: 'The simplest pronunciation in any language, greetings & why Swahili is the key to Africa',
        duration: '18 m',
        xp: 150,
        vocab: [
          {
            word: 'Jambo / Hujambo',
            pronunciation: 'JAM-bo / hoo-JAM-bo',
            meaning: 'Hello (Jambo - tourist greeting / Hujambo - native greeting)',
            scenario: 'Arriving at Jomo Kenyatta Airport in Nairobi.',
            exampleSentence: 'Hujambo! Habari yako?',
            exampleTranslation: 'Hello! How are you?',
            audioText: 'Hujambo! Habari yako leo?',
          },
          {
            word: 'Hakuna matata',
            pronunciation: 'ha-KOO-na ma-TA-ta',
            meaning: 'No worries / No problems (literally: there are no problems)',
            scenario: 'The phrase the Lion King made famous — and Swahili speakers actually use.',
            exampleSentence: 'Hakuna matata! Tutafika kwa wakati.',
            exampleTranslation: 'No worries! We\'ll arrive on time.',
            audioText: 'Hakuna matata, kila kitu kitakuwa sawa',
          },
          {
            word: 'Asante sana',
            pronunciation: 'a-SAN-teh SA-na',
            meaning: 'Thank you very much',
            scenario: 'Expressing deep gratitude in any East African context.',
            exampleSentence: 'Asante sana kwa msaada wako!',
            exampleTranslation: 'Thank you very much for your help!',
            audioText: 'Asante sana kwa msaada wako wa thamani',
          },
          {
            word: 'Ubuntu',
            pronunciation: 'oo-BOON-too',
            meaning: 'I am because we are — humanity through others',
            scenario: 'The Ubuntu philosophy underpins all of Southern and East African culture.',
            exampleSentence: 'Ubuntu inamaanisha kwamba binadamu ni wa kijamii.',
            exampleTranslation: 'Ubuntu means that humans are communal beings.',
            audioText: 'Ubuntu — mimi ni kwa sababu sisi ni',
          },
        ],
        grammar: [
          {
            rule: 'Swahili noun classes — the elegant system',
            explanation: 'Swahili organizes nouns into 8-9 classes, each with its own prefix pattern. Unlike European gender, classes are based on semantics: people (m-/wa-: mtu/watu = person/people), living things (m-/mi-: mti/miti = tree/trees), abstract things (u-: uhuru = freedom). Adjectives and verbs agree with the noun\'s class — so if you know the class, you can build whole sentences.',
            examples: [
              { target: 'Mtu mzuri (m-class: person)', translation: 'A good person — both mtu and mzuri have m-' },
              { target: 'Watu wazuri (wa-class: people)', translation: 'Good people — wa- in both words' },
              { target: 'Kitabu kizuri (ki-class: book)', translation: 'A good book — ki- in both words' },
            ],
          },
        ],
        dialogueLines: [
          { speaker: 'You', text: 'Habari za asubuhi!', translation: 'Good morning! (news of the morning)' },
          { speaker: 'Local', text: 'Nzuri sana! Na wewe?', translation: 'Very good! And you?' },
          { speaker: 'You', text: 'Mimi pia nzuri. Asante. Ninapenda Kenya sana.', translation: 'I\'m good too. Thank you. I love Kenya very much.' },
          { speaker: 'Local', text: 'Karibu Kenya! Tunafurahi uwepo wako!', translation: 'Welcome to Kenya! We\'re happy to have you!' },
        ],
        challenge: [
          { prompt: 'What does Ubuntu mean, and how is it different from Western individualism?', answer: 'Ubuntu = "I am because we are" — identity and humanity are defined through relationships and community, not individual achievement', hint: 'The philosophical opposite of "I think therefore I am"' },
          { prompt: 'What does "Hakuna matata" literally mean?', answer: 'There are no problems / no worries — hakuna = there is no/none, matata = problems/troubles', hint: 'You know this from a famous movie — now you know what it actually means' },
        ],
      },
    ],
  },
]

export function getLanguage(code: LanguageCode): Language | undefined {
  return LANGUAGES.find(l => l.code === code)
}

export function getLesson(langCode: LanguageCode, level: string) {
  const lang = getLanguage(langCode)
  return lang?.lessons.find(l => l.level === level || l.id === `${langCode}-${level}`)
}
