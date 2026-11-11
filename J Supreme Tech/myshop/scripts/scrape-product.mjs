/**
 * Mine & Yours Shop — Product Scraper + Inserter
 * Usage: node scripts/scrape-product.mjs <url1> [url2 ...] --category "Furniture"
 *
 * Tier 1 (no-stealth): CJ Dropshipping, AliExpress, DHgate, Banggood
 * Tier 2 (stealth):    Amazon, Walmart, Target, Wayfair, Home Depot
 * Both tiers run together — customers get budget + premium options.
 *
 * Requires: npm install puppeteer-extra puppeteer-extra-plugin-stealth xlsx
 */

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, createWriteStream, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import xlsx from "xlsx";
import https from "https";
import http from "http";
import { SEED_PRODUCTS, MARKUP_RULES } from "./seed-urls.mjs";

puppeteer.use(StealthPlugin());

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const JMD_RATE  = 157;     // USD → JMD rate (update monthly)
const DEFAULT_MARKUP = { min: 50, max: 90 }; // fallback if category not in MARKUP_RULES
const MAX_IMG_KB = 200;

// Admin API auth
const ADMIN_SECRET = "bfsM5TBSV8AKu6JdqmtnRxrOWgyCXUNP";

// Load Supabase creds from .env.local
const envVars   = parseEnv(join(__dirname, "../.env.local"));
const SB_URL    = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const SB_KEY    = envVars["SUPABASE_SERVICE_ROLE_KEY"];

// ─── VERO BRAND BLACKLIST ─────────────────────────────────────────────────────
const VERO_BRANDS = [
  "nike","adidas","puma","under armour","reebok","new balance","vans","converse",
  "apple","samsung","sony","bose","beats","jbl","lg","hp","dell","lenovo",
  "louis vuitton","gucci","prada","chanel","hermes","versace","balenciaga","dior",
  "disney","marvel","star wars","pokemon","nintendo","xbox","playstation",
  "rolex","omega","cartier","pandora","tiffany",
  "ugg","timberland","dr martens","birkenstock","crocs",
  "lego","barbie","hasbro","mattel","fisher-price",
  "ralph lauren","tommy hilfiger","calvin klein","lacoste","hugo boss",
  "north face","columbia","patagonia","arc'teryx",
  "dyson","kitchenaid","vitamix","instant pot","ninja","nespresso",
  "yeti","hydroflask","stanley","contigo",
  "jordan","air jordan",
];

// ─── SPREADSHEET DEMAND LOOKUP ────────────────────────────────────────────────

function loadResearchSheet() {
  const path = "C:/Users/jader/Downloads/DropShipProductResearch (1) (1).xlsx";
  if (!existsSync(path)) { console.log("  ℹ Research sheet not found — skipping demand check"); return new Map(); }
  const wb   = xlsx.readFile(path);
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
  const map  = new Map();
  let currentCategory = "Other";
  for (const row of rows) {
    if (!row[1]) continue;
    // Category header rows have no price/seller data
    if (row[1] && !row[3] && !row[4] && row[1] !== "Item Name") {
      currentCategory = row[1]; continue;
    }
    if (row[1] === "Item Name") continue;
    map.set(String(row[1]).toLowerCase().trim(), {
      sheetCategory: currentCategory,
      avgPrice:      row[3],
      totalSales:    parseFloat(row[6]) || 0,
      rating:        row[7],   // "Good" | "Bad"
      googleTrends:  row[8],
    });
  }
  return map;
}

// ─── PRICE ────────────────────────────────────────────────────────────────────

function calcPriceJmd(usdPrice, category) {
  const range = MARKUP_RULES?.[category] ?? DEFAULT_MARKUP;
  const pct = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const raw = usdPrice * JMD_RATE * (1 + pct / 100);
  const price = Math.round(raw / 100) * 100; // nearest J$100
  return { price, pct };
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-").slice(0,60);
}

// ─── SUPPLIER SHIPPING KNOWLEDGE BASE ────────────────────────────────────────

const SUPPLIER_SHIPPING = {
  "cjdropshipping.com": {
    supplierName: "CJ Dropshipping",
    options: [
      { label: "Standard Shipping", daysMin: 7,  daysMax: 15, priceCents: 0,    carrier: "CJ Packet" },
      { label: "Expedited",         daysMin: 5,  daysMax: 8,  priceCents: 1500, carrier: "DHL" },
    ],
    freeDelivery: true, defaultMin: 9, defaultMax: 17,
  },
  "aliexpress.com": {
    supplierName: "AliExpress",
    options: [
      { label: "AliExpress Standard", daysMin: 15, daysMax: 30, priceCents: 0,    carrier: "AliExpress Shipping" },
      { label: "DHL Express",         daysMin: 5,  daysMax: 8,  priceCents: 2000, carrier: "DHL" },
    ],
    freeDelivery: true, defaultMin: 17, defaultMax: 32,
  },
  "dhgate.com": {
    supplierName: "DHgate",
    options: [
      { label: "Free Shipping", daysMin: 7,  daysMax: 20, priceCents: 0,    carrier: "DHgate Shipping" },
      { label: "DHL Express",   daysMin: 5,  daysMax: 7,  priceCents: 1800, carrier: "DHL" },
    ],
    freeDelivery: true, defaultMin: 9, defaultMax: 22,
  },
  "banggood.com": {
    supplierName: "Banggood",
    options: [
      { label: "Free Shipping",  daysMin: 7,  daysMax: 15, priceCents: 0,    carrier: "Banggood Shipping" },
      { label: "Priority Line",  daysMin: 5,  daysMax: 10, priceCents: 1200, carrier: "Priority" },
    ],
    freeDelivery: true, defaultMin: 9, defaultMax: 17,
  },
  "amazon.com": {
    supplierName: "Amazon",
    options: [
      { label: "Free Delivery",          daysMin: 5, daysMax: 7,  priceCents: 0,    carrier: "Amazon Logistics" },
      { label: "Express (2-Day)",        daysMin: 2, daysMax: 3,  priceCents: 1299, carrier: "Amazon" },
      { label: "Same-Day (select zip)",  daysMin: 0, daysMax: 1,  priceCents: 2999, carrier: "Amazon" },
    ],
    freeDelivery: true, defaultMin: 7, defaultMax: 9,
  },
  "walmart.com": {
    supplierName: "Walmart",
    options: [
      { label: "Free Delivery ($35+)", daysMin: 2, daysMax: 7, priceCents: 0,   carrier: "Walmart Fulfillment" },
      { label: "Express Delivery",     daysMin: 1, daysMax: 2, priceCents: 999, carrier: "Walmart+" },
    ],
    freeDelivery: true, defaultMin: 4, defaultMax: 9,
  },
  "target.com": {
    supplierName: "Target",
    options: [
      { label: "Free Delivery ($35+)", daysMin: 2, daysMax: 5,  priceCents: 0,    carrier: "Target Fulfillment" },
      { label: "Same-Day",             daysMin: 0, daysMax: 0,  priceCents: 1099, carrier: "Shipt" },
    ],
    freeDelivery: true, defaultMin: 4, defaultMax: 7,
  },
  "wayfair.com": {
    supplierName: "Wayfair",
    options: [
      { label: "Free Shipping",        daysMin: 1, daysMax: 7,  priceCents: 0,    carrier: "Wayfair Delivery" },
      { label: "White Glove Delivery", daysMin: 7, daysMax: 14, priceCents: 9900, carrier: "Wayfair" },
    ],
    freeDelivery: true, defaultMin: 3, defaultMax: 9,
  },
  "homedepot.com": {
    supplierName: "Home Depot",
    options: [
      { label: "Free Delivery ($45+)", daysMin: 1, daysMax: 7, priceCents: 0,    carrier: "Home Depot Delivery" },
      { label: "Express Delivery",     daysMin: 1, daysMax: 2, priceCents: 2500, carrier: "Home Depot" },
    ],
    freeDelivery: true, defaultMin: 3, defaultMax: 9,
  },
};

function getSupplierShipping(url) {
  const match = Object.entries(SUPPLIER_SHIPPING).find(([host]) => url.includes(host));
  if (match) return match[1];
  return {
    supplierName: "Direct Supplier",
    options: [{ label: "Standard Shipping", daysMin: 5, daysMax: 9, priceCents: 0, carrier: "Carrier" }],
    freeDelivery: true, defaultMin: 7, defaultMax: 11,
  };
}

// ─── SCRAPERS ─────────────────────────────────────────────────────────────────

async function scrapeUrl(url) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox","--disable-setuid-sandbox","--disable-blink-features=AutomationControlled"],
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2000);
  // Inject the variant helper so page.evaluate() calls can use it
  await page.evaluate(EXTRACT_VARIANTS_SRC).catch(() => {});

  let result;
  if      (url.includes("cjdropshipping.com")) result = await scrapeCJ(page);
  else if (url.includes("aliexpress.com"))     result = await scrapeAli(page);
  else if (url.includes("dhgate.com"))         result = await scrapeDHgate(page);
  else if (url.includes("banggood.com"))       result = await scrapeBanggood(page);
  else if (url.includes("amazon.com"))         result = await scrapeAmazon(page);
  else if (url.includes("walmart.com"))        result = await scrapeWalmart(page);
  else if (url.includes("target.com"))         result = await scrapeTarget(page);
  else if (url.includes("wayfair.com"))        result = await scrapeWayfair(page);
  else if (url.includes("homedepot.com"))      result = await scrapeHomeDepot(page);
  else throw new Error(`Unsupported supplier: ${url}`);

  await browser.close();
  return result;
}

// Browser-side variant extractor — injected into each page.evaluate call
const EXTRACT_VARIANTS_SRC = `
function extractedVariants(selectors) {
  const variants = [];
  for (const { label, optionSelector } of selectors) {
    const opts = [...document.querySelectorAll(optionSelector)]
      .map((el) => (el.textContent || el.value || el.getAttribute("aria-label") || "").trim())
      .filter((t) => t && t.length < 60);
    if (opts.length > 1) variants.push({ label, options: opts });
  }
  return variants;
}
`;

// — Tier 1 scrapers —

async function scrapeCJ(page) {
  return page.evaluate(() => {
    const variants = extractedVariants([
      { label: "Color", optionSelector: ".sku-color-item, .color-select li, [class*='color-item']" },
      { label: "Size",  optionSelector: ".sku-size-item,  .size-select  li, [class*='size-item']"  },
    ]);
    return {
      name:     document.querySelector(".product-title, h1")?.textContent?.trim(),
      desc:     document.querySelector(".product-desc, .description")?.textContent?.trim()?.slice(0,500),
      price:    parseFloat(document.querySelector(".price, .product-price")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
      imageUrl: document.querySelector(".product-img img, .swiper-slide img")?.src,
      variants,
    };
  });
}

async function scrapeAli(page) {
  return page.evaluate(() => {
    const variants = extractedVariants([
      { label: "Color", optionSelector: "[class*='sku-item'][class*='color'] span, [class*='skuColorItem']" },
      { label: "Size",  optionSelector: "[class*='sku-item'][class*='size']  span, [class*='skuSizeItem']"  },
    ]);
    return {
      name:     document.querySelector("h1")?.textContent?.trim(),
      desc:     document.querySelector("[class*='description']")?.textContent?.trim()?.slice(0,500),
      price:    parseFloat(document.querySelector("[class*='price'] span")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
      imageUrl: document.querySelector(".magnifier-image, [class*='gallery'] img")?.src,
      variants,
    };
  });
}

async function scrapeDHgate(page) {
  return page.evaluate(() => {
    const variants = extractedVariants([
      { label: "Color", optionSelector: ".color-spec li, [class*='color-item']" },
      { label: "Size",  optionSelector: ".size-spec  li, [class*='size-item']"  },
    ]);
    return {
      name:     document.querySelector(".product-title-wrap h1, h1.product-name")?.textContent?.trim(),
      desc:     document.querySelector(".product-description")?.textContent?.trim()?.slice(0,500),
      price:    parseFloat(document.querySelector(".price-now, .sale-price")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
      imageUrl: document.querySelector(".main-img img, .item-gallery img")?.src,
      variants,
    };
  });
}

async function scrapeBanggood(page) {
  return page.evaluate(() => {
    const variants = extractedVariants([
      { label: "Color", optionSelector: ".color-box li, [class*='color-select'] li" },
      { label: "Size",  optionSelector: ".size-box  li, [class*='size-select']  li" },
    ]);
    return {
      name:     document.querySelector("h1")?.textContent?.trim(),
      desc:     document.querySelector(".product-description-block")?.textContent?.trim()?.slice(0,500),
      price:    parseFloat(document.querySelector(".main-price, .now-price")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
      imageUrl: document.querySelector(".imgs-box img")?.src,
      variants,
    };
  });
}

// — Tier 2 scrapers (stealth handled by puppeteer-extra-plugin-stealth) —

async function scrapeAmazon(page) {
  await page.waitForSelector("#productTitle", { timeout: 10000 }).catch(() => {});
  return page.evaluate(() => {
    // Amazon inline variant pickers
    const colorEls = [...document.querySelectorAll("#variation_color_name .a-button-text, #variation_color_name li img")].map((el) => el.getAttribute("title") || el.textContent?.trim()).filter(Boolean);
    const sizeEls  = [...document.querySelectorAll("#variation_size_name  .a-button-text")].map((el) => el.textContent?.trim()).filter(Boolean);
    const styleEls = [...document.querySelectorAll("#variation_style_name .a-button-text")].map((el) => el.textContent?.trim()).filter(Boolean);
    const variants = [];
    if (colorEls.length > 1) variants.push({ label: "Color", options: colorEls });
    if (sizeEls.length  > 1) variants.push({ label: "Size",  options: sizeEls  });
    if (styleEls.length > 1) variants.push({ label: "Style", options: styleEls });
    return {
      name:     document.querySelector("#productTitle")?.textContent?.trim(),
      desc:     document.querySelector("#feature-bullets li:first-child")?.textContent?.trim()?.slice(0,500),
      price:    parseFloat(document.querySelector(".a-price-whole")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
      imageUrl: document.querySelector("#landingImage, #imgBlkFront")?.src,
      variants,
    };
  });
}

async function scrapeWalmart(page) {
  await page.waitForSelector("h1", { timeout: 10000 }).catch(() => {});
  return page.evaluate(() => {
    const variants = extractedVariants([
      { label: "Color", optionSelector: "[data-testid='variant-color'] button, [class*='ColorButton']" },
      { label: "Size",  optionSelector: "[data-testid='variant-size']  button, [class*='SizeButton']"  },
    ]);
    return {
      name:     document.querySelector("h1")?.textContent?.trim(),
      desc:     document.querySelector("[data-testid='product-description']")?.textContent?.trim()?.slice(0,500),
      price:    parseFloat(document.querySelector("[itemprop='price']")?.getAttribute("content") || "0"),
      imageUrl: document.querySelector("[data-testid='hero-image'] img")?.src,
      variants,
    };
  });
}

async function scrapeTarget(page) {
  await page.waitForSelector("h1[data-test='product-title']", { timeout: 10000 }).catch(() => {});
  return page.evaluate(() => {
    const variants = extractedVariants([
      { label: "Color", optionSelector: "[data-test='swatch-label']" },
      { label: "Size",  optionSelector: "[data-test='size-swatch']  button" },
    ]);
    return {
      name:     document.querySelector("h1[data-test='product-title']")?.textContent?.trim(),
      desc:     document.querySelector("[data-test='item-details-description']")?.textContent?.trim()?.slice(0,500),
      price:    parseFloat(document.querySelector("[data-test='product-price']")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
      imageUrl: document.querySelector("[data-test='product-image'] img")?.src,
      variants,
    };
  });
}

async function scrapeWayfair(page) {
  return page.evaluate(() => {
    const variants = extractedVariants([
      { label: "Color",   optionSelector: "[class*='SwatchList'] button, [data-cy='swatch-button']" },
      { label: "Finish",  optionSelector: "[class*='FinishOption'], [data-cy='finish-option']" },
      { label: "Size",    optionSelector: "[class*='SizeOption']  button" },
    ]);
    return {
      name:     document.querySelector("h1")?.textContent?.trim(),
      desc:     document.querySelector("[data-enzyme-id='ProductDetailDescription']")?.textContent?.trim()?.slice(0,500),
      price:    parseFloat(document.querySelector(".BasePriceBlock, .SalePrice")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
      imageUrl: document.querySelector(".MediaCarousel img, .Image__Element img")?.src,
      variants,
    };
  });
}

async function scrapeHomeDepot(page) {
  return page.evaluate(() => {
    const variants = extractedVariants([
      { label: "Color",  optionSelector: "[class*='SwatchChooser'] li, .swatch__option" },
      { label: "Size",   optionSelector: "[class*='PodOption']     li, .dropdown__option" },
    ]);
    return {
      name:     document.querySelector("h1")?.textContent?.trim(),
      desc:     document.querySelector(".product-description__content")?.textContent?.trim()?.slice(0,500),
      price:    parseFloat(document.querySelector("[itemprop='price']")?.getAttribute("content") || document.querySelector(".price__numbers")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
      imageUrl: document.querySelector(".mediagallery__mainimage img")?.src,
      variants,
    };
  });
}

// ─── SUPABASE STORAGE UPLOAD ─────────────────────────────────────────────────

async function uploadImageToSupabase(localPath, slug) {
  if (!SB_URL || !SB_KEY) return null;
  const bucket = "myshop";
  const key    = `products/${slug}.jpg`;
  const data   = readFileSync(localPath);

  const res = await fetch(`${SB_URL}/storage/v1/object/${bucket}/${key}`, {
    method:  "POST",
    headers: {
      apikey:          SB_KEY,
      Authorization:   `Bearer ${SB_KEY}`,
      "Content-Type":  "image/jpeg",
      "x-upsert":      "true",
    },
    body: data,
  });

  if (!res.ok) {
    console.log(`    ⚠ Storage upload failed (${res.status}) — using local path only`);
    return null;
  }
  return `${SB_URL}/storage/v1/object/public/${bucket}/${key}`;
}

// ─── IMAGE: DOWNLOAD + COMPRESS ───────────────────────────────────────────────

async function downloadImage(url, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const file  = createWriteStream(dest);
    proto.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", reject);
  });
}

function compressImage(src, dest) {
  try {
    execSync(`magick "${src}" -resize "1400x>" -quality 82 -strip "${dest}"`, { stdio: "pipe" });
    if (statSync(dest).size / 1024 > MAX_IMG_KB) {
      execSync(`magick "${src}" -resize "1000x>" -quality 70 -strip "${dest}"`, { stdio: "pipe" });
    }
  } catch {
    execSync(`copy /Y "${src}" "${dest}"`, { shell: "cmd", stdio: "pipe" });
  }
}

// ─── VERO CHECK ───────────────────────────────────────────────────────────────

function checkVero(name) {
  const lower = name.toLowerCase();
  return VERO_BRANDS.find((b) => lower.includes(b)) || null;
}

// ─── CATEGORY MAPPER (fallback if not in spreadsheet) ─────────────────────────

function guessCategory(name) {
  const n = name.toLowerCase();
  if (n.match(/sofa|chair|table|shelf|rack|dresser|bed|desk|stool|cabinet/)) return "Furniture";
  if (n.match(/decor|plant|candle|vase|frame|mirror|rug|curtain|lamp/))      return "Home";
  if (n.match(/phone|case|charger|cable|earphone|speaker|tablet|tripod/))    return "Cellphone Accessories";
  if (n.match(/laptop|computer|monitor|keyboard|mouse|router|smart home/))   return "Electronics";
  if (n.match(/exercise|gym|yoga|dumbbell|band|mat|foam roller|kettlebell/)) return "Fitness";
  if (n.match(/makeup|skincare|brush|serum|mascara|lipstick|beauty/))        return "Beauty & Skincare";
  if (n.match(/baby|toddler|infant|pacifier|diaper|stroller|swing/))         return "Baby & Toddler";
  if (n.match(/dog|cat|pet|leash|bowl|collar|kennel|aquarium/))              return "Pets";
  if (n.match(/pen|notebook|stapler|binder|marker|printer|office/))          return "Office";
  if (n.match(/garden|outdoor|lawn|grass|patio|planter|hose|shovel/))        return "Garden";
  if (n.match(/necklace|ring|earring|bracelet|watch|jewelry|jewellery/))     return "Jewellery";
  if (n.match(/shirt|dress|jacket|pants|skirt|hoodie|clothing/))             return "Clothing";
  if (n.match(/bag|purse|tote|backpack|handbag|wallet/))                     return "Bags";
  if (n.match(/shoe|sneaker|boot|sandal|heel|slipper/))                      return "Shoes";
  return "Other";
}

// ─── SUPABASE INSERT ──────────────────────────────────────────────────────────

async function insertProduct(product) {
  const res = await fetch(`${SB_URL}/rest/v1/myshop_products`, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      apikey:          SB_KEY,
      Authorization:   `Bearer ${SB_KEY}`,
      Prefer:          "return=representation",
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  const args    = process.argv.slice(2);
  const catIdx  = args.indexOf("--category");
  const catArg  = catIdx !== -1 ? args[catIdx + 1] : null;
  const seedMode = args.includes("--seed");

  // --seed: iterate all URLs from SEED_PRODUCTS, using per-entry category
  let urls;
  if (seedMode) {
    urls = SEED_PRODUCTS.map((p) => p.url);
    console.log(`\n🌱  Seed mode — ${urls.length} products across all categories\n`);
  } else {
    urls = args.filter((a) => a.startsWith("http"));
  }

  if (!urls.length) {
    console.log("\nUsage:");
    console.log("  node scripts/scrape-product.mjs <url1> [url2 ...] [--category 'Furniture']");
    console.log("  node scripts/scrape-product.mjs --seed\n");
    console.log("Example:");
    console.log('  node scripts/scrape-product.mjs https://www.cjdropshipping.com/product/xxxx --category "Fitness"\n');
    process.exit(1);
  }

  const research    = loadResearchSheet();
  const productsDir = join(__dirname, "../public/products");
  const tmpDir      = join(__dirname, "../.tmp-imgs");
  mkdirSync(productsDir, { recursive: true });
  mkdirSync(tmpDir,      { recursive: true });

  const results = { inserted: [], flagged: [], rejected: [] };

  for (const url of urls) {
    // In seed mode, derive category from SEED_PRODUCTS entry instead of CLI arg
    const seedEntry = seedMode ? SEED_PRODUCTS.find((p) => p.url === url) : null;
    const effectiveCatArg = seedEntry?.category ?? catArg;
    console.log(`\n🔍  ${url}`);

    // 1. Scrape
    let scraped;
    try {
      scraped = await scrapeUrl(url);
    } catch (e) {
      console.error(`    ✗ Scrape error: ${e.message}`);
      results.rejected.push({ url, reason: e.message });
      continue;
    }

    if (!scraped.name) {
      console.log("    ✗ Could not extract product name");
      results.rejected.push({ url, reason: "No name extracted" });
      continue;
    }

    // 2. VERO
    const veroHit = checkVero(scraped.name);
    if (veroHit) {
      console.log(`    ✗ VERO reject — brand "${veroHit}" in name`);
      results.rejected.push({ name: scraped.name, reason: `VERO: ${veroHit}` });
      continue;
    }

    // 3. Research sheet lookup
    const nameTokens  = scraped.name.toLowerCase().split(/\s+/);
    const researchHit = [...research.entries()].find(([k]) =>
      nameTokens.some((t) => t.length > 3 && k.includes(t))
    );
    const demand = researchHit?.[1];

    // Flag if Bad rating AND low sales
    if (demand?.rating === "Bad" && demand.totalSales < 50000) {
      console.log(`    ⚠ Flagged — Bad rating (sales: ${demand.totalSales}): ${scraped.name}`);
      results.flagged.push({ name: scraped.name, url, totalSales: demand.totalSales });
      continue;
    }

    // 4. Category
    const category = effectiveCatArg || demand?.sheetCategory?.trim() || guessCategory(scraped.name);

    // 5. Slug + Image
    const slug    = toSlug(scraped.name);
    let imageUrl  = "/hero/hero-1.jpg";

    // 5b. Shipping knowledge
    const shipping = getSupplierShipping(url);

    if (scraped.imageUrl) {
      try {
        const tmpPath   = join(tmpDir, `${slug}-tmp`);
        const finalPath = join(productsDir, `${slug}.jpg`);
        await downloadImage(scraped.imageUrl, tmpPath);
        compressImage(tmpPath, finalPath);
        // Upload to Supabase Storage and use that URL if successful
        const storageUrl = await uploadImageToSupabase(finalPath, slug);
        imageUrl = storageUrl || `/products/${slug}.jpg`;
        console.log(`    📸 Image → ${storageUrl ? "Supabase Storage" : `public/products/${slug}.jpg`}`);
      } catch (e) {
        console.log(`    ⚠ Image failed (${e.message}) — using placeholder`);
      }
    }

    // 6. Price
    const rawUsd  = scraped.price || (demand?.avgPrice ? parseFloat(demand.avgPrice) : 15);
    const { price: priceJmd, pct: markupPct } = calcPriceJmd(rawUsd, category);

    // 7. Insert
    const variants = (scraped.variants || []).filter((v) => v.options.length > 1);
    const product = {
      name:              scraped.name,
      slug,
      description:       scraped.desc || `Premium ${scraped.name}. Fast delivery across Jamaica.`,
      price_jmd:         priceJmd,
      category,
      image_url:         imageUrl,
      stock:             50,
      active:            true,
      variants:          variants.length ? variants : [],
      shipping_info:     { options: shipping.options },
      free_delivery:     shipping.freeDelivery,
      delivery_days_min: shipping.defaultMin,
      delivery_days_max: shipping.defaultMax,
      supplier_url:      url,
      supplier_name:     shipping.supplierName,
      cost_usd:          rawUsd,
      markup_pct:        markupPct,
      is_promo:          false,
      promo_price_jmd:   null,
      promo_ends_at:     null,
    };
    if (variants.length) {
      console.log(`    🎨 Variants: ${variants.map((v) => `${v.label}(${v.options.length})`).join(", ")}`);
    }

    try {
      await insertProduct(product);
      console.log(`    ✓ Inserted — ${scraped.name} · J$${priceJmd.toLocaleString()} · ${category}`);
      results.inserted.push({ name: scraped.name, priceJmd, category });
    } catch (e) {
      console.error(`    ✗ Insert failed: ${e.message}`);
      results.rejected.push({ name: scraped.name, reason: e.message });
    }
  }

  // Final report
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✓ Inserted  (${results.inserted.length}):  ${results.inserted.map((p) => p.name).join(", ") || "—"}`);
  console.log(`⚠ Flagged   (${results.flagged.length}):  ${results.flagged.map((p) => p.name).join(", ")  || "—"}`);
  console.log(`✗ Rejected  (${results.rejected.length}):  ${results.rejected.map((p) => p.name || p.url).join(", ") || "—"}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function parseEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split("\n")
      .filter((l) => l.includes("=") && !l.startsWith("#"))
      .map((l) => [l.split("=")[0].trim(), l.split("=").slice(1).join("=").trim()])
  );
}

main().catch(console.error);
