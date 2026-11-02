// Auto-categorizes a TikTok profile into one of 11 business niches
// Uses weighted keyword scoring on username + bio + display name

const CATEGORIES = {
  fashion: {
    keywords: ['fashion', 'clothing', 'clothes', 'wear', 'boutique', 'apparel', 'style', 'outfit', 'dress', 'shirt', 'shoes', 'sneaker', 'jeans', 'tshirt', 'streetwear', 'menswear', 'womenswear', 'swimwear', 'accessories', 'bag', 'purse', 'jewel'],
    message: `Hey! I checked out your page and I love what you're building. I'm Jordan from J Supreme Tech — we design high-converting websites and digital tools for fashion brands just like yours. I actually put together a quick mockup of what your brand could look like online. Would love to share it. Mind if I send it over?`
  },
  beauty: {
    keywords: ['beauty', 'hair', 'locs', 'loctician', 'salon', 'nails', 'makeup', 'cosmetics', 'skincare', 'spa', 'wax', 'brow', 'lash', 'natural', 'twists', 'braids', 'weave', 'wig', 'barber', 'grooming', 'facial'],
    message: `Hey! Your content is giving serious vibes — I love the aesthetic. I'm Jordan from J Supreme Tech and we help beauty brands get more clients online. I put together a free mockup of what a booking page could look like for your brand. Can I send it over?`
  },
  food: {
    keywords: ['food', 'restaurant', 'chef', 'cook', 'kitchen', 'meal', 'catering', 'jerk', 'curry', 'roti', 'oxtail', 'ackee', 'patty', 'diner', 'cafe', 'eatery', 'cuisine', 'foodie', 'lunch', 'dinner', 'breakfast', 'snack', 'menu'],
    message: `Hey! Your food content is fire 🔥. I'm Jordan from J Supreme Tech — we build digital menus, online ordering, and websites for restaurants. I designed a free mockup of an online ordering page for your brand. Want me to send it?`
  },
  bakery: {
    keywords: ['bak', 'cake', 'pastry', 'dessert', 'cupcake', 'cookie', 'bread', 'pastries', 'confection', 'sweet', 'sugar', 'frosting', 'fondant', 'bun', 'tart', 'cheesecake', 'brownie', 'muffin', 'donut'],
    message: `Hey! Your baked goods look amazing. I'm Jordan from J Supreme Tech and we help bakeries get more online orders. I actually put together a free website mockup for your brand — would love to show you what it could look like. Can I send it over?`
  },
  furniture: {
    keywords: ['furniture', 'interior', 'decor', 'sofa', 'couch', 'table', 'chair', 'bed', 'cabinet', 'wood', 'craft', 'handmade', 'custom made', 'upholstery', 'design', 'home design', 'renovation', 'living room'],
    message: `Hey! Your work is stunning — the craftsmanship really shows. I'm Jordan from J Supreme Tech and we build websites and online catalogues for furniture and interior design brands. I put together a free mockup for your brand. Want me to send it over?`
  },
  retail: {
    keywords: ['store', 'shop', 'retail', 'sell', 'sale', 'product', 'merchandise', 'stock', 'inventory', 'market', 'vendor', 'online store', 'ecommerce', 'brand', 'gift', 'wholesale', 'dropship'],
    message: `Hey! I love your products. I'm Jordan from J Supreme Tech — we build e-commerce stores and product landing pages that actually convert. I put together a free mockup of an online store for your brand. Mind if I send it?`
  },
  automotive: {
    keywords: ['car', 'auto', 'vehicle', 'mechanic', 'garage', 'detailing', 'wash', 'tint', 'rim', 'wheel', 'engine', 'motor', 'repair', 'service', 'dealership', 'truck', 'rental', 'drive'],
    message: `Hey! Your content is clean just like your work. I'm Jordan from J Supreme Tech — we build booking and service websites for auto businesses. I designed a free mockup of a booking page for your garage/shop. Can I send it?`
  },
  logistics: {
    keywords: ['delivery', 'courier', 'shipping', 'logistics', 'freight', 'transport', 'cargo', 'move', 'mover', 'dispatch', 'drop off', 'pickup', 'supply', 'warehouse', 'fleet', 'driver'],
    message: `Hey! I see you're building something solid in logistics. I'm Jordan from J Supreme Tech — we build tracking dashboards, booking systems, and websites for courier and delivery companies. I put together a free mockup for your brand. Want to see it?`
  },
  packaging: {
    keywords: ['print', 'packaging', 'label', 'box', 'bag', 'wrap', 'design', 'brand', 'logo', 'sign', 'banner', 'tshirt print', 'vinyl', 'custom print', 'graphics', 'sublimation', 'embroidery'],
    message: `Hey! Your designs are clean. I'm Jordan from J Supreme Tech — we build portfolio and order management websites for print and packaging businesses. I put together a free mockup of what your online presence could look like. Can I send it?`
  },
  creative: {
    keywords: ['photography', 'photo', 'video', 'film', 'creative', 'artist', 'art', 'studio', 'media', 'content', 'creator', 'graphic', 'designer', 'illustrat', 'animation', 'edit', 'production', 'music', 'dj', 'podcast'],
    message: `Hey! Your work speaks for itself. I'm Jordan from J Supreme Tech — we build portfolio sites and client-booking systems for creatives. I put together a free mockup of what your digital presence could look like. Want me to send it?`
  },
  floral: {
    keywords: ['flower', 'floral', 'bouquet', 'wedding', 'event', 'decor', 'planner', 'garden', 'plant', 'arrangement', 'centerpiece', 'corsage', 'florist', 'bloom', 'rose', 'lily', 'orchid'],
    message: `Hey! Your arrangements are beautiful. I'm Jordan from J Supreme Tech — we build online booking and ordering sites for floral and event businesses. I designed a free mockup for your brand. Can I send it over?`
  },
  realestate: {
    keywords: ['real estate', 'realtor', 'property', 'land', 'house', 'home', 'construction', 'builder', 'contractor', 'renovate', 'build', 'invest', 'listing', 'airbnb', 'rental property', 'mortgage'],
    message: `Hey! I love what you're building in the property space. I'm Jordan from J Supreme Tech — we build listing sites, lead capture pages, and portals for real estate and construction brands. I put together a free mockup for your brand. Want me to send it?`
  },
  wellness: {
    keywords: ['fitness', 'gym', 'trainer', 'health', 'wellness', 'yoga', 'pilates', 'nutrition', 'diet', 'weight', 'workout', 'coach', 'spa', 'massage', 'physio', 'therapy', 'mental health', 'meditation'],
    message: `Hey! Your content is inspiring. I'm Jordan from J Supreme Tech — we build booking and client management sites for fitness and wellness brands. I put together a free mockup of a booking page for your brand. Can I send it over?`
  },
  events: {
    keywords: ['event', 'party', 'dj', 'entertainment', 'venue', 'concert', 'festival', 'promoter', 'sound', 'booking', 'club', 'host', 'mc', 'emcee', 'nightlife', 'vip'],
    message: `Hey! Your energy is everything — I love what you're doing in events. I'm Jordan from J Supreme Tech and we build event booking and ticketing sites for entertainers and promoters. I put together a free mockup for your brand. Want to see it?`
  },
  hospitality: {
    keywords: ['hotel', 'villa', 'airbnb', 'resort', 'guesthouse', 'tourism', 'tour', 'travel', 'excursion', 'transfer', 'airport', 'guide', 'hospitality', 'visitor', 'accommodation'],
    message: `Hey! Your setup looks amazing. I'm Jordan from J Supreme Tech — we build booking and tourism sites for hospitality businesses in the Caribbean. I designed a free mockup for your brand. Can I send it?`
  }
};

function classify(profile) {
  const text = [
    profile.username || '',
    profile.display_name || '',
    profile.bio || ''
  ].join(' ').toLowerCase();

  let bestCategory = null;
  let bestScore = 0;

  for (const [category, config] of Object.entries(CATEGORIES)) {
    let score = 0;
    for (const kw of config.keywords) {
      if (text.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  if (bestScore === 0) return null; // no match — skip this profile

  return {
    category: bestCategory,
    score: bestScore,
    message: CATEGORIES[bestCategory].message
  };
}

module.exports = { classify, CATEGORIES };
