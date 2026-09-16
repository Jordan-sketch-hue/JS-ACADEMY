// build-full.mjs: renders the COMPLETE Ferguson Law "H.O.M.E. Guide" ebook.
// One polished style (Editorial Law: navy / gold / serif). Reads as a web edition
// and prints to a clean PDF (each chapter breaks to a new page). Output: public/index.html
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/* ---------------------------------------------------------------- helpers */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Auto-linkify bare domains / URLs in body copy. Runs AFTER esc + bold, so it only
// ever wraps real text, never our own markup. Known TLDs only, so prose like
// "St. Andrew", "e.g." or "0.5%" is never mistaken for a link.
const URL_RE = /(^|[\s(>])((?:https?:\/\/)?(?:[a-z0-9-]+\.)+(?:jm|org|com|net))(\/[^\s)<]*)?/gi;
const linkify = (s) => s.replace(URL_RE, (_m, pre, domain, path) => {
  path = path || '';
  let tail = '';
  const t = path.match(/[.,;:!?]+$/);          // keep trailing sentence punctuation out of the href
  if (t) { tail = t[0]; path = path.slice(0, -tail.length); }
  const href = (/^https?:\/\//i.test(domain) ? '' : 'https://') + domain + path;
  return `${pre}<a class="lnk" href="${href}" target="_blank" rel="noopener">${domain}${path}</a>${tail}`;
});

// inline **bold**, then make every URL clickable
const inl = (s) => linkify(esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'));

const ICON = {
  bank:  '<path d="M3 21h18"/><path d="M5 21V10"/><path d="M9 21V10"/><path d="M15 21V10"/><path d="M19 21V10"/><path d="M4 10h16"/><path d="M12 3 4 7.5h16z"/>',
  house: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.2 10v10h13.6V10"/><path d="M10 20v-5.2h4V20"/>',
  globe: '<circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2"/><path d="M12 3.4a13 13 0 0 1 0 17.2 13 13 0 0 1 0-17.2Z"/>',
};
const svg = (p, w = 1.6) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

/* ------------------------------------------------------------ renderers */
const R = {
  p:    (b) => `<p>${inl(b.p)}</p>`,
  lead: (b) => `<p class="lead">${inl(b.lead)}</p>`,
  h3:   (b) => `<h3 class="sh">${inl(b.h3)}</h3>`,
  note: (b) => `<div class="note"><div class="note-t">${inl(b.note.title)}</div><p>${inl(b.note.body)}</p></div>`,

  figure: (b) => `<figure class="figure"><img src="img/${b.figure.img}" alt="${esc(b.figure.alt || '')}" loading="lazy">${b.figure.caption ? `<figcaption>${inl(b.figure.caption)}</figcaption>` : ''}</figure>`,

  quote: (b) => `<blockquote class="pquote"><p>${inl(b.quote)}</p></blockquote>`,

  callout: (b) => {
    const k = b.callout.kind || 'gold';
    const mark = k === 'danger' ? '!' : k === 'info' ? 'i' : '✓';
    const tagCls = b.callout.headline ? 'co-tag co-tag--head' : 'co-tag';
    return `<div class="callout callout--${k}"><div class="${tagCls}"><span class="co-mark">${mark}</span>${inl(b.callout.tag)}</div><p class="co-b">${inl(b.callout.body)}</p></div>`;
  },

  pillars: (b) => `<div class="pillars">${b.pillars.map(([l, t, d]) =>
    `<div class="pillar"><div class="pl-badge">${l}</div><div><div class="pl-t">${inl(t)}</div><div class="pl-d">${inl(d)}</div></div></div>`).join('')}</div>`,

  paths: (b) => `<div class="paths">${b.paths.map(([ic, t, items]) =>
    `<div class="pathc"><div class="picon">${svg(ICON[ic])}</div><div class="pbody"><div class="pt">${inl(t)}</div><ul class="pul">${items.map(i => `<li>${inl(i)}</li>`).join('')}</ul></div></div>`).join('')}</div>`,

  cards: (b) => `<div class="cards">${b.cards.map(([t, d]) =>
    `<div class="card"><div class="cd-t">${inl(t)}</div><div class="cd-d">${inl(d)}</div></div>`).join('')}</div>`,

  table: (b) => {
    const head = b.table.head ? `<thead><tr>${b.table.head.map(h => `<th>${inl(h)}</th>`).join('')}</tr></thead>` : '';
    const rows = b.table.rows.map(r => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="strong"' : ''}>${inl(c)}</td>`).join('')}</tr>`).join('');
    return `<div class="tbl-wrap"><table class="tbl">${head}<tbody>${rows}</tbody></table></div>`;
  },

  dos: (b) => `<ul class="dos">${b.dos.map(i => `<li>${inl(i)}</li>`).join('')}</ul>`,

  flags: (b) => `<ul class="flags">${b.flags.map(f => `<li><span class="fx">${svg('<path d="M6 6l12 12"/><path d="M18 6 6 18"/>', 2.4)}</span>${inl(f)}</li>`).join('')}</ul>`,

  checkgroups: (b) => `<div class="checkcols">${b.checkgroups.map(g =>
    `<div class="checkcol"><div class="ckg-t">${inl(g.title)}</div><ul class="checklist">${g.items.map(i => `<li>${inl(i)}</li>`).join('')}</ul></div>`).join('')}</div>`,

  questions: (b) => `<ol class="qlist">${b.questions.map(([q, look]) =>
    `<li><div class="q">${inl(q)}</div><div class="qa">${inl(look)}</div></li>`).join('')}</ol>`,

  scams: (b) => `<div class="scams">${b.scams.map(s =>
    `<div class="scam"><div class="sc-h"><span class="sc-warn">${svg('<path d="M12 3 22 20H2z"/><path d="M12 10v4.3"/><path d="M12 17.2h.01"/>', 1.7)}</span>${inl(s.title)}</div><p class="sc-r"><b>The risk:</b> ${inl(s.risk)}</p><p class="sc-p"><b>How to protect:</b> ${inl(s.protect)}</p></div>`).join('')}</div>`,

  timeline: (b) => `<div class="timeline">${b.timeline.map(s =>
    `<div class="tl-step"><div class="tl-dot"></div><div class="tl-body"><div class="tl-h"><span class="tl-stage">${inl(s.stage)}</span>${s.time ? `<span class="tl-time">${inl(s.time)}</span>` : ''}</div><ul class="tl-list">${s.items.map(i => `<li>${inl(i)}</li>`).join('')}</ul></div></div>`).join('')}</div>`,
};

const render = (blocks) => blocks.map(b => {
  const key = Object.keys(b)[0];
  return R[key] ? R[key](b) : '';
}).join('\n');

/* ================================================================ CONTENT */
const CHAPTERS = [
  /* ---------- INTRODUCTION ---------- */
  { num: 'Introduction', title: 'Welcome to Your Homeownership Journey', sub: 'Why this guide exists, and how to use it', hero: 'home-newhome-wide.png', body: [
    { p: 'Buying a home in Jamaica should be one of the proudest moments of your life. Yet for many, it becomes a nightmare of confusing jargon, unexpected costs, delays, and in the worst cases, outright fraud. **The H.O.M.E. Buyers\' Guide was written to change that.**' },
    { p: 'Whether you are a young professional in Kingston buying your first apartment, a diaspora member in the United States, United Kingdom or Canada investing remotely, or an investor seeking cashflow and capital appreciation, this guide will walk you through every stage of the Jamaican property buying process with clarity, confidence and legal precision.' },
    { quote: 'Owning your home is more than a transaction: it is security, legacy and pride. Our job is to get you there safely.' },
    { h3: `What the H.O.M.E. Buyers’ Guide Covers` },
    { pillars: [
      ['H', 'Handling Financing', 'Banks, NHT, overseas funds: every option broken down clearly.'],
      ['O', 'Ownership Risks', 'The legal dangers lurking in contracts, titles and developments.'],
      ['M', 'Making the Right Team', 'How to choose your attorney, real estate agent and developer wisely.'],
      ['E', 'Executing the Purchase', 'The step-by-step legal process from offer to title transfer.'],
    ] },
  ] },

  /* ---------- CHAPTER 1 ---------- */
  { num: 'Chapter One', title: 'Understanding the Jamaican Property Market', sub: 'What every purchaser must know before they start', hero: 'home-kingston.png', body: [
    { lead: 'Jamaica’s real estate market has grown significantly over the past decade, fuelled by diaspora investment, tourism demand and a rising middle class. Property values in Kingston, St. Andrew, St. James (Montego Bay), and coastal parishes have appreciated substantially. Understanding market dynamics before you buy is critical.' },
    { h3: 'Key Market Segments' },
    { table: { head: ['Market Segment', 'Price Range (JMD)', 'Typical Purchasers', 'Key Areas'], rows: [
      ['Affordable / NHT', '$6M – $20M', 'First-time purchasers', 'Spanish Town, Portmore, Linstead'],
      ['Middle Market', '$20M – $60M', 'Professionals, families', 'St. Andrew, Westmoreland'],
      ['Upscale / Luxury', '$60M – $250M+', 'Executives, diaspora', 'Cherry Gardens, Norbrook, MoBay'],
      ['Commercial / Land', 'Varies widely', 'Investors, developers', 'Islandwide'],
    ] } },
    { h3: 'Types of Property Titles in Jamaica' },
    { p: 'Not all titles are equal. Understanding title types can save you from a devastating purchase.' },
    { cards: [
      ['Registered Title (Certificate of Title)', 'The **gold standard**. Issued under the Registration of Titles Act. The government guarantees the ownership. Fully searchable at the National Land Agency (NLA).'],
      ['Deed Property (Common Law Title)', 'Older system. Ownership proven by a chain of deeds. Can be valid but requires thorough title investigation. Higher risk of competing claims. Not acceptable for mortgages.'],
      ['Possessory Title', 'Based on long occupation. Occupier may obtain a title after 12+ years of undisputed possession. **High risk** for purchasers, so do thorough due diligence.'],
      ['Strata Title', 'For apartments and townhouses. You own your unit plus a share in common areas. Check Strata Corporation minutes and financials before buying.'],
    ] },
    { callout: { kind: 'gold', tag: 'Ferguson Law Tip', body: 'Always insist on a Registered Title (including strata titles). If a vendor says "the title is being processed," that is a red flag. **Do not pay a down payment** until your attorney has verified the title status at the National Land Agency.' } },
  ] },

  /* ---------- CHAPTER 2 ---------- */
  { num: 'Chapter Two', title: 'Financing Your Home', sub: 'Banks, NHT & overseas funding: know your options', hero: 'home-keys.png', body: [
    { lead: 'Securing the right financing is arguably the most important decision in your home-buying journey. Jamaica offers several pathways, each with distinct advantages, qualification requirements and legal implications.' },
    { h3: 'Your Three Main Financing Pathways' },
    { paths: [
      ['bank', 'Jamaican Commercial Banks', ['Loan up to 90–95% of property value (with insurance)', 'Competitive variable & fixed interest rates', 'Requires Jamaican income documentation', 'Typical approval: 4–8 weeks']],
      ['house', 'National Housing Trust (NHT)', ['Government-backed fund: lowest interest rates available', 'Open to NHT contributors (employed / self-employed)', 'Interest rates: 0% to 6%']],
      ['globe', 'Overseas / Foreign Currency Funding', ['USD, GBP, CAD: wire transfers accepted', 'Some banks offer FX mortgages for diaspora purchasers', 'Must comply with BOJ foreign exchange rules', 'Requires compliance with the Proceeds of Crime Act']],
    ] },
    { h3: 'Financing Comparison at a Glance' },
    { table: { head: ['Feature', 'Commercial Bank', 'NHT', 'Overseas Cash'], rows: [
      ['Interest Rate', '8% – 13%', '0% – 6%', 'N/A'],
      ['Max Loan', 'Up to 95% LTV', 'Set by benefit', 'Full price'],
      ['Processing Time', '4–8 weeks', '6–12 weeks', '1–4 weeks'],
      ['Income Required', 'Yes (local)', 'Contributor', 'Proof of funds'],
      ['Open to Diaspora', 'Limited', 'Yes (if contributed)', 'Yes'],
      ['Currency', 'JMD', 'JMD', 'JMD / USD / GBP / CAD'],
      ['Best For', 'Good income history', 'NHT contributors', 'Overseas purchasers'],
    ] } },
    
    { h3: 'Overseas Purchasers: Foreign Exchange & Legal Rules' },
    { cards: [
      ['Proceeds of Crime Act (POCA)', 'All funds must be demonstrably legitimate. Banks and attorneys are required by law to conduct KYC / AML due diligence. Provide: source-of-funds letters, bank statements, employment or business verification.'],
      ['Bank of Jamaica (BOJ) Rules', 'Foreign currency must be converted through an authorised dealer (commercial bank or cambio). Your attorney must receive these funds through proper channels.'],
      ['Wire Transfers to Attorney', 'Funds must be wired directly to your attorney’s client account, **never** to the vendor’s personal account. Insist on a client-account letter from your attorney’s firm.'],
      ['Tax Registration Number (TRN)', 'Every purchaser, resident or non-resident, needs a Jamaican TRN. This can be obtained remotely. Your attorney can facilitate.'],
    ] },
  ] },

  /* ---------- CHAPTER 3 ---------- */
  { num: 'Chapter Three', title: 'Qualifying for the Highest Possible Loan', sub: 'Strategies to maximise your borrowing power with minimum hassle', hero: 're-consult.png', body: [
    { lead: 'Banks and the NHT use specific criteria to determine how much they will lend you. Understanding these criteria, and optimising your financial profile before applying, can dramatically increase your loan amount and approval chances.' },
    { h3: 'The 5 Pillars That Banks Assess' },
    { cards: [
      ['1 · Capacity', 'Your income vs your expenses. Banks typically allow 40–45% of gross income for loan payments (including your mortgage). Higher income + lower existing debt = higher loan.'],
      ['2 · Credit', 'Your credit history with credit bureaus (local and/or overseas). A clean credit record unlocks better rates and higher amounts. Check your credit report 6 months before applying.'],
      ['3 · Capital', 'Your down payment. Most banks require 5–20% down. A larger down payment reduces the bank’s risk, improving your terms and monthly payment.'],
      ['4 · Collateral', 'The property itself. Banks conduct an independent valuation and only lend against registered, unencumbered title. Property in a flood zone may be rejected.'],
      ['5 · Character', 'Your overall financial behaviour: employment stability, banking history, relationship with the institution. Long-standing bank clients often receive preferential rates.'],
    ] },
    { h3: '12-Month Loan Maximisation Plan' },
    { p: 'If you are not in a rush, the following 12-month preparation strategy can significantly boost your qualifying loan amount.' },
    { table: { head: ['Timeline', 'Action', 'Impact'], rows: [
      ['Month 1–2', 'Pull your credit report. Dispute errors. Pay down credit cards to under 30% utilisation.', 'Credit score +20–50 pts'],
      ['Month 2–4', 'Open or maintain a salary account at your target bank. Set up direct deposit. Avoid large unexplained withdrawals.', 'Demonstrates banking discipline'],
      ['Month 3–6', 'Reduce or pay off vehicle or personal loans if possible. Remove co-signor liability.', 'Improves debt-to-income ratio'],
      ['Month 4–8', 'Save your down payment in a dedicated account. Show consistency over months of savings growth.', 'Shows capital discipline'],
      ['Month 6–10', 'Collect: last 3 months’ payslips, 2 years’ tax returns (if self-employed), bank statements, TRN, NIS, ID.', 'Speeds up approval'],
      ['Month 10–12', 'Get a pre-approval letter. Engage your attorney. Begin property search within your pre-approved range.', 'Negotiating power with vendors'],
    ] } },
    { h3: 'Documents You Will Need: Master Checklist' },
    { checkgroups: [
      { title: 'Personal Identification', items: ['Valid Passport or National ID', 'Tax Registration Number (TRN)', 'Proof of address (utility bill, not older than 3 months)', 'National Insurance Scheme (NIS) Number (if applying for NHT)'] },
      { title: 'Income (Employed)', items: ['Last 3 months’ payslips', 'Employment letter (salary, position, length of service)', 'Last 2 years’ P45 / PAYE documents (or overseas equivalent)', 'Bank statements: last 6 months (salary account)'] },
      { title: 'Income (Self-Employed)', items: ['Last 2 years’ income tax returns', 'Financial statements prepared by a CPA or Chartered Accountant', 'Business registration / certificate of incorporation', 'Bank statements: last 12 months (business account)'] },
      { title: 'Overseas Purchaser Additions', items: ['Foreign passport + Jamaican TRN (required)', 'Source-of-funds letter from overseas bank', 'Overseas credit report', 'Last 6 months’ overseas bank statements', 'Proof of overseas address'] },
    ] },
    { callout: { kind: 'gold', tag: 'Pro Strategy: Shop Multiple Lenders', body: 'Do not apply to only one bank. Get pre-approval from 2–3 institutions. Compare: interest rate, processing fees, valuation fees, life-insurance requirements, and prepayment penalties. Your attorney can help you evaluate the mortgage commitment letter before you sign.' } },
  ] },

  /* ---------- CHAPTER 4 ---------- */
  { num: 'Chapter Four', title: 'How to Select the Right Attorney', sub: 'Your attorney is your most critical hire: get this right', hero: 'owen-desk.jpg', body: [
    { callout: { kind: 'danger', headline: true, tag: 'The Most Dangerous Mistake Purchasers Make', body: 'Many purchasers, especially overseas purchasers, allow the vendor’s attorney to handle both sides of the transaction to save cost. This is a fundamental and potentially costly mistake involving a serious conflict of interest. The vendor’s attorney has a legal duty to the vendor, not to you. You must have independent legal representation.' } },
    { h3: 'What Your Attorney Should Do For You' },
    { cards: [
      ['Title Investigation', 'Search the National Land Agency (NLA) to verify ownership and confirm no mortgages, caveats, liens or disputes are registered.'],
      ['Due Diligence', 'Check for unpaid property taxes, NWC (water) arrears and utility charges. Examine the development agreement if buying pre-construction.'],
      ['Contract Review & Drafting', 'Draft or critically review the Agreement for Sale. Negotiate protective clauses. Identify unfair terms.'],
      ['Funds Management', 'Hold your down payment in a dedicated client account. Ensure funds are only released when all conditions are satisfied.'],
      ['Registration of Title', 'Complete the transfer at the NLA, pay Stamp Duty, Transfer Tax and all legal fees, and deliver your new title.'],
      ['Mortgage Compliance', 'Liaise with your bank to execute the mortgage, register it on title and ensure all disbursements are correct.'],
    ] },
    { h3: 'The 10 Questions to Ask Before Hiring an Attorney' },
    { questions: [
      ['Are you currently licensed to practise law in Jamaica?', 'Verifiable with the General Legal Council at generallegalcouncil.org/attorneys/practising-attorneys/'],
      ['Do you specialise in conveyancing / real estate?', 'General practitioners exist; you want a specialist.'],
      ['Will you personally handle my file, or a paralegal?', 'Know exactly who manages your transaction.'],
      ['What is your fee structure?', 'Fixed fee? Percentage? Get it in writing upfront.'],
      ['Do you have a dedicated client account for down payments?', 'Non-negotiable: your money must be protected.'],
      ['What is your experience with overseas clients?', 'Critical for remote transactions.'],
      ['How do you communicate: email, WhatsApp, phone?', 'Set expectations for responsiveness upfront.'],
      ['What is the estimated timeline for my transaction?', 'Should be realistic (2–6 months).'],
      ['Can you provide references from past clients?', 'A confident attorney welcomes this.'],
      ['Have you acted for the other party before?', 'Reveals potential conflicts of interest.'],
    ] },
    { h3: 'Understanding Legal Fees: Budget for Closing Costs' },
    { table: { head: ['Fee Item', 'Who Pays', 'Typical Amount'], rows: [
      ['Attorney’s Legal Fee', 'Purchaser', '~ 3% of purchase price'],
      ['Stamp Duty', 'Purchaser & Vendor equally', '$5,000'],
      ['Transfer Tax', 'Vendor', '2% of purchase price'],
      ['Registration Fee', 'Purchaser & Vendor equally', '$5,000'],
      ['Valuation Fee', 'Purchaser', '~ 0.3% of purchase price'],
      ['Mortgage Processing Fee', 'Purchaser', '1–2% of loan amount'],
      ['Life Insurance', 'Purchaser', 'Monthly, required by most lenders'],
      ['Survey Fee', 'Purchaser', '~ 0.3% of purchase price'],
    ] } },
    { callout: { kind: 'danger', tag: 'Budget Rule of Thumb', body: 'Always budget an additional **8–12% of the property purchase price** to cover all closing costs (legal fees, taxes, registration, valuation, mortgage fees). First-time purchasers frequently underestimate this and face last-minute financial crises at closing.' } },
  ] },

  /* ---------- CHAPTER 5 ---------- */
  { num: 'Chapter Five', title: 'How to Select a Developer', sub: 'Buying pre-construction (off-plan)? What you must know before you sign', hero: 'owen-blueprints.png', body: [
    { lead: 'Pre-construction purchases are extremely common in Jamaica and can offer excellent value. They also carry unique risks. A wrong choice of developer can mean years of delays, lost down payments, or a property that is never built.' },
    { h3: 'Developer Red Flags: Walk Away Immediately' },
    { flags: [
      'No proof of land ownership or registered title for the development site',
      'Cannot provide a copy of the approved subdivision plan from NEPA / local authority',
      'Requests cash payments or down payments to personal accounts (not company accounts)',
      'No formal Agreement for Sale, uses only a "receipt" or informal letter',
      'Cannot name the attorney handling the conveyancing',
      'Refuses to allow your attorney to review the sale agreement',
      'Promises completion dates but has no contractor or building permit',
      'Has previous developments with unresolved complaints or pending litigation',
      'Pressures you to sign "before the price goes up" without time to review',
      'Cannot provide NHT / bank approval letters for the development',
    ] },
    { h3: 'Developer Due Diligence: What to Verify' },
    { cards: [
      ['Company Registration', 'Search the Companies Office of Jamaica (COJ) to confirm the company is properly registered, in good standing, and the directors match who you are dealing with.'],
      ['Title Search', 'Your attorney must search the NLA to confirm the developer actually owns the land. Some developers sell lots on land they do not own.'],
      ['Planning Approvals', 'Confirm NEPA and the relevant municipal corporation have approved the development. Unapproved subdivisions cannot get registered titles.'],
      ['Building Permits', 'Confirm the building permit has been granted by the local authority. No permit = no legal construction.'],
      ['Previous Projects', 'Visit completed developments. Talk to homeowners. Check if titles were delivered on time. Search court records for past litigation.'],
      ['Financial Stability', 'Does the developer have a bank construction loan? A bank has already vetted them. Self-funded projects carry higher completion risk.'],
    ] },
    { h3: 'Key Clauses to Negotiate in a Developer Agreement' },
    { cards: [
      ['Completion Date', 'Fix a specific calendar date, not "approximately." Include liquidated damages (a daily penalty) for late completion.'],
      ['Down payment Protection', 'Down payments should be held in an attorney’s client account, not with the developer. Staged payments must align with construction milestones.'],
      ['Specification Lock', 'All finishes, fixtures and fittings listed in a schedule attached to the agreement. Verbal promises mean nothing.'],
      ['Defects Liability', 'Include a 12-month defects liability period during which the developer must fix structural defects at no cost.'],
      ['Title Delivery', 'Agree a specific timeframe for title transfer after completion. 1–3 months is reasonable; indefinite timelines are unacceptable.'],
      ['Default & Refund', 'If the developer defaults, you must be able to recover your full down payment plus interest. Have your attorney draft this clearly.'],
    ] },
  ] },

  /* ---------- CHAPTER 6 ---------- */
  { num: 'Chapter Six', title: 'How to Select a Real Estate Agent', sub: 'A great agent is your eyes, ears and negotiator in the market', hero: 'home-realtor-wide.png', body: [
    { lead: 'In Jamaica, the real estate industry is regulated by the Real Estate Board (REB). Every practicing real estate agent and real estate dealer must be registered and licensed. Engaging an unlicensed agent exposes you to significant risk.' },
    { callout: { kind: 'danger', tag: 'Verify First', body: 'Before engaging any real estate agent, verify their licence at the Real Estate Board of Jamaica: **reb.gov.jm**. An unlicensed agent has no legal standing and no professional accountability if something goes wrong.' } },
    { h3: 'Real Estate Agent vs Real Estate Dealer: What’s the Difference?' },
    { table: { head: ['', 'Real Estate Agent / REALTOR®', 'Real Estate Dealer'], rows: [
      ['Who They Are', 'Individual sales agent', 'Company / licensed broker employing salespersons'],
      ['REB Requirement', 'Individual licence', 'Dealer licence (company)'],
      ['Commission', 'Split with dealer', 'Company collects full commission'],
      ['Who You Contract With', 'Their dealer / company', 'The dealer company directly'],
    ] } },
    { note: { title: 'A note on the term "REALTOR®"', body: 'REALTOR® is a registered collective membership mark owned by the National Association of REALTORS® (NAR), headquartered in Chicago, USA, of which the Realtors Association of Jamaica (RAJ) is an affiliate. It is not a job title nor a synonym for "real estate agent." It exclusively designates a professional who is an active NAR member and adheres to its Code of Ethics. **The designation REALTOR is not a requirement in order to practise as a real estate agent in Jamaica.**' } },
    { h3: 'What a Good Real Estate Agent Does for a Purchaser' },
    { dos: [
      'Identifies properties matching your criteria and budget (including unlisted ones)',
      'Arranges and accompanies viewings, and knows what to look for',
      'Provides comparative market analysis to ensure you are not overpaying',
      'Negotiates the purchase price and contract terms on your behalf',
      'Coordinates with your attorney, the bank valuer and the vendor',
      'Flags property issues, neighbourhood concerns and access problems',
      'For overseas purchasers: provides virtual tours, video viewings and detailed reporting',
      'Guides you through the offer process and manages all communications',
    ] },
    { h3: '8 Questions to Ask Your Real Estate Agent' },
    { questions: [
      ['Are you licensed with the Real Estate Board?', 'Get their licence number.'],
      ['Which dealer company are you registered with?', 'Confirms accountability.'],
      ['How long have you worked in this specific area / parish?', 'Local knowledge matters.'],
      ['How many transactions did you close in the last 12 months?', 'Gauges activity and experience.'],
      ['Do you work with overseas purchasers? Do you offer virtual viewings?', 'Essential for diaspora buyers.'],
      ['How will you communicate with me throughout the process?', 'Set expectations early.'],
      ['What is your commission, and who pays it?', 'Know the cost upfront.'],
      ['Can you refer me to an attorney and mortgage broker?', 'Shows network quality.'],
    ] },
  ] },

  /* ---------- CHAPTER 7 ---------- */
  { num: 'Chapter Seven', title: 'The Legal Process: Step by Step', sub: 'From offer to title: what happens, when and why', hero: 'family-estate.png', body: [
    { lead: 'The Jamaican conveyancing process follows six distinct stages. Each has specific legal actions, timelines and financial obligations. Understanding these stages helps you manage expectations and avoid costly mistakes.' },
    { timeline: [
      { stage: 'Preliminary', time: '', items: ['Obtain a pre-approval from a local bank, if a mortgage is required', 'Select a real estate agent to assist you', 'Select an attorney to represent you'] },
      { stage: 'Stage 1: The Offer', time: '⏱ 1–2 weeks', items: ['Identify a property and discuss possible terms', 'Do not sign or pay anything until your attorney reviews the paperwork', 'An Offer to Purchase may be signed at this stage'] },
      { stage: 'Stage 2: Agreement for Sale', time: '⏱ 2–4 weeks', items: ['Formal Agreement for Sale drafted by vendor’s attorney, reviewed by yours', 'On signing, the purchaser pays a down payment (typically 5%–10%)', 'The down payment is held by the vendor’s attorney in their client account', 'Vendor’s attorney pays Stamp Duty and Transfer Tax to TAJ', 'The agreement sets the completion date (typically 90–120 days)'] },
      { stage: 'Stage 3: Due Diligence', time: '⏱ 2–6 weeks', items: ['Your attorney conducts a full NLA title search', 'Checks for mortgages, caveats, liens and judgments', 'Verifies property tax payments are current', 'For strata: reviews strata plan, bylaws and meeting minutes'] },
      { stage: 'Stage 4: Financing & Valuation', time: '⏱ 4–8 weeks', items: ['Bank orders an independent valuation and survey report', 'You submit all required documents to the lender', 'Bank issues a mortgage commitment letter', 'Life insurance policy assigned to the bank as security'] },
      { stage: 'Stage 5: Title Transfer & Registration', time: '⏱ 1–2 weeks', items: ['Transfer documents are signed by both parties', 'Vendor’s attorney lodges the transfer documents at the NLA', 'The NLA processes the title transfer and mortgage, if any', 'Arrangement made for payment of the balance (less down payment)'] },
      { stage: 'Stage 6: Closing & Completion', time: '⏱ 4–12 weeks', items: ['A new Certificate of Title is issued in your name', 'Keys are handed over', 'Your attorney delivers the original title to you (or your bank)'] },
    ] },
  ] },

  /* ---------- CHAPTER 8 ---------- */
  { num: 'Chapter Eight', title: 'Risks, Red Flags & How to Protect Yourself', sub: 'The dangers that derail transactions, and how to avoid them', hero: 'owen-corporate.png', body: [
    { callout: { kind: 'danger', tag: 'Know This', body: 'Property fraud and disputes are among the most common matters litigated in Jamaican courts. Most could have been prevented with proper due diligence and independent legal counsel. This chapter could save you millions.' } },
    { h3: 'The Most Common Property Scams in Jamaica' },
    { scams: [
      { title: 'Title Fraud / Identity Fraud', risk: 'A fraudster impersonates the true owner and sells the property using fake ID. The real owner later emerges and the purchaser loses everything.', protect: 'Your attorney must conduct face-to-face ID verification of the vendor. For remote vendors, use notarised ID and supporting documents.' },
      { title: '"Phantom" Pre-construction Developments', risk: 'A "developer" collects down payments for a housing scheme that is never built, with no planning approval and no construction financing, then disappears with the money.', protect: 'Never pay a down payment until your attorney confirms planning approval, developer land ownership, and reviews the sale agreement.' },
      { title: 'Double-Selling', risk: 'A dishonest vendor sells the same property to multiple purchasers. The first to register their title at the NLA wins; the others lose their down payments.', protect: 'Lodge a Caveat at the NLA immediately after signing the Agreement for Sale. This blocks other registrations at minimal cost.' },
      { title: 'Defective Chain of Title', risk: 'A property is sold without a clear, unbroken chain of ownership. A previous heir, co-owner or mortgagee later claims an interest, which is common with family land.', protect: 'Full title investigation by your attorney. For family land, all family members must consent to and sign the transfer.' },
      { title: 'Unregistered Encumbrances', risk: 'The vendor has an undisclosed mortgage, lien or judgment against the property. The purchaser may inherit these liabilities.', protect: 'Full NLA search and Tax Administration Jamaica search must be conducted before any payment is made.' },
    ] },
    { h3: 'Dangerous Contract Clauses to Watch Out For' },
    { cards: [
      ['Unfair forfeiture clauses', 'Some agreements let the vendor keep your entire down payment if you fail to complete, even for reasons beyond your control. Negotiate a fairer default clause.'],
      ['"Time is of the essence"', 'A single missed deadline can void your contract and forfeit your down payment. Your attorney must flag and review this carefully.'],
      ['Incomplete fixtures schedule', 'If appliances and AC units are not listed in writing, vendors can legally remove them. List everything in a fixtures-and-fittings schedule.'],
      ['No vacant possession clause', 'If a property has tenants, you may inherit them unintentionally. Ensure the agreement requires vacant possession on completion.'],
      ['Vague completion dates', '"Approximately 3 months" is not a date. Demand a specific calendar date for completion.'],
    ] },
  ] },

  /* ---------- CHAPTER 9 ---------- */
  { num: 'Chapter Nine', title: 'The Overseas Purchaser’s Survival Guide', sub: 'Buying from the USA, UK, Canada or elsewhere: your complete roadmap', hero: 'jamaica-coast.jpg', body: [
    { lead: 'Jamaica is one of the most popular Caribbean destinations for diaspora real estate investment. Tens of thousands of Jamaicans living abroad invest in property on the island each year. But distance creates vulnerability, and bad actors know this.' },
    { h3: 'Addressing the Five Core Overseas Purchaser Fears' },
    { cards: [
      ['"I don’t know any attorneys."', 'Research via the General Legal Council (GLC) at generallegalcouncil.org, ask for references from other diaspora purchasers, or contact firms like Ferguson Law that specialise in remote transactions.'],
      ['"How do I know the property is real?"', 'Request a video tour, Google Maps verification, drone footage, and a physical inspection report from a licensed surveyor. Your attorney can arrange an independent inspection.'],
      ['"What if the attorney steals my money?"', 'Confirm your attorney has a dedicated client account. Wire funds to that account only. All reputable firms provide a client-account letter.'],
      ['"Can I sign documents from abroad?"', 'Most documents can be signed and notarised abroad. Your attorney will advise on which require apostille.'],
      ['"What about taxes in my country?"', 'Consult a tax advisor at home (FBAR / FATCA for US; CGT for UK; CRA T1135 for Canada). Ferguson Law can refer international tax counsel.'],
    ] },
    { note: { title: 'The Regulation of Attorneys in Jamaica', body: 'The Jamaican Bar Association (JAMBAR) is a **voluntary** association and is not the regulator of the profession. The **General Legal Council (GLC)** is empowered by the Legal Profession Act to regulate the practice of law, conduct professional education, and maintain the register of licensed attorneys at generallegalcouncil.org/attorneys/practising-attorneys/. Confirm that the attorney you choose is listed.' } },
    { h3: 'The Overseas Purchaser’s Step-by-Step Process' },
    { checkgroups: [
      { title: 'Pre-Purchase', items: ['Obtain your Jamaican TRN (online via TAJ)', 'Open a Jamaican bank account or identify an attorney with a USD client account', 'Engage a licensed Jamaican attorney before your property search', 'Get pre-qualified for bank / NHT financing, if required', 'Set a realistic budget including closing costs (add 10–12%)'] },
      { title: 'Property Selection', items: ['Work with a licensed agent experienced with overseas purchasers', 'Request virtual tours, video walkthroughs and drone footage', 'Get a written property condition report from a licensed surveyor', 'Research flooding history, access roads, utilities and neighbours', 'Have your attorney conduct a preliminary title search before offering'] },
      { title: 'Agreement & Down payment', items: ['Have your attorney review the Agreement for Sale, never sign without review', 'Ensure the down payment is paid to the attorney’s client account, not the vendor', 'Wire transfer from your bank, providing source-of-funds documentation', 'Ask your attorney to lodge a Caveat at the NLA immediately after signing', 'Set up a Power of Attorney if you will not be present for completion'] },
      { title: 'Power of Attorney', items: ['A POA allows the named agent to sign documents on your behalf', 'In order to be used in a real estate transaction, a POA must be stamped and registered at the Registrar General’s Department (RGD). Your lawyer can assist with that', 'Must be properly drafted, executed and (in some cases) notarised or apostilled', 'Should be limited to specific transactions, not a general / blanket POA'] },
      { title: 'Completion & Title', items: ['Balance of purchase price wired to attorney’s client account', 'Your attorney handles all closing documents and disbursements', 'Original title kept by the bank (if mortgaged) or delivered to you', 'Consider a local property manager if the property will be rented', 'Register with TAJ for annual Property Tax payments'] },
    ] },
    { h3: 'Country-Specific Notes for Overseas Purchasers' },
    { cards: [
      ['<img src="https://flagcdn.com/20x15/us.png" alt="USA" style="height:15px;border-radius:2px;vertical-align:middle;margin-right:7px"> USA-Based Purchasers', 'FBAR filing required if a Jamaican bank account exceeds $10,000 USD. FATCA compliance required. Capital gains on foreign property subject to US tax. Wire transfers over $10,000 will be flagged, so have your source-of-funds letter ready.'],
      ['<img src="https://flagcdn.com/20x15/gb.png" alt="UK" style="height:15px;border-radius:2px;vertical-align:middle;margin-right:7px"> UK-Based Purchasers', 'Capital Gains Tax (CGT) applies to gains on foreign property when sold. No SDLT on overseas properties. HMRC must be informed of overseas property ownership.'],
      ['<img src="https://flagcdn.com/20x15/ca.png" alt="Canada" style="height:15px;border-radius:2px;vertical-align:middle;margin-right:7px"> Canada-Based Purchasers', 'Foreign property must be reported to CRA (T1135 form). Wire transfers over $10,000 CAD flagged by FINTRAC. Canadian banks generally do not mortgage Jamaican property. Cash purchases are most common.'],
    ] },
  ] },

  /* ---------- CHAPTER 10 ---------- */
  { num: 'Chapter Ten', title: 'Your Home Ownership Action Plan', sub: 'From decision to keys: a clear roadmap to get started today', hero: 'owen-pitch.png', body: [
    { lead: 'Use this action plan as your personal roadmap. Each step builds on the last. Do not skip stages: each one exists to protect you.' },
    { timeline: [
      { stage: 'Today', time: '', items: ['Read this guide in full', 'Determine your budget: annual income × 3.5 = rough target price', 'Pull your credit report (a credit score alone is not sufficient)', 'Check your NHT benefit status at nht.gov.jm', 'Identify 2–3 attorneys to interview'] },
      { stage: 'Week 1–2', time: '', items: ['Interview and select your attorney', 'Contact your bank to discuss your financing plan', 'Open or consolidate bank accounts at your target lender', 'Gather all documents on the master checklist', 'Set up your savings plan for down payment and closing costs'] },
      { stage: 'Month 1–3', time: '', items: ['Engage your attorney formally, signing a retainer', 'Apply for NHT pre-qualification if eligible', 'Apply for bank mortgage pre-approval', 'Begin working with a licensed real estate agent', 'View properties within your approved budget'] },
      { stage: 'Month 3–6', time: '', items: ['Make an offer on your selected property', 'Have your attorney review before you sign the Agreement for Sale', 'Pay the down payment to the attorney’s client account only', 'Lodge a Caveat at the NLA', 'Complete financing: submit to bank, arrange valuation and survey'] },
      { stage: 'Month 6–9', time: '', items: ['Complete the transaction, arranging to pay the balance', 'Ensure the title transfer is lodged at the NLA', 'Set up building insurance (required by lender)', 'Receive keys at closing'] },
      { stage: 'Month 9–12', time: '', items: ['Receive your original Certificate of Title', 'File any overseas tax reporting obligations', 'Review your mortgage statement to confirm accuracy', 'Consider a property manager if renting', 'Congratulations, you own property in Jamaica!'] },
    ] },
    { figure: { img: 'home-keys.png', alt: 'New homeowners receiving their keys', caption: 'The goal: keys in hand, and a registered title in your name.' } },
    { callout: { kind: 'info', tag: 'Remember the H.O.M.E. Principle', body: '**H:** Handle financing before you start shopping.  **O:** Own the process: know every step and every document.  **M:** Make your team first: attorney, real estate agent, lender.  **E:** Execute with patience: rushing kills deals and creates fraud opportunities.' } },
  ] },

  /* ---------- APPENDIX ---------- */
  { num: 'Appendix', title: 'Glossary, Key Contacts & Resources', sub: 'Quick reference for the terms and bodies in this guide', body: [
    { h3: 'Key Terms Glossary' },
    { table: { head: ['Term', 'Definition'], rows: [
      ['Agreement for Sale', 'The formal contract between purchaser and vendor setting out all terms of the property sale.'],
      ['Caveat', 'A notice lodged at the NLA to warn the world of your interest in a property, preventing other registrations.'],
      ['Certificate of Title', 'The government-issued document proving registered ownership of land in Jamaica.'],
      ['Conveyancing', 'The legal process of transferring property ownership from vendor to purchaser.'],
      ['LTV (Loan-to-Value)', 'The ratio of the loan amount to the property value. Higher LTV = smaller down payment required.'],
      ['NHT', 'National Housing Trust, Jamaica’s government-backed housing finance institution.'],
      ['NLA', 'National Land Agency, the government body that maintains the land registry.'],
      ['Power of Attorney', 'A legal document authorising another person to act on your behalf in specific transactions.'],
      ['Stamp Duty', 'A government tax paid on legal documents, including property transfers.'],
      ['Strata Title', 'Title for apartments / townhouses; each owner holds their unit plus a share in common property.'],
      ['Transfer Tax', 'A 2% tax on the sale price paid by the vendor upon transfer of property.'],
      ['TRN', 'Tax Registration Number, issued by TAJ; required for all property transactions.'],
      ['Vacant Possession', 'The property is empty and available for the purchaser upon completion.'],
      ['Valuation', 'An independent assessment of a property’s market value, required by lenders.'],
    ] } },
    { h3: 'Key Government Bodies & Resources' },
    { table: { head: ['Institution', 'Website', 'Purpose'], rows: [
      ['National Land Agency (NLA)', 'nla.gov.jm', 'Title searches, registration'],
      ['National Housing Trust (NHT)', 'nht.gov.jm', 'Housing loans, benefit queries'],
      ['Companies Office (COJ)', 'orcjamaica.com', 'Verify company registrations'],
      ['General Legal Council (GLC)', 'generallegalcouncil.org', 'Verify attorneys'],
      ['National Environment & Planning Agency', 'nepa.gov.jm', 'Planning approvals, subdivisions'],
      ['Real Estate Board (REB)', 'reb.gov.jm', 'Verify real estate agents, file complaints'],
      ['Tax Administration Jamaica (TAJ)', 'jamaicatax.gov.jm', 'TRN, property tax, stamp duty'],
    ] } },
  ] },
];

/* ----------------------------------------------------------- chapter html */
const DISCLAIMER_HTML = `<div class="ch-disclaimer"><span class="ch-disc-info">The Ferguson Law H.O.M.E. Buyer's guide is for general information only and is not legal advice.</span><span class="ch-disc-copy">&copy; 2026 Ferguson Law. All rights reserved.</span></div>`;

const chapterHtml = (c, i) => {
  const header = c.hero
    ? `<header class="ch-head ch-head--hero">
      <img class="ch-hero-img" src="img/${c.hero}" alt="">
      <div class="ch-hero-scrim"></div>
      <div class="ch-hero-text">
        <div class="ch-eyebrow">${esc(c.num)}</div>
        <h2 class="ch-title">${inl(c.title)}</h2>
        <p class="ch-sub">${inl(c.sub)}</p>
      </div>
    </header>`
    : `<header class="ch-head">
      <div class="ch-eyebrow">${esc(c.num)}</div>
      <h2 class="ch-title">${inl(c.title)}</h2>
      <p class="ch-sub">${inl(c.sub)}</p>
    </header>`;
  return `<section class="chapter${c.hero ? ' chapter--hero' : ''}" id="ch-${i}">
  ${header}
  <div class="ch-body">${render(c.body)}</div>
  ${DISCLAIMER_HTML}
</section>`;
};

const toc = CHAPTERS.map((c, i) =>
  `<li><a href="#ch-${i}"><span class="toc-n">${esc(c.num)}</span><span class="toc-t">${inl(c.title)}</span></a></li>`).join('');

/* ------------------------------------------------------------------- DOC */
const PHONE = '+1 (876) 320-0235';
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>H.O.M.E.: Home Ownership Made Easy · Ferguson Law</title>
<meta name="description" content="The complete first-time home purchaser’s guide for Jamaicans at home and abroad. A free guide by Ferguson Law: financing, titles, attorneys, developers, the legal process, scams to avoid and a diaspora roadmap.">
<meta property="og:title" content="H.O.M.E.: Home Ownership Made Easy">
<meta property="og:description" content="The complete first-time home purchaser’s guide for Jamaicans at home & abroad. Free, by Ferguson Law.">
<meta property="og:type" content="book">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230d2318'/%3E%3Ctext x='16' y='22' font-family='Georgia,serif' font-size='16' font-weight='700' fill='%23d7af5b' text-anchor='middle'%3EFL%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap">
<style>
:root{
  --bg:#0c1622; --bg2:#13243a;
  --paper:#fdf8ee; --ink:#15202e; --muted:#5d6776;
  --accent:#c9a84c; --accent2:#1b6b7b; --line:#e7dec9;
  --danger:#a23a2e; --badge:#0d1b2a; --badgeInk:#c9a84c;
  --head:"Fraunces",Georgia,serif; --body:"Plus Jakarta Sans",system-ui,sans-serif;
  --maxw:820px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:var(--body);background:#0a1018;color:var(--ink);-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:inherit}
/* clickable links in body copy + tables (auto-generated) */
.lnk{color:var(--accent2);text-decoration:none;border-bottom:1px solid rgba(27,107,123,.4);font-weight:600;word-break:break-word;transition:.15s}
.lnk:hover{color:#0f4651;border-bottom-color:var(--accent2)}

/* sticky utility bar (screen only) */
.bar{position:sticky;top:0;z-index:50;background:rgba(10,16,24,.96);backdrop-filter:blur(8px);border-bottom:1px solid #1c2533;color:#e8edf3}
.bar-in{max-width:1080px;margin:0 auto;display:flex;align-items:center;gap:16px;padding:11px 22px}
.bar .brand{font-family:var(--head);font-weight:600;font-size:17px;letter-spacing:.2px}
.bar .brand b{color:var(--accent)}
.bar .sp{margin-left:auto}
.btn-dl{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#0b1018;font-weight:700;font-size:13.5px;border:0;cursor:pointer;padding:9px 16px;border-radius:999px;text-decoration:none}
.btn-dl svg{width:16px;height:16px}

/* the book sheet */
.sheet{max-width:var(--maxw);margin:26px auto;background:var(--paper);color:var(--ink);
  box-shadow:0 40px 90px -30px rgba(0,0,0,.7);border-radius:4px;overflow:hidden}

/* cover (photographic) */
.cover{position:relative;color:#f4ecdb;text-align:center;overflow:hidden;isolation:isolate}
.cv-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 42%;z-index:-2}
.cv-overlay{position:absolute;inset:0;z-index:-1;background:
  linear-gradient(180deg,rgba(8,14,24,.78) 0%,rgba(9,16,28,.72) 45%,rgba(6,11,20,.93) 100%),
  radial-gradient(120% 80% at 80% 0%,rgba(27,107,123,.32),transparent 60%)}
.cover::after{content:"";position:absolute;left:0;right:0;bottom:0;height:5px;background:linear-gradient(90deg,var(--accent),#e7cd85,var(--accent))}
.cv-inner{position:relative;padding:78px 60px 66px}
.cv-firm{font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);font-weight:600}
.cv-logo{width:min(360px,72%);margin:30px auto 6px;filter:drop-shadow(0 8px 30px rgba(0,0,0,.5))}
.cv-desc{max-width:480px;margin:18px auto 0;font-size:14.5px;line-height:1.6;color:#dbe2ea}
.cv-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:24px 0 0}
.cv-chips span{font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;padding:6px 13px;border-radius:999px;border:1px solid rgba(231,205,133,.45);color:#e7cd85}
.cv-foot{margin-top:30px;font-size:12.5px;color:#aeb9c6;line-height:1.7}
.cv-foot b{color:#e8edf3;font-weight:600}
.cover--final{aspect-ratio:2/3;position:relative}
.cv-price-badge{position:absolute;bottom:18px;right:18px;background:rgba(10,16,24,.78);backdrop-filter:blur(6px);color:#e7cd85;font-family:var(--head);font-weight:600;font-size:14px;letter-spacing:.04em;padding:8px 16px;border-radius:999px;border:1px solid rgba(231,205,133,.4)}
@media print{.cv-price-badge{background:rgba(10,16,24,.9)}}
.cv-final-img{display:block;width:100%;height:100%;object-fit:cover}
@media print{.cover--final{aspect-ratio:auto;height:100vh}}

/* table of contents */
.toc{padding:46px 60px}
.toc h2{font-family:var(--head);font-weight:600;font-size:13px;letter-spacing:.28em;text-transform:uppercase;color:var(--accent);margin:0 0 18px}
.toc ol{list-style:none;margin:0;padding:0;counter-reset:toc}
.toc li{border-bottom:1px solid var(--line)}
.toc a{display:flex;gap:16px;align-items:baseline;padding:13px 4px;text-decoration:none;transition:.15s}
.toc a:hover{padding-left:10px;color:var(--accent2)}
.toc .toc-n{flex:0 0 122px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600}
.toc .toc-t{font-family:var(--head);font-weight:500;font-size:18px;color:var(--ink)}

/* chapter */
.chapter{padding:54px 60px}
.chapter + .chapter{border-top:1px solid var(--line)}
.ch-head{margin-bottom:26px}
.ch-eyebrow{font-size:11.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--accent);font-weight:700}
.ch-title{font-family:var(--head);font-weight:600;font-size:clamp(28px,4.4vw,40px);line-height:1.06;letter-spacing:-.4px;margin:11px 0 0}
.ch-sub{font-family:var(--head);font-style:italic;font-size:18px;color:var(--muted);margin:9px 0 0}
.ch-body{font-size:15px;line-height:1.68}
.ch-body p{margin:0 0 14px}
.ch-body .lead{font-size:16.5px;line-height:1.62;color:#33414f}

/* chapter hero banner */
.chapter--hero{padding-top:0}
.ch-head--hero{position:relative;margin:0 -60px 30px;height:268px;overflow:hidden;display:flex;align-items:flex-end;isolation:isolate}
.ch-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 38%;z-index:-2}
.ch-hero-scrim{position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(10,16,26,.18) 0%,rgba(10,16,26,.5) 55%,rgba(8,14,24,.93) 100%)}
.ch-head--hero .ch-hero-text{padding:0 60px 26px;color:#fff;width:100%}
.ch-head--hero .ch-eyebrow{color:#e7cd85}
.ch-head--hero .ch-title{color:#fff;text-shadow:0 2px 24px rgba(0,0,0,.45)}
.ch-head--hero .ch-sub{color:#dbe2ea}

/* inline figure */
.figure{margin:20px 0;border-radius:12px;overflow:hidden;border:1px solid var(--line)}
.figure img{width:100%;height:auto;display:block}
.figure figcaption{font-size:12px;color:var(--muted);padding:9px 14px;background:#fff;border-top:1px solid var(--line);font-style:italic}

/* pull quote */
.pquote{margin:20px 0;padding:6px 0 6px 22px;border-left:3px solid var(--accent)}
.pquote p{font-family:var(--head);font-style:italic;font-size:19px;line-height:1.45;color:var(--badge);margin:0}
.sh{font-family:var(--head);font-weight:600;font-size:21px;letter-spacing:-.2px;margin:30px 0 12px;padding-bottom:8px;border-bottom:2px solid var(--accent);display:inline-block}

/* pillars */
.pillars{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:8px 0 6px}
.pillar{display:flex;gap:14px;align-items:flex-start;background:rgba(201,168,76,.07);border:1px solid var(--line);border-radius:11px;padding:16px}
.pl-badge{flex:0 0 auto;width:44px;height:44px;border-radius:10px;background:var(--badge);color:var(--badgeInk);font-family:var(--head);font-weight:700;font-size:23px;display:grid;place-items:center}
.pl-t{font-weight:700;font-size:15px}
.pl-d{color:var(--muted);font-size:13px;line-height:1.5;margin-top:3px}

/* pathway cards */
.paths{display:flex;flex-direction:column;gap:12px;margin:6px 0}
.pathc{display:flex;gap:15px;align-items:flex-start;border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:10px;padding:16px 18px;background:rgba(201,168,76,.05)}
.picon{flex:0 0 auto;width:34px;height:34px;color:var(--accent2)}
.picon svg{width:100%;height:100%}
.pt{font-weight:700;font-size:15.5px;margin-bottom:6px}
.pul{margin:0;padding-left:18px;color:var(--muted);font-size:13.5px;line-height:1.5}
.pul li{margin:2px 0}

/* generic cards grid */
.cards{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin:6px 0}
.card{border:1px solid var(--line);border-radius:10px;padding:15px 16px;background:#fff}
.cd-t{font-weight:700;font-size:14.5px;color:var(--badge)}
.cd-d{color:var(--muted);font-size:13px;line-height:1.52;margin-top:5px}

/* tables */
.tbl-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:10px 0 6px}
.tbl{width:100%;border-collapse:collapse;font-size:13px;border:1px solid var(--line);min-width:600px}
.tbl th{text-align:left;background:var(--badge);color:var(--badgeInk);font-weight:600;padding:10px 12px;font-size:11.5px;letter-spacing:.04em;text-transform:uppercase}
.tbl td{padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}
.tbl tr:last-child td{border-bottom:0}
.tbl tr:nth-child(even) td{background:rgba(201,168,76,.06)}
.tbl .strong{font-weight:600;color:var(--ink)}

/* callouts */
.callout{margin:18px 0;border-radius:11px;padding:16px 18px;break-inside:avoid}
.callout--gold{background:rgba(201,168,76,.13);border:1px solid rgba(201,168,76,.45)}
.callout--danger{background:rgba(162,58,46,.08);border:1px solid rgba(162,58,46,.35)}
.callout--info{background:rgba(27,107,123,.09);border:1px solid rgba(27,107,123,.35)}
.co-tag{display:flex;align-items:center;gap:9px;font-weight:700;font-size:12px;letter-spacing:.01em;color:var(--accent)}
.co-tag--head{text-transform:none;letter-spacing:0;font-size:15.5px;line-height:1.3}
.callout--danger .co-tag{color:var(--danger)}
.callout--info .co-tag{color:var(--accent2)}
.co-mark{flex:0 0 auto;width:21px;height:21px;border-radius:6px;display:grid;place-items:center;font-family:var(--head);font-weight:700;font-size:14px;color:#fff;background:var(--accent)}
.callout--danger .co-mark{background:var(--danger)}
.callout--info .co-mark{background:var(--accent2)}
.co-b{font-size:14px;line-height:1.6;margin:9px 0 0;color:var(--ink)}

/* dos list */
.dos{list-style:none;margin:8px 0;padding:0;display:grid;gap:8px}
.dos li{position:relative;padding-left:26px;font-size:14px;line-height:1.5}
.dos li::before{content:"";position:absolute;left:4px;top:7px;width:9px;height:9px;border-radius:50%;background:var(--accent2)}

/* red flags */
.flags{list-style:none;margin:8px 0;padding:0;display:grid;gap:9px}
.flags li{display:flex;gap:11px;align-items:flex-start;font-size:14px;line-height:1.45}
.fx{flex:0 0 auto;width:21px;height:21px;border-radius:6px;background:rgba(162,58,46,.13);color:var(--danger);display:grid;place-items:center;margin-top:1px}
.fx svg{width:12px;height:12px}

/* checklists */
.checkcols{display:grid;grid-template-columns:1fr 1fr;gap:18px 26px;margin:8px 0}
.ckg-t{font-weight:700;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--accent2);margin-bottom:8px}
.checklist{list-style:none;margin:0;padding:0;display:grid;gap:7px}
.checklist li{position:relative;padding-left:26px;font-size:13.5px;line-height:1.45;color:var(--ink)}
.checklist li::before{content:"";position:absolute;left:2px;top:1px;width:15px;height:15px;border-radius:4px;border:1.5px solid var(--accent)}

/* questions */
.qlist{margin:14px 0;padding:0;list-style:none;counter-reset:q;text-align:left}
.qlist li{counter-increment:q;display:grid;grid-template-columns:34px 1fr;column-gap:16px;row-gap:2px;align-items:start;padding:13px 2px;border-bottom:1px solid var(--line)}
.qlist li:last-child{border-bottom:0}
.qlist li::before{content:counter(q);grid-row:span 2;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:rgba(201,168,76,.13);border:1px solid rgba(201,168,76,.55);font-family:var(--head);font-weight:700;font-size:14.5px;color:var(--accent)}
.qlist .q{grid-column:2;font-weight:600;font-size:15px;line-height:1.4;text-align:left}
.qlist .qa{grid-column:2;color:var(--muted);font-size:12.5px;line-height:1.45;text-align:left;margin-top:1px}

/* scams */
.scams{display:grid;gap:13px;margin:8px 0}
.scam{border:1px solid rgba(162,58,46,.28);border-left:3px solid var(--danger);border-radius:10px;padding:15px 17px;background:rgba(162,58,46,.04);break-inside:avoid}
.sc-h{display:flex;align-items:center;gap:10px;font-family:var(--head);font-weight:600;font-size:17px;color:var(--danger)}
.sc-warn{flex:0 0 auto;width:22px;height:22px;color:var(--danger)}
.sc-r,.sc-p{font-size:13.5px;line-height:1.55;margin:8px 0 0}
.sc-r b,.sc-p b{color:var(--ink)}
.sc-p b{color:var(--accent2)}

/* timeline */
.timeline{position:relative;margin:10px 0 4px;padding-left:8px}
.tl-step{position:relative;padding:0 0 20px 30px;border-left:2px solid var(--line)}
.tl-step:last-child{border-left-color:transparent}
.tl-dot{position:absolute;left:-8px;top:2px;width:14px;height:14px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px var(--paper)}
.tl-h{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
.tl-stage{font-family:var(--head);font-weight:600;font-size:17px;color:var(--badge)}
.tl-time{font-size:12px;font-weight:600;color:var(--accent2);background:rgba(27,107,123,.1);padding:3px 9px;border-radius:999px}
.tl-list{margin:8px 0 0;padding-left:18px;color:var(--muted);font-size:13.5px;line-height:1.55}
.tl-list li{margin:3px 0}

/* note block */
.note{background:#fff;border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin:16px 0}
.note-t{font-family:var(--head);font-weight:600;font-size:16px;color:var(--badge);margin-bottom:6px}
.note p{font-size:13.5px;line-height:1.6;color:var(--muted);margin:0}

/* closing / firm */
.colophon{background:radial-gradient(120% 100% at 50% 0%,var(--bg2),var(--bg));color:#e8edf3;padding:54px 60px;text-align:center}
.colophon .cl-mark{font-family:var(--head);font-weight:600;font-size:30px;letter-spacing:.02em;color:#fff}
.colophon .cl-mark b{color:var(--accent)}
.colophon .cl-sub{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin-top:6px}
.colophon p{max-width:560px;margin:18px auto 0;font-size:14px;line-height:1.65;color:#bcc6d2}
.cl-serv{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:20px auto 0;max-width:620px}
.cl-serv span{font-size:11.5px;font-weight:600;color:#e7cd85;border:1px solid rgba(231,205,133,.35);border-radius:999px;padding:6px 13px}
.cl-dl{display:inline-flex;align-items:center;gap:9px;margin:26px auto 0;background:var(--accent);color:#0b1018;font-weight:700;font-size:14.5px;padding:12px 22px;border-radius:999px;text-decoration:none}
.cl-dl svg{width:17px;height:17px}
.cl-contact{margin-top:22px;font-size:15px}
.cl-contact b{color:var(--accent)}
.cl-contact a.cl-link{color:var(--accent);text-decoration:none;border-bottom:1px solid rgba(231,205,133,.45)}
.cl-contact a.cl-link:hover{border-bottom-color:var(--accent)}
@media print{.cl-dl{display:none}}
.cl-legal{margin:22px auto 0;max-width:600px;font-size:12.5px;line-height:1.65;color:#8995a6}

/* per-chapter disclaimer footer */
.ch-disclaimer{margin-top:28px;padding-top:12px;border-top:1px solid var(--line);font-size:11px;color:var(--muted);text-align:center;font-style:italic;line-height:1.5;display:flex;flex-direction:column;gap:2px}

@media(max-width:720px){
  .toc,.chapter,.colophon{padding-left:24px;padding-right:24px}
  .cv-inner{padding-left:24px;padding-right:24px}
  .ch-head--hero{margin-left:-24px;margin-right:-24px;height:210px}
  .ch-head--hero .ch-hero-text{padding-left:24px;padding-right:24px}
  .pillars,.cards,.checkcols{grid-template-columns:1fr}
  .toc .toc-n{flex-basis:96px}
}

/* very narrow viewports: only one line of the disclaimer can fit comfortably.
   Keep the copyright notice visible; hide the general-info sentence. */
@media(max-width:340px){
  .ch-disc-info{display:none}
}

/* ---------------- PRINT / PDF ---------------- */
@page{size:A4;margin:16mm 15mm 22mm}
@page{@bottom-center{content:"The Ferguson Law H.O.M.E. Buyer\'s guide is for general information only and is not legal advice.\\A\\00A9 2026 Ferguson Law. All rights reserved.";white-space:pre-line;font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:7.5pt;color:#8995a6;text-align:center}}
@media print{
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  body{background:#fff}
  .bar{display:none}
  .sheet{max-width:none;margin:0;box-shadow:none;border-radius:0}
  .cv-inner{padding:60px 40px}
  .toc{break-after:page}
  .chapter{break-before:page;padding:0 38px 24px;border-top:0}
  .chapter:first-of-type{break-before:auto}
  .chapter--hero{padding-top:0}
  .ch-head--hero{margin:0 -38px 26px;height:230px}
  .ch-head--hero .ch-hero-text{padding:0 38px 22px}
  .colophon{break-before:page;padding:50px 38px}
  .ch-disclaimer{display:none}
  .callout,.scam,.pathc,.pillar,.note,.tl-step,.figure,.card{break-inside:avoid}
  .ch-head--hero{break-inside:avoid}
  .ch-title,.sh,.tl-stage{break-after:avoid}
  a{text-decoration:none}
}
</style>
</head>
<body>

<div class="bar"><div class="bar-in">
  <div class="brand">Ferguson <b>Law</b></div>
  <div class="sp"></div>
  <button class="btn-dl" onclick="openLeadGate()" type="button">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
    Get the free guide (PDF)
  </button>
</div></div>

<main class="sheet">

  <section class="cover cover--final">
    <img class="cv-final-img" src="img/cover-final.jpg" alt="The Ferguson Law H.O.M.E. Buyer’s Guide: Home Ownership Made Easy. The complete first-time home purchaser’s guide for Jamaicans at home and abroad.">
  </section>

  <nav class="toc">
    <h2>Contents</h2>
    <ol>${toc}</ol>
    ${DISCLAIMER_HTML}
  </nav>

  ${CHAPTERS.map(chapterHtml).join('\n')}

  <section class="colophon">
    <div class="cl-mark">Ferguson <b>Law</b></div>
    <div class="cl-sub">Attorneys-at-Law · Kingston, Jamaica</div>
    <p>Ferguson Law is a Jamaican law firm specialising in conveyancing and property law for local and international clients. We guide first-time purchasers, investors and diaspora clients through every stage of acquiring property in Jamaica, with clarity, confidence and legal precision.</p>
    <div class="cl-serv">
      <span>Residential Conveyancing</span><span>Commercial Property</span><span>Title Investigation</span>
      <span>Pre-Construction Agreements</span><span>Remote / Diaspora Transactions</span>
      <span>Power of Attorney</span><span>NHT &amp; Mortgage Completion</span>
    </div>
    <button class="cl-dl" onclick="openLeadGate()" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
      Get the free guide (PDF)
    </button>
    <div class="cl-contact"><b><a class="cl-link" href="https://ferguson-law.vercel.app" target="_blank" rel="noopener">fergusonlawja.com</a></b> · <a class="cl-link" href="tel:${PHONE.replace(/[^\d+]/g, '')}">${PHONE}</a> · <a class="cl-link" href="mailto:contact@fergusonlawja.com">contact@fergusonlawja.com</a></div>
    <p class="cl-legal">This guide is provided for general information purposes only and does not constitute legal advice for your specific situation. Laws and procedures may change. Always consult a qualified Jamaican attorney before taking any action in relation to a property transaction. © Ferguson Law. All rights reserved.</p>
  </section>

<!-- Lead Gate Modal -->
<div id="lead-gate" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(10,16,24,.75);backdrop-filter:blur(4px);overflow-y:auto">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:20px;padding:32px 28px;box-shadow:0 32px 80px rgba(0,0,0,.35)">
    <h2 style="margin:0 0 6px;font-size:1.4rem;color:#0e2518">Get the Free H.O.M.E.® Guide</h2>
    <p style="margin:0 0 20px;font-size:.93rem;color:#69736d;line-height:1.6">Fill in a short form and the PDF downloads instantly — complimentary from Ferguson Law.</p>
    <form id="lead-form" onsubmit="submitLead(event)" style="display:grid;gap:14px">
      <input name="name" required placeholder="Full name *" style="padding:10px 14px;border:1px solid #ddd;border-radius:10px;font-size:.95rem;width:100%;box-sizing:border-box">
      <input name="email" type="email" required placeholder="Email address *" style="padding:10px 14px;border:1px solid #ddd;border-radius:10px;font-size:.95rem;width:100%;box-sizing:border-box">
      <input name="phone" placeholder="Phone / WhatsApp (optional)" style="padding:10px 14px;border:1px solid #ddd;border-radius:10px;font-size:.95rem;width:100%;box-sizing:border-box">
      <input name="country" required placeholder="Country of residence *" style="padding:10px 14px;border:1px solid #ddd;border-radius:10px;font-size:.95rem;width:100%;box-sizing:border-box">
      <select name="purchase_timeframe" required style="padding:10px 14px;border:1px solid #ddd;border-radius:10px;font-size:.95rem;width:100%;box-sizing:border-box;background:#fff">
        <option value="">Expected purchase timeframe *</option>
        <option value="0-6 months">Within 6 months</option>
        <option value="6-12 months">6 – 12 months</option>
        <option value="1-2 years">1 – 2 years</option>
        <option value="2+ years">2+ years / just exploring</option>
      </select>
      <select name="purchase_location" required style="padding:10px 14px;border:1px solid #ddd;border-radius:10px;font-size:.95rem;width:100%;box-sizing:border-box;background:#fff">
        <option value="">Intended purchase location *</option>
        <option value="Kingston / St. Andrew">Kingston / St. Andrew</option>
        <option value="St. Catherine">St. Catherine</option>
        <option value="St. James / Montego Bay">St. James / Montego Bay</option>
        <option value="Other parish">Other parish</option>
        <option value="Undecided">Undecided</option>
      </select>
      <fieldset style="border:1px solid #ddd;border-radius:10px;padding:10px 14px">
        <legend style="font-size:.85rem;color:#69736d;padding:0 6px">Financing type *</legend>
        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:6px">
          <label style="display:flex;gap:6px;align-items:center;font-size:.93rem"><input type="radio" name="financing_type" value="cash" required> Cash</label>
          <label style="display:flex;gap:6px;align-items:center;font-size:.93rem"><input type="radio" name="financing_type" value="mortgage"> Mortgage</label>
          <label style="display:flex;gap:6px;align-items:center;font-size:.93rem"><input type="radio" name="financing_type" value="nht"> NHT</label>
          <label style="display:flex;gap:6px;align-items:center;font-size:.93rem"><input type="radio" name="financing_type" value="undecided"> Undecided</label>
        </div>
      </fieldset>
      <fieldset style="border:1px solid #ddd;border-radius:10px;padding:10px 14px">
        <legend style="font-size:.85rem;color:#69736d;padding:0 6px">First-time buyer? *</legend>
        <div style="display:flex;gap:14px;margin-top:6px">
          <label style="display:flex;gap:6px;align-items:center;font-size:.93rem"><input type="radio" name="first_time_buyer" value="yes" required> Yes</label>
          <label style="display:flex;gap:6px;align-items:center;font-size:.93rem"><input type="radio" name="first_time_buyer" value="no"> No</label>
        </div>
      </fieldset>
      <select name="budget_band" required style="padding:10px 14px;border:1px solid #ddd;border-radius:10px;font-size:.95rem;width:100%;box-sizing:border-box;background:#fff">
        <option value="">Approximate budget *</option>
        <option value="Under J$10M">Under J$10M</option>
        <option value="J$10M - J$20M">J$10M – J$20M</option>
        <option value="J$20M - J$40M">J$20M – J$40M</option>
        <option value="J$40M+">J$40M+</option>
        <option value="USD budget">USD budget</option>
        <option value="Undecided">Undecided</option>
      </select>
      <label style="display:flex;gap:10px;align-items:flex-start;font-size:.88rem;color:#555;cursor:pointer">
        <input type="checkbox" name="consent" required style="margin-top:3px;flex-shrink:0">
        I consent to receive relevant property and legal communications from Ferguson Law.
      </label>
      <p id="lead-err" style="display:none;color:#c0392b;font-size:.88rem;margin:0"></p>
      <button type="submit" id="lead-submit" style="background:#c8a65c;color:#0e2518;font-weight:700;font-size:1rem;border:0;border-radius:999px;padding:13px 22px;cursor:pointer;width:100%">Get the PDF &rarr;</button>
      <button type="button" onclick="document.getElementById('lead-gate').style.display='none'" style="background:none;border:0;color:#69736d;font-size:.88rem;cursor:pointer;padding:4px">Cancel</button>
    </form>
    <div id="lead-success" style="display:none;text-align:center;padding:20px 0">
      <p style="font-size:1.1rem;font-weight:700;color:#0e2518;margin:0 0 10px">Your guide is ready.</p>
      <a id="lead-pdf-link" href="HOME-Guide-Ferguson-Law.pdf" download="HOME-Guide-Ferguson-Law.pdf" style="display:inline-block;background:#c8a65c;color:#0e2518;font-weight:700;font-size:1rem;border-radius:999px;padding:13px 26px;text-decoration:none">Download PDF</a>
      <p style="font-size:.85rem;color:#69736d;margin:14px 0 0">A copy has been sent to your email.</p>
    </div>
  </div>
</div>
<script>
function openLeadGate(){document.getElementById('lead-gate').style.display='block';}
async function submitLead(e){
  e.preventDefault();
  const btn=document.getElementById('lead-submit');
  const err=document.getElementById('lead-err');
  btn.disabled=true; btn.textContent='Sending…'; err.style.display='none';
  const fd=new FormData(e.target);
  const body={
    name:fd.get('name'), email:fd.get('email'), phone:fd.get('phone')||null,
    country:fd.get('country'), purchase_timeframe:fd.get('purchase_timeframe'),
    purchase_location:fd.get('purchase_location'), financing_type:fd.get('financing_type'),
    first_time_buyer:fd.get('first_time_buyer')==='yes', budget_band:fd.get('budget_band'),
    consent:true, source:'ferguson-home-ebook'
  };
  try{
    const res=await fetch('https://ferguson-law.vercel.app/api/ebook/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const json=await res.json();
    if(!res.ok||!json.ok) throw new Error(json.error||'Submission failed');
    document.getElementById('lead-form').style.display='none';
    document.getElementById('lead-success').style.display='block';
  }catch(ex){
    err.textContent=ex.message||'Something went wrong. Please try again.';
    err.style.display='block';
    btn.disabled=false; btn.textContent='Get the PDF →';
  }
}
</script>

</main>
</body>
</html>`;

await writeFile(join(process.cwd(), 'public', 'index.html'), html);
console.log('Wrote public/index.html (' + (html.length / 1024).toFixed(1) + ' KB), ' + CHAPTERS.length + ' chapters.');
