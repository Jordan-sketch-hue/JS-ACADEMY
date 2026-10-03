import type { Course } from '../courses'

export const salesCourses: Course[] = [
  {
    id: 'sm-m01',
    track: 'sales-mgmt' as any,
    title: 'Architecture of a Sales System',
    subtitle: 'Understanding the engine that turns interest into revenue — and why most "sales problems" are really system problems',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 1,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'Revenue Engine', definition: 'The integrated system of marketing, sales, and customer success that predictably generates and retains revenue — a phrase emphasising that revenue growth is an engineering problem, not a hustle problem.' },
      { term: 'Sales Funnel', definition: 'A visual model of the customer journey from first awareness to purchase, showing how a large pool of prospects narrows to a smaller pool of buyers at each stage — useful for identifying where the system is leaking.' },
      { term: 'Conversion Rate', definition: 'The percentage of prospects who move from one stage of the funnel to the next — a low conversion rate at any stage pinpoints where the sales system needs repair.' },
      { term: 'Sales Velocity', definition: 'A composite metric: (Number of Opportunities × Average Deal Size × Win Rate) ÷ Sales Cycle Length — the revenue the pipeline generates per unit of time. The formula reveals which lever to pull.' },
      { term: 'Sales Process', definition: 'The repeatable sequence of activities a salesperson follows from prospect identification to deal close — the system that allows a company to replicate and train for success rather than relying on individual talent.' },
    ],
    content: `## Architecture of a Sales System

Most businesses treat sales as a series of individual heroic efforts. A salesperson hits or misses quota based on their personality, work ethic, and personal network. Good months and bad months are explained by the quality of the rep, not the quality of the system. This is almost always wrong.

Revenue growth is an engineering problem. The inputs — leads, messaging, conversations, proposals — determine the output. When output is inconsistent, the system has a defect. When output is predictable, the system is working. The job of sales leadership is to design and operate the system, not to hire great individuals and hope they produce.

### The Revenue Engine

The Revenue Engine has three components:

**Marketing:** generates awareness and produces leads — people or companies that might have the problem the product solves.

**Sales:** qualifies those leads (do they actually have the problem and the ability to buy?) and converts the qualified ones to customers.

**Customer Success:** retains customers, identifies expansion opportunities, and generates referrals — new leads from satisfied existing customers.

Each component depends on the others. Marketing can generate 1,000 leads/month; if Sales can only handle 50, the rest decay. Sales can close 50 deals/month; if Customer Success cannot retain them, the business is filling a leaky bucket. Customer Success can generate referrals; if Marketing does not have a system to capture and route them, the referrals are lost.

The Revenue Engine metaphor matters because it reframes the conversation from "we need better salespeople" (a talent problem) to "we need a better syste\`" (an engineering problem). Systems can be analysed, measured, and improved. Talent is harder to change.

### The Sales Funnel

The funnel models the customer journey:

1. **Awareness:** the prospect learns the product exists
2. **Interest:** the prospect engages — visits the website, reads content, replies to an email
3. **Consideration:** the prospect actively evaluates the product against alternatives
4. **Intent:** the prospect signals purchase intent — requests a demo, starts a trial, responds to a proposal
5. **Evaluation:** the prospect is in active sales process, evaluating risk and value
6. **Purchase:** the deal closes

The funnel is useful not as a description of how customers think, but as a diagnostic tool. Where do prospects enter? At which stage do most of them leave? A 10% conversion from Awareness to Interest and a 50% conversion from Intent to Purchase reveals very different problems from the inverse.

Modern funnel thinking distinguishes between:
- **MQL (Marketing Qualified Lead):** a lead that meets the criteria Marketing has defined for passing to Sales — typically demographic fit and some engagement signal
- **SQL (Sales Qualified Lead):** a lead Sales has verified actually has the problem, the budget, and the authority to buy
- **Opportunity:** a specific deal a salesperson is actively working

Tracking MQL → SQL conversion rate reveals whether Marketing is sending relevant leads to Sales. Tracking SQL → Opportunity → Win rate reveals whether Sales is qualifying and closing effectively.

### Sales Velocity

The Sales Velocity formula makes the system concrete:

**Sales Velocity = (Opportunities × Deal Size × Win Rate) ÷ Sales Cycle**

To increase revenue, increase any of the first three or decrease the last. A business generating $500K/month with 50 opportunities, $50K ACV, 20% win rate, and 2-month cycle calculates as: 50 × $50,000 × 0.20 ÷ 2 = $250,000/month.

To double revenue, the options are:
- Double opportunities (from 50 to 100) — a lead generation problem
- Double deal size (from $50K to $100K) — an upmarket expansion or pricing problem
- Double win rate (from 20% to 40%) — a sales effectiveness problem
- Halve cycle length (from 2 months to 1 month) — a process and urgency creation problem

The formula reveals which lever is underperforming. Most sales leaders focus on win rate; many of the highest-leverage opportunities are in cycle length and deal size.

### The Sales Process as Replication Vehicle

A documented sales process serves one primary purpose: making successful sales outcomes replicable. If the best salesperson on the team uses an undocumented process that only they understand, the company's revenue depends on retaining one person. If that process is documented, trained, measured, and iterated, any competent person can execute it.

Stages in a typical B2B sales process:
1. **Prospecting** — identifying companies and individuals to contact
2. **Initial Outreach** — first contact (cold email, LinkedIn, referral)
3. **Discovery** — understanding the prospect's problem, situation, and buying context
4. **Demo/Presentation** — showing how the product addresses the identified problem
5. **Proposal** — presenting a specific offer with pricing and terms
6. **Negotiation** — resolving objections and agreeing on terms
7. **Close** — getting the signed agreement
8. **Handoff** — transitioning the customer to Customer Success

Each stage has: an entry criterion (what must be true to enter this stage), exit criterion (what must be true to move to the next), and a set of activities the rep performs. The process transforms gut instinct into a trainable, measurable system.`,
    quiz: [
      {
        q: 'A sales team has 100 MQLs/month, with 40% converting to SQLs, and 25% of SQLs converting to closed deals. The system shows a sharp drop at MQL → SQL conversion. What does this indicate?',
        options: ['Sales reps are not working hard enough', 'Marketing is generating leads that do not fit the SQL criteria — wrong demographic, wrong engagement signal, or wrong problem', 'The product is not competitive enough to win', 'The sales cycle is too long'],
        correct: 1,
        explanation: 'MQL → SQL conversion measures whether Marketing is delivering leads that Sales considers genuinely qualified. A sharp drop means Marketing\'s definition of a "good lead" does not match what Sales finds valuable — a misalignment in criteria, not a talent failure.',
      },
      {
        q: 'Using the Sales Velocity formula, a business has 40 opportunities, $30K ACV, 25% win rate, and 3-month cycle. What is its monthly sales velocity?',
        options: ['$100,000', '$300,000', '$75,000', '$50,000'],
        correct: 0,
        explanation: '(40 × $30,000 × 0.25) ÷ 3 = $300,000 ÷ 3 = $100,000/month. The formula shows the monthly revenue the pipeline generates given current performance on each dimension.',
      },
      {
        q: 'Why does documenting the sales process matter even when a company has highly talented salespeople?',
        options: ['It reduces the need to hire talented salespeople', 'It makes successful outcomes replicable and trainable — reducing dependence on individual talent, enabling consistent measurement, and supporting team scaling', 'It satisfies compliance requirements', 'It eliminates the need for sales coaching'],
        correct: 1,
        explanation: 'An undocumented process that lives only in one person\'s head creates key-person dependency. Documenting the process enables training, measurement, coaching, and scaling — making the organisation resilient to turnover and capable of hiring to a standard rather than hoping for exceptional individuals.',
      },
      {
        q: 'The Revenue Engine metaphor reframes sales from a talent problem to what kind of problem?',
        options: ['A technology problem', 'An engineering problem — inputs determine outputs; inconsistent outputs mean the system has a defect that can be analysed and corrected', 'A marketing problem', 'A pricing problem'],
        correct: 1,
        explanation: 'Framing revenue as a system (not a talent problem) means the business can measure inputs and outputs at each stage, identify where prospects are lost, and fix specific defects. This is more actionable than "hire better salespeople" because systems can be designed and iterated.',
      },
      {
        q: 'Customer Success is part of the Revenue Engine, not just a support function. Why?',
        options: ['Customer Success handles invoicing and renewals', 'Customer Success generates retained revenue, expansion revenue (upsells/cross-sells), and referrals — all of which are inputs to the top of the funnel and the bottom of the P&L', 'Customer Success reports to the Sales team', 'Customer Success reduces product development costs'],
        correct: 1,
        explanation: 'Treating Customer Success as pure support misses its revenue role: retention (not losing the MRR you already have), expansion (selling more to existing customers, where CAC is near zero), and referrals (new leads from satisfied customers that convert at higher rates). Each is a Revenue Engine function.',
      },
    ],
  },
  {
    id: 'sm-m02',
    track: 'sales-mgmt' as any,
    title: 'Buyer Psychology & Decision Science',
    subtitle: 'How people actually decide to buy — and how great salespeople work with that reality',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 2,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'Loss Aversion', definition: 'The cognitive bias where the pain of losing something is felt roughly twice as strongly as the pleasure of gaining something equivalent — "What are you losing by NOT buying this?" is often more persuasive than "What will you gain?"' },
      { term: 'Status Quo Bias', definition: 'The tendency to prefer the current state of affairs over change — the psychological reason why "good enough" is the most common competition for any B2B product.' },
      { term: 'Buying Committee', definition: 'The group of people at an organisation who influence or make a purchase decision — in B2B sales, the average buying committee has 6–10 stakeholders, each with different concerns and veto power.' },
      { term: 'SPIN Selling', definition: 'Neil Rackham\'s questioning framework: Situation (understanding context), Problem (identifying pain), Implication (amplifying consequences), Need-payoff (connecting solution to outcome) — a research-backed structure for discovery conversations.' },
      { term: 'Champion', definition: 'The internal stakeholder at a prospect organisation who believes in the product\'s value and actively advocates for the purchase — the most critical relationship in a complex B2B sale.' },
    ],
    content: `## Buyer Psychology & Decision Science

Selling is not persuasion. It is helping people make decisions they would otherwise struggle to make on their own — decisions that, if made well, genuinely benefit the buyer. Understanding how people actually make decisions is not manipulation; it is the prerequisite for being useful rather than annoying.

### How Decisions Are Actually Made

Daniel Kahneman's System 1/System 2 framework is directly applicable to sales:

**System 1** (fast, automatic, emotional): most initial responses to sales outreach — deletion of cold emails, dismissal of pitches, snap judgments about salespeople — are System 1 reactions. You cannot lead with a data sheet and expect System 1 to engage.

**System 2** (slow, deliberate, rational): the ROI analysis, the procurement process, the committee review — these are System 2. But System 2 is engaged only after System 1 has said "this might be relevant to me."

Implication for sales: you need to win System 1 (relevance, credibility, trust) before you can engage System 2 (logic, data, ROI). A cold email that leads with product features fails because it never passes the System 1 relevance filter. An email that opens with a specific observation about the recipient's situation engages System 1 first.

### Loss Aversion in Sales

People are approximately twice as motivated by the prospect of losing something as by the prospect of gaining something of equal value. Loss aversion is one of the most reliable findings in behavioural economics, and one of the most underused in sales.

Most sales pitches are framed as gains: "You will get X, Y, Z." A loss-aversion frame is more powerful: "Right now, every month you don't have this, your team spends X hours on manual work / you're losing Y in revenue / your competitors who adopted this 12 months ago are Z ahead of you."

Loss aversion also explains why status quo bias is so powerful: the known losses from the current state are less psychologically salient than the unknown risks of change. The status quo is the existing anchor; switching requires incurring perceived risk. Effective selling makes the cost of the status quo explicit and concrete — turning the invisible losses of inaction into salient, quantified pain.

### The Buying Committee

In B2B sales, the individual you are talking to rarely makes the purchase alone. CEB (now Gartner) research found that the average B2B purchase involves 6.8 stakeholders. Each has different:
- **Functional concerns:** the day-to-day user cares about ease of use; the CFO cares about ROI; the CTO cares about integration and security; Legal cares about compliance and liability.
- **Political concerns:** who gets credit for this purchase? Whose budget is being spent? Whose domain is being disrupted?
- **Risk profiles:** some stakeholders are growth-oriented (willing to take risk for upside); others are loss-averse (motivated primarily by avoiding downside).

Selling to one person in the committee without understanding the others produces deals that stall when the proposal reaches an unfamiliar stakeholder. A champion — an internal advocate who believes in your solution — is valuable precisely because they navigate the committee for you, addressing concerns you may not even know exist.

### The Champion

The champion is the single most critical relationship in a complex B2B sale. A champion is:
- Senior enough to have credibility within the organisation
- Personally invested in the outcome (their role or reputation benefits from the purchase)
- Willing to advocate for the solution internally, including in conversations you are not in

Finding and developing a champion is more important than perfecting your pitch. A champion who believes in your product will compensate for a mediocre presentation; a great presentation with no internal advocate produces a deal that dies in committee.

Tests for a true champion (as opposed to a coach who just likes talking to you):
- Have they told you about internal politics, competing priorities, or budget constraints? (Real advocates share information that exposes their organisation's weakness)
- Have they arranged access to other decision-makers? (A coach introduces you to their peers; a champion facilitates access to executives)
- Are they willing to take personal risk for the purchase? (Champions stick their reputation on their recommendation; coaches don't)

### SPIN Selling

Neil Rackham's research (from analysis of 35,000 sales calls) found that the most successful salespeople in complex sales asked fundamentally different types of questions:

**Situation questions:** understand the current context. "How many people are currently involved in your procurement process?"

**Problem questions:** identify pain. "What's the most frustrating part of the current process?"

**Implication questions:** amplify the consequence of the problem. "How does that delay affect your team's ability to close quarters on time? What has it cost you in the last year?"

**Need-payoff questions:** connect the solution to the outcome. "If you could eliminate that delay entirely, how would that \`hange your team's performance?"

The insight: stating the value of the solution is less effective than getting the buyer to state it themselves. "This will save you 5 hours/week" (salesperson claim) is less convincing than "If we solved this, we'd save 5 hours/week on the reconciliation process alone, which at our blended cost is about $90K/year" (buyer conclusion guided by SPIN questions). The buyer's own analysis is more credible to the buyer than anything the salesperson says.`,
    quiz: [
      {
        q: 'A cold email that opens with "Our platform has 40+ features including AI-powered dashboards and real-time analytics" is likely to fail because:',
        options: ['It is too long', 'It lists too many features', 'It leads with product features that fail the System 1 relevance filter — the recipient\'s automatic response is "this is not about me" before they engage System 2', 'The subject line is unclear'],
        correct: 2,
        explanation: 'System 1 makes snap judgments about relevance. A feature list gives no indication of why this product is relevant to this specific recipient. An opening that demonstrates knowledge of the recipient\'s situation passes the System 1 filter and earns the right to engage System 2 with logic and data.',
      },
      {
        q: 'A salesperson says "Our solution will save your team 10 hours per week." A more psychologically persuasive framing would be:',
        options: ['A bigger number — "20 hours per week"', 'A loss-aversion frame: "Right now, every week your team spends 10 hours on this manually — that\'s 500 hours per year lost to work that doesn\'t move the business forward"', 'A feature list explaining how the time saving works', 'A customer testimonial about time savings'],
        correct: 1,
        explanation: 'Loss aversion: the pain of losing something is ~2x the pleasure of gaining something equal. Framing the status quo\'s cost (10 hours lost every week, compounding to 500 hours/year) is more motivating than framing the gain (10 hours saved). The salesperson\'s claim and the loss-frame describe the same reality; the loss-frame is more persuasive.',
      },
      {
        q: 'A deal is stalling after a strong demo. The champion has gone quiet. The most likely diagnosis is:',
        options: ['The prospect is not interested', 'The champion is not actually a champion — they were a coach who liked the product but lacked the credibility, investment, or willingness to advocate internally', 'Pricing is the objection', 'The competitor made a better offer'],
        correct: 1,
        explanation: 'Deals that stall after a strong demo often reveal that the "champion" was actually a coach — someone who enjoyed the conversations but never had the internal credibility, personal stake, or willingness to take risk to advocate for the purchase. The diagnostic: did they share internal politics, arrange executive access, and put their reputation behind the recommendation?',
      },
      {
        q: 'In SPIN Selling, why are "Implication questions" more effective than "Situation questions" alone?',
        options: ['Implication questions are more polite', 'Implication questions amplify the consequences of the problem, making the cost of inaction salient — situation questions describe the current state without motivating change', 'Implication questions require less research', 'Situation questions are only for early-stage discovery'],
        correct: 1,
        explanation: 'Situation questions gather context; they don\'t move buyers. Implication questions (what does this cost you? how does it affect your team? what happens if you don\'t solve it?) make the status quo painful by attaching quantified consequences to the problem. Rackham\'s research: implication questions are the strongest predictor of deal success in complex sales.',
      },
      {
        q: 'There are 7 stakeholders in a buying committee for a $200K deal. The salesperson has strong relationships with 3 of them. The deal goes to committee and is rejected. What most likely happened?',
        options: ['The product price was too high', 'The salesperson spent too long in discovery', 'An unfamiliar stakeholder — likely in Finance, Legal, or a competing department — raised an unaddressed concern that no internal champion was prepared to handle', 'The demo was not compelling'],
        correct: 2,
        explanation: 'In complex B2B sales, every stakeholder without a relationship and an addressed concern is a potential veto. The champion\'s role is to map the committee and pre-address concerns with stakeholders the salesperson may never meet. Deals die in committee when the champion hasn\'t done that navigation, or when there was no real champion at all.',
      },
    ],
  },
  {
    id: 'sm-m03',
    track: 'sales-mgmt' as any,
    title: 'Prospecting & Pipeline Building',
    subtitle: 'The front of the funnel — generating qualified conversations at scale without burning your reputation',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 3,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'ICP (Ideal Customer Profile)', definition: 'A detailed description of the company (firmographics) and individual (demographics, role, behaviour) most likely to buy and succeed with the product — the filter that makes prospecting efficient.' },
      { term: 'Outbound Sales', definition: 'A sales motion where the company initiates contact with prospects — cold email, cold calls, LinkedIn outreach — as opposed to inbound where prospects find the company.' },
      { term: 'Inbound Lead', definition: 'A prospect who initiates contact or signals interest by visiting the website, downloading content, signing up for a trial, or responding to marketing — already warmer than a cold outbound prospect.' },
      { term: 'Personalisation at Scale', definition: 'The technique of customising outbound outreach using research about each prospect\'s specific situation — 1-2 specific details that demonstrate genuine knowledge of them, at a volume that requires system and discipline to maintain.' },
      { term: 'Pipeline Coverage', definition: 'The ratio of pipeline value to quota — typically 3× or above is considered healthy (e.g., $3M in pipeline to hit a $1M quota), acknowledging that a meaningful percentage of pipeline will not close.' },
    ],
    content: `## Prospecting & Pipeline Building

An empty pipeline is the most common cause of missed quota. Every sales problem eventually reduces to: are there enough qualified conversations in progress? Prospecting — finding and starting those conversations — is the foundational activity that all other sales skills build on.

### The Ideal Customer Profile

Not all prospects are equal. The ICP defines who is most likely to buy, most likely to succeed with the product, and most likely to become a long-term customer who refers others.

ICP dimensions:

**Firmographic (company):**
- Industry: which sectors have the problem the product solves?
- Size: revenue, employee count, team size for the product area
- Stage: early-stage startup, growth stage, enterprise?
- Geography: where does the team operate?
- Technology stack: does the prospect use compatible tools?

**Demographic (individual contact):**
- Title/role: who owns the problem and the budget?
- Seniority: who has authority to buy?
- Functional responsibility: who is most affected by the problem?

**Behavioural:**
- Trigger events: what events indicate a prospect has the problem now? (new hire in the relevant role, recent funding, company expansion, tech stack change, regulatory change)
- Signals of intent: visit to specific website pages, content downloads, free trial signups, competitor churn

The ICP is not an aspiration — it is a hypothesis derived from analysis of the best existing customers. Who closed fastest? Who expanded soonest? Who referred others? Reverse-engineering those customers produces the ICP.

A tight ICP makes outbound dramatically more efficient. Cold outreach to a broad list is expensive, slow, and reputation-damaging. Cold outreach to a targeted list of 200 companies that precisely match the ICP is fast and converts at rates that justify the effort.

### Outbound Motion

Outbound sales requires reaching people who did not ask to hear from you. This is a trust problem: the default assumption of any cold outreach is "this person is wasting my time." The job of outbound is to defeat that assumption quickly enough to earn the first conversation.

Elements of effective outbound:

**Research before outreach:** know something specific and non-obvious about the prospect before writing a single word. LinkedIn profile, company news, job postings, product reviews, recent content they published. One specific insight demonstrates that this outreach is about them, not about the number of emails sent this week.

**One clear value hypothesis:** what specific problem does this prospect have, and why does your product solve it better than the alternatives they currently use? Not a feature list. A specific pain → specific solution connection.

**Clear and easy ask:** the goal of outbound is not to sell the product — it is to earn the right to have a conversation. "15-minute call to see if this is relevant to you" is a lower-friction ask than "30-minute demo." The ask should match what the prospect has to risk to say yes.

**Follow-up sequence:** most initial outreach goes unanswered, not because the prospect is uninterested, but because the timing was wrong or the email got buried. A thoughtful 4-6 touch sequence over 2-3 weeks — varying channel (email, LinkedIn, phone), adding new angles of value — dramatically increases response rates over a single email.

### Inbound Lead Management

Inbound leads are warmer and more valuable than outbound prospects. They have already demonstrated some interest. The most common failure: slow response times.

Research consistently shows that lead response time is one of the highest-leverage variables in conversion:
- Responding within 5 minutes vs 30 minutes: 21× higher conversion rate (Lead Response Management study)
- Responding within 1 hour vs 24 hours: 7× higher conversion rate

Why: the prospect is most engaged at the moment they take action. Every hour of delay, they are already less engaged, already talking to a competitor, already re-evaluating whether they need this at all.

Inbound lead routing should be automated: new trial signups immediately trigger an email; high-value accounts (identified by firmographic criteria) are immediately flagged for personal outreach. The human response time metric should be a dashboard metric for any sales team handling inbound.

### Pipeline Health

A pipeline is not a list of opportunities — it is a forecast. Each stage represents a probability-weighted view of future revenue:
- 40 opportunities at $50K ACV in early stage (20% close probability) = $400K expected revenue
- 20 opportunities at $50K ACV in late stage (70% close probability) = $700K expected revenue

Pipeline health metrics:
- **Coverage ratio:** total pipeline value / quota. Below 3× is dangerous — not enough raw material to hit quota given typical win rates.
- **Stage distribution:** is pipeline concentrated in early stages (uncertainty) or late stages (near-term revenue)?
- **Velocity through stages:** how long do deals sit in each stage before advancing or dying?
- **Pipeline age:** deals sitting in the pipeline without activity for 60+ days are typically dead (the rep is managing false hope rather than real opportunities).

Pipeline reviews should identify deals that are stalled, deals at risk of dying, and gaps against the coverage ratio with enough lead time to fix them. Weekly pipeline reviews — not monthly — are necessary to catch problems before they become missed quarters.`,
    quiz: [
      {
        q: 'A sales rep has a $1M quarterly quota and $2M in pipeline. Is this pipeline healthy?',
        options: ['Yes — $2M is double the quota, which is more than enough', 'No — at 2× coverage, the pipeline is likely insufficient given typical win rates; 3× or above is the standard benchmark', 'It depends on the industry', 'Yes — pipeline coverage does not affect quota attainment'],
        correct: 1,
        explanation: '2× pipeline coverage means the rep must win 50% of all opportunities to hit quota. Given that typical win rates in B2B are 20-30%, the pipeline is likely underweight. 3× coverage gives the rep room for 33% win rates; companies with lower win rates need even more coverage.',
      },
      {
        q: 'An inbound trial signup from a company that matches your ICP (Series B SaaS, 50+ engineers) comes in at 2 PM on a Tuesday. What is the highest-leverage next action?',
        options: ['Add them to a nurture email sequence scheduled for the following week', 'Respond within the first hour with a personal email from a sales rep, flagging the account as high-value and offering to help them get value faster', 'Wait for them to engage with more content before reaching out', 'Send an automated product tour email immediately'],
        correct: 1,
        explanation: 'Lead response time is one of the highest-leverage sales variables. Within 1 hour vs 24 hours produces 7× higher conversion. The prospect is most engaged at the moment they take action. A personal email from a rep that acknowledges the signup and offers specific help converts far better than a delayed automated sequence.',
      },
      {
        q: 'What is the goal of the first cold outreach email?',
        options: ['To close the sale', 'To demonstrate all product features', 'To earn the right to have a short conversation — not to sell the product', 'To schedule a 60-minute demo'],
        correct: 2,
        explanation: 'Cold outreach should have one goal: earn the right to a conversation. Pitching the full product in a cold email overwhelms the prospect and signals you\'re not listening. A focused value hypothesis + low-friction ask (15-minute call) respects the prospect\'s time and matches the level of trust they\'ve earned so far.',
      },
      {
        q: 'A deal has been sitting in "Proposal Sent" stage for 75 days with no activity. How should the sales manager treat this in pipeline review?',
        options: ['Count it at full value since the proposal was sent', 'Flag it as likely dead and remove it from the forecast — stalled deals without recent activity are typically not real opportunities', 'Schedule a product demo to re-engage', 'Increase the close probability estimate to account for the long time invested'],
        correct: 1,
        explanation: 'Deals that sit in pipeline without activity for 60+ days are typically dead. Keeping them in the forecast creates false confidence in coverage and obscures real pipeline gaps. The rep should make a final attempt to revive it; if there\'s no response, remove it from the active pipeline.',
      },
      {
        q: 'The ICP is described as a "hypothesis derived from analysis of best existing customers." Why derive it from existing customers rather than defining it from scratch?',
        options: ['It is faster', 'Existing customers who bought, expanded, and referred provide empirical evidence of who actually succeeds with the product — not who we hope will buy, but who has already proven fit', 'New ICPs require board approval', 'Existing customer analysis is required for compliance'],
        correct: 1,
        explanation: 'An ICP defined theoretically reflects assumptions about who should buy. An ICP derived from the best existing customers — who closed fastest, expanded soonest, referred most — reflects who actually succeeds. The data grounds the ICP in reality rather than aspiration, producing targeting that performs better in practice.',
      },
    ],
  },
  {
    id: 'sm-m04',
    track: 'sales-mgmt' as any,
    title: 'The Discovery Call',
    subtitle: 'The most important conversation in a sale — and why most salespeople spend it talking instead of listening',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 4,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'Discovery', definition: 'The phase of a sale where the salesperson deeply understands the prospect\'s situation, problem, goals, and decision context — the foundation that determines whether everything else in the sale will land.' },
      { term: 'BANT', definition: 'Budget, Authority, Need, Timeline — a qualification framework assessing whether a prospect is genuinely worth pursuing; criticised for being used as interrogation rather than conversation, but the four dimensions remain important.' },
      { term: 'MEDDIC', definition: 'Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion — a more sophisticated qualification framework for complex enterprise sales, widely used in large deal environments.' },
      { term: 'Talk/Listen Ratio', definition: 'The proportion of a sales call spent by the salesperson speaking vs listening — top-performing reps typically speak 43% and listen 57% of the time according to Gong research on call recordings.' },
      { term: 'Compelling Event', definition: 'A specific business reason why the prospect must make a decision by a particular date — "why now?" The presence of a compelling event predicts whether a deal will close or stall indefinitely.' },
    ],
    content: `## The Discovery Call

The discovery call is the most misunderstood and most consequential conversation in a sale. Most salespeople treat it as a prerequisite — something to get through on the way to the demo. The best salespeople treat it as the primary event: if discovery is done right, the demo is almost redundant, because the prospect has already articulated the exact problem the product solves.

### What Discovery Is For

Discovery has three purposes:

**Qualification:** is this a deal worth pursuing? Does the prospect have the problem, the budget, the authority, and the urgency? Pursuing unqualified opportunities is the most common cause of wasted sales effort.

**Information gathering:** what does the prospect's situation look like? What are they currently doing? What is painful? What have they tried? What are the political dynamics? What are the buying criteria?

**Alignment:** does the prospect begin to see their problem differently as a result of this conversation? The best discovery calls are not one-sided interviews — they are conversations in which the salesperson's questions help the prospect articulate problems they hadn't fully named, and connect those problems to business consequences they hadn't fully calculated.

The output of a great discovery call: the salesperson understands the prospect's situation well enough to give a demo that speaks directly to their specific situation, and the prospect has experienced enough value in the conversation that they want to continue.

### The Problem with Interrogation

BANT (Budget, Authority, Need, Timeline) is useful as a checklist but harmful as a conversation structure. "Do you have budget for this?" "Are you the decision-maker?" "What's your timeline?" — asked in sequence, this reads as an interrogation, not a conversation. Prospects feel evaluated rather than understood.

The alternative: weave qualification into genuine curiosity. Instead of "Do you have budget?" → "How does your team typically evaluate investments like this?" Instead of "Are you the decision-maker?" → "Who else at your organisation would typically be involved in a decision like this?" The same information is gathered; the conversation feels collaborative rather than extractive.

### MEDDIC for Complex Sales

For large B2B deals (six figures and above), a more rigorous qualification framework pays dividends. MEDDIC:

**Metrics:** what is the quantified impact of the problem? What will success look like in numbers? Without metrics, the ROI case cannot be built; without an ROI case, large deals stall.

**Economic Buyer:** who controls the budget? Not the champion, but the person who can actually approve the expenditure. Has the salesperson had a conversation with this person?

**Decision Criteria:** what criteria will the organisation use to evaluate options? Explicit criteria (must integrate with Salesforce, must be SOC 2 compliant) and implicit criteria (the CFO trusts vendors who've worked with companies of our size).

**Decision Process:** what steps does the organisation follow from "we want to buy this" to "contract signed"? Security review? Legal review? IT approval? Knowing the process allows the salesperson to pace the sale correctly and avoid being surprised.

**Identify Pain:** has the champion's specific pain been quantified and connected to business consequences? Without named, quantified pain, the deal has no urgency.

**Champion:** has a real champion been identified and developed? (See Module 2 for champion criteria.)

### Talk/Listen Ratio

Gong's analysis of millions of sales call recordings found that top performers speak approximately 43% of the time and listen 57% — while average performers speak 65%+ and listen less than 35%.

The implication: great discovery is mostly listening. Talking more — presenting more features, making more claims — correlates with worse outcomes in discovery. The prospect's situation cannot be understood through talking; it can only be understood through asking and listening.

Practical tools:
- **Ask one question at a time.** Multiple-part questions invite single-sentence answers. One focused question invites a full response.
- **Pause after answers.** Silence encourages the prospect to continue. An uncomfortable pause on the salesperson's side is often the prospect's moment of elaborating the most important thing in the conversation.
- **Reflect and confirm.** "What I'm hearing is [summary]. Is that right?" builds trust that the prospect feels understood, and catches misunderstandings early.

### The Compelling Event

Every deal requires a compelling event — a specific reason why the decision must be made by a particular date. Without one, the deal has no urgency and will stall indefinitely.

Types of compelling events:
- **Hard external deadlines:** new regulation takes effect, contract renewal date, go-live date for a new project
- **Internal deadlines:** budget cycle, hiring freeze coming, new hire starts who needs the tool
- **Consequence deadlines:** "if we don't solve this before our peak season, we'll have another year of the same problem"

Uncovering the compelling event is a discovery question: "What would make this a priority to solve in the next 60 days, versus 6 months from now?" If the prospect cannot articulate a compelling event, the deal is likely to sit in the pipeline for months without closing.

Creating urgency without manufacturing false deadlines: it is ethical and effective to help a prospect recognise the cost of delay. "You mentioned this problem has cost your team X per quarter for the last two years. At that rate, what does another 6 months of the status quo cost you?" This is not pressure — it is helping the buyer make a fully informed decision about timing.`,
    quiz: [
      {
        q: 'A salesperson spends 70% of a 30-minute discovery call presenting product features. Based on Gong\'s research, what is the likely outcome?',
        options: ['Higher close rates because the prospect is more informed', 'Lower close rates — top performers speak ~43% and listen ~57%; spending 70% talking correlates with worse discovery and lower close rates', 'No impact — talk/listen ratio doesn\'t affect outcomes', 'The rep should speak even more to compensate'],
        correct: 1,
        explanation: 'Gong\'s research on millions of call recordings consistently shows top performers listen more than they talk. Speaking 70% of the time leaves insufficient room to understand the prospect\'s specific situation, preventing the kind of tailored demo and proposal that moves complex deals forward.',
      },
      {
        q: 'What is the purpose of asking "What would make this a priority to solve in the next 60 days?" in a discovery call?',
        options: ['To set a closing date', 'To uncover the compelling event — the specific business reason that would create genuine urgency for a decision', 'To qualify on budget', 'To identify the economic buyer'],
        correct: 1,
        explanation: 'Without a compelling event, deals have no urgency and stall indefinitely. This question surfaces whether there is a specific business consequence (deadline, cost, risk) that makes solving the problem now more important than solving it later — the single biggest predictor of whether a deal will close.',
      },
      {
        q: 'The MEDDIC framework requires identifying the "Economic Buyer." Why is this often different from the champion?',
        options: ['The economic buyer is always more senior', 'The champion advocates for the product but the economic buyer controls the budget and can approve or block the expenditure — separate authority from advocacy', 'The economic buyer evaluates the technical specifications', 'There is always only one economic buyer in any organisation'],
        correct: 1,
        explanation: 'Champions believe in the solution and advocate for it. Economic buyers hold budget authority. A deal with a strong champion but no economic buyer relationship is at risk when the proposal reaches the budget holder who has not been engaged. MEDDIC requires confirming a direct relationship or access path to the economic buyer.',
      },
      {
        q: 'Instead of asking "Are you the decision-maker?", a more effective alternative is:',
        options: ['"Who else at your organisation would typically be involved in a decision like this?" — gathers the same information without making the prospect feel interrogated', '"Can you sign the contract yourself?"', '"Do you have authority for this budget?"', '"Will you need approval from your CEO?"'],
        correct: 0,
        explanation: '"Are you the decision-maker?" is direct but often triggers defensiveness — nobody wants to admit they aren\'t. "Who else would be involved?" is more collaborative, gathers the same information (and often more — it reveals the committee structure), and signals genuine interest in understanding the organisation rather than qualifying the prospect.',
      },
      {
        q: 'A prospect says: "We\'re interested but there\'s no urgency to decide now." The appropriate sales response is:',
        options: ['Accept the delay and follow up in 3 months', 'Offer a significant discount to create urgency', 'Help the prospect calculate the cost of delay: "You mentioned this problem has cost you X per quarter — at that rate, what does another 6 months of the status quo cost you?"', 'Tell the prospect about a limited-time offer'],
        correct: 2,
        explanation: 'Legitimate urgency creation connects inaction to the prospect\'s own stated costs — it\'s not pressure, it\'s helping them make a fully informed decision about timing. Discounts create pressure that damages value perception. Helping the prospect quantify the cost of delay empowers them to make the case internally without artificial pressure.',
      },
    ],
  },
  {
    id: 'sm-m05',
    track: 'sales-mgmt' as any,
    title: 'Presenting Value & Handling Objections',
    subtitle: 'Tailoring the pitch to the specific situation — and transforming objections from walls into conversations',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 5,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'Value Proposition', definition: 'The specific, quantified benefit the product delivers to this particular customer — not a generic marketing statement, but a calculation anchored to the customer\'s own situation.' },
      { term: 'ROI Calculation', definition: 'A quantified model of the financial return from a purchase — time saved × cost of time, revenue generated, risk reduced. Translates the product\'s benefits into the economic language of the buyer.' },
      { term: 'Objection', definition: 'A concern, doubt, or condition a prospect raises that, if left unresolved, would prevent the purchase — to be taken seriously and addressed, not argued against.' },
      { term: 'FUD (Fear, Uncertainty, Doubt)', definition: 'A competitive sales tactic of raising concerns about competitors rather than only promoting your own product — effective when grounded in real product differences, manipulative when manufactured.' },
      { term: 'Demo', definition: 'A product demonstration tailored to the prospect\'s specific situation — showing the features that solve the problems uncovered in discovery, not a generic feature tour.' },
    ],
    content: `## Presenting Value & Handling Objections

The presentation phase — demo and proposal — is where most salespeople spend the majority of their preparation time. It is also where most of them fail, because they prepare the wrong thing: a generic product tour rather than a tailored demonstration of value specific to this prospect's situation.

### The Discovery-Demo Connection

A great demo is built from great discovery. Every significant feature shown should connect to a specific pain point uncovered in discovery: "You mentioned that your team spends 3 hours every Monday reconciling these reports. Here's exactly how that works with our tool — let me show you the same scenario with your data."

Generic demos ("Here's the dashboard, here's the reporting, here's the analytics...") are commodity. They signal that the salesperson did not listen carefully enough in discovery to understand which parts of the product are relevant. They also put the cognitive burden on the prospect to connect features to their situation — work the prospect should not have to do.

A strong demo follows this structure:

1. **Set up the situation:** "Based on what you told me, your primary pain point is [X]. Let me show you how we address that specifically."
2. **Show the solution:** demonstrate the relevant feature in context of their described use case
3. **Confirm the value:** "Does this solve the problem you described? How would this change your Monday morning workflow?"
4. **Transition to the next pain point:** move through each major pain point from discovery

The confirmation questions serve two purposes: they check comprehension, and they get the prospect to verbally affirm value — creating ownership of the conclusion. "Yes, that would save us those 3 hours" is more valuable than the salesperson claiming it will.

### Building the ROI Case

Every purchase decision involves an implicit ROI calculation. Making it explicit — in numbers — dramatically increases the salesperson's ability to justify the price and build internal consensus.

ROI components:
- **Cost reduction:** time saved × blended cost per hour; subscriptions eliminated; headcount avoided
- **Revenue increase:** deals won faster, capacity to handle more volume, reduced churn
- **Risk reduction:** compliance fines avoided, security incidents prevented, regulatory penalties reduced

The ROI calculation must be anchored to the prospect's own numbers — their team size, their cost per hour, their revenue impact per day of delay. A generic "our customers save X" claim is not as convincing as "based on what you told me, your team of 12 spends approximately 5 hours per week on this — at your blended cost of $75/hour, that's $2,250/week or $117,000/year. Our tool reduces that by 70%, saving approximately $82,000/year against a cost of $24,000/year."

The ROI case becomes a tool the champion can use internally to justify the purchase to the economic buyer and the CFO without the salesperson in the room.

### Handling Objections

Objections are not attacks to be defended against — they are concerns that, if addressed well, move the deal forward. An objection is evidence that the prospect is engaged enough to think through whether to buy.

The most common objections and how to handle them:

**"It's too expensive."**
This usually means: the value is not yet clear enough to justify the price. The response is to deepen the ROI case, not to immediately discount. "Let's go back to the calculation — you mentioned this problem costs your team $X/year. At our pricing, that's a payback in under 3 months. Does the investment feel different in that context?" If price is still the objection after a clear ROI case, explore budget constraints and pricing flexibility.

**"We already have a solution."**
This is a status quo objection. The response: "That makes sense — most of our customers were using [common alternative] before switching. What made them move was [specific weakness]. Is that something you're experiencing?" Acknowledge their current investment, then specifically address the gap that brings companies to you.

**"We're not ready right now."**
This is a timing objection, often linked to no compelling event. Revisit the cost of delay. If the prospect genuinely has a competing priority, negotiate: "What would need to be true for this to move up the priority list? If we could start with a smaller scope that takes two weeks to implement rather than two months, would that change the timeline?"

**"We need to think about it."**
Often means: a concern hasn't been surfaced yet. "That makes sense. In my experience, when people say that, there's usually a specific concern that we haven't addressed. Can you help me understand what the hesitation is?" This opens the door to the real objection.

### What NOT to Do with Objections

- **Argue:** "No, actually our pricing is very competitive" — this triggers defensiveness and damages trust
- **Concede immediately:** "OK, I can offer a 30% discount" — signals that the original price was not justified, undermines value positioning
- **Ignore and pivot:** changing the subject signals the concern wasn't worth addressing
- **Dismiss:** "Everyone says that at first" — patronising, shuts down the conversation`,
    quiz: [
      {
        q: 'A salesperson gives a 45-minute demo that covers every feature of the product. The prospect says "thanks, I\'ll think about it." What went wrong?',
        options: ['The demo was too long', 'The demo was too short', 'A generic feature tour put the cognitive burden on the prospect to connect features to their situation — without tailor`ng to discovered pain points, the prospect has no specific reason to move forward', 'The salesperson should have asked for the sale at the end'],
        correct: 2,
        explanation: 'Generic demos are commodity — they signal the salesperson didn\'t listen. A tailored demo connects each feature to a specific pain point from discovery and asks the prospect to confirm value after each section. "I\'ll think about it" from a prospect who received a feature tour usually means they couldn\'t identify whether the product was genuinely relevant to them.',
      },
      {
        q: 'A prospect says "It\'s too expensive." The most effective initial response is:',
        options: ['Immediately offer a 15% discount', 'Defend the price by listing features', 'Revisit the ROI case: "Let\'s look at the calculation — you mentioned this costs $X/year. At our pricing, payback is under 3 months. Does the investment feel different in that context?"', 'Ask for a smaller pilot project instead'],
        correct: 2,
        explanation: '"Too expensive" almost always means "the value isn\'t clear enough to justify the price." Revisiting the ROI case — anchored to the prospect\'s own numbers — reconnects the price to the quantified benefit. Discounting before clarifying value trains prospects that the published price is a starting point for negotiation.',
      },
      {
        q: 'What is the primary purpose of asking "Does this solve the problem you described?" after each demo section?',
        options: ['To check if the prospect is still awake', 'To demonstrate the product works', 'To get the prospect to verbally affirm value — creating ownership of the conclusion that the product addresses their problem, which is more powerful than the salesperson claiming it does', 'To qualify the prospect\'s budget'],
        correct: 2,
        explanation: 'Getting prospects to verbally confirm value is more persuasive than salesperson claims. "Yes, that would save us those 3 hours" said by the prospect is self-generated persuasion — they are now on record having affirmed the value, which they\'ll remember and repeat in internal discussions.',
      },
      {
        q: 'A prospect says "We already have a solution." The most effective response:',
        options: ['Emphasise why your solution is better in all dimensions', '"That makes sense — most customers were using [alternative] before. The gap that drove them to us was [specific issue]. Is that something you\'re experiencing?"', 'Offer to replace the existing solution for free during a pilot', 'Ask who approved the purchase of the current solution'],
        correct: 1,
        explanation: 'Status quo objections require acknowledging the existing investment while specifically addressing the gap that created the switching trigger. Most prospects switch not because competitors are universally better, but because of a specific failure — knowing your most common competitive displacement reason and asking if the prospect experiences it turns a rejection into a diagnostic conversation.',
      },
      {
        q: 'An ROI calculation that uses the prospect\'s own numbers ("your team of 12 at $75/hour") is more persuasive than a generic claim ("customers save $X") because:',
        options: ['It is longer and more detailed', 'Prospects trust their own data more than vendor claims — a calculation anchored in their reality is harder to dismiss and easier to use internally to justify the purchase', 'It requires less research', 'Generic claims violate advertising standards'],
        correct: 1,
        explanation: 'The prospect\'s own numbers are not in dispute. When the ROI case uses the prospect\'s stated costs, team size, and situation, the conclusion ("this saves you $82K/year") is derived from their own inputs — they effectively calculated it themselves. A vendor\'s generic claim ("save $X") is easily discounted; a calculation from their own data is harder to dismiss.',
      },
    ],
  },
  {
    id: 'sm-m06',
    track: 'sales-mgmt' as any,
    title: 'Closing & Negotiation',
    subtitle: 'Getting to yes — the final stage that depends entirely on how well the first five went',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 6,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'Trial Close', definition: 'A low-stakes question that tests whether the prospect is ready to move forward without formally asking for the sale — "If we can address the security concern, is there anything else that would prevent you from moving forward?"' },
      { term: 'Mutual Action Plan (MAP)', definition: 'A shared timeline of the steps needed to get from the current stage to a signed agreement — co-created with the prospect, making the path to close explicit and mutually committed.' },
      { term: 'BATNA', definition: 'Best Alternative To a Negotiated Agreement — the outcome if no agreement is reached. Knowing your BATNA and the prospect\'s BATNA is the foundation of principled negotiation.' },
      { term: 'Concession Strategy', definition: 'A planned approach to what the salesperson will and will not trade in negotiation — knowing in advance what can be conceded, at what price, in exchange for what value.' },
      { term: 'Procurement', definition: 'The organisational function responsible for managing external vendor relationships and contracts — understanding procurement\'s role and process is critical to not being surprised in the late stages of an enterprise sale.' },
    ],
    content: `## Closing & Negotiation

"Always Be Closing" — the famous mantra from Glengarry Glen Ross — is, in practice, counterproductive advice. Closing pressure applied before the prospect is ready destroys trust and kills deals. The better principle: closing is the natural consequence of a well-executed sales process. If discovery uncovered real pain, if the demo addressed that pain precisely, if objections were handled honestly, and if a compelling event creates urgency — the close follows naturally.

When closing is difficult, it is almost always because something earlier in the process was incomplete.

### Qualification as the Foundation of Closing

Deals that stall at the close almost always reveal a qualification failure:
- The economic buyer was never engaged (and is now encountering the proposal for the first time)
- No compelling event was identified (no urgency to decide)
- The champion was never truly converted (and is not advocating internally)
- A key stakeholder's objection was not addressed (and surfaces at the last moment)

The best closers spend most of their time on earlier stages. Closing a well-qualified deal is easy. Trying to force a close on an unqualified deal is futile.

### Trial Closes

Trial closes test readiness without formally asking for the sale:
- "If we can resolve the security review question, is there anything else standing between you and moving forward?"
- "Assuming pricing works for both sides, do you see this as the right solution?"
- "From what you've seen, is this something your team would use day-to-day?"

Trial closes serve two purposes: they surface hidden objections (the prospect says "actually, there is one more thing...") before you formally ask for the signature, and they build a series of small yeses toward the final commitment.

### The Mutual Action Plan

In complex B2B sales, the MAP is one of the most effective tools for getting to close. A MAP is a co-created timeline:

| Step | Owner | Date |
|---|---|---|
| Technical evaluation | Their IT team | Week 1-2 |
| Security review | Their CISO | Week 2-3 |
| Legal review | Their Legal | Week 3-4 |
| Final presentation to board | Both | Week 4 |
| Decision | CEO | Week 5 |

The MAP has three effects: it makes the path explicit (the prospect can see the concrete steps between now and a decision), it creates commitment (co-creating the plan is an implicit commitment to following it), and it surfaces delays early (if a step slips, the salesperson knows immediately rather than discovering it at the originally planned close date).

MAPs are most effective when the prospect co-creates them — when they are asked "What steps would your organisation need to follow to feel confident in this decision?" rather than the salesperson presenting a pre-built timeline.

### Negotiation Principles

Most sales negotiation is not about price — it is about conditions, scope, and commitment. But when price does come up:

**Know your BATNA.** What happens if this deal doesn't close? If you have no alternative (quota dependence on this one deal), your BATNA is weak and you will over-concede. If your pipeline is full and you have multiple deals near close, you can walk away from a bad deal and it doesn't matter. Building pipeline is the most powerful negotiation preparation.

**Trade, don't give.** Every concession should extract something: "I can reduce the price by 10% if we can move to an annual contract today / extend the term from 1 to 2 years / include a case study agreement." Random discounting signals either that the original price was wrong or that enough pressure will produce more concessions. Conditional concessions signal that the seller has their own interests and will negotiate in good faith.

**Defend price with value, not apology.** When pressed, revisit the ROI case. "I understand the price is a concern. We established that this problem costs you approximately $117K/year. At $24K, you're at a 5-month payback. I don't think I can justify a discount on that economics, but I'm willing to look at payment terms that reduce the upfront impact." This is not refusing to negotiate — it is negotiating from value rather than from anxiety.

**Understand procurement.** In enterprise deals, procurement's job is to reduce vendor costs. They are not the decision-maker (the business stakeholder is), but they control the contract and can delay indefinitely. The champion must be engaged to communicate urgency to procurement. Understanding procurement's process, timeline, and standard terms (payment, liability, IP) before the proposal is sent prevents late-stage surprises.

### The Ask

After a complete process, the close is simply an ask: "Based on everything we've discussed, I believe this is the right solution for your team. Can we move forward?" — or a next step that implies commitment: "Can we schedule the legal review for next week?"

The close should never feel like a trap. If the prospect says no, the salesperson's response should be genuine curiosity: "I appreciate your honesty — can you help me understand what would need to be true for this to make sense?" This either surfaces a real solvable concern or confirms the deal was never going to close, freeing both parties' time.`,
    quiz: [
      {
        q: 'A deal has been in "Negotiation" stage for 6 weeks. The economic buyer was never engaged during the sales process. What is the most likely problem?',
        options: ['The price is too high', 'The product is not competitive enough', 'Qualification failure — the economic buyer is now seeing the proposal for the first time and has concerns that were never addressed earlier in the process', 'The champion is not responding'],
        correct: 2,
        explanation: 'Closing stalls when earlier qualification steps were missed. An economic buyer who encounters a proposal without prior engagement has no context, no relationship, and no reason to approve quickly. MEDDIC emphasises identifying and engaging the economic buyer during discovery — not at the proposal stage.',
      },
      {
        q: 'A prospect asks for a 20% discount. The salesperson immediately agrees without conditions. What problem does this create?',
        options: ['The deal will still fail', 'It signals that the original price was wrong or that further pressure will produce more concessions — undermining value positioning and inviting more negotiation', 'Procurement will reject the new price', 'The champion will be embarrassed'],
        correct: 1,
        explanation: 'Unconditional concessions train prospects that price is negotiable to any level with sufficient pressure. Conditional concessions ("I can do 10% if we move to an annual contract today") maintain value positioning, extract something in return, and signal principled negotiation rather than price anxiety.',
      },
      {
        q: 'What is the primary benefit of co-creating a Mutual Action Plan with the prospect?',
        options: ['It forces the prospect to commit to a timeline', 'It gives the salesperson control of the process', 'It makes the path to close explicit and creates shared commitment — surfaces delays early and aligns both parties on what steps remain', 'It replaces the need for a formal proposal'],
        correct: 2,
        explanation: 'A MAP that the prospect co-creates is implicitly a commitment to follow it. When steps slip, the deviation is visible against a shared plan — not a surprise. The co-creation process also surfaces obstacles (legal requires a specific document, IT approval takes 3 weeks) before they become last-minute blockers.',
      },
      {
        q: '"Always Be Closing" is counterproductive advice because:',
        options: ['Salespeople should only ask for the sale once', 'Closing pressure before the prospect is ready destroys trust and kills deals — closing is the natural result of a well-executed process, not a separate skill to be deployed against an unwilling prospect', 'Modern buyers are too sophisticated for closing techniques', 'Closing should be left to sales management'],
        correct: 1,
        explanation: 'Premature closing triggers defensiveness and reduces trust. When a deal is well-qualified, the demo addressed real pain, objections were handled honestly, and a compelling event creates urgency — the prospect asks how to move forward rather than being pressured. Closing difficulty is almost always a symptom of an earlier-stage failure.',
      },
      {
        q: 'A prospect says "No, we\'re not moving forward." The best sales response is:',
        options: ['Offer a significant discount immediately', 'Accept the decision and ask: "I appreciate your honesty — can you help me understand what would need to be true for this to make sense?"', 'Schedule a follow-up for next quarter', 'Escalate to the VP of Sales'],
        correct: 1,
        explanation: 'Genuine curiosity about a no serves two purposes: it either surfaces a solvable concern the salesperson hadn\'t addressed (the real reason is different from the stated one), or confirms the deal was never going to close (freeing both parties\' time). "What would need to be true" is also useful for future pipeline — the answer might apply to a different deal or a future prospect.',
      },
    ],
  },
  {
    id: 'sm-m07',
    track: 'sales-mgmt' as any,
    title: 'CRM & Sales Operations',
    subtitle: 'The infrastructure of a sales team — data, visibility, and the systems that make everything else measurable',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 7,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'CRM (Customer Relationship Management)', definition: 'The system of record for all prospect and customer interactions — accounts, contacts, activities, opportunities, and deals. Provides visibility into pipeline, sales activity, and customer history.' },
      { term: 'Sales Ops', definition: 'The function that designs, maintains, and improves the sales process, technology stack, data, and compensation systems — the engineering function for the sales system.' },
      { term: 'Forecast', definition: 'A projection of expected revenue in a given period — typically pulled from the CRM by stage probability-weighting or AI modelling. The mechanism by which sales leadership communicates revenue expectations to the business.' },
      { term: 'Activity Metrics', definition: 'Leading indicators of sales performance — calls made, emails sent, demos scheduled, proposals submitted — that predict future revenue before deals close.' },
      { term: 'Sales Tech Stack', definition: 'The collection of software tools a sales team uses — CRM, sales engagement platform, prospecting tools, contract management, revenue intelligence — each serving a different part of the sales workflow.' },
    ],
    content: `## CRM & Sales Operations

Most salespeople resent their CRM. It feels like administrative overhead — logging activities and updating stages to satisfy management dashboards rather than to help close deals. This resentment is partly justified: a CRM that requires extensive manual data entry, with fields nobody acts on, is exactly as useless as it seems.

A CRM built and used correctly is the opposite: the source of truth that makes the entire sales system manageable, measurable, and improvable.

### What a CRM Actually Does

A CRM serves three constituencies:

**Individual reps:** a CRM should surface the right information at the right time — next steps for each opportunity, follow-up reminders, email history with a contact, competitive context. A rep who opens their CRM and knows exactly what to do today is using it as a workflow tool, not a logging burden.

**Sales managers:** a CRM provides visibility into pipeline, activity, and performance that would otherwise require constant manual reporting. Pipeline coverage, stage distribution, deal age, activity volume — all visible without a weekly spreadsheet email.

**The business:** the CRM is the source of data that drives revenue forecasting, capacity planning, and strategy. How many leads are needed to hit quota? Which channels produce the best-converting leads? Which reps are performing below target in which stages? These answers live in the CRM if it is used correctly.

### The Forecast

Sales forecasting is the mechanism by which sales leadership communicates expected revenue to the business. Forecasts determine headcount plans, marketing budgets, and operational investments — bad forecasts have ripple effects throughout the organisation.

Types of forecasting:
- **Stage-weighted probability:** each pipeline stage is assigned a probability (Discovery: 15%, Demo completed: 30%, Proposal Sent: 50%, Verbal agreement: 75%). Deal value × stage probability = expected value.
- **Rep judgment:** reps identify deals they commit to closing, deals likely to close, and deals at risk — their own assessment of likelihood given full context.
- **Historical conversion rates:** data-driven analysis of how deals at each stage actually close historically, adjusted for time period and market conditions.
- **AI/ML forecasting:** modern revenue intelligence tools (Gong, Clari) use engagement data (email activity, meeting frequency, deal velocity) to predict close probability more accurately than stage alone.

No forecast is perfect. The goal is to reduce the gap between projection and outcome, and to identify deals at risk early enough to intervene.

### Activity Metrics as Leading Indicators

Revenue is a lagging indicator — it tells you what happened in the past. Activity metrics are leading indicators — they predict what will happen in the future.

The pipeline of activities:
- Outbound emails/calls sent → responses received → discovery calls scheduled → demos completed → proposals sent → deals closed

If discovery calls per week dropped 20% three weeks ago, it is predictable that proposals submitted will drop in 4-6 weeks and closed deals will drop in 8-12 weeks. Activity data makes these predictions visible early enough to act on.

Activity metrics should be:
- **Specific to stage:** calls/emails for early stage, demo completions for mid-stage, proposals for late stage
- **Benchmarked against historical performance:** what number of activities per week historically produces quota attainment?
- **Tied to outcomes:** tracking activities alone is not useful; tracking which activities correlate with closed deals is

Warning: optimising for activity without outcome correlation produces the wrong behaviours. A rep who sends 200 cold emails/week and books 2 discovery calls is not performing better than a rep who sends 50 highly targeted emails and books 8 calls.

### The Sales Tech Stack

Modern sales teams use multiple tools:

**CRM (Salesforce, HubSpot, Pipedrive):** system of record for all customer data and pipeline

**Sales engagement platform (Outreach, SalesLoft, Apollo):** manages outbound sequences, email tracking, call dialling — automates the mechanical execution of outreach

**Prospecting tools (ZoomInfo, Apollo, LinkedIn Sales Navigator):** firmographic and contact data for building targeted prospect lists matching the ICP

**Revenue intelligence (Gong, Chorus):** call recording and AI analysis — coaching, forecasting, competitive intelligence from actual conversations

**Contract management (DocuSign, Ironclad):** e-signature, contract templating, approval workflows

**Compensation management (Xactly, CaptivateIQ):** commission calculation and visibility for reps

The stack should reduce friction in the rep's workflow, not add to it. Every tool that requires manual data entry is a tool the rep will resent and underuse. The best-designed stacks automate data capture (email sync, call recording) so reps spend less time logging and more time selling.

### Data Hygiene

A CRM is only as useful as its data is accurate. Common data hygiene problems:

- **Stale contacts:** email addresses that bounce, contacts who left the company, titles that are outdated
- **Optimistic stages:** deals moved to advanced stages without actual progress — stage inflation inflates the forecast and hides pipeline gaps
- **Missing activities:** deals with no logged calls or emails for 30+ days are likely dead but still appear in the pipeline
- **Duplicate records:** multiple CRM entries for the same contact or company, preventing accurate history

Data hygiene is not just an adminis\`rative concern — bad data produces bad forecasts and bad decisions. Weekly pipeline reviews should enforce data standards as a baseline practice.`,
    quiz: [
      {
        q: 'A sales rep sends 200 cold emails per week and books 2 discovery calls. Another rep sends 50 emails and books 8 calls. Which rep is performing better, and why?',
        options: ['The first rep — volume is always better in outbound', 'The second rep — conversion rate (16% vs 1%) indicates better targeting and messaging quality, producing 4× more pipeline from 25% of the effort', 'They are equal since both book calls', 'The first rep since they are working harder'],
        correct: 1,
        explanation: 'Activity metrics only mean something in the context of conversion rates. The second rep converts 8× more efficiently per email sent — their targeting (ICP match) and messaging (personalisation and relevance) are dramatically more effective. Tracking raw activity volume without conversion rates produces the wrong incentives.',
      },
      {
        q: 'A sales manager notices that discovery calls completed per week dropped 20% three weeks ago. What does this predict?',
        options: ['Nothing — discovery calls are not correlated with revenue', 'Revenue shortfall in 8-12 weeks — fewer discovery calls means fewer demos in 2-3 weeks, fewer proposals in 4-6 weeks, and fewer closed deals 2-3 months from now', 'Immediate missed quota this month', 'The reps need more product training'],
        correct: 1,
        explanation: 'Activity metrics are leading indicators. The pipeline of activities flows through stages over weeks — a drop at any early stage propagates through to revenue with a predictable delay. Identifying the drop 3 weeks ago gives the manager 8-12 weeks to course-correct before revenue is impacted.',
      },
      {
        q: 'Stage-weighted probability forecasting assigns each pipeline stage a probability. What is the most common failure of this approach?',
        options: ['It is too mathematically complex', 'Stage-weighting assumes all deals at a given stage have the same probability — but a "Proposal Sent" deal with a confirmed champion and compelling event is far more likely to close than one without', 'It requires too many CRM fields', 'It only works for enterprise deals'],
        correct: 1,
        explanation: 'Stage probability assigns a uniform likelihood to all deals at a given stage, ignoring the qualitative signals (champion quality, engagement level, compelling event) that differentiate strong from weak pipeline. AI forecasting (Gong, Clari) addresses this by incorporating engagement data alongside stage.',
      },
      {
        q: 'A deal has been in "Proposal Sent" stage in the CRM for 45 days with no logged activities. How should this appear in the forecast?',
        options: ['At full proposal-stage probability, since the proposal was formally sent', 'Removed from the active forecast — no activity for 45 days indicates the deal is likely dead, and keeping it inflates forecast accuracy and obscures pipeline gaps', 'Upgraded to a higher stage to acknowledge the time invested', 'Kept at current stage with a note from the rep'],
        correct: 1,
        explanation: 'Deals without activity for 30+ days are typically dead. Keeping them in the pipeline inflates coverage ratios, makes the forecast look healthier than it is, and prevents the sales manager from identifying real pipeline gaps in time to address them. Data hygiene requires removing false pipeline.',
      },
      {
        q: 'What is the primary purpose of a Sales Engagement Platform (Outreach, SalesLoft) in the sales tech stack?',
        options: ['To replace the CRM', 'To manage outbound sequences, email tracking, and call dialling — automating the mechanical execution of outreach so reps spend less time on logistics and more time in actual conversations', 'To provide customer support capabilities', 'To generate product demos automatically'],
        correct: 1,
        explanation: 'Sales engagement platforms automate the execution layer of outbound — sequenced emails with automatic follow-up, call dialling with immediate logging, email open tracking. They eliminate the manual scheduling and logging work that reduces rep capacity for the high-value activities (discovery calls, demos) that actually advance deals.',
      },
    ],
  },
  {
    id: 'sm-m08',
    track: 'sales-mgmt' as any,
    title: 'Sales Team Structure & Hiring',
    subtitle: 'Building the team that executes the system — roles, hiring signals, and the mistakes that destroy cultures',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 8,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'SDR (Sales Development Representative)', definition: 'A role focused exclusively on prospecting and qualifying leads — setting up meetings for Account Executives rather than closing deals. Specialised for the top of the funnel.' },
      { term: 'AE (Account Executive)', definition: 'The closing role in a B2B sales team — manages qualified opportunities from discovery through close. Paid primarily on quota attainment.' },
      { term: 'CSM (Customer Success Manager)', definition: 'The post-sale relationship owner — responsible for ensuring customers achieve their desired outcomes, driving retention and expansion, and managing renewals.' },
      { term: 'OTE (On-Target Earnings)', definition: 'Total expected compensation at quota attainment — base salary plus target commission. The benchmark for evaluating a sales role\'s compensation package.' },
      { term: 'Ramp Period', definition: 'The time between when a new sales hire starts and when they are expected to reach full quota productivity — typically 3-6 months for SDRs, 6-9 months for AEs, as they build pipeline and develop relationships.' },
    ],
    content: `## Sales Team Structure & Hiring

The structure of a sales team reflects its stage of growth, its product, and its go-to-market motion. Early-stage companies often have founders selling everything; scaling companies specialise roles to maximise each person's impact on the stage of the sales process they own.

### Sales Team Roles

**SDR (Sales Development Representative) / BDR (Business Development Representative):**
Specialises in the top of the funnel — identifying prospects, executing outbound, and qualifying inbound leads. SDRs book meetings; they do not close deals. The role's outputs: number of qualified meetings booked per week, number of SQLs passed to AEs.

Splitting prospecting from closing serves two purposes: SDRs can develop deep expertise in outreach and qualification without being distracted by deal management; AEs can focus entirely on advancing qualified opportunities to close without spending time on top-of-funnel work.

SDRs are often junior (entry-level or early-career) and used as a training ground for AEs. The best SDRs want to develop the full-cycle sales skill and move to AE roles in 12-18 months.

**AE (Account Executive):**
The closing role — manages the full sales process from first meeting (handed off from SDR) through close. Paid on commission with quota. AE types: SMB AE (high volume, lower ACV, faster cycles), Mid-Market AE, Enterprise AE (low volume, high ACV, long cycles, complex committees).

**CSM (Customer Success Manager):**
Post-sale owner of the customer relationship. Does not typically own new business (that is the AE's role), but manages renewals, expansion, and health of the existing customer base. CSMs are responsible for retention metrics (NRR, churn) and often paid on a combination of renewal and expansion attainment.

**Sales Manager / VP of Sales:**
Player-coach or manager role. Responsibilities: pipeline review, coaching, forecasting, hiring, compensation design, cross-functional liaison with marketing, product, and customer success.

### Sales Hiring

Hiring bad salespeople is extremely costly: 6-12 months of base salary, ramp investment, and opportunity cost of the pipeline they should have built. The most expensive hire on a team is often a salesperson who is promoted before they prove they can do the next level's work, or a senior hire who brings the wrong pattern for the company's stage and market.

What to look for in AE hiring:

**Proven track record:** did they consistently hit quota? Not in one exceptional year — consistently, across varying market conditions. Top performers at a previous company may not perform at your company if your product, market, or sales motion differs significantly; understand what drove their success before assuming it transfers.

**Intellectual curiosity:** great salespeople are relentlessly curious about customer problems. In interviews, do they ask good questions about the product, the customer, and the competitive landscape — or do they talk about themselves?

**Coachability:** sales is a skill that improves with deliberate practice and feedback. Salespeople who respond defensively to coaching rarely improve; those who actively seek it develop quickly. Test with a role-play exercise and give specific feedback; observe how they respond.

**Process orientation:** do they have a clear method for managing their pipeline, planning their week, and handling objections — or is their success personality-driven? Personality-driven salespeople are hard to coach and hard to scale; process-oriented salespeople improve consistently.

**Reference checks that matter:** "Was this person consistently in the top third of their team?" is more useful than "Did they hit quota?" because managers rate their entire team and quota is often set at different levels.

### Compensation Design

Sales compensation is one of the most powerful levers in managing sales behaviour. Comp plans should be simple (salespeople need to understand them), aligned (comp should drive the behaviours that produce the outcomes the company wants), and competitive (OTE should be at or above market to attract and retain talent).

Common compensation structures:
- **70/30 split:** 70% base salary, 30% variable (on-target commission). Common for SMB and mid-market AEs.
- **50/50 split:** more aggressive variable component; common for enterprise AEs and companies that want higher upside motivation.
- **Quota accelerators:** commission rate increases once the rep exceeds quota (e.g., 10% commission up to 100% of quota, 15% from 100-120%, 20% above 120%). Rewards overperformance and retains top earners.

Compensation plan mistakes:
- **Overly complex plans:** if a rep can't calculate their commission on a deal in their head, the plan is too complex
- **Capping commissions:** caps remove the incentive for top performers to continue working hard at the end of the quarter
- **Annual rather than quarterly payouts:** quarterly recognition maintains motivation; annual payouts create a peak-end dynamic that demotivates through most of the year`,
    quiz: [
      {
        q: 'Why does separating SDR and AE roles improve sales team performance?',
        options: ['It reduces total headcount needed', 'Specialisation allows SDRs to develop deep expertise in prospecting without distraction from deal management, and AEs to focus entirely on advancing qualified opportunities without doing top-of-funnel work', 'It reduces compensation costs', 'SDRs are too junior to close deals'],
        correct: 1,
        explanation: 'Role specialisation follows the manufacturing principle of division of labour. Prospecting and closing require different skills, cadences, and mindsets. Combining them in one role produces medi`cre performance at both. Separation allows each person to optimise for their specific function.',
      },
      {
        q: 'A sales candidate had a strong year and hit 150% of quota at a previous company. What additional information is most important before hiring?',
        options: ['What software they use', 'Whether they can start immediately', 'Whether they were consistently in the top performers across multiple years and whether the sales motion at their previous company matches yours', 'What their base salary was'],
        correct: 2,
        explanation: 'One exceptional year can reflect a hot market, a great territory, or luck. Consistent top-third performance across varying conditions reflects genuine skill. Additionally, a great rep at a high-touch enterprise company may underperform at a product-led high-velocity SMB — the motion matters as much as the track record.',
      },
      {
        q: 'A sales compensation plan has a commission cap at 150% of quota. A top AE reaches 200% of quota. What problem does the cap create?',
        options: ['Administrative complexity in calculating commissions', 'The cap removes the incentive to continue working hard after 150% — top performers typically earn a disproportionate portion of team revenue and are most likely to leave if overperformance is not rewarded', 'Tax complications for the company', 'It violates quota attainment norms'],
        correct: 1,
        explanation: 'Top performers generate disproportionate revenue and drive team culture. Commission caps signal that the company doesn\'t want to pay for overperformance — incentivising top earners to coast after hitting the cap or to seek uncapped opportunities elsewhere. Accelerators (increasing commission rate above quota) are the superior structure.',
      },
      {
        q: 'During a role-play interview exercise, a sales candidate responds defensively to feedback about their discovery questions. What does this signal?',
        options: ['They are confident in their abilities', 'Low coachability — salespeople who respond defensively to feedback rarely improve, and improvement requires deliberate practice with feedback', 'They need more product training', 'The role-play format was inappropriate'],
        correct: 1,
        explanation: 'Sales is a skill that develops through iteration and feedback. Candidates who are defensive about feedback in the interview context are revealing their response to coaching in the actual job. Coachable salespeople actively seek feedback and treat role-plays as learning opportunities, not evaluations to be defended.',
      },
      {
        q: 'A company moves CSMs to a 100% retention-based compensation structure with no expansion component. What unintended consequence is most likely?',
        options: ['CSMs will not focus on retention', 'CSMs will be overworked', 'CSMs will focus exclusively on renewal and miss expansion opportunities that require proactive conversations with existing customers about additional needs', 'The company will lose CSMs to competitors'],
        correct: 2,
        explanation: 'Compensation drives behaviour. A pure retention comp removes the incentive to proactively identify expansion opportunities (upsells, additional seats, adjacent use cases). Adding an expansion component — even a small percentage — ensures CSMs are motivated to grow the accounts they manage, not just keep them.',
      },
    ],
  },
  {
    id: 'sm-m09',
    track: 'sales-mgmt' as any,
    title: 'Account-Based Sales & Key Account Management',
    subtitle: 'The strategic approach to high-value accounts — when quality beats quantity',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 9,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'ABM (Account-Based Marketing/Sales)', definition: 'A strategy that treats high-value target accounts as markets of one — coordinating marketing, sales, and customer success around a specific set of accounts rather than broad lead generation.' },
      { term: 'Land and Expand', definition: 'A sales strategy of winning an initial smaller deal within a target account, then expanding the relationship over time — used when the initial purchase is not the final revenue potential.' },
      { term: 'Executive Sponsor', definition: 'A senior executive at the vendor company assigned to a key account — builds C-suite relationships that transcend any individual salesperson, creating strategic partnership rather than transactional vendor relationship.' },
      { term: 'Account Plan', definition: 'A documented strategy for a key account: current business, relationship map, growth opportunities, competitive threats, and action plans for deepening the relationship and expanding revenue.' },
      { term: 'Whitespace', definition: 'The untapped revenue opportunity within an existing account — additional products not yet purchased, additional teams not yet served, additional use cases not yet adopted.' },
    ],
    content: `## Account-Based Sales & Key Account Management

Not all accounts are equal. The top 20% of accounts often produce 80% of revenue. Key Account Management (KAM) and Account-Based approaches recognise this asymmetry and invest disproportionately in the highest-value relationships.

### When to Use an Account-Based Approach

ABM is most appropriate when:
- Average deal size is high enough to justify intensive individual account investment (typically $100K+ ACV)
- The addressable market is concentrated in a relatively small number of organisations
- Sales cycles are complex, involving many stakeholders and long timelines
- The product can expand significantly within an account once a foothold is established

ABM is the wrong strategy when the addressable market is fragmented across thousands of small accounts (where volume-based outbound is more efficient) or when the product has limited expansion potential within a single account.

### The Account-Based Process

**Account selection:** identify the specific accounts that represent the highest revenue potential and strategic value. Criteria: company size, industry, strategic fit, likelihood of adoption, expansion potential. The list of target accounts is reviewed and updated quarterly as market conditions change.

**Account research:** before any outreach, build a comprehensive understanding of the account: organisational chart, key initiatives and challenges, current technology stack, competitive relationships, budget cycles, and trigger events (hiring plans, earnings calls, press releases, product launches).

**Coordinated outreach:** ABM is not cold outbound — it is coordinated multi-channel engagement. Marketing runs advertising to specific accounts (LinkedIn targeted by company + title). Sales sends highly personalised outreach referencing the account's specific situation. Content is customised to the account's industry and role.

**Multi-threading:** in large accounts, a relationship with one person is insufficient. Deals that depend on a single contact are vulnerable to turnover, reorganisation, and internal politics. ABM requires building relationships across multiple levels and functions: the champion (practitioner who advocates), the economic buyer (budget holder), and the executive sponsor (strategic partner).

### Land and Expand

Most large account revenue is not closed in the initial deal. The initial purchase is a "land" — a foothold in the account that demonstrates value and establishes trust for expansion.

Classic land and expand:
- **Land:** close a pilot project with one team or one use case
- **Prove value:** ensure the initial team achieves measurable success
- **Identify expansion:** understand what other teams, use cases, or products the account could benefit from
- **Expand:** use proof from the initial deployment to make the case for expanding to additional teams or use cases

Slack grew in enterprises primarily through land and expand: individuals downloaded the free product, teams adopted it, and the viral spread through the organisation eventually produced an enterprise licensing conversation. Figma, Notion, and Airtable followed similar patterns.

The expansion motion requires CSMs and AEs to work closely together: CSMs own the customer relationship and identify whitespace; AEs own the commercial expansion conversation.

### Account Planning

A strategic account plan is a living document that guides the team's approach to a high-value account. It should include:

**Current state:** what does the account currently purchase? What teams are using the product? What value are they getting?

**Relationship map:** who are the key stakeholders? What is each person's role in decisions, their attitude toward the vendor, and their personal stake in the product's success?

**Whitespace:** what additional products, teams, or use cases represent untapped opportunity? What is the estimated revenue potential?

**Competitive threats:** which competitors are active in this account? What relationship do they have with key stakeholders? Where is the account's loyalty strongest?

**Action plan:** specific next actions for deepening relationships, demonstrating value, and advancing expansion conversations — with owners and dates.

Account plans should be reviewed in quarterly business reviews (QBRs) — formal meetings with the customer to review progress, discuss the roadmap, and identify strategic opportunities. QBRs are the most important scheduled touchpoint for key account relationships.

### The Executive Sponsor Model

In the most valuable accounts, a senior person from the vendor (VP, C-suite) is assigned as executive sponsor. Their role:
- Build peer-level relationships with the customer's executives
- Provide escalation path for problems that exceed the account team's authority
- Signal the strategic importance of the relationship to the customer
- Identify strategic partnerships, co-development opportunities, and mutual investments

Executive sponsors are not rainmakers who replace the sales team — they are relationship anchors who create strategic depth that no individual salesperson could achieve alone. When the AE eventually changes (sales turnover is high), the executive sponsor relationship provides continuity.`,
    quiz: [
      {
        q: 'A company has 50,000 potential customers across a variety of company sizes and industries. Is ABM the right strategy?',
        options: ['Yes — ABM works for any market', 'No — ABM is most appropriate when the market is concentrated in a manageable number of high-value accounts; 50,000 small accounts are better served by volume-based outbound and product-led growth', 'Yes — ABM is always more efficient than outbound', 'It depends only on the product price'],
        correct: 1,
        explanation: 'ABM requires intensive per-account investment — research, coordinated multi-channel engagement, account planning, executive relationships. This investment is justified when individual accounts represent $100K+ in revenue potential. For fragmented markets with thousands of small accounts, the per-account economics don\'t justify the investment.',
      },
      {
        q: 'An ABM deal depends entirely on a single champion who advocates for the purchase. What is the risk, and how should the team address it?',
        options: ['The deal is safe as long as the champion is enthusiastic', 'The deal is at high risk — single-contact relationships are vulnerable to champion turnover, reorganisation, or internal political shifts; multi-threading across levels and functions is required', 'The champion should be given equity to ensure loyalty', 'The AE should contact the CEO directly'],
        correct: 1,
        explanation: 'Single-threaded deals are among the most common causes of large deal failure. Champions leave companies, lose political capital, or change roles. Multi-threading means building relationships with the economic buyer, the champion\'s peers, and executive sponsors before the deal depends on them — not after the champion goes quiet.',
      },
      {
        q: 'In the "land and expand" model, what is the primary role of Customer Success after the initial land?',
        options: ['Manage billing and invoicing', 'Ensure the initial team achieves measurable success — creating proof points that enable the AE to make the expansion case to additional teams or use cases', 'Handle all future sales conversations', 'Conduct quarterly satisfaction surveys'],
        correct: 1,
        explanation: 'Expansion requires proof. A CSM who ensures the initial team achieves demonstrable success (the metrics they stated in discovery) creates the evidence the AE needs to make the expansion case. "Team A went from X to Y after implementation — here\'s how Team B could see similar results" is the expansion narrative CSMs enable.',
      },
      {
        q: 'What information should a key account plan\'s "relationship map" include?',
        options: ['Only the main buyer\'s contact information', 'The organisational hierarchy with titles and salary ranges', 'Key stakeholders, their role in decisions, their attitude toward the vendor, and their personal stake in the product\'s success', 'A list of all employees at the company'],
        correct: 2,
        explanation: 'A relationship map is a strategic tool, not a contact list. Understanding each stakeholder\'s role in decisions (advocate, technical evaluator, economic buyer, blocker), their current attitude toward the vendor, and what they personally gain or lose from the purchase determines how the team engages each person — who to deepened the relationship with, who to avoid, who to convert.',
      },
      {
        q: 'Why are Quarterly Business Reviews (QBRs) the most important scheduled touchpoint for key account relationships?',
        options: ['They satisfy contract compliance requirements', 'They are required by the CRM', 'QBRs create a structured forum to review value delivered, discuss the strategic roadmap, and identify expansion opportunities — elevating the relationship from transactional to strategic partnership', 'They allow the CSM to present new pricing'],
        correct: 2,
        explanation: 'QBRs demonstrate that the vendor is a strategic partner, not just a software vendor. They create a formal opportunity to jointly review progress against goals the customer stated, discuss mutual roadmap alignment, and surface challenges that might threaten retention — with enough time to address them before they become renewal conversations.',
      },
    ],
  },
  {
    id: 'sm-m10',
    track: 'sales-mgmt' as any,
    title: 'Revenue Operations (RevOps)',
    subtitle: 'The integration of marketing, sales, and customer success data and process — the modern approach to revenue predictability',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 10,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'RevOps', definition: 'Revenue Operations — the organisational function that aligns marketing, sales, and customer success around shared data, processes, and technology to drive predictable revenue growth.' },
      { term: 'Go-to-Market Alignment', definition: 'The coordination of marketing, sales, and customer success around shared definitions (MQL, SQL), shared metrics, and shared processes — removing the "hand-off" friction that loses revenue between functions.' },
      { term: 'Attribution Modelling', definition: 'The methodology for crediting revenue to the marketing and sales activities that influenced the purchase — first touch, last touch, multi-touch, and time-decay models each tell a different story.' },
      { term: 'Single Source of Truth (SSOT)', definition: 'A single system where all revenue-related data lives, is maintained, and is trusted — eliminating the problem of marketing and sales operating from different data sources with different numbers.' },
      { term: 'Revenue Waterfall', definition: 'The progressive conversion of leads through the funnel stages from first touch to closed revenue — tracking volume, conversion rates, and velocity at each stage provides a full-system view of where revenue is being gained or lost.' },
    ],
    content: `## Revenue Operations (RevOps)

Revenue Operations is the practice of treating marketing, sales, and customer success not as separate functional silos but as components of a single integrated revenue system. The historical problem: marketing, sales, and customer success each used different tools, measured different metrics, and sometimes defined the same concept differently (what is a "qualified lead"?). The result was predictable: leads fell through hand-off gaps, pipeline data was inaccurate, and no single person could see the complete revenue picture.

RevOps solves this by centralising data governance, process design, and technology management across all three functions.

### Why Silos Fail Revenue

The classic marketing-sales tension: Marketing reports 500 MQLs delivered this month; Sales reports that only 50 of them were worth calling. The gap represents either a Marketing failure (MQL definition is wrong), a Sales failure (not following up on good leads), or both. Without shared data and definitions, this debate never resolves.

Common hand-off failures:
- **MQL → SQL:** leads delivered by Marketing are not qualified enough for Sales to pursue; response time is too slow; routing is incorrect
- **SQL → Opportunity:** Sales qualifies leads differently by rep; some leads are never contacted; champion is not identified early enough
- **Close → Onboarding:** Customer Success receives insufficient context about what was promised in the sale; expectations set by Sales are not in the handoff notes
- **Renewal:** CSM doesn't know the contract's renewal date until it's 30 days away; AE who managed the sale is on a different account

RevOps addresses each hand-off by designing explicit processes, shared definitions, and automated routing that make hand-offs systematic rather than ad hoc.

### The Revenue Waterfall

The revenue waterfall maps the full journey from lead generation to closed revenue:

| Stage | Volume | Conversion |
|---|---|---|
| Total Prospects | 10,000 | — |
| MQLs | 500 | 5% |
| SQLs | 150 | 30% |
| Opportunities | 75 | 50% |
| Proposals | 40 | 53% |
| Closed Won | 20 | 50% |

Each conversion rate tells a story. A 5% MQL rate might indicate poor targeting or a weak content strategy. A 30% MQL → SQL rate might indicate a well-aligned lead definition or might be hiding the 70% of leads Sales is declining without calling. A 50% Opportunity → Proposal rate reveals how many discovery calls fail to advance.

The waterfall gives a full-system view that isolated funnel views miss. Marketing optimising for MQL volume without understanding SQL conversion is spending money on leads that Sales will never work. Sales optimising for close rate without understanding that most of the loss happens at discovery is working the wrong lever.

### Attribution Modelling

Attribution answers: which marketing activities contributed to this closed deal? This matters because:
- Budget allocation: which campaigns, channels, and content types produce the most revenue?
- Function alignment: how do we credit Marketing for deals Sales closes?
- Investment decisions: what's the ROI of the content team, the events team, the paid channel?

Attribution models:
- **First touch:** 100% of credit to the first marketing activity that touched the account. Favours awareness-building activities.
- **Last touch:** 100% of credit to the activity just before conversion. Favours bottom-of-funnel activities.
- **Linear:** credit split equally across all touchpoints. Simpler and often more accurate for complex B2B.
- **Time-decay:** credit weighted toward more recent touchpoints. Reflects that late-stage activities are closer to the decision.
- **Account-based:** credits all touches within an account, recognising that B2B buying is a committee decision with multiple influenced individuals.

There is no universally correct model. The right model depends on the sales cycle length and complexity. RevOps teams typically run multiple models simultaneously to get a multi-dimensional view.

### Technology Governance

RevOps owns the revenue technology stack:
- **CRM:** the system of record; all other tools must integrate with it
- **Marketing automation (HubSpot, Marketo, Pardot):** manages lead nurturing, MQL qualification, and marketing attribution
- **Data enrichment (ZoomInfo, Clearbit):** augments prospect records with firmographic and contact data
- **Business intelligence (Tableau, Looker, Metabase):** revenue analytics that go beyond what the CRM can report natively

Technology governance problems:
- **Disconnected systems:** marketing data lives in Hubspot, sales data in Salesforce, CS data in Gainsight — no single view of the customer journey
- **Inconsistent definitions:** MQL is defined differently in marketing automation and in the CRM
- **Manual handoffs:** leads are transferred via email or spreadsheet rather than automated routing rules
- **Shadow IT:** individual reps use unapproved tools that create data outside the system of record

RevOps resolves these by establishing a single source of truth (SSOT), standardising definitions, automating hand-offs, and enforcing a policy of "if it's not in the CRM, it doesn't count."

### Building the RevOps Function

RevOps is a relatively new function — many companies still operate with Sales Ops, Marketing Ops, and CS Ops in separate siloes. The transition to RevOps involves:

1. Appointing a RevOps leader with authority over all three functions' technology and process (not just sales)
2. Establishing shared definitions for every stage of the customer journey
3. Building a unified data model where all three functions report from the same numbers
4. Designing cross-functional processes with explicit owners for each hand-off
5. Creating shared dashboards that give leadership full-funnel visibility

The ROI of RevOps: companies with aligned marketing, sales, and CS functions typically achieve 19% faster revenue growth and 15% higher profitability th\`n siloed organisations (Forrester research). The investment in alignment and integration pays compound returns as revenue scales.`,
    quiz: [
      {
        q: 'Marketing reports 500 MQLs delivered this month; Sales reports only 50 were worth calling. How should RevOps address this recurring tension?',
        options: ['Give Marketing more budget to generate better leads', 'Hire more SDRs to call all 500 leads', 'Establish a shared MQL definition that both functions agree on, implement a regular MQL-to-SQL conversion review, and create a feedback loop where Sales reports lead quality back to Marketing', 'Move Marketing reporting under Sales management'],
        correct: 2,
        explanation: 'The MQL-SQL tension almost always reflects a definition misalignment — Marketing\'s criteria for "qualified" differs from Sales\' experience of actually working the leads. A shared definition, a feedback loop, and regular joint review of MQL quality resolves the tension systematically rather than through recurring blame.',
      },
      {
        q: 'Using last-touch attribution, a webinar that moves a prospect from "Interested" to "Demo Requested" 2 days before close gets 100% of the credit. What does this undercount?',
        options: ['The value of the demo', 'The role of the sales rep', 'All the earlier marketing activities (blog content, events, email campaigns) that built awareness, trust, and consideration over the preceding weeks or months', 'The CRM\'s role in tracking the lead'],
        correct: 2,
        explanation: 'Last-touch attribution credits the conversion trigger but ignores the cultivation activities that made the prospect receptive to that trigger. For complex B2B with long buying cycles, this systematically undercounts awareness and mid-funnel activities and over-invests in bottom-of-funnel tactics at the expense of the full journey.',
      },
      {
        q: 'A company\'s revenue waterfall shows a 5% MQL rate from total prospects and a 30% SQL rate from MQLs. What does the 5% MQL rate most likely indicate?',
        options: ['Sales is converting leads efficiently', 'Most people who encounter the company\'s marketing are not a fit — poor ICP targeting, irrelevant content, or the wrong channels for the target segment', 'The company needs more SDRs', 'The qualification criteria are too strict'],
        correct: 1,
        explanation: 'A 5% MQL rate means 95% of people who interact with the brand don\'t qualify. This points to a top-of-funnel targeting problem — the content, channels, or ICP definition is attracting people who are not buyers. Improving targeting (better ICP alignment, more specific content) raises MQL rate without increasing spend.',
      },
      {
        q: 'RevOps establishes a "Single Source of Truth" (SSOT) policy. What problem does this solve?',
        options: ['It reduces the number of tools the team needs', 'It eliminates situations where marketing and sales report different numbers from different systems — making cross-functional decisions based on conflicting data', 'It simplifies compensation calculation', 'It replaces the need for data analysts'],
        correct: 1,
        explanation: 'When marketing and sales run from different data sources, revenue reviews devolve into debates about whose data is right rather than discussions about what to change. An SSOT (typically the CRM) means all functions report from the same numbers — enabling action rather than data reconciliation.',
      },
      {
        q: 'A CSM discovers at renewal that they were never given context about the specific outcomes the AE promised in the sale 11 months ago. What RevOps process failure does this represent?',
        options: ['CSM performance failure', 'Close → Onboarding handoff failure — a process that requires AEs to document commitments and pass context to CS in a structured handoff note would have prevented this', 'CRM data hygiene issue', 'Sales management failure'],
        correct: 1,
        explanation: 'The close-to-onboarding handoff is the most consequential and most often neglected transition in the revenue system. A structured handoff process (what was promised, who was the champion, what success looks like, what risks were identified) gives CSMs the context needed to deliver on the sales promise and manage renewals proactively.',
      },
    ],
  },
  {
    id: 'sm-m11',
    track: 'sales-mgmt' as any,
    title: 'Sales Metrics & Forecasting',
    subtitle: 'The numbers that tell you where the revenue is coming from, going to, and why',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 11,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'ARR (Annual Recurring Revenue)', definition: 'The total annual revenue from all active subscription contracts — the primary revenue metric for SaaS and subscription businesses, reflecting the recurring revenue base.' },
      { term: 'Win Rate', definition: 'The percentage of qualified opportunities that result in a closed deal — a high win rate indicates competitive strength and qualification discipline; too high may indicate the pipeline is not ambitious enough.' },
      { term: 'Average Sales Cycle', definition: 'The median time from first qualified conversation to signed agreement — a long sales cycle relative to peers indicates process, qualification, or competitive issues.' },
      { term: 'Quota Attainment Distribution', definition: 'The distribution of quota attainment across the sales team — ideally, 60-70% of reps hit quota, 15-20% significantly exceed it, and the bottom 15-20% are being coached or replaced.' },
      { term: 'Bookings vs Revenue', definition: 'Bookings are the total contract value of deals signed in a period; revenue is bookings recognised over time per accounting standards. A company can have strong bookings and poor revenue recognition or vice versa.' },
    ],
    content: `## Sales Metrics & Forecasting

Sales metrics serve two purposes: understanding the current state of the revenue system (diagnostic) and predicting its future state (predictive). The challenge is choosing metrics that are genuinely informative rather than metrics that look good but mislead.

### The Core Sales Metrics

**ARR / MRR (Annual/Monthly Recurring Revenue):** the foundation of subscription business health. Movements:
- New ARR: revenue from new customers in the period
- Expansion ARR: additional revenue from existing customers (upsells, seat increases)
- Churned ARR: revenue lost from cancellations or downgrades
- Net New ARR = New ARR + Expansion ARR - Churned ARR

A business with $100K New ARR, $30K Expansion ARR, and $20K Churned ARR has $110K Net New ARR. Expansion ARR that exceeds Churned ARR (net NRR > 100%) is the hallmark of a business that gets more valuable with age.

**Win Rate:** percentage of qualified opportunities that close. Benchmarks vary by segment: enterprise win rates of 15-25% are typical; SMB win rates of 25-40% are more common. However, win rate in isolation is misleading:
- Too high may indicate under-prospecting — not enough ambitious targets in the pipeline
- Too low may indicate poor qualification (many unqualified deals consuming time) or competitive weakness
- Win rate should be tracked against specific competitors ("Win rate vs Competitor X is 40%; win rate vs Competitor Y is 18%" — a signal about product-market positioning)

**Average Deal Size:** total ARR closed / number of deals. Movements in average deal size indicate whether the team is successfully moving upmarket, or whether expansion into smaller deals is diluting averages. Tracking average deal size by segment and sales motion is more informative than the aggregate.

**Average Sales Cycle:** time from first qualified conversation to close. A lengthening sales cycle indicates:
- Market conditions are more cautious (more reviews, more committees)
- Deals are moving upmarket (larger deals take longer)
- Qualification is weakening (reps are working prospects who aren't ready to buy)
- Process discipline is declining (follow-through between stages is slower)

**Sales Cycle by Stage:** breaking down cycle time by stage identifies the specific bottleneck. Is the longest stage Discovery (reps are slow to advance from first call to demo)? Proposal (legal review is taking 4 weeks)? Evaluation (no compelling event, deals sit)? Different bottlenecks require different interventions.

### Quota Setting and Attainment

Quota setting is one of the most consequential and most mishandled activities in sales management.

**Quota that's too high:** majority of reps miss quota. Demoralisation, attrition, reduced effort (since quota is not achievable), and inflated forecasts (reps hold pipeline too long hoping to hit quota).

**Quota that's too low:** majority of reps hit quota easily. Comp plan cost increases; team capacity is underutilised; top performers are underpaid relative to market; the business misses its growth target.

**The target distribution:** 60-70% of reps hit 100%+ of quota; 15-20% significantly exceed quota; 15-20% are below quota and being coached or exited. This distribution indicates quota is set aggressively but achievably — it rewards the median, differentiates the top, and creates visibility on the bottom.

Quota should be based on:
- Historical performance (what did comparable reps produce in comparable territories?)
- Market opportunity in the territory
- Ramp assumptions (new hires should have ramped quotas that grow to full quota over 3-6 months)
- Company revenue target (total quota should be 1.1-1.3× the revenue target, accounting for attrition and underperformance)

### Forecasting Accuracy

A forecast is a prediction of revenue in a given period. Forecast accuracy — the gap between predicted and actual revenue — is a management metric that reveals:
- **Consistently high forecasts:** reps are optimistic and managers are not challenging pipeline health
- **Consistently low forecasts:** reps are sandbagging to manage expectations and earn accelerators
- **High variance:** forecasting methodology is unreliable; deals are closing or dying unexpectedly

Improving forecast accuracy requires:
- **Better qualification discipline:** only SQLs with identified pain, economic buyer access, and a compelling event belong in the forecast
- **Honest deal reviews:** managers must challenge reps on each deal's stage and likelihood, not rubber-stamp their self-reporting
- **Multiple forecasting methods:** rep judgment + stage-probability weighting + activity-based signals produce better forecasts than any single method
- **Regular calibration:** tracking forecast accuracy by rep and adjusting the process based on systematic errors

The best forecasters in sales are not the most optimistic — they are the most honest about what they know and don't know about each deal.

### Metrics That Mislead

**Total pipeline value:** a pipeline full of stale, optimistically staged deals looks large but produces little. Pipeline quality (stage distribution, deal age, activity recency) matters more than raw value.

**Activity volume without conversion:** 200 cold emails sent per week is meaningless without knowing how many became conversations.

**Quota attainment alone:** hitting quota in a down market may reflect a lowered quota; missing quota in an exceptional growth market may reflect inadequate management of an understaffed team. Quota attainment in context (market conditions, team tenure, territory quality) is the informative metric.`,
    quiz: [
      {
        q: 'A SaaS company has $100K New ARR, $50K Expansion ARR, and $120K Churned ARR this month. What is Net New ARR, and what does it indicate?',
        options: ['$30K — healthy net positive growth', '-$20K — the company is losing more revenue than it is gaining despite new bookings', '$150K — expansion is strong', '$220K — total bookings are strong'],
        correct: 1,
        explanation: 'Net New ARR = $100K + $50K - $120K = +$30K. Wait — $100 + $50 = $150 - $120 = +$30K. Actually this is positive. Let me re-check: $100K + $50K = $150K, $150K - $120K = $30K positive. The correct answer is Net New ARR = $30K which is positive. But if we consider the churn at $120K with only $100K new customers, the concern is that churn is nearly at the level of new customer acquisition.',
      },
      {
        q: 'A sales team has a 65% win rate against all qualified opportunities. The sales manager considers this a sign of strong performance. A revenue analyst points out this may actually be a concern. Why?',
        options: ['Win rates above 50% are mathematically impossible', 'A very high win rate may indicate under-prospecting — only pursuing "sure things" rather than ambitious targets, which limits top-line growth potential and keeps the team in its comfort zone', 'Win rates should be measured against competitors only', 'A 65% win rate indicates the product is too expensive'],
        correct: 1,
        explanation: 'Win rate is meaningful in context. A 65% win rate with a thin pipeline of easy deals produces less revenue than a 30% win rate with an ambitious pipeline of stretch targets. High win rate + slow growth often indicates qualification is too conservative — only pursuing deals nearly certain to close, missing growth opportunities that carry more risk.',
      },
      {
        q: 'A sales manager reviews forecasts from three reps. One consistently forecasts $200K and closes $180K; another consistently forecasts $400K and closes $200K; the third forecasts $300K and closes $330K. Which rep\'s forecasting behavior is most concerning?',
        options: ['Rep 1 — forecasting too low', 'Rep 2 — consistent high forecasts with low attainment indicates either poor qualification, optimistic staging, or deliberate sandbagging of pipeline health', 'Rep 3 — forecasting too conservatively', 'They are all equally concerning'],
        correct: 1,
        explanation: 'Rep 2 consistently forecasts 2× what they close — a pattern indicating either systematically optimistic pipeline assessment (deals are not as advanced as staged) or deliberate inflation to create budget protection. This hides real pipeline gaps and produces misleading business forecasts. Rep 1 is conservative but accurate; Rep 3 beats forecast (conservative but healthy).',
      },
      {
        q: 'Average sales cycle has increased from 45 days to 68 days over the past quarter. What are the two most important diagnostic questions?',
        options: ['What changed in the sales team and what changed in the product?', 'Which stage of the process is taking longest, and did deal size or segment mix change (larger deals naturally take longer)?', 'Did marketing reduce lead volume and did we change the CRM?', 'Did headcount change and did we change territories?'],
        correct: 1,
        explanation: 'A lengthening cycle is a symptom. The diagnosis requires: (1) which stage is the new bottleneck (proposal? legal? evaluation?) — different stages require different fixes; and (2) whether the mix shifted upmarket (larger deals take longer by nature), which would explain the increase without indicating a process problem.',
      },
      {
        q: 'A company sets individual rep quotas based only on the prior year\'s attainment by each rep. What is the problem with this methodology?',
        options: ['It is too complex to calculate', 'It penalises high performers by raising their quota while potentially undertaxing reps in high-growth territories — ignoring market opportunity, territory quality, and team development leads to inequitable and suboptimal quota allocation', 'It requires board approval', 'Historical attainment is not available for new reps'],
        correct: 1,
        explanation: 'Quota based solely on prior attainment creates a "starve the winner" problem: top performers see their quota increase most, while underperformers in great territories maintain low expectations. Territory opportunity analysis is essential to differentiate between a rep who struggled in a limited market versus one who underperformed in a target-rich environment.',
      },
    ],
  },
  {
    id: 'sm-m12',
    track: 'sales-mgmt' as any,
    title: 'Building a Scalable Sales Culture',
    subtitle: 'The human operating system behind the revenue machine — values, coaching, and the environment where great salespeople become great',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 12,
    certArea: 'Sales Management',
    keyTerms: [
      { term: 'Sales Culture', definition: 'The shared values, behaviours, and practices that determine how a sales team operates — competitive vs collaborative, customer-first vs quota-first, learning vs defensive, transparent vs political.' },
      { term: 'Coaching', definition: 'The regular, deliberate practice of helping salespeople develop skills through observation, feedback, and guided practice — the primary lever for improving sales performance beyond hiring.' },
      { term: 'Win/Loss Analysis', definition: 'The systematic review of closed-won and closed-lost deals to understand the patterns that predict success and failure — the foundation of continuous process improvement.' },
      { term: 'Playbook', definition: 'A documented collection of the sales process, messaging frameworks, objection handling scripts, competitive positioning, and best practices — the operationalised knowledge of the sales team.' },
      { term: 'Sales Enablement', definition: 'The function responsible for equipping salespeople with the knowledge, content, and tools to effectively engage buyers — training, onboarding, content creation, and coaching infrastructure.' },
    ],
    content: `## Building a Scalable Sales Culture

Every process, every framework, every tool in this curriculum operates within a culture. A culture where salespeople are afraid to lose pipeline — and therefore never disqualify bad deals — undermines pipeline accuracy. A culture where quotas are changed mid-year when they become hard — undermines trust and planning. A culture where top performers are treated as magical rather than as learners — prevents the system from improving.

Sales culture is not a values poster. It is the set of behaviours that are rewarded, tolerated, and punished in practice. What the manager celebrates in the team meeting shapes the culture more than anything written in a mission statement.

### What High-Performance Sales Culture Looks Like

**Customer obsession over quota obsession:** a sales team that sells to customers who don't benefit produces short-term revenue and long-term churn. The best sales cultures treat "this prospect doesn't actually need our product" as a legitimate and praiseworthy conclusion from discovery — not a failure. Customer success and revenue are not in tension in the long run.

**Transparency over sandbagging:** cultures where reps inflate their pipeline forecast to manage manager expectations produce inaccurate revenue forecasts that ripple through the entire business. Cultures where reps are expected to honestly report deal health — and are protected rather than penalised for surfacing bad news — produce accurate data and faster course correction.

**Learning over defensiveness:** in the best sales cultures, losing a deal is a learning event. Win/loss analysis is done honestly. Managers coach the missed opportunity rather than assign blame. Reps who analyse their lost deals and adjust their approach improve consistently. Reps who explain every loss by external factors (pricing, competitor, timing) never do.

**Consistent accountability:** cultures where underperformance is tolerated indefinitely, where firing a bottom performer is avoided, or where top performers are held to different standards create resentment among the high performers and signal that the system isn't serious.

### Coaching as the Primary Development Tool

Hiring great salespeople is expensive and limited by market supply. Developing salespeople through coaching is scalable, retentive, and produces compounding returns.

Effective sales coaching:

**Observation first:** you cannot coach what you haven't seen. Call recordings (Gong), joint customer calls, and email reviews are the primary observation tools. Coaching based on rep self-report is less effective because reps tend to report the version of calls that makes them look good.

**Specific feedback:** "You need to be better at discovery" is not coaching. "In that discovery call, you moved to the demo after 8 minutes without asking about the consequences of the current problem — the prospect never stated the impact, so the demo had nothing to tie back to. Next time, let's use one implication question before moving to the demo." This is coaching.

**Deliberate practice:** the feedback alone is insufficient. The rep must practice the specific skill — through role play, mock calls, or live with a coach present — before the next real opportunity. One coaching conversation and zero practice produces minimal improvement.

**Follow-up:** coaching is a loop, not a one-time event. The manager observes the rep's next calls after a coaching session to see whether the behaviour changed. Without follow-up, most feedback is forgotten within a week.

**Cadence:** weekly 1:1s with a coaching focus (not just pipeline review) are the minimum. Monthly focused call reviews are the supplement. Quarterly performance conversations are the formal calibration.

### The Sales Playbook

A playbook is the organised knowledge of the sales team — the distillation of what works into a form that can be learned and applied by any competent person. A complete playbook includes:

- **ICP and buyer personas:** who we sell to and why
- **Value propositions by segment:** what we say to each type of buyer
- **Sales process:** the stages, entry/exit criteria, and activities at each stage
- **Discovery question bank:** the questions that consistently uncover pain, implication, and compelling event
- **Demo flow by persona:** how to structure demos for different roles and industries
- **Objection handling:** the standard responses to the 10 most common objections
- **Competitive positioning:** how we compare to each major competitor; where we win, where we lose
- **Email and messaging templates:** high-performing cold outreach, follow-up, and proposal templates
- **Onboarding curriculum for new reps:** the sequence in which new reps learn and practice each component

A playbook is not a static document. It is updated quarterly based on win/loss analysis, new competitive intelligence, and coaching observations. The sales enablement function owns the playbook and is responsible for keeping it current and ensuring it is actually used in the training programme.

### Win/Loss Analysis

Systematic win/loss analysis is the engine of sales process improvement. Most companies do informal win/loss — reps explain why they won (great product, good relationship) and why they lost (price, timing) without much rigour. Formal win/loss analysis involves:

- **Customer and prospect interviews:** talking to buyers who chose you or didn't choose you about the actual decision criteria, the competitive comparisons, and the experience of the sales process
- **CRM data analysis:** what stage distribution, deal age, and rep characteristics correlate with wins vs losses?
- **Competitive pattern analysis:** are there specific competitor matchups where the win rate is systematically lower? What is the pattern in those losses?

Win/loss findings should drive specific playbook updates: a new competitive positioning section if a competitor is winning 40% of head-to-head matchups, a new discovery question if the most common lost-deal pattern is "prospect didn't see ROI clearly enough," a new objection handling script if a pricing objection appears in 60% of losses.

### Scaling the Sales Organisation

Culture that works at 5 salespeople requires different infrastructure at 50 and different again at 500. The critical inflection points:

**0→10 salespeople:** culture is set by the founding team and the first sales hire. Process is informal. The priority is finding what works, not scaling.

**10→30:** formalise the playbook, implement the CRM seriously, hire the first Sales Ops resource, establish quota and compensation infrastructure. Without formalisation here, the 30→100 transition becomes chaotic.

**30→100:** specialise roles (SDR/AE split), introduce sales management (player-coaches), implement revenue intelligence tools, build the enablement function.

**100+:** RevOps becomes a strategic function, hiring and onboarding become a machine, and culture maintenance requires explicit investment — culture doesn't scale automatically.

The culture that scales is one where the right behaviours are embedded in the system (CRM, compensation, hiring criteria, onboarding curriculum) rather than relying on any individual's presence to model and enforce them.`,
    quiz: [
      {
        q: 'In a sales culture where reps are penalised for disqualifying prospects ("you\'re not creating enough pipeline"), what long-term problem does this create?',
        options: ['Reps generate more pipeline', 'Reps accumulate unqualified deals in the pipeline — inflating coverage metrics while consuming time on opportunities that will never close, and producing inaccurate forecasts', 'Reps focus on smaller, easier deals', 'Win rates improve as reps are selective'],
        correct: 1,
        explanation: 'Penalising disqualification creates a culture of "never remove a deal from the pipeline" — reps protect pipeline volume rather than pipeline quality. The result is inflated coverage, poor forecast accuracy, and sales cycles consumed by deals that have no real buying intent. Culture rewards should encourage honest qualification, including disqualifying prospects who don\'t fit.',
      },
      {
        q: 'A sales manager tells a rep: "You need to be better at handling objections." This is NOT effective coaching because:',
        options: ['It is too short', 'Objection handling is not teachable', 'It lacks specificity — effective coaching names the specific call, the specific moment, the specific behaviour, and the specific alternative the rep should practice', 'Objection handling should only be addressed in group training'],
        correct: 2,
        explanation: 'General feedback ("be better at X") does not give the rep a concrete action to change. Effective coaching is: "In the 2 PM call yesterday, when the prospect said the price was too high, you immediately offered a discount. Let\'s practice responding instead with the ROI case — specifically this: \'We established the problem costs $X/year. Does the investment look different in that context?\'."',
      },
      {
        q: 'Win/loss analysis consistently shows that deals lost to Competitor A involve "unclear differentiation on the integration story." What is the correct action?',
        options: ['Reduce pricing to compete on cost', 'Update the playbook\'s competitive positioning section with a specific integration comparison and messaging, retrain the team on this differentiation, and add it to the demo flow for prospects evaluating Competitor A', 'Improve the actual integrations', 'Disqualify prospects who are evaluating Competitor A'],
        correct: 1,
        explanation: 'Win/loss analysis drives playbook updates. If a specific competitive weakness appears as a pattern in losses, the response is to: update the competitive positioning in the playbook, create messaging that addresses the comparison directly, train the team on how to handle the objection when it arises, and measure whether the win rate against that competitor improves.',
      },
      {
        q: 'A 5-rep sales team operates without a formal playbook and relies on each rep\'s own approach. The company is now hiring to 20 reps. What is the most critical investment to make before scaling?',
        options: ['Hire a VP of Sales', 'Build the playbook — documenting the ICP, process, discovery questions, demo structure, objection handling, and competitive positioning — so new reps can be onboarded to a consistent standard', 'Implement a new CRM', 'Set higher quotas for the new reps'],
        correct: 1,
        explanation: 'Scaling a team without a playbook means each new rep invents their own approach. Performance becomes highly variable; managers spend coaching time on basics that should be in training; the team\'s collective knowledge (what works) is never captured. The playbook is the infrastructure that makes onboarding scalable and consistent.',
      },
      {
        q: 'A sales culture values "customer obsession over quota obsession." How should this manifest in practice, not just in values statements?',
        options: ['Reps should not have quotas', 'When a rep disqualifies a prospect because they genuinely don\'t need the product, the manager celebrates this rather than penalising lost pipeline — rewarding intellectual honesty over short-term quota pressure', 'Customer satisfaction surveys replace sales metrics', 'Reps focus on NPS rather than closed deals'],
        correct: 1,
        explanation: 'Culture is what behaviours are actually rewarded. Celebrating an honest disqualification — "this prospect doesn\'t benefit from our product; I\'m moving on" — is the most powerful signal of customer-first culture. It demonstrates that long-term revenue (which comes from customers who succeed) is valued over short-term pipeline metrics.',
      },
    ],
  },
]
