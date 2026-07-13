export type LangCode = 'zh' | 'es' | 'fr' | 'de' | 'ru' | 'nl' | 'ja' | 'ar' | 'pt' | 'it' | 'ko' | 'hi' | 'sw' | 'en'
export type ProfLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'PhD'

export interface VocabItem {
  word: string
  romanization?: string
  translation: string
  partOfSpeech: string
  scenario: string
  exampleNative: string
  exampleEnglish: string
}

export interface LangLevel {
  level: ProfLevel
  label: string
  description: string
  cefr: string
  azureVoice: string
  vocab: VocabItem[]
  grammar: string[]
  drillSentences: { native: string; english: string }[]
}

export interface Language {
  code: LangCode
  name: string
  nativeName: string
  flag: string
  family: string
  speakers: string
  specialChars: { char: string; description: string }[]
  levels: LangLevel[]
}

const SHARED_PHD_NOTE = 'At PhD level you synthesise across academic papers, negotiate contracts, deliver keynotes, and produce original written work indistinguishable from an educated native speaker.'

export const LANGUAGES: Language[] = [
  // ─── MANDARIN ────────────────────────────────────────────────────
  {
    code: 'zh',
    name: 'Mandarin Chinese',
    nativeName: '普通话',
    flag: '🇨🇳',
    family: 'Sino-Tibetan',
    speakers: '1.1 billion',
    specialChars: [
      { char: 'ā', description: 'a — 1st tone (flat)' },
      { char: 'á', description: 'a — 2nd tone (rising)' },
      { char: 'ǎ', description: 'a — 3rd tone (dip)' },
      { char: 'à', description: 'a — 4th tone (falling)' },
      { char: 'ē', description: 'e — 1st tone' },
      { char: 'é', description: 'e — 2nd tone' },
      { char: 'ě', description: 'e — 3rd tone' },
      { char: 'è', description: 'e — 4th tone' },
      { char: 'ü', description: 'ü — rounded u' },
      { char: '你好', description: 'Hello (type it!)' },
      { char: '谢谢', description: 'Thank you' },
      { char: '请', description: 'Please' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Greetings, numbers, colours, basic survival phrases. You can introduce yourself and understand very slow speech.',
        azureVoice: 'zh-CN-XiaoxiaoNeural',
        vocab: [
          { word: '你好', romanization: 'nǐ hǎo', translation: 'Hello', partOfSpeech: 'greeting', scenario: 'You walk into a business meeting in Shenzhen — the first word out of your mouth sets the tone.', exampleNative: '你好！我是Jordan。', exampleEnglish: 'Hello! I am Jordan.' },
          { word: '谢谢', romanization: 'xiè xie', translation: 'Thank you', partOfSpeech: 'phrase', scenario: 'A client hands you their business card with both hands — you receive it respectfully and say this.', exampleNative: '谢谢你的帮助。', exampleEnglish: 'Thank you for your help.' },
          { word: '对不起', romanization: 'duì bu qǐ', translation: 'Sorry / Excuse me', partOfSpeech: 'phrase', scenario: 'You bump into someone in a Beijing market — this immediately defuses the situation.', exampleNative: '对不起，我迟到了。', exampleEnglish: 'Sorry, I am late.' },
          { word: '多少钱', romanization: 'duō shao qián', translation: 'How much does it cost?', partOfSpeech: 'question', scenario: 'You spot something you want at a street vendor — this is your power question.', exampleNative: '这个多少钱？', exampleEnglish: 'How much is this?' },
          { word: '我不懂', romanization: 'wǒ bù dǒng', translation: "I don't understand", partOfSpeech: 'phrase', scenario: 'A supplier speaks too fast — say this confidently instead of nodding and hoping.', exampleNative: '对不起，我不懂。请说慢一点。', exampleEnglish: "Sorry, I don't understand. Please speak more slowly." },
          { word: '请', romanization: 'qǐng', translation: 'Please', partOfSpeech: 'adverb', scenario: 'Ordering at a restaurant — this one word makes you sound polite and intentional.', exampleNative: '请给我一杯水。', exampleEnglish: 'Please give me a glass of water.' },
          { word: '是', romanization: 'shì', translation: 'Yes / to be', partOfSpeech: 'verb', scenario: 'Confirming an order, agreeing with a statement — the bedrock verb in Chinese.', exampleNative: '是的，我同意。', exampleEnglish: 'Yes, I agree.' },
          { word: '不', romanization: 'bù', translation: 'No / not', partOfSpeech: 'negation', scenario: 'Declining something gracefully — tone 4 before most words, tone 2 before another tone 4.', exampleNative: '我不喝酒。', exampleEnglish: "I don't drink alcohol." },
          { word: '朋友', romanization: 'péng yǒu', translation: 'Friend', partOfSpeech: 'noun', scenario: 'Introducing your business contact as a friend signals warmth in Chinese culture.', exampleNative: '他是我的朋友。', exampleEnglish: 'He is my friend.' },
          { word: '再见', romanization: 'zài jiàn', translation: 'Goodbye', partOfSpeech: 'greeting', scenario: 'Ending a call or meeting — always say this rather than just hanging up.', exampleNative: '明天见！再见！', exampleEnglish: 'See you tomorrow! Goodbye!' },
        ],
        grammar: [
          'Mandarin has NO verb conjugation — 我吃 (I eat), 你吃 (you eat), 他吃 (he eats) — the verb never changes.',
          'Tones are MEANING, not music: mā (mother) vs mǎ (horse) vs mà (scold) — same letters, completely different words.',
          'Word order: Subject → Verb → Object, same as English: 我爱你 = I love you.',
          'Negation: put 不 (bù) before the verb: 我不去 = I\'m not going.',
          'Questions: add 吗 (ma) to the end of any statement: 你是学生。 = You are a student. → 你是学生吗？ = Are you a student?',
        ],
        drillSentences: [
          { native: '你叫什么名字？', english: 'What is your name?' },
          { native: '我叫Jordan。', english: 'My name is Jordan.' },
          { native: '你好吗？', english: 'How are you?' },
          { native: '我很好，谢谢。', english: 'I am very well, thank you.' },
          { native: '这是什么？', english: 'What is this?' },
        ],
      },
      {
        level: 'A2', label: 'Elementary', cefr: 'A2',
        description: 'Simple transactions, directions, talking about family and work. Navigating daily life with confidence.',
        azureVoice: 'zh-CN-XiaoxiaoNeural',
        vocab: [
          { word: '工作', romanization: 'gōng zuò', translation: 'Work / job', partOfSpeech: 'noun/verb', scenario: 'Networking at a Shanghai conference — "what do you do?" is the first real question.', exampleNative: '你做什么工作？', exampleEnglish: 'What work do you do?' },
          { word: '公司', romanization: 'gōng sī', translation: 'Company', partOfSpeech: 'noun', scenario: 'Pitching your services to a Chinese manufacturer.', exampleNative: '我的公司专注于科技解决方案。', exampleEnglish: 'My company focuses on tech solutions.' },
          { word: '价格', romanization: 'jià gé', translation: 'Price', partOfSpeech: 'noun', scenario: 'Negotiating a wholesale deal — this word will come up in every business conversation.', exampleNative: '我们可以谈价格吗？', exampleEnglish: 'Can we discuss the price?' },
          { word: '合同', romanization: 'hé tong', translation: 'Contract', partOfSpeech: 'noun', scenario: 'Closing a deal with a supplier in Guangzhou.', exampleNative: '我们准备好签合同了吗？', exampleEnglish: 'Are we ready to sign the contract?' },
          { word: '银行', romanization: 'yín háng', translation: 'Bank', partOfSpeech: 'noun', scenario: 'You need to arrange payment — knowing how to find a bank is essential.', exampleNative: '最近的银行在哪里？', exampleEnglish: 'Where is the nearest bank?' },
          { word: '时间', romanization: 'shí jiān', translation: 'Time', partOfSpeech: 'noun', scenario: 'Scheduling a follow-up meeting — Chinese business culture values punctuality.', exampleNative: '我们什么时间开会？', exampleEnglish: 'What time do we meet?' },
          { word: '地址', romanization: 'dì zhǐ', translation: 'Address', partOfSpeech: 'noun', scenario: 'Coordinating a delivery from a Chinese supplier.', exampleNative: '请告诉我你们的地址。', exampleEnglish: 'Please tell me your address.' },
          { word: '非常', romanization: 'fēi cháng', translation: 'Very / extremely', partOfSpeech: 'adverb', scenario: 'Complimenting a partner — Chinese business culture appreciates warmth.', exampleNative: '你的演示非常精彩！', exampleEnglish: 'Your presentation was extremely brilliant!' },
        ],
        grammar: [
          'Measure words: every noun has one — 一本书 (yī běn shū = one book), 一个人 (yī gè rén = one person). 个 is the default.',
          'Time phrases come BEFORE the verb: 我明天去北京 = I tomorrow go Beijing = I\'m going to Beijing tomorrow.',
          'The particle 了 (le) signals completed action: 我吃了 = I ate / I have eaten.',
          '的 (de) shows possession: 我的朋友 = my friend, 公司的产品 = the company\'s product.',
          'Comparison: A 比 B + adjective: 他比我高 = He is taller than me.',
        ],
        drillSentences: [
          { native: '我在科技公司工作。', english: 'I work at a tech company.' },
          { native: '请问，洗手间在哪里？', english: 'Excuse me, where is the restroom?' },
          { native: '我想订一个房间。', english: 'I would like to book a room.' },
          { native: '你们有英文菜单吗？', english: 'Do you have an English menu?' },
          { native: '我需要收据。', english: 'I need a receipt.' },
        ],
      },
      {
        level: 'B1', label: 'Intermediate', cefr: 'B1',
        description: 'Handle most travel, work and social situations. Discuss plans, opinions, and experiences.',
        azureVoice: 'zh-CN-YunxiNeural',
        vocab: [
          { word: '谈判', romanization: 'tán pàn', translation: 'Negotiation', partOfSpeech: 'noun/verb', scenario: 'A serious business negotiation in a Chinese boardroom — tone matters as much as words.', exampleNative: '我们需要继续谈判。', exampleEnglish: 'We need to continue the negotiation.' },
          { word: '市场', romanization: 'shì chǎng', translation: 'Market', partOfSpeech: 'noun', scenario: 'Discussing market entry strategy with a Chinese partner.', exampleNative: '中国市场非常有潜力。', exampleEnglish: 'The Chinese market has enormous potential.' },
          { word: '关系', romanization: 'guān xi', translation: 'Relationship / connections', partOfSpeech: 'noun', scenario: 'Guanxi (关系) is the foundation of Chinese business — relationships come before transactions.', exampleNative: '建立好的关系需要时间。', exampleEnglish: 'Building good relationships takes time.' },
          { word: '投资', romanization: 'tóu zī', translation: 'Investment', partOfSpeech: 'noun/verb', scenario: 'Presenting a business case to a Chinese investor.', exampleNative: '这个项目值得投资。', exampleEnglish: 'This project is worth investing in.' },
          { word: '策略', romanization: 'cè lüè', translation: 'Strategy', partOfSpeech: 'noun', scenario: 'Planning a market expansion with your team.', exampleNative: '我们需要调整我们的策略。', exampleEnglish: 'We need to adjust our strategy.' },
        ],
        grammar: [
          'Potential complement: 做得到 (can do it) vs 做不到 (can\'t do it) — add 得/不 between verb and result.',
          'The particle 过 (guò) indicates life experience: 你去过中国吗？= Have you ever been to China?',
          'Resultative complements: 学会 (learned successfully), 写完 (finished writing), 听懂 (understood by listening).',
          'Pivotal sentences: 我叫他去 = I asked him to go (subject becomes object AND subject of next clause).',
          'Topic-comment structure: 这件事，我早就知道了 = This matter, I knew long ago. Topic front-loaded.',
        ],
        drillSentences: [
          { native: '我认为我们应该重新考虑这个提案。', english: 'I think we should reconsider this proposal.' },
          { native: '能不能把价格再降一些？', english: 'Is it possible to lower the price a bit more?' },
          { native: '我对中国文化很感兴趣。', english: 'I am very interested in Chinese culture.' },
          { native: '我们的产品在亚洲市场很受欢迎。', english: 'Our products are very popular in the Asian market.' },
          { native: '我已经和他们谈过了。', english: 'I have already talked with them.' },
        ],
      },
      {
        level: 'B2', label: 'Upper Intermediate', cefr: 'B2',
        description: 'Complex topics, nuanced opinion, professional writing, understanding native speakers at natural speed.',
        azureVoice: 'zh-CN-YunxiNeural',
        vocab: [
          { word: '供应链', romanization: 'gōng yìng liàn', translation: 'Supply chain', partOfSpeech: 'noun', scenario: 'Discussing global logistics disruptions with a manufacturing partner.', exampleNative: '全球供应链受到了严重冲击。', exampleEnglish: 'The global supply chain suffered severe disruption.' },
          { word: '知识产权', romanization: 'zhī shi chǎn quán', translation: 'Intellectual property', partOfSpeech: 'noun', scenario: 'Protecting your tech IP before sharing designs with a Chinese factory.', exampleNative: '我们需要保护知识产权。', exampleEnglish: 'We need to protect intellectual property.' },
          { word: '可持续发展', romanization: 'kě chí xù fā zhǎn', translation: 'Sustainable development', partOfSpeech: 'phrase', scenario: 'ESG pitch to a Chinese institutional investor.', exampleNative: '可持续发展是我们核心战略。', exampleEnglish: 'Sustainable development is our core strategy.' },
        ],
        grammar: [
          'Classical Chinese phrases appear in modern formal writing: 此致敬礼 (email closing), 敬请回复 (please reply).',
          'Four-character idioms (成语 chéngyǔ) signal education and refinement — e.g. 马到成功 (immediate success).',
          'Passive: 被 (bèi) + agent + verb: 合同被取消了 = The contract was cancelled.',
          'Modal adverbs for nuance: 其实 (actually), 毕竟 (after all), 虽然...但是 (although...but).',
        ],
        drillSentences: [
          { native: '尽管遇到了困难，我们仍然完成了项目。', english: 'Despite encountering difficulties, we still completed the project.' },
          { native: '这份报告需要在周五之前提交。', english: 'This report needs to be submitted before Friday.' },
          { native: '请问您对我们的方案有什么意见？', english: 'May I ask what opinions you have on our proposal?' },
        ],
      },
      {
        level: 'C1', label: 'Advanced', cefr: 'C1',
        description: 'Spontaneous, fluent, precise expression. You understand implicit meaning, humor and cultural references.',
        azureVoice: 'zh-CN-YunxiNeural',
        vocab: [
          { word: '宏观经济', romanization: 'hóng guān jīng jì', translation: 'Macroeconomics', partOfSpeech: 'noun', scenario: 'Conference panel discussion on global financial policy.', exampleNative: '宏观经济政策对汇率有重大影响。', exampleEnglish: 'Macroeconomic policy has a major impact on exchange rates.' },
          { word: '辩证法', romanization: 'biàn zhèng fǎ', translation: 'Dialectics', partOfSpeech: 'noun', scenario: 'Academic debate — Marxist dialectics is referenced often in Chinese elite discourse.', exampleNative: '我们用辩证法分析这个问题。', exampleEnglish: 'We analyse this problem using dialectics.' },
        ],
        grammar: [
          'Master 把 (bǎ) construction for disposal: 把合同带来 = bring the contract (disposing of it towards a goal).',
          'Understand register shifts: 吃饭 (casual eat) vs 用餐 (formal dine) vs 进膳 (imperial/ceremonial).',
          'Complex conditionals: 即使...也, 除非...否则, 只有...才 — each with distinct logical nuance.',
        ],
        drillSentences: [
          { native: '只有深刻理解文化背景，才能真正掌握一门语言。', english: 'Only by deeply understanding cultural context can you truly master a language.' },
          { native: '这个问题需要从多角度进行全面分析。', english: 'This issue requires comprehensive multi-angle analysis.' },
        ],
      },
      {
        level: 'C2', label: 'Mastery', cefr: 'C2',
        description: 'Near-native precision, idiomatic command, ability to write formal documents and persuade native speakers.',
        azureVoice: 'zh-CN-YunxiNeural',
        vocab: [
          { word: '精髓', romanization: 'jīng suǐ', translation: 'Essence / quintessence', partOfSpeech: 'noun', scenario: 'Literary essay or keynote — capturing the soul of an idea.', exampleNative: '这正是中华文化的精髓所在。', exampleEnglish: 'This is precisely the essence of Chinese culture.' },
          { word: '韬光养晦', romanization: 'tāo guāng yǎng huì', translation: 'Bide your time, build strength quietly', partOfSpeech: 'chengyu', scenario: 'Geopolitical strategy discussion — Deng Xiaoping\'s famous doctrine.', exampleNative: '韬光养晦是一种长远战略。', exampleEnglish: 'Biding one\'s time and building strength is a long-term strategy.' },
        ],
        grammar: [
          'Classical poetry forms: 七言绝句 (7-character quatrain) — understanding tonal patterns in classical verse.',
          'Bureaucratic / legal Chinese: 鉴于 (in view of), 特此通知 (hereby notify), 依据 (pursuant to).',
          'Rhetorical structures in formal speeches: 三个代表 pattern — tricolon reinforcement.',
        ],
        drillSentences: [
          { native: '纵观历史，凡成大事者，皆能忍人所不能忍。', english: 'Throughout history, those who accomplish great things can endure what others cannot.' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'zh-CN-YunxiNeural',
        vocab: [
          { word: '话语权', romanization: 'huà yǔ quán', translation: 'Discursive power / right to define narrative', partOfSpeech: 'noun', scenario: 'Academic paper on media and geopolitical influence — Foucauldian analysis in Chinese.', exampleNative: '在国际秩序中争夺话语权是当代大国博弈的核心。', exampleEnglish: 'Competing for discursive power within the international order is the core of contemporary great-power competition.' },
        ],
        grammar: [
          'Dissertation-level: 就...而言 (as far as...is concerned), 有别于 (distinct from), 不乏其例 (examples abound).',
          'Academic citation format in Chinese: 根据（作者，年份）的研究 — structure and punctuation conventions.',
          'Phonological analysis: understanding dialectal variation (Wu, Cantonese, Min) relative to Putonghua standard.',
        ],
        drillSentences: [
          { native: '本文旨在探讨后殖民视角下的语言权力与文化身份认同。', english: 'This paper aims to explore linguistic power and cultural identity from a postcolonial perspective.' },
        ],
      },
    ],
  },

  // ─── SPANISH ─────────────────────────────────────────────────────
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    family: 'Romance (Indo-European)',
    speakers: '500 million',
    specialChars: [
      { char: 'á', description: 'a with accent' },
      { char: 'é', description: 'e with accent' },
      { char: 'í', description: 'i with accent' },
      { char: 'ó', description: 'o with accent' },
      { char: 'ú', description: 'u with accent' },
      { char: 'ü', description: 'u with umlaut (güe)' },
      { char: 'ñ', description: 'eñe — señor, mañana' },
      { char: '¿', description: 'Opening question mark' },
      { char: '¡', description: 'Opening exclamation' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Introduce yourself, basic numbers, days, greetings. Survive in any Spanish-speaking country.',
        azureVoice: 'es-ES-ElviraNeural',
        vocab: [
          { word: 'Hola', translation: 'Hello', partOfSpeech: 'greeting', scenario: 'Walking into any business in Latin America — warmth first, business second.', exampleNative: '¡Hola! ¿Cómo está usted?', exampleEnglish: 'Hello! How are you?' },
          { word: 'Gracias', translation: 'Thank you', partOfSpeech: 'phrase', scenario: 'A Colombian client brings you coffee — your response sets the relational tone.', exampleNative: 'Muchas gracias por su tiempo.', exampleEnglish: 'Thank you very much for your time.' },
          { word: 'Por favor', translation: 'Please', partOfSpeech: 'phrase', scenario: 'Ordering in a restaurant in Madrid — courtesy signals class.', exampleNative: 'Un café, por favor.', exampleEnglish: 'A coffee, please.' },
          { word: '¿Cuánto cuesta?', translation: 'How much does it cost?', partOfSpeech: 'question', scenario: 'Browsing a Mexican artisan market — your power shopping phrase.', exampleNative: '¿Cuánto cuesta este artículo?', exampleEnglish: 'How much does this item cost?' },
          { word: 'No entiendo', translation: "I don't understand", partOfSpeech: 'phrase', scenario: 'A local speaks regional slang — own the confusion, don\'t bluff.', exampleNative: 'Perdón, no entiendo. ¿Puede repetir más despacio?', exampleEnglish: "Sorry, I don't understand. Can you repeat more slowly?" },
          { word: 'Buenos días', translation: 'Good morning', partOfSpeech: 'greeting', scenario: 'Starting any morning call with a Latin American client — use through ~12pm.', exampleNative: 'Buenos días a todos.', exampleEnglish: 'Good morning, everyone.' },
          { word: 'Me llamo', translation: 'My name is', partOfSpeech: 'phrase', scenario: 'Introducing yourself at any Latin American or Spanish networking event.', exampleNative: 'Me llamo Jordan. Encantado de conocerle.', exampleEnglish: 'My name is Jordan. Pleased to meet you.' },
          { word: 'Sí / No', translation: 'Yes / No', partOfSpeech: 'particle', scenario: 'Confirming or declining a business proposal — directness is respected.', exampleNative: 'Sí, estoy de acuerdo.', exampleEnglish: 'Yes, I agree.' },
        ],
        grammar: [
          'Spanish has 2 genders: masculine (el/un) and feminine (la/una). Most -o nouns are masculine, -a nouns feminine.',
          'Verb SER vs ESTAR — both mean "to be": SER for permanent identity (I am Jamaican), ESTAR for state (I am tired).',
          'Subject pronouns are optional — verb endings already encode person: Hablo = I speak (tú/él/yo clear from context).',
          '¿Verdad? / ¿No? at end of sentence = "right?" — adds confirmation-seeking warmth.',
          'Diminutives signal warmth and informality: café → cafecito, momento → momentito.',
        ],
        drillSentences: [
          { native: '¿De dónde es usted?', english: 'Where are you from?' },
          { native: 'Soy de Jamaica.', english: 'I am from Jamaica.' },
          { native: '¿Habla usted inglés?', english: 'Do you speak English?' },
          { native: 'Un poco. Estoy aprendiendo español.', english: 'A little. I am learning Spanish.' },
          { native: '¿Dónde está el baño?', english: 'Where is the bathroom?' },
        ],
      },
      {
        level: 'A2', label: 'Elementary', cefr: 'A2',
        description: 'Daily life, shopping, work basics, navigating cities across 21 Spanish-speaking countries.',
        azureVoice: 'es-ES-ElviraNeural',
        vocab: [
          { word: 'Negocio', translation: 'Business', partOfSpeech: 'noun', scenario: 'Pitching your services at a conference in Bogotá.', exampleNative: 'Tengo un negocio de tecnología en Jamaica.', exampleEnglish: 'I have a technology business in Jamaica.' },
          { word: 'Reunión', translation: 'Meeting', partOfSpeech: 'noun', scenario: 'Scheduling with a Mexican client across time zones.', exampleNative: '¿Podemos tener una reunión el lunes?', exampleEnglish: 'Can we have a meeting on Monday?' },
          { word: 'Precio', translation: 'Price', partOfSpeech: 'noun', scenario: 'Negotiating with a Spanish supplier.', exampleNative: '¿Es posible mejorar el precio?', exampleEnglish: 'Is it possible to improve the price?' },
          { word: 'Cliente', translation: 'Client / Customer', partOfSpeech: 'noun', scenario: 'Referring to your clientele when presenting your portfolio.', exampleNative: 'Nuestros clientes están muy satisfechos.', exampleEnglish: 'Our clients are very satisfied.' },
          { word: 'Factura', translation: 'Invoice', partOfSpeech: 'noun', scenario: 'Following up on payment from a Latin American partner.', exampleNative: '¿Puede enviarme la factura por correo electrónico?', exampleEnglish: 'Can you send me the invoice by email?' },
        ],
        grammar: [
          'Preterite (past completed): hablé, comí, viví — regular patterns + key irregulars: fui (went), tuve (had), dije (said).',
          'Imperfect (habitual/descriptive past): hablaba, comía — "I used to speak", "it was raining".',
          'Direct + indirect object pronouns: lo, la, le, me, te, nos — placement rules (before conjugated verb, attached to infinitive).',
          'Reflexive verbs: me llamo, se llama — action bounces back to subject.',
        ],
        drillSentences: [
          { native: 'Ayer tuve una reunión con el cliente.', english: 'Yesterday I had a meeting with the client.' },
          { native: 'Necesito enviarle una propuesta esta semana.', english: 'I need to send him a proposal this week.' },
          { native: '¿A qué hora abre el banco?', english: 'What time does the bank open?' },
        ],
      },
      {
        level: 'B1', label: 'Intermediate', cefr: 'B1',
        description: 'Handle most professional situations, discuss opinions, follow native TV and podcasts.',
        azureVoice: 'es-MX-DaliaNeural',
        vocab: [
          { word: 'Propuesta', translation: 'Proposal', partOfSpeech: 'noun', scenario: 'Submitting a formal business proposal to a Spanish-speaking government agency.', exampleNative: 'He preparado una propuesta detallada para su consideración.', exampleEnglish: 'I have prepared a detailed proposal for your consideration.' },
          { word: 'Acuerdo', translation: 'Agreement', partOfSpeech: 'noun', scenario: 'Closing a deal — this word seals it.', exampleNative: 'Hemos llegado a un acuerdo beneficioso para ambas partes.', exampleEnglish: 'We have reached an agreement beneficial to both parties.' },
          { word: 'Mercado', translation: 'Market', partOfSpeech: 'noun', scenario: 'Presenting market analysis to investors.', exampleNative: 'El mercado latinoamericano ofrece grandes oportunidades.', exampleEnglish: 'The Latin American market offers great opportunities.' },
        ],
        grammar: [
          'Subjunctive mood — the biggest hurdle in Spanish: quiero que vengas (I want you to come) — doubt, desire, emotion trigger it.',
          'Conditional: hablaría (I would speak) — polite requests, hypotheticals.',
          'Ser vs Estar mastered: la reunión es a las 3 (ser for scheduled event) vs estoy listo (estar for state).',
        ],
        drillSentences: [
          { native: 'Es importante que lleguemos a un acuerdo esta semana.', english: 'It is important that we reach an agreement this week.' },
          { native: 'Si tuviéramos más tiempo, haríamos una presentación más completa.', english: 'If we had more time, we would make a more complete presentation.' },
        ],
      },
      {
        level: 'B2', label: 'Upper Intermediate', cefr: 'B2',
        description: 'Complex professional communication, understanding regional dialects, persuasive writing.',
        azureVoice: 'es-MX-DaliaNeural',
        vocab: [
          { word: 'Rentabilidad', translation: 'Profitability / ROI', partOfSpeech: 'noun', scenario: 'Financial reporting to Spanish-speaking board members.', exampleNative: 'La rentabilidad ha mejorado un 23% este trimestre.', exampleEnglish: 'Profitability has improved 23% this quarter.' },
        ],
        grammar: [
          'Voseo (Argentina/Uruguay): vos hablás, vos tenés — different from tuteo (tú hablas).',
          'Regional vocabulary: carro (MX) vs coche (ES) vs auto (AR) for car — same language, different words.',
          'Formal subjunctive past: si hubiera sabido (if I had known) — sophisticated hypotheticals.',
        ],
        drillSentences: [
          { native: 'Aunque los resultados han sido positivos, aún queda mucho por mejorar.', english: 'Although the results have been positive, there is still much to improve.' },
        ],
      },
      {
        level: 'C1', label: 'Advanced', cefr: 'C1',
        description: 'Spontaneous fluency, nuanced humor, idioms, regional register shifts.',
        azureVoice: 'es-ES-ElviraNeural',
        vocab: [
          { word: 'Elocuencia', translation: 'Eloquence', partOfSpeech: 'noun', scenario: 'Complimenting a speaker after a keynote in Madrid.', exampleNative: 'Su elocuencia ha cautivado a toda la audiencia.', exampleEnglish: 'Your eloquence captivated the entire audience.' },
        ],
        grammar: [
          'Inversion for emphasis: Jamás lo hubiera imaginado (Never would I have imagined it).',
          'Mastering ser/estar in all contexts including with adjectives that change meaning: ser aburrido (to be boring) vs estar aburrido (to be bored).',
        ],
        drillSentences: [
          { native: 'No cabe duda de que el mercado ha experimentado cambios estructurales profundos.', english: 'There is no doubt that the market has experienced deep structural changes.' },
        ],
      },
      {
        level: 'C2', label: 'Mastery', cefr: 'C2',
        description: 'Near-native command — write contracts, deliver keynotes, debate politics in any Spanish-speaking country.',
        azureVoice: 'es-ES-ElviraNeural',
        vocab: [
          { word: 'Preponderancia', translation: 'Preponderance / dominance', partOfSpeech: 'noun', scenario: 'Academic paper on economic dominance in the Latin American region.', exampleNative: 'La preponderancia del dólar sigue siendo un factor determinante.', exampleEnglish: 'The preponderance of the dollar remains a determining factor.' },
        ],
        grammar: ['Full command of all subjunctive tenses in literary and colloquial register.', 'Understanding 16th-century Spanish syntax in literature (Cervantes, García Márquez).'],
        drillSentences: [{ native: 'Ojalá que las generaciones futuras puedan disfrutar de un mundo más justo y equitativo.', english: 'May future generations be able to enjoy a more just and equitable world.' }],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'es-ES-ElviraNeural',
        vocab: [
          { word: 'Hegemonía', translation: 'Hegemony', partOfSpeech: 'noun', scenario: 'Political science dissertation on US influence in Latin America.', exampleNative: 'La hegemonía cultural se manifiesta a través de múltiples mecanismos discursivos.', exampleEnglish: 'Cultural hegemony manifests through multiple discursive mechanisms.' },
        ],
        grammar: ['Academic register: asimismo, no obstante, en virtud de, cabe señalar — transition arsenal.', 'Spanish Royal Academy (RAE) style guide compliance for formal publications.'],
        drillSentences: [{ native: 'El presente estudio examina la intersección entre identidad lingüística y poder económico en el contexto caribeño.', english: 'The present study examines the intersection between linguistic identity and economic power in the Caribbean context.' }],
      },
    ],
  },

  // ─── FRENCH ──────────────────────────────────────────────────────
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    family: 'Romance (Indo-European)',
    speakers: '300 million',
    specialChars: [
      { char: 'à', description: 'a grave — à Paris' },
      { char: 'â', description: 'a circumflex — château' },
      { char: 'é', description: 'e acute — été' },
      { char: 'è', description: 'e grave — très' },
      { char: 'ê', description: 'e circumflex — fête' },
      { char: 'î', description: 'i circumflex — île' },
      { char: 'ô', description: 'o circumflex — côte' },
      { char: 'û', description: 'u circumflex — sûr' },
      { char: 'ù', description: 'u grave — où' },
      { char: 'ü', description: 'u umlaut — Noël' },
      { char: 'ç', description: 'c cedilla — français' },
      { char: 'œ', description: 'oe ligature — cœur' },
      { char: '«', description: 'French open quote' },
      { char: '»', description: 'French close quote' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Survive in Paris, greet clients, order food, count money. French opens doors across Africa, the Caribbean, and Europe.',
        azureVoice: 'fr-FR-DeniseNeural',
        vocab: [
          { word: 'Bonjour', translation: 'Good day / Hello', partOfSpeech: 'greeting', scenario: 'Walking into ANY French establishment — skipping this is considered rude, not efficient.', exampleNative: 'Bonjour ! Comment puis-je vous aider ?', exampleEnglish: 'Good day! How can I help you?' },
          { word: 'Merci', translation: 'Thank you', partOfSpeech: 'phrase', scenario: 'A Parisian colleague holds the door — this plus a slight nod is all you need.', exampleNative: 'Merci beaucoup pour votre aide.', exampleEnglish: 'Thank you very much for your help.' },
          { word: "S'il vous plaît", translation: 'Please (formal)', partOfSpeech: 'phrase', scenario: 'Ordering at a brasserie — politeness is a performance in French culture.', exampleNative: "Un verre de vin rouge, s'il vous plaît.", exampleEnglish: 'A glass of red wine, please.' },
          { word: 'Excusez-moi', translation: 'Excuse me', partOfSpeech: 'phrase', scenario: 'Getting a waiter\'s attention in Paris — wave optional, phrase mandatory.', exampleNative: "Excusez-moi, où sont les toilettes ?", exampleEnglish: 'Excuse me, where are the toilets?' },
          { word: "Je ne comprends pas", translation: "I don't understand", partOfSpeech: 'phrase', scenario: 'When a French native speaks at full speed — admitting it is respected.', exampleNative: "Je ne comprends pas. Pourriez-vous répéter ?", exampleEnglish: "I don't understand. Could you repeat?" },
          { word: 'Combien ça coûte ?', translation: 'How much does it cost?', partOfSpeech: 'question', scenario: 'Any market or boutique in Francophone Africa or Paris.', exampleNative: "Combien coûte cette robe ?", exampleEnglish: 'How much does this dress cost?' },
        ],
        grammar: [
          'ALL nouns have gender: le (masc) / la (fem), un (masc) / une (fem). Memorize gender WITH the noun.',
          'Liaison: words link in spoken French — les enfants sounds like "lay-zenfant". Silent letters come alive before vowels.',
          'Vous (formal/plural) vs tu (informal) — ALWAYS use vous with strangers, clients, elders until invited to switch.',
          'Negation wraps the verb: je ne parle pas = I do not speak. Ne...pas is the standard sandwich.',
        ],
        drillSentences: [
          { native: 'Je m\'appelle Jordan. Enchanté(e).', english: 'My name is Jordan. Pleased to meet you.' },
          { native: 'D\'où venez-vous ?', english: 'Where do you come from?' },
          { native: 'Je viens de la Jamaïque.', english: 'I come from Jamaica.' },
          { native: 'Parlez-vous anglais ?', english: 'Do you speak English?' },
        ],
      },
      {
        level: 'B1', label: 'Intermediate', cefr: 'B1',
        description: 'Business correspondence, opinion expression, African and Caribbean French contexts.',
        azureVoice: 'fr-FR-DeniseNeural',
        vocab: [
          { word: 'Partenariat', translation: 'Partnership', partOfSpeech: 'noun', scenario: 'Proposal to a Côte d\'Ivoire investor for a joint venture.', exampleNative: 'Nous proposons un partenariat stratégique à long terme.', exampleEnglish: 'We propose a long-term strategic partnership.' },
          { word: 'Marché', translation: 'Market', partOfSpeech: 'noun', scenario: 'Pitching expansion into Francophone West Africa.', exampleNative: 'Le marché africain francophone est en pleine expansion.', exampleEnglish: 'The Francophone African market is in full expansion.' },
        ],
        grammar: [
          'Subjonctif: il faut que vous soyez (you must be) — desire, necessity, doubt trigger it.',
          'Conditionnel: je voudrais (I would like) — the most important polite form.',
          'Agreement of past participle with avoir verbs when direct object precedes: la lettre que j\'ai écrite.',
        ],
        drillSentences: [
          { native: 'Il est essentiel que nous trouvions une solution rapidement.', english: 'It is essential that we find a solution quickly.' },
          { native: 'Je voudrais vous soumettre notre proposition commerciale.', english: 'I would like to submit our commercial proposal to you.' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'fr-FR-DeniseNeural',
        vocab: [
          { word: 'Épistémologie', translation: 'Epistemology', partOfSpeech: 'noun', scenario: 'Academic philosophy paper — French academia loves epistemological framing.', exampleNative: "L'épistémologie de Foucault remet en question les fondements du savoir occidental.", exampleEnglish: "Foucault's epistemology calls into question the foundations of Western knowledge." },
        ],
        grammar: ['Nominalisation: converting verbs to abstract nouns — a hallmark of high French academic register.', 'Passive impersonal: il est à noter que, force est de constater que.'],
        drillSentences: [{ native: "La présente recherche vise à analyser les dynamiques postcoloniales au sein des institutions francophones.", english: 'The present research aims to analyse postcolonial dynamics within Francophone institutions.' }],
      },
    ],
  },

  // ─── GERMAN ──────────────────────────────────────────────────────
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    family: 'Germanic (Indo-European)',
    speakers: '130 million',
    specialChars: [
      { char: 'ä', description: 'a-umlaut — Mädchen' },
      { char: 'ö', description: 'o-umlaut — schön' },
      { char: 'ü', description: 'u-umlaut — über' },
      { char: 'Ä', description: 'capital Ä' },
      { char: 'Ö', description: 'capital Ö' },
      { char: 'Ü', description: 'capital Ü' },
      { char: 'ß', description: 'Eszett — straße (street)' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Greetings, numbers, basic questions. German precision starts here.',
        azureVoice: 'de-DE-KatjaNeural',
        vocab: [
          { word: 'Guten Tag', translation: 'Good day', partOfSpeech: 'greeting', scenario: 'Professional greeting in any German business context — Hallo is too casual for first meetings.', exampleNative: 'Guten Tag! Mein Name ist Jordan.', exampleEnglish: 'Good day! My name is Jordan.' },
          { word: 'Danke', translation: 'Thank you', partOfSpeech: 'phrase', scenario: 'Any act of service — German directness means no need to over-embellish.', exampleNative: 'Danke schön für Ihre Hilfe.', exampleEnglish: 'Thank you very much for your help.' },
          { word: 'Bitte', translation: 'Please / You\'re welcome', partOfSpeech: 'phrase', scenario: 'Both "please" when asking AND "you\'re welcome" when thanked — one word, dual function.', exampleNative: 'Einen Kaffee, bitte.', exampleEnglish: 'A coffee, please.' },
          { word: 'Entschuldigung', translation: 'Excuse me / Sorry', partOfSpeech: 'phrase', scenario: 'Getting someone\'s attention or apologising — yes, it\'s long, practice it until automatic.', exampleNative: 'Entschuldigung, wo ist der Ausgang?', exampleEnglish: 'Excuse me, where is the exit?' },
          { word: 'Wie viel kostet das?', translation: 'How much does that cost?', partOfSpeech: 'question', scenario: 'Any shop or market in Germany, Austria, or Switzerland.', exampleNative: 'Wie viel kostet dieses Produkt?', exampleEnglish: 'How much does this product cost?' },
        ],
        grammar: [
          'German has 3 genders: der (masc), die (fem), das (neuter) — must be memorized per noun.',
          '4 cases: Nominative (subject), Accusative (object), Dative (indirect object), Genitive (possession) — articles change.',
          'Verb goes SECOND in a main clause: Heute gehe ich ins Büro = Today I-go to-the office.',
          'Compound nouns: Donaudampfschifffahrtsgesellschaft — German stacks nouns into one word. Learn the components.',
          'Formal address: Sie (capital S) — use always with strangers and in business until invited to use du.',
        ],
        drillSentences: [
          { native: 'Ich bin aus Jamaika.', english: 'I am from Jamaica.' },
          { native: 'Sprechen Sie Englisch?', english: 'Do you speak English?' },
          { native: 'Ich verstehe das nicht.', english: "I don't understand that." },
          { native: 'Können Sie das bitte wiederholen?', english: 'Can you please repeat that?' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'de-DE-KatjaNeural',
        vocab: [
          { word: 'Weltanschauung', translation: 'World view / comprehensive philosophy', partOfSpeech: 'noun', scenario: 'Philosophy seminar — this untranslatable German concept appears in English academic texts too.', exampleNative: 'Hegels Weltanschauung bildet die Grundlage des deutschen Idealismus.', exampleEnglish: "Hegel's Weltanschauung forms the foundation of German Idealism." },
        ],
        grammar: ['Konjunktiv II for academic hedging: es wäre denkbar, dass... (it would be conceivable that...).', 'Genitive constructions in academic prose: angesichts, infolge, hinsichtlich, im Rahmen.'],
        drillSentences: [{ native: 'Die vorliegende Untersuchung analysiert die epistemologischen Grundlagen der kritischen Theorie.', english: 'The present study analyses the epistemological foundations of critical theory.' }],
      },
    ],
  },

  // ─── RUSSIAN ─────────────────────────────────────────────────────
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    family: 'Slavic (Indo-European)',
    speakers: '258 million',
    specialChars: [
      { char: 'А', description: 'A — as in father' },
      { char: 'Б', description: 'B' },
      { char: 'В', description: 'V' },
      { char: 'Г', description: 'G' },
      { char: 'Д', description: 'D' },
      { char: 'Е', description: 'YE' },
      { char: 'Ж', description: 'ZH (measure)' },
      { char: 'З', description: 'Z' },
      { char: 'И', description: 'EE' },
      { char: 'Й', description: 'Y (short)' },
      { char: 'К', description: 'K' },
      { char: 'Л', description: 'L' },
      { char: 'М', description: 'M' },
      { char: 'Н', description: 'N' },
      { char: 'О', description: 'O' },
      { char: 'П', description: 'P' },
      { char: 'Р', description: 'R (rolled)' },
      { char: 'С', description: 'S' },
      { char: 'Т', description: 'T' },
      { char: 'У', description: 'OO' },
      { char: 'Ф', description: 'F' },
      { char: 'Х', description: 'KH (Bach)' },
      { char: 'Ц', description: 'TS' },
      { char: 'Ч', description: 'CH' },
      { char: 'Ш', description: 'SH' },
      { char: 'Щ', description: 'SHCH' },
      { char: 'Ъ', description: 'Hard sign (no sound)' },
      { char: 'Ы', description: 'Ï (guttural i)' },
      { char: 'Ь', description: 'Soft sign' },
      { char: 'Э', description: 'E (open)' },
      { char: 'Ю', description: 'YU' },
      { char: 'Я', description: 'YA' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Master the Cyrillic alphabet first, then basic survival phrases.',
        azureVoice: 'ru-RU-SvetlanaNeural',
        vocab: [
          { word: 'Привет', romanization: 'Privet', translation: 'Hi (informal)', partOfSpeech: 'greeting', scenario: 'Greeting a Russian tech contact your age at a startup event.', exampleNative: 'Привет! Меня зовут Джордан.', exampleEnglish: 'Hi! My name is Jordan.' },
          { word: 'Здравствуйте', romanization: 'Zdravstvuyte', translation: 'Hello (formal)', partOfSpeech: 'greeting', scenario: 'Meeting a Russian business partner for the first time — formal respect is non-negotiable.', exampleNative: 'Здравствуйте! Рад познакомиться.', exampleEnglish: 'Hello! Pleased to meet you.' },
          { word: 'Спасибо', romanization: 'Spasibo', translation: 'Thank you', partOfSpeech: 'phrase', scenario: 'After any service or gift — Russians appreciate warmth beneath the formal exterior.', exampleNative: 'Большое спасибо за вашу помощь.', exampleEnglish: 'Thank you very much for your help.' },
          { word: 'Сколько стоит?', romanization: 'Skolko stoit?', translation: 'How much does it cost?', partOfSpeech: 'question', scenario: 'Market in Moscow or negotiating import pricing.', exampleNative: 'Сколько стоит этот товар?', exampleEnglish: 'How much does this item cost?' },
          { word: 'Я не понимаю', romanization: 'Ya ne ponimayu', translation: "I don't understand", partOfSpeech: 'phrase', scenario: 'Russian business conversations move fast — say this, don\'t nod blankly.', exampleNative: 'Извините, я не понимаю. Можете повторить?', exampleEnglish: "Excuse me, I don't understand. Can you repeat?" },
        ],
        grammar: [
          'Learn Cyrillic FIRST — it takes 2-3 hours and unlocks everything. Many letters are shared: А, Е, М, Т, О.',
          'Russian has NO articles (no the/a) — Это книга = This (is) book / The book.',
          'Russian has NO verb "to be" in present tense: Я студент = I (am) student.',
          '6 cases change noun endings: Nominative, Genitive, Dative, Accusative, Instrumental, Prepositional.',
          'Stress is unpredictable and changes meaning: замок (zámok = castle) vs замок (zamók = lock).',
        ],
        drillSentences: [
          { native: 'Как вас зовут?', english: 'What is your name? (formal)' },
          { native: 'Меня зовут Джордан.', english: 'My name is Jordan.' },
          { native: 'Вы говорите по-английски?', english: 'Do you speak English?' },
          { native: 'Где находится метро?', english: 'Where is the metro?' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'ru-RU-SvetlanaNeural',
        vocab: [
          { word: 'Онтология', romanization: 'Ontologiya', translation: 'Ontology', partOfSpeech: 'noun', scenario: 'Philosophy dissertation — Russian academic tradition is deeply rooted in German Idealism and Soviet dialectical materialism.', exampleNative: 'Онтологические основания марксистской диалектики остаются предметом дискуссий.', exampleEnglish: 'The ontological foundations of Marxist dialectics remain a subject of debate.' },
        ],
        grammar: ['Aspect pairs mastered: читать/прочитать (to read/to have read) — imperfective vs perfective.', 'Participles and gerunds in formal prose: являясь, будучи, рассматривая.'],
        drillSentences: [{ native: 'Данное исследование посвящено анализу лингвистических механизмов политического дискурса.', english: 'This research is devoted to the analysis of linguistic mechanisms in political discourse.' }],
      },
    ],
  },

  // ─── DUTCH ───────────────────────────────────────────────────────
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    family: 'Germanic (Indo-European)',
    speakers: '25 million',
    specialChars: [
      { char: 'é', description: 'e acute — café' },
      { char: 'ë', description: 'e umlaut — geëerd' },
      { char: 'ï', description: 'i umlaut — naïef' },
      { char: 'ó', description: 'o acute — lóópbaan' },
      { char: 'ij', description: 'ij — treats as one letter — tijd' },
      { char: 'IJ', description: 'IJ — capital — IJssel' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Dutch is the closest major language to English — you already know more than you think.',
        azureVoice: 'nl-NL-ColetteNeural',
        vocab: [
          { word: 'Hallo', translation: 'Hello', partOfSpeech: 'greeting', scenario: 'Amsterdam business meeting or Rotterdam port logistics partner.', exampleNative: 'Hallo! Mijn naam is Jordan.', exampleEnglish: 'Hello! My name is Jordan.' },
          { word: 'Dank je wel', translation: 'Thank you', partOfSpeech: 'phrase', scenario: 'Informal thanks — use dank u wel (formal) in business contexts.', exampleNative: 'Dank u wel voor uw tijd.', exampleEnglish: 'Thank you for your time.' },
          { word: 'Alsjeblieft', translation: 'Please / Here you go', partOfSpeech: 'phrase', scenario: 'Both "please" when requesting AND when handing something to someone — critical dual-use word.', exampleNative: 'Een koffie, alsjeblieft.', exampleEnglish: 'A coffee, please.' },
          { word: 'Hoeveel kost dat?', translation: 'How much does that cost?', partOfSpeech: 'question', scenario: 'Trade fair in Amsterdam or negotiating Dutch supplier pricing.', exampleNative: 'Hoeveel kost het om uw dienst te gebruiken?', exampleEnglish: 'How much does it cost to use your service?' },
        ],
        grammar: [
          'De (common gender) vs Het (neuter) — two genders, no reliable rule, memorize per noun.',
          'Dutch word order: verb always goes second in main clauses, to the END in subordinate clauses.',
          "G is pronounced as a guttural 'kh' sound — goed (good) sounds like 'khoot'.",
          'English cognates are everywhere: water, hand, arm, bank, hotel, internet — your head start is real.',
        ],
        drillSentences: [
          { native: 'Ik kom uit Jamaica.', english: 'I come from Jamaica.' },
          { native: 'Spreekt u Engels?', english: 'Do you speak English?' },
          { native: 'Ik begrijp het niet.', english: "I don't understand." },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'nl-NL-ColetteNeural',
        vocab: [
          { word: 'Rechtsstatelijkheid', translation: 'Rule of law / constitutional democracy', partOfSpeech: 'noun', scenario: 'Legal or political science paper on Dutch constitutional law.', exampleNative: 'Rechtsstatelijkheid vormt de kern van de Nederlandse democratische traditie.', exampleEnglish: 'The rule of law forms the core of the Dutch democratic tradition.' },
        ],
        grammar: ['Formal written register: dientengevolge, desalniettemin, teneinde (consequently, nevertheless, in order to).'],
        drillSentences: [{ native: 'Dit onderzoek beoogt de structurele ongelijkheden in het Nederlandse onderwijsstelsel te analyseren.', english: 'This research aims to analyse the structural inequalities in the Dutch educational system.' }],
      },
    ],
  },

  // ─── JAPANESE ────────────────────────────────────────────────────
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    family: 'Japonic',
    speakers: '125 million',
    specialChars: [
      { char: 'あ', description: 'a — hiragana' },
      { char: 'い', description: 'i — hiragana' },
      { char: 'う', description: 'u — hiragana' },
      { char: 'え', description: 'e — hiragana' },
      { char: 'お', description: 'o — hiragana' },
      { char: 'ア', description: 'a — katakana' },
      { char: 'イ', description: 'i — katakana' },
      { char: 'ウ', description: 'u — katakana' },
      { char: 'エ', description: 'e — katakana' },
      { char: 'オ', description: 'o — katakana' },
      { char: '日本語', description: 'Japanese (kanji)' },
      { char: 'ありがとう', description: 'Thank you (hiragana)' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Hiragana alphabet (46 chars), katakana alphabet, basic phrases. Japan is a top-5 global economy.',
        azureVoice: 'ja-JP-NanamiNeural',
        vocab: [
          { word: 'こんにちは', romanization: 'Konnichiwa', translation: 'Hello (daytime)', partOfSpeech: 'greeting', scenario: 'Meeting a Japanese tech partner at a Tokyo conference.', exampleNative: 'こんにちは！ジョーダンと申します。', exampleEnglish: 'Hello! My name is Jordan (humble form).' },
          { word: 'ありがとうございます', romanization: 'Arigatou gozaimasu', translation: 'Thank you (formal)', partOfSpeech: 'phrase', scenario: 'After receiving anything — a card, a gift, an introduction — always bow slightly.', exampleNative: 'ありがとうございます。大変助かりました。', exampleEnglish: 'Thank you very much. You helped me greatly.' },
          { word: 'すみません', romanization: 'Sumimasen', translation: 'Excuse me / Sorry', partOfSpeech: 'phrase', scenario: 'Getting attention at a restaurant, apologising for being late — the most versatile social lubricant.', exampleNative: 'すみません、お会計をお願いします。', exampleEnglish: 'Excuse me, the bill please.' },
          { word: 'いくらですか', romanization: 'Ikura desu ka?', translation: 'How much is it?', partOfSpeech: 'question', scenario: 'Any purchase in Japan — cashless is growing but this phrase still works everywhere.', exampleNative: 'これはいくらですか？', exampleEnglish: 'How much is this?' },
          { word: 'わかりません', romanization: 'Wakarimasen', translation: "I don't understand", partOfSpeech: 'phrase', scenario: 'When a colleague speaks too fast — never bluff in Japanese business culture, honesty is respected.', exampleNative: 'すみません、わかりません。もう一度お願いします。', exampleEnglish: "Sorry, I don't understand. Once more, please." },
        ],
        grammar: [
          'Learn Hiragana first (46 chars) — 1 week of daily practice. Then Katakana (loan words). Kanji is lifelong.',
          'Japanese is SOV: Subject → Object → Verb. 私は水を飲みます = I water drink (I drink water).',
          'Politeness levels: plain (friends), polite -masu/-desu forms (business default), honorific keigo (meetings).',
          'Particles mark grammatical role: は (topic), が (subject), を (object), に (direction/time), で (location/means).',
          'No plural forms, no articles. Context and counters signal quantity.',
        ],
        drillSentences: [
          { native: 'お名前は何ですか？', english: 'What is your name? (polite)' },
          { native: 'ジャマイカから来ました。', english: 'I came from Jamaica.' },
          { native: '英語を話せますか？', english: 'Can you speak English?' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'ja-JP-NanamiNeural',
        vocab: [
          { word: '言語相対論', romanization: 'Gengo sōtairon', translation: 'Linguistic relativity (Sapir-Whorf hypothesis)', partOfSpeech: 'noun', scenario: 'Academic linguistics paper at Kyoto University.', exampleNative: '言語相対論は言語が思考を規定するか否かという問いに答えようとする。', exampleEnglish: 'Linguistic relativity attempts to answer whether language determines thought.' },
        ],
        grammar: ['Academic 候文 (sorobun) awareness for historical texts.', 'Keigo mastery: sonkeigo (respect) vs kenjōgo (humble) — never confuse them in formal writing.'],
        drillSentences: [{ native: '本論文は日本語における敬語体系の社会言語学的機能を考察するものである。', english: 'This paper examines the sociolinguistic functions of the Japanese honorific system.' }],
      },
    ],
  },

  // ─── ARABIC ──────────────────────────────────────────────────────
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    family: 'Semitic (Afro-Asiatic)',
    speakers: '422 million',
    specialChars: [
      { char: 'ا', description: 'Alef — A' },
      { char: 'ب', description: 'Ba — B' },
      { char: 'ت', description: 'Ta — T' },
      { char: 'ث', description: 'Tha — TH' },
      { char: 'ج', description: 'Jeem — J' },
      { char: 'ح', description: 'Ha — H (deep)' },
      { char: 'خ', description: 'Kha — KH' },
      { char: 'د', description: 'Dal — D' },
      { char: 'ذ', description: 'Dhal — DH' },
      { char: 'ر', description: 'Ra — R (rolled)' },
      { char: 'ز', description: 'Zay — Z' },
      { char: 'س', description: 'Seen — S' },
      { char: 'ش', description: 'Sheen — SH' },
      { char: 'ص', description: 'Sad — emphatic S' },
      { char: 'ض', description: 'Dad — emphatic D' },
      { char: 'ط', description: 'Ta — emphatic T' },
      { char: 'ظ', description: 'Dha — emphatic DH' },
      { char: 'ع', description: "Ayn — pharyngeal '" },
      { char: 'غ', description: 'Ghayn — guttural G' },
      { char: 'ف', description: 'Fa — F' },
      { char: 'ق', description: 'Qaf — deep K' },
      { char: 'ك', description: 'Kaf — K' },
      { char: 'ل', description: 'Lam — L' },
      { char: 'م', description: 'Meem — M' },
      { char: 'ن', description: 'Noon — N' },
      { char: 'ه', description: 'Ha — H' },
      { char: 'و', description: 'Waw — W/OO' },
      { char: 'ي', description: 'Ya — Y/EE' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Right-to-left script, Arabic alphabet, Modern Standard Arabic (MSA) basics.',
        azureVoice: 'ar-SA-ZariyahNeural',
        vocab: [
          { word: 'مرحبا', romanization: 'Marhaba', translation: 'Hello', partOfSpeech: 'greeting', scenario: 'Universal greeting across the Arab world — opens every door.', exampleNative: 'مرحبا! اسمي جوردان.', exampleEnglish: 'Hello! My name is Jordan.' },
          { word: 'شكراً', romanization: 'Shukran', translation: 'Thank you', partOfSpeech: 'phrase', scenario: 'Any act of generosity — Arab hospitality culture expects warm acknowledgment.', exampleNative: 'شكراً جزيلاً على كرمكم.', exampleEnglish: 'Thank you very much for your generosity.' },
          { word: 'السلام عليكم', romanization: "As-salamu alaykum", translation: 'Peace be upon you', partOfSpeech: 'greeting', scenario: 'The universal Islamic greeting — use it, mean it, and always respond وعليكم السلام.', exampleNative: 'السلام عليكم ورحمة الله وبركاته.', exampleEnglish: 'Peace, mercy and blessings of God be upon you.' },
          { word: 'بكم هذا؟', romanization: 'Bikam hada?', translation: 'How much is this?', partOfSpeech: 'question', scenario: 'Souq negotiation in Dubai, Cairo, or Marrakech.', exampleNative: 'بكم هذا المنتج؟', exampleEnglish: 'How much is this product?' },
        ],
        grammar: [
          'Arabic script is written RIGHT TO LEFT. Letters connect and change shape depending on position.',
          'Root system: 3-letter roots generate entire word families. كتب (k-t-b) = write → كتاب (book), كاتب (writer), مكتبة (library).',
          'Dual form: add ـان suffix — كتابان = two books. No need to say "two" separately.',
          'Broken plurals: no simple -s rule. كتاب → كتب, رجل → رجال — each must be memorized.',
          'MSA (Modern Standard Arabic) = written + formal. Colloquial dialects vary widely by country.',
        ],
        drillSentences: [
          { native: 'ما اسمك؟', english: 'What is your name?' },
          { native: 'أنا من جامايكا.', english: 'I am from Jamaica.' },
          { native: 'هل تتحدث الإنجليزية؟', english: 'Do you speak English?' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'ar-SA-ZariyahNeural',
        vocab: [
          { word: 'الهيمنة الثقافية', romanization: "Al-haymana al-thaqafiyya", translation: 'Cultural hegemony', partOfSpeech: 'noun', scenario: 'Post-colonial studies dissertation at Cairo University.', exampleNative: 'تُحلِّل هذه الدراسة مفهوم الهيمنة الثقافية في سياق الخطاب الإعلامي العربي.', exampleEnglish: 'This study analyses the concept of cultural hegemony in the context of Arab media discourse.' },
        ],
        grammar: ['Classical Arabic (فصحى) syntax for Quranic and legal text analysis.', 'Rhetorical devices: سجع (rhymed prose), طباق (antithesis), جناس (paronomasia).'],
        drillSentences: [{ native: 'تسعى هذه الأطروحة إلى استجلاء الأبعاد الاجتماعية للخطاب السياسي العربي المعاصر.', english: 'This dissertation seeks to elucidate the social dimensions of contemporary Arab political discourse.' }],
      },
    ],
  },

  // ─── PORTUGUESE ──────────────────────────────────────────────────
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    family: 'Romance (Indo-European)',
    speakers: '260 million',
    specialChars: [
      { char: 'ã', description: 'a nasal — irmã' },
      { char: 'õ', description: 'o nasal — não' },
      { char: 'â', description: 'a circumflex' },
      { char: 'ê', description: 'e circumflex' },
      { char: 'ô', description: 'o circumflex' },
      { char: 'á', description: 'a acute' },
      { char: 'é', description: 'e acute' },
      { char: 'í', description: 'i acute' },
      { char: 'ó', description: 'o acute' },
      { char: 'ú', description: 'u acute' },
      { char: 'ç', description: 'c cedilla — coração' },
      { char: 'à', description: 'a grave (contraction)' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Brazil is top-10 GDP. Portuguese unlocks Brazil, Portugal, Angola, Mozambique, Cape Verde.',
        azureVoice: 'pt-BR-FranciscaNeural',
        vocab: [
          { word: 'Olá', translation: 'Hello', partOfSpeech: 'greeting', scenario: 'Universal greeting — same in Brazilian (olá / oi) and European Portuguese.', exampleNative: 'Olá! Meu nome é Jordan.', exampleEnglish: 'Hello! My name is Jordan.' },
          { word: 'Obrigado/a', translation: 'Thank you (m/f)', partOfSpeech: 'phrase', scenario: 'Gender agreement in thanks — male speaker says obrigado, female says obrigada.', exampleNative: 'Muito obrigado pela sua atenção.', exampleEnglish: 'Thank you very much for your attention.' },
          { word: 'Por favor', translation: 'Please', partOfSpeech: 'phrase', scenario: 'Same as Spanish — same Latin root, same use.', exampleNative: 'Um café, por favor.', exampleEnglish: 'A coffee, please.' },
          { word: 'Quanto custa?', translation: 'How much does it cost?', partOfSpeech: 'question', scenario: 'Shopping in São Paulo or negotiating with a Brazilian supplier.', exampleNative: 'Quanto custa este produto?', exampleEnglish: 'How much does this product cost?' },
        ],
        grammar: [
          'BR Portuguese vs European: você (BR you) vs tu (PT you). Pronunciation differs significantly.',
          'Nasal vowels: ã, ão, em, en — these sounds don\'t exist in English. Crucial for being understood.',
          'Personal infinitive: unique to Portuguese — canto (I sing) → para eu cantar (for me to sing). No other Romance language has this.',
        ],
        drillSentences: [
          { native: 'De onde você é?', english: 'Where are you from? (Brazilian)' },
          { native: 'Sou da Jamaica.', english: 'I am from Jamaica.' },
          { native: 'Você fala inglês?', english: 'Do you speak English?' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'pt-BR-FranciscaNeural',
        vocab: [
          { word: 'Lusofonia', translation: 'Lusosphere / Portuguese-speaking world', partOfSpeech: 'noun', scenario: 'Academic paper on post-colonial relations across the Portuguese-speaking world.', exampleNative: 'A lusofonia como projeto identitário pós-colonial merece análise crítica aprofundada.', exampleEnglish: 'The Lusosphere as a post-colonial identity project deserves thorough critical analysis.' },
        ],
        grammar: ['Future subjunctive — unique survival in Portuguese from Latin. When used correctly, marks you instantly as educated.', 'Camões-era syntax for literary analysis of Os Lusíadas.'],
        drillSentences: [{ native: 'A presente investigação propõe uma análise crítica das relações de poder inscritas nos discursos coloniais.', english: 'The present investigation proposes a critical analysis of power relations inscribed in colonial discourses.' }],
      },
    ],
  },

  // ─── ITALIAN ─────────────────────────────────────────────────────
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    family: 'Romance (Indo-European)',
    speakers: '85 million',
    specialChars: [
      { char: 'à', description: 'a grave — città' },
      { char: 'è', description: 'e grave — è (is)' },
      { char: 'é', description: 'e acute — perché' },
      { char: 'ì', description: 'i grave — così' },
      { char: 'ò', description: 'o grave — però' },
      { char: 'ó', description: 'o acute' },
      { char: 'ù', description: 'u grave — più' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Music, fashion, food, luxury, finance — Italian is the language of culture and style.',
        azureVoice: 'it-IT-ElsaNeural',
        vocab: [
          { word: 'Ciao', translation: 'Hi / Bye (informal)', partOfSpeech: 'greeting', scenario: 'Casual greeting — also used as goodbye. Use "Buongiorno" in formal/business contexts.', exampleNative: 'Ciao! Come stai?', exampleEnglish: 'Hi! How are you?' },
          { word: 'Grazie', translation: 'Thank you', partOfSpeech: 'phrase', scenario: 'Italian warmth is expressive — grazie mille (a thousand thanks) is common.', exampleNative: 'Grazie mille per il suo aiuto.', exampleEnglish: 'A thousand thanks for your help.' },
          { word: 'Per favore', translation: 'Please', partOfSpeech: 'phrase', scenario: 'Any request in Italy — pairs beautifully with un espresso, per favore.', exampleNative: 'Un espresso, per favore.', exampleEnglish: 'An espresso, please.' },
          { word: 'Quanto costa?', translation: 'How much does it cost?', partOfSpeech: 'question', scenario: 'Milan fashion district, luxury goods, trade fairs.', exampleNative: 'Quanto costa questa borsa?', exampleEnglish: 'How much does this bag cost?' },
        ],
        grammar: [
          'Vowel-ending languages sound musical — Italian vowels are pure and open, like Spanish.',
          'Gender: -o endings usually masculine, -a endings usually feminine (like Spanish). -e endings vary.',
          'Double consonants matter: penne vs pene are very different. Gemination is phonemically meaningful.',
        ],
        drillSentences: [
          { native: 'Mi chiamo Jordan. Piacere.', english: 'My name is Jordan. Pleased to meet you.' },
          { native: 'Vengo dalla Giamaica.', english: 'I come from Jamaica.' },
          { native: 'Parla inglese?', english: 'Do you speak English?' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'it-IT-ElsaNeural',
        vocab: [
          { word: 'Risorgimento', translation: 'Italian unification movement (19th c.)', partOfSpeech: 'noun', scenario: 'Historical analysis dissertation at La Sapienza University.', exampleNative: 'Il Risorgimento ha profondamente ridefinito l\'identità nazionale italiana.', exampleEnglish: 'The Risorgimento profoundly redefined Italian national identity.' },
        ],
        grammar: ['Congiuntivo in all 4 tenses — marker of educated Italian.', 'Dante\'s Tuscan dialect vs modern Italian standard — understanding the divergence.'],
        drillSentences: [{ native: 'La presente tesi esamina il ruolo della retorica politica nell\'Italia del dopoguerra.', english: 'This thesis examines the role of political rhetoric in postwar Italy.' }],
      },
    ],
  },

  // ─── KOREAN ──────────────────────────────────────────────────────
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    family: 'Koreanic (language isolate)',
    speakers: '82 million',
    specialChars: [
      { char: '가', description: 'ga — syllable block' },
      { char: '나', description: 'na' },
      { char: '다', description: 'da' },
      { char: '라', description: 'ra' },
      { char: '마', description: 'ma' },
      { char: '바', description: 'ba' },
      { char: '사', description: 'sa' },
      { char: '아', description: 'a' },
      { char: '자', description: 'ja' },
      { char: '안녕하세요', description: 'Hello (type it!)' },
      { char: '감사합니다', description: 'Thank you' },
      { char: '한국어', description: 'Korean language' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Hangul (Korean alphabet) takes 1 day to learn — most logical writing system on earth.',
        azureVoice: 'ko-KR-SunHiNeural',
        vocab: [
          { word: '안녕하세요', romanization: 'Annyeonghaseyo', translation: 'Hello (formal)', partOfSpeech: 'greeting', scenario: 'Meeting a Korean business partner — slight bow is expected.', exampleNative: '안녕하세요! 저는 Jordan입니다.', exampleEnglish: 'Hello! I am Jordan.' },
          { word: '감사합니다', romanization: 'Gamsahamnida', translation: 'Thank you (formal)', partOfSpeech: 'phrase', scenario: 'After any service in a professional Korean context.', exampleNative: '도움 주셔서 감사합니다.', exampleEnglish: 'Thank you for your help.' },
          { word: '얼마예요?', romanization: 'Eolmayeyo?', translation: 'How much is it?', partOfSpeech: 'question', scenario: 'Any Korean market or business negotiation.', exampleNative: '이것은 얼마예요?', exampleEnglish: 'How much is this?' },
          { word: '모르겠어요', romanization: "Moreugesseoyo", translation: "I don't know / I'm not sure", partOfSpeech: 'phrase', scenario: 'Admitting uncertainty in Korean business — honesty is more respected than bluffing.', exampleNative: '죄송해요, 잘 모르겠어요.', exampleEnglish: "Sorry, I'm not sure." },
        ],
        grammar: [
          'Hangul (한글) was designed in 1443 — learn it in one sitting. It\'s phonetically consistent.',
          'SOV: 저는 커피를 마셔요 = I coffee drink (I drink coffee). Verb always at the end.',
          'Speech levels: 합쇼체 (formal), 해요체 (polite informal), 해체 (casual). Business = 해요체.',
          'Particles: 은/는 (topic), 이/가 (subject), 을/를 (object) — Korean grammar is particle-driven.',
        ],
        drillSentences: [
          { native: '이름이 뭐예요?', english: 'What is your name?' },
          { native: '저는 자메이카에서 왔어요.', english: 'I came from Jamaica.' },
          { native: '영어 하세요?', english: 'Do you speak English?' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'ko-KR-SunHiNeural',
        vocab: [
          { word: '담론', romanization: 'Damron', translation: 'Discourse (Foucauldian)', partOfSpeech: 'noun', scenario: 'Critical theory dissertation at Seoul National University.', exampleNative: '미디어 담론은 권력 관계를 재생산하는 핵심 기제이다.', exampleEnglish: 'Media discourse is a key mechanism for reproducing power relations.' },
        ],
        grammar: ['Honorific system (경어법) mastery — distinguishing humble, neutral, and honorific in academic writing.', 'Classical Chinese influence: 한자 (hanja) in academic vocabulary.'],
        drillSentences: [{ native: '본 연구는 한국 현대 정치 담론에 나타난 민족 정체성의 구성 방식을 분석한다.', english: 'This study analyses the construction of ethnic identity in contemporary Korean political discourse.' }],
      },
    ],
  },

  // ─── HINDI ───────────────────────────────────────────────────────
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    family: 'Indo-Aryan (Indo-European)',
    speakers: '600 million',
    specialChars: [
      { char: 'अ', description: 'a — short' },
      { char: 'आ', description: 'aa — long' },
      { char: 'इ', description: 'i — short' },
      { char: 'ई', description: 'ii — long' },
      { char: 'उ', description: 'u — short' },
      { char: 'ऊ', description: 'uu — long' },
      { char: 'ए', description: 'e' },
      { char: 'ऐ', description: 'ai' },
      { char: 'ओ', description: 'o' },
      { char: 'औ', description: 'au' },
      { char: 'क', description: 'ka' },
      { char: 'ख', description: 'kha' },
      { char: 'ग', description: 'ga' },
      { char: 'घ', description: 'gha' },
      { char: 'नमस्ते', description: 'Namaste' },
      { char: 'धन्यवाद', description: 'Thank you' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Devanagari script, basic phrases. Hindi opens India — 1.4 billion people, top-5 economy.',
        azureVoice: 'hi-IN-SwaraNeural',
        vocab: [
          { word: 'नमस्ते', romanization: 'Namaste', translation: 'Hello / I bow to you', partOfSpeech: 'greeting', scenario: 'Universal Indian greeting — hands together (anjali mudra) adds cultural respect.', exampleNative: 'नमस्ते! मेरा नाम Jordan है।', exampleEnglish: 'Namaste! My name is Jordan.' },
          { word: 'धन्यवाद', romanization: 'Dhanyavaad', translation: 'Thank you', partOfSpeech: 'phrase', scenario: 'Formal thanks — शुक्रिया (shukriya) is more colloquial, from Urdu.', exampleNative: 'आपकी मदद के लिए बहुत धन्यवाद।', exampleEnglish: 'Thank you very much for your help.' },
          { word: 'कितने का है?', romanization: 'Kitne ka hai?', translation: 'How much does it cost?', partOfSpeech: 'question', scenario: 'Any Indian market or negotiating with an Indian supplier.', exampleNative: 'यह कितने का है?', exampleEnglish: 'How much is this?' },
          { word: 'मुझे समझ नहीं आया', romanization: 'Mujhe samajh nahi aaya', translation: "I didn't understand", partOfSpeech: 'phrase', scenario: 'Hindi varies enormously by region — own the confusion.', exampleNative: 'माफ़ करें, मुझे समझ नहीं आया।', exampleEnglish: "Sorry, I didn't understand." },
        ],
        grammar: [
          'Devanagari: 13 vowels + 36 consonants. Vowels attach as diacritics to consonants. Learn the chart in a week.',
          'SOV: मैं पानी पीता हूँ = I water drink (I drink water).',
          'Grammatical gender: nouns are either masculine or feminine. Verbs agree with the subject AND sometimes the object.',
          'Postpositions not prepositions: घर में (ghar mein = in the house — "house in").',
        ],
        drillSentences: [
          { native: 'आपका नाम क्या है?', english: 'What is your name? (formal)' },
          { native: 'मेरा नाम Jordan है।', english: 'My name is Jordan.' },
          { native: 'क्या आप अंग्रेज़ी बोलते हैं?', english: 'Do you speak English?' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'hi-IN-SwaraNeural',
        vocab: [
          { word: 'उत्तर-औपनिवेशिकता', romanization: 'Uttar-aupniveshikata', translation: 'Post-colonialism', partOfSpeech: 'noun', scenario: 'Academic paper at JNU on post-colonial Indian identity.', exampleNative: 'उत्तर-औपनिवेशिक विमर्श भारतीय साहित्य में किस प्रकार प्रतिफलित होता है?', exampleEnglish: 'How is post-colonial discourse reflected in Indian literature?' },
        ],
        grammar: ['Sanskrit-origin academic vocabulary (तत्सम) vs everyday Hindustani (तद्भव).', 'Complex compound postpositions: के संदर्भ में, के अनुसार, की दृष्टि से.'],
        drillSentences: [{ native: 'प्रस्तुत शोध प्रबंध भारतीय राजनीतिक विमर्श में राष्ट्रीय पहचान की संरचना का विश्लेषण करता है।', english: 'This dissertation analyses the structure of national identity in Indian political discourse.' }],
      },
    ],
  },

  // ─── SWAHILI ─────────────────────────────────────────────────────
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇰🇪',
    family: 'Bantu (Niger-Congo)',
    speakers: '200 million',
    specialChars: [
      { char: 'ng\'', description: "ng' — nasal (ng'ombe=cow)" },
      { char: 'ch', description: 'ch — digraph' },
      { char: 'sh', description: 'sh — digraph' },
      { char: 'dh', description: 'dh — like "the"' },
      { char: 'th', description: 'th — like "three"' },
      { char: 'gh', description: 'gh — guttural' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'Swahili uses Roman alphabet — arguably the easiest major language to begin. East African economic powerhouse language.',
        azureVoice: 'sw-KE-RafikiNeural',
        vocab: [
          { word: 'Habari', translation: 'Hello / How are you? (news?)', partOfSpeech: 'greeting', scenario: 'East African greeting — the response is "nzuri" (good) or "salama" (peaceful).', exampleNative: 'Habari za asubuhi?', exampleEnglish: 'How is the morning? (Good morning)' },
          { word: 'Asante', translation: 'Thank you', partOfSpeech: 'phrase', scenario: 'Any act of help — asante sana (thank you very much) is the standard warm upgrade.', exampleNative: 'Asante sana kwa msaada wako.', exampleEnglish: 'Thank you very much for your help.' },
          { word: 'Tafadhali', translation: 'Please', partOfSpeech: 'phrase', scenario: 'Polite requests in any East African business or social context.', exampleNative: 'Kahawa moja, tafadhali.', exampleEnglish: 'One coffee, please.' },
          { word: 'Bei gani?', translation: 'What is the price?', partOfSpeech: 'question', scenario: 'Nairobi market or negotiating with a Kenyan/Tanzanian supplier.', exampleNative: 'Bei gani ya bidhaa hii?', exampleEnglish: 'What is the price of this product?' },
          { word: 'Sifahamu', translation: "I don't understand", partOfSpeech: 'phrase', scenario: 'When someone speaks too fast — Swahili dialects vary between Kenya and Tanzania.', exampleNative: 'Samahani, sifahamu. Tafadhali rudia.', exampleEnglish: "Sorry, I don't understand. Please repeat." },
        ],
        grammar: [
          'Noun classes: Swahili has ~18 grammatical noun classes, each with its own prefix agreement system.',
          'M-/Wa- class for people: mtu (person) → watu (people). Prefixes ripple through the sentence.',
          'Pronunciation is phonetic — every letter is pronounced, stress is always on the penultimate syllable.',
          'Verb structure: subject prefix + tense marker + object prefix + root + suffix: ni-ta-ku-penda = I-will-you-love.',
          'Arabic loanwords dominate formal/trade vocabulary: biashara (business), bei (price), duka (shop).',
        ],
        drillSentences: [
          { native: 'Jina lako nani?', english: 'What is your name?' },
          { native: 'Jina langu ni Jordan.', english: 'My name is Jordan.' },
          { native: 'Unasema Kiingereza?', english: 'Do you speak English?' },
          { native: 'Ninatoka Jamaica.', english: 'I come from Jamaica.' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: SHARED_PHD_NOTE,
        azureVoice: 'sw-KE-RafikiNeural',
        vocab: [
          { word: 'Utandawazi', translation: 'Globalization', partOfSpeech: 'noun', scenario: 'Academic paper on economic globalization and African development.', exampleNative: 'Utandawazi unaathiri vibaya uchumi wa nchi zinazoendelea.', exampleEnglish: 'Globalization negatively affects the economies of developing countries.' },
        ],
        grammar: ['Mastery of all 18 noun class prefixes and their concordance across adjectives, verbs, and pronouns.', 'Classical Kiswahili poetry (tendi, shairi) — formal verse structures.'],
        drillSentences: [{ native: 'Utafiti huu unachunguza mifumo ya nguvu za kiuchumi katika muktadha wa Afrika Mashariki ya kisasa.', english: 'This research examines systems of economic power in the context of modern East Africa.' }],
      },
    ],
  },

  // ─── ENGLISH (for non-native speakers) ──────────────────────────
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    family: 'Germanic (Indo-European)',
    speakers: '1.5 billion (native + second language)',
    specialChars: [
      { char: 'ʌ', description: 'IPA: cup vowel' },
      { char: 'æ', description: 'IPA: cat vowel' },
      { char: 'ə', description: 'IPA: schwa — the most common English vowel' },
      { char: 'ɪ', description: 'IPA: kit vowel' },
      { char: 'ʊ', description: 'IPA: foot vowel' },
      { char: 'θ', description: 'IPA: think (voiceless th)' },
      { char: 'ð', description: 'IPA: the (voiced th)' },
    ],
    levels: [
      {
        level: 'A1', label: 'Absolute Beginner', cefr: 'A1',
        description: 'For non-native English learners. English is the global business, science, and internet language.',
        azureVoice: 'en-US-AndrewMultilingualNeural',
        vocab: [
          { word: 'Hello', translation: 'Universal greeting', partOfSpeech: 'greeting', scenario: 'Global business — English opens every international door.', exampleNative: 'Hello! My name is Jordan. Nice to meet you.', exampleEnglish: 'Hello! My name is Jordan. Nice to meet you.' },
          { word: 'Thank you', translation: 'Expression of gratitude', partOfSpeech: 'phrase', scenario: 'Any English-speaking or international context.', exampleNative: 'Thank you very much for your time and consideration.', exampleEnglish: 'Thank you very much for your time and consideration.' },
          { word: 'I apologize', translation: 'Formal sorry', partOfSpeech: 'phrase', scenario: 'Professional apology — much stronger than "sorry" in business English.', exampleNative: 'I apologize for the delay in my response.', exampleEnglish: 'I apologize for the delay in my response.' },
          { word: 'Could you please', translation: 'Polite request form', partOfSpeech: 'phrase', scenario: 'The most important polite structure in business English.', exampleNative: 'Could you please send me the report by Friday?', exampleEnglish: 'Could you please send me the report by Friday?' },
        ],
        grammar: [
          'English has no grammatical gender — one of the easiest things about it.',
          'Phrasal verbs: look up, look into, look after, look out — same verb, wildly different meanings.',
          "Articles the/a — English learners struggle most with these. 'The' = specific, 'a/an' = any one.",
          'Verb tenses: 12 total. Focus first on: simple present, simple past, present perfect, future with will/going to.',
        ],
        drillSentences: [
          { native: 'Where are you from?', english: 'Response: I am from [country].' },
          { native: 'What do you do for a living?', english: 'Response: I work in [field] / I run a [type] business.' },
          { native: 'Could you repeat that, please?', english: 'Use this instead of "What?" — it sounds polished.' },
        ],
      },
      {
        level: 'PhD', label: 'PhD / Expert', cefr: 'PhD',
        description: 'PhD-level academic English: dissertations, peer-reviewed papers, keynote speeches, contract drafting.',
        azureVoice: 'en-US-AndrewMultilingualNeural',
        vocab: [
          { word: 'Ontological', translation: 'Relating to the nature of being/existence', partOfSpeech: 'adjective', scenario: 'Philosophy or social science dissertation introduction.', exampleNative: 'This paper adopts an ontological stance that treats social structures as emergent properties of human interaction.', exampleEnglish: 'This paper adopts an ontological stance that treats social structures as emergent properties of human interaction.' },
          { word: 'Epistemological', translation: 'Relating to the theory of knowledge', partOfSpeech: 'adjective', scenario: 'Research methodology chapter — how you know what you claim to know.', exampleNative: 'The epistemological assumptions underpinning this research are rooted in critical realism.', exampleEnglish: 'The epistemological assumptions underpinning this research are rooted in critical realism.' },
          { word: 'Hitherto', translation: 'Until now / up to this point', partOfSpeech: 'adverb', scenario: 'Academic transition — signals you\'re building on prior scholarship.', exampleNative: 'The hitherto unexamined relationship between X and Y is the focus of this study.', exampleEnglish: 'The hitherto unexamined relationship between X and Y is the focus of this study.' },
        ],
        grammar: [
          'Nominalisation: convert verbs to nouns for academic register — "analyse" becomes "analysis of", "develop" becomes "development of".',
          'Hedging language: "appears to suggest", "may indicate", "it is conceivable that" — epistemic humility is a marker of academic rigor.',
          'Passive voice in academic writing: "It has been argued that..." — removes personal bias from claims.',
          'Discourse markers: "Furthermore", "Notwithstanding", "Conversely", "In contradistinction to" — signal logical structure.',
        ],
        drillSentences: [
          { native: 'The present study seeks to examine the extent to which X influences Y in the context of Z.', english: 'Master this opening formula — adaptable to any dissertation.' },
          { native: 'It is argued herein that the conventional interpretation fails to account for the structural dynamics at play.', english: 'Thesis counter-argument formula.' },
        ],
      },
    ],
  },
]

export function getLanguage(code: LangCode): Language | undefined {
  return LANGUAGES.find(l => l.code === code)
}

export const LEVEL_ORDER: ProfLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'PhD']

export const VOICES: Record<LangCode, string[]> = {
  zh: ['zh-CN-XiaoxiaoNeural', 'zh-CN-YunxiNeural', 'zh-CN-YunjianNeural'],
  es: ['es-ES-ElviraNeural', 'es-MX-DaliaNeural', 'es-US-AlonsoNeural'],
  fr: ['fr-FR-DeniseNeural', 'fr-FR-HenriNeural', 'fr-CA-SylvieNeural'],
  de: ['de-DE-KatjaNeural', 'de-DE-ConradNeural', 'de-AT-IngridNeural'],
  ru: ['ru-RU-SvetlanaNeural', 'ru-RU-DmitryNeural'],
  nl: ['nl-NL-ColetteNeural', 'nl-NL-MaartenNeural'],
  ja: ['ja-JP-NanamiNeural', 'ja-JP-KeitaNeural'],
  ar: ['ar-SA-ZariyahNeural', 'ar-EG-SalmaNeural', 'ar-MA-JamalNeural'],
  pt: ['pt-BR-FranciscaNeural', 'pt-PT-RaquelNeural'],
  it: ['it-IT-ElsaNeural', 'it-IT-DiegoNeural'],
  ko: ['ko-KR-SunHiNeural', 'ko-KR-InJoonNeural'],
  hi: ['hi-IN-SwaraNeural', 'hi-IN-MadhurNeural'],
  sw: ['sw-KE-RafikiNeural', 'sw-TZ-RehemaNeural'],
  en: ['en-US-AndrewMultilingualNeural', 'en-US-AvaMultilingualNeural', 'en-GB-SoniaNeural'],
}
