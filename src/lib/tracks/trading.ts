export const TRADING_COURSES = [
  {
    id: 'trading-1',
    track: 'Trading',
    title: 'Smart Money Concepts: how institutions actually move markets',
    subtitle: 'Order blocks, liquidity sweeps, market structure & the institutional footprint retail traders ignore',
    duration: '16 m',
    level: 'PhD',
    xp: 200,
    sections: [
      {
        title: 'The institutional vs retail framework',
        content: 'Retail traders use indicators derived from price. Institutional traders move price. This asymmetry is the foundational insight of Smart Money Concepts (SMC). Banks, hedge funds, and central banks have position sizes too large to enter without moving the market — so they engineer liquidity events that allow them to fill at scale. Understanding where institutions need liquidity to enter or exit tells you more about likely price direction than any indicator ever will.',
        keyPoints: [
          'Institutions move price; retail traders react to it',
          'Large positions require engineered liquidity to fill',
          'Follow the institutional footprint, not lagging indicators',
        ],
      },
      {
        title: 'Order blocks and fair value gaps',
        content: 'An order block is the last candle before a significant directional move — the candle where institutional orders were placed. Price frequently returns to these zones to retest before continuing in the original direction. A fair value gap (FVG) is a three-candle pattern where the wicks of the first and third candles don\'t overlap, indicating price moved so fast that an imbalance was left. These gaps act as magnets; price tends to fill them. Neither concept is a guaranteed signal — they are context-dependent tools.',
        keyPoints: [
          'Order block: last candle before a significant move',
          'Fair value gap: imbalance left by fast price movement',
          'Both are context-dependent, not mechanical entry signals',
        ],
      },
      {
        title: 'Liquidity: the magnet beneath every move',
        content: 'Liquidity in SMC refers to clusters of stop orders sitting above swing highs (buy-side liquidity) or below swing lows (sell-side liquidity). Institutions need these pools to fill their own large orders. Before a significant move, price often sweeps these liquidity pools — briefly spiking beyond a swing high or low to trigger stops — before reversing. Recognising liquidity sweeps prevents you from being stopped out on the wrong side and shows you where smart money is positioning.',
        keyPoints: [
          'Liquidity pools sit above swing highs and below swing lows',
          'Price sweeps these pools to fill institutional orders',
          'A liquidity sweep followed by reversal is a high-probability signal',
        ],
      },
    ],
  },
  {
    id: 'trading-2',
    track: 'Trading',
    title: 'Risk management: the only skill that keeps you in the game',
    subtitle: 'Position sizing, R-multiples, drawdown psychology & the maths behind long-term survival',
    duration: '14 m',
    level: 'Masters',
    xp: 170,
    sections: [
      {
        title: 'The maths of ruin',
        content: 'If you risk 25% of your account on a single trade and lose four in a row — a completely plausible sequence even with a 50% win rate — you have 31% of your capital left. Recovery from a 69% drawdown requires a 223% gain. This is not a trading problem; it is a mathematics problem. Position sizing is not optional. The Kelly Criterion gives the mathematically optimal bet size given edge and odds; in practice, half-Kelly (or less) is safer because real-world edge estimates are imprecise.',
        keyPoints: [
          'Ruin is irreversible — drawdown maths makes recovery geometrically harder',
          'Kelly Criterion: optimal bet size = edge / odds',
          'Use half-Kelly or less in practice; edge estimates are imprecise',
        ],
      },
      {
        title: 'R-multiples: the language of professional risk',
        content: 'An R-multiple expresses trade outcomes as multiples of initial risk. If you risk $100 on a trade and make $300, that\'s a +3R trade. If you lose $100, that\'s -1R. This normalises trade results across different position sizes and account sizes, making performance genuinely comparable. A trading system with a 40% win rate and an average winner of +3R outperforms one with a 60% win rate and an average winner of +1R. Know your expectancy: (win rate × average winner) − (loss rate × average loser).',
        keyPoints: [
          'R-multiples normalise risk across trade sizes',
          'Expectancy = (win rate × avg winner R) − (loss rate × avg loser R)',
          'Win rate alone tells you nothing without knowing R-multiples',
        ],
      },
      {
        title: 'Drawdown psychology',
        content: 'Every trading system has drawdown periods — stretches where consecutive losses erode equity. The psychological challenge is distinguishing between a system in drawdown (normal) and a system that has stopped working (requires action). Rules: define your maximum acceptable drawdown before you start; if you hit it, stop trading and review. Track your metrics (win rate, average R) over rolling periods to detect genuine system degradation. Never increase position size to recover losses — this is the fastest path to account destruction.',
        keyPoints: [
          'Drawdown is inevitable — define your limit before trading',
          'Track rolling metrics to detect real system failure vs normal variance',
          'Never revenge-trade or size up to recover — it accelerates ruin',
        ],
      },
    ],
  },
  {
    id: 'trading-3',
    track: 'Trading',
    title: 'Reading the VIX and volatility term structure',
    subtitle: 'What implied volatility tells you, how the VIX is constructed & using volatility as a market signal',
    duration: '15 m',
    level: 'PhD',
    xp: 185,
    sections: [
      {
        title: 'What the VIX actually measures',
        content: 'The VIX (CBOE Volatility Index) measures the market\'s expectation of 30-day volatility in the S&P 500, derived from the prices of SPX options. It does not measure realised volatility; it measures implied volatility — what options traders collectively expect will happen. A VIX of 20 means the market implies a 20% annualised move, which translates to approximately a 1.25% daily move. High VIX = high fear and expected volatility. Low VIX = complacency. Neither extreme is inherently bullish or bearish; context is everything.',
        keyPoints: [
          'VIX = market-implied 30-day volatility for the S&P 500',
          'Derived from SPX option prices — it measures expectation, not realised vol',
          'VIX of 20 implies ~1.25% daily moves; VIX of 30 implies ~1.9%',
        ],
      },
      {
        title: 'Term structure: what the curve tells you',
        content: 'Volatility has a term structure: implied volatility varies across different expiry dates. In normal markets, the vol curve slopes upward (contango) — near-term options are cheaper than longer-dated ones. In stressed markets, the curve inverts (backwardation) — near-term options become expensive as hedging demand spikes. The slope of the VIX term structure (measured by VIX vs VIX3M) is a useful regime indicator: steep contango = calm, complacent market; backwardation = stress, often near market bottoms.',
        keyPoints: [
          'Contango (upward slope): normal, calm markets',
          'Backwardation (inverted): stressed markets, elevated short-term hedging demand',
          'VIX vs VIX3M spread is a useful regime signal',
        ],
      },
      {
        title: 'Using volatility signals in practice',
        content: 'Mean-reversion in volatility is one of the most reliable patterns in financial markets. Extreme VIX spikes — above 40, above 50 — have historically been excellent long equity entry points, not because the worst is necessarily over, but because options premiums are maximally inflated and the distribution of outcomes is skewed. Selling volatility into spikes (via short puts, put spreads, or VIX call spreads) has been a profitable systematic strategy. But vol spikes can persist and extend; position sizing and defined risk are essential.',
        keyPoints: [
          'Extreme VIX spikes historically mark good long equity entry zones',
          'Selling volatility into spikes: a systematic edge with real risk',
          'Defined risk and position sizing are non-negotiable in vol trades',
        ],
      },
    ],
  },
  {
    id: 'trading-4',
    track: 'Trading',
    title: 'Market structure and trend identification',
    subtitle: 'Higher highs, lower lows, break of structure & the framework for knowing where price is in its cycle',
    duration: '12 m',
    level: 'Masters',
    xp: 155,
    sections: [
      {
        title: 'The structure framework',
        content: 'Market structure is the pattern of highs and lows that defines trend direction. An uptrend is a series of higher highs and higher lows (HH/HL). A downtrend is a series of lower lows and lower highs (LL/LH). Structure breaks when price fails to make a new high (in an uptrend) or fails to make a new low (in a downtrend). The break of structure (BOS) is the SMC term for a confirmed trend change. Trading in the direction of structure is the highest-probability alignment.',
        keyPoints: [
          'Uptrend: HH/HL. Downtrend: LL/LH',
          'Break of structure = confirmed trend change',
          'Always trade in alignment with higher-timeframe structure',
        ],
      },
      {
        title: 'Multi-timeframe analysis',
        content: 'Every asset trades in nested timeframes simultaneously. A 15-minute chart exists inside a 1-hour chart, which exists inside a 4-hour chart, which exists inside a daily chart. Smart analysis identifies the dominant trend on the highest relevant timeframe and looks for entries on a lower timeframe. The 4-hour gives direction; the 15-minute gives entry. Conflicts between timeframes reduce probability. Alignment across timeframes — daily bullish, 4H bullish, 1H pulling back into structure — is the setup worth waiting for.',
        keyPoints: [
          'Higher timeframe gives direction; lower timeframe gives entry',
          'Conflicts reduce probability; alignment increases it',
          'The 4H/daily context is more important than the 5-minute pattern',
        ],
      },
      {
        title: 'Ranging vs trending: the market state problem',
        content: 'Trending strategies fail in ranging markets. Ranging strategies fail in trending markets. Most traders use one strategy in both environments and wonder why results are inconsistent. The first job is market state identification: is this market trending (clear HH/HL or LL/LH on the relevant timeframe) or ranging (price oscillating between defined support and resistance)? ADX (Average Directional Index) above 25 generally indicates trending conditions. Below 20, assume range. Between 20–25, be cautious.',
        keyPoints: [
          'Trending vs ranging require different strategies',
          'Identify market state before selecting strategy',
          'ADX >25 = trend; <20 = range; 20–25 = ambiguous',
        ],
      },
    ],
  },
  {
    id: 'trading-5',
    track: 'Trading',
    title: 'Trading psychology: the inner game',
    subtitle: 'Cognitive biases, emotional regulation, process vs outcome & building the habits that separate profitable traders',
    duration: '14 m',
    level: 'Masters',
    xp: 165,
    sections: [
      {
        title: 'Why most traders fail: the psychological reality',
        content: 'Studies consistently show that most retail traders lose money — not because their strategies are wrong, but because they can\'t execute their strategies under emotional pressure. Loss aversion (losses hurt twice as much as equivalent gains feel good) causes premature exits from winners and holding losers too long. Recency bias makes a losing streak feel permanent and a winning streak feel like skill. Overconfidence after a good run leads to position size errors. The problem is not information; it is execution under conditions of uncertainty and loss.',
        keyPoints: [
          'Most traders fail psychologically, not strategically',
          'Loss aversion: losses feel 2× worse than equivalent gains feel good',
          'Overconfidence after winning streaks is as dangerous as fear after losing streaks',
        ],
      },
      {
        title: 'Process vs outcome',
        content: 'A good trade and a profitable trade are not the same thing. A good trade is one where you followed your system — correct analysis, correct entry, correct sizing, correct management. Sometimes good trades lose money; sometimes bad trades make money. The randomness of short-term outcomes means you cannot judge decision quality by outcomes alone. The professionals track process metrics (did I follow my rules? did I take my planned entries?) separately from outcome metrics (did I make money?). This distinction is psychologically and practically essential.',
        keyPoints: [
          'Good process can produce bad outcomes and vice versa in the short run',
          'Track process compliance separately from P&L',
          'Long-run profitability comes from consistently good process, not from chasing outcomes',
        ],
      },
      {
        title: 'Building trading habits that compound',
        content: 'The habits that separate long-term profitable traders: a pre-session routine (market review, bias formation, planned scenarios), a trading journal (not just entries/exits but reasoning and emotional state), a post-session review (what worked, what didn\'t, what will change), and a weekly/monthly statistics review (win rate, average R, expectancy trends). These are not optional admin tasks — they are the mechanism by which skill compounds. Most traders skip them entirely, then wonder why they\'re not improving.',
        keyPoints: [
          'Pre-session routine: market context, bias, planned scenarios',
          'Journal: entries, reasoning, and emotional state — all three',
          'Weekly stats review: how skill compounds over time',
        ],
      },
    ],
  },
] as const
