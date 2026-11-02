// Hashtags ordered most-popular → least-popular
// Scraper works down the list; dedup removes repeat profiles
// Total: 120 hashtags across 4 tiers + Tier 5 expansion

const HASHTAGS = [
  // ── TIER 1: MEGA (JA/Caribbean broad) — 10M–100M+ views ──
  'jamaicanbusiness',
  'jamaicasmallbusiness',
  'caribbeanbusiness',
  '876business',
  'jamaicaentrepreneur',
  'caribbeanentrepreneur',
  'jamaicanentrepreneur',
  'smallbusinessjamaica',
  'kingstonjamaica',
  'shopjamaica',
  'caribbeansmallbusiness',
  'buyjamaican',

  // ── TIER 2: CATEGORY BROAD — 1M–10M views ──
  // Fashion
  'jamaicafashion',
  'caribbeanfashion',
  'jamaicanfashion',
  // Beauty
  'jamaicabeauty',
  'caribbeanbeauty',
  'blackownedbeauty',
  // Food
  'jamaicanfood',
  'caribbeanfood',
  'jamaicanrestaurant',
  // Bakery
  'jamaicanbakery',
  'caribbeanbaked',
  // Furniture
  'jamaicafurniture',
  'caribbeaninteriors',
  // Retail
  'jamaicashopping',
  'caribbeanretail',
  // Automotive
  'jamaicacars',
  'caribbeanautos',
  // Logistics
  'jamaicadelivery',
  'caribbeanshipping',
  // Packaging / printing
  'jamaicaprinting',
  // Creative
  'jamaicadesign',
  'caribbeancreative',
  // Floral
  'jamaicaflowers',

  // ── TIER 3: NICHE PER CATEGORY — 100K–1M views ──
  // Fashion
  '876fashion',
  'kingstonfashion',
  'jamaicanclothing',
  'trinidadfashion',
  'barbadosfashion',
  // Beauty
  '876beauty',
  'jamaicannatural',
  'naturalhairjamaica',
  'caribbeanskincare',
  'locticianja',
  // Food
  '876food',
  'jamaicanChef',
  'jamaicanfoodie',
  'trinifood',
  'caribbeanchef',
  // Bakery
  '876bakery',
  'jamaicanpastry',
  'caribbeancakes',
  // Furniture
  '876furniture',
  'jamaicanwood',
  'handcraftedjamaica',
  // Automotive
  '876cars',
  'jamaicanmechanic',
  'caribbeanauto',
  // Logistics
  '876courier',
  'jamaicashipping',
  'caribbeancourier',
  // Packaging
  '876print',
  'caribbeanbranding',
  // Creative
  '876creative',
  'jamaicanartist',
  'caribbeandesigner',
  // Floral
  '876flowers',
  'jamaicanwedding',

  // ── TIER 4: HYPER-LOCAL — 10K–100K views ──
  'kingstonbusiness',
  'montegobay876',
  'spanishtown876',
  'portmorebusiness',
  'ocho876',
  'portantoniojamaica',
  'negrilbusiness',
  'trinidadbusiness',
  'barbadosbusiness',
  'guyanabusiness',
  'stluciabusiness',
  'antiguabusiness',
  'bahamas876',
  'jamaicamarket',
  'downtown876',
  'halfwaytree876',
  'liguanea876',
  'corporate876',
  'jamaicatech',
  'caribbeanstartup',

  // ── TIER 5: EXPANSION — general SMB + diaspora + adjacent niches ──
  // General SMB / entrepreneur
  'blackownedbusiness',
  'blackentrepreneur',
  'caribbeanentrepreneurs',
  'islandbusiness',
  'tropicalbusiness',
  'smallbusinessowner',
  'womeninbusiness876',
  'caribbeanwomeninbusiness',
  // Diaspora / export market
  'jamaicansinamerica',
  'jamaicansincanada',
  'jamaicansinuk',
  'jamaicandiapora',
  // Service-based
  'jamaicaevents',
  'caribbeanevents',
  'eventplannersjamaica',
  'jamaicaphotographer',
  'caribbeanphotography',
  'jamaicavideographer',
  // Real estate / construction
  'jamaicarealestate',
  'caribbeanrealestate',
  'jamaicaconstruction',
  'buildingjamaica',
  // Health & wellness
  'jamaicawellness',
  'caribbeanwellness',
  'jamaicanfitness',
  '876fitness',
  // Tourism & hospitality
  'jamaicatourism',
  'visitjamaica',
  'jamaicaairbnb',
  'caribbeantravel',
];

module.exports = { HASHTAGS };
