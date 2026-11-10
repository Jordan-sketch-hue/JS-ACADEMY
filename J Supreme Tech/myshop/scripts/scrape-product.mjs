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

puppeteer.use(StealthPlugin());

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const MARGIN    = 1.35;    // 35% markup — change this to adjust all prices
const JMD_RATE  = 157;     // USD → JMD rate (update monthly)
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

function calcPriceJmd(usdPrice) {
  const raw = usdPrice * JMD_RATE * MARGIN;
  return Math.round(raw / 100) * 100; // nearest J$100
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-").slice(0,60);
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

// — Tier 1 scrapers —

async function scrapeCJ(page) {
  return page.evaluate(() => ({
    name:     document.querySelector(".product-title, h1")?.textContent?.trim(),
    desc:     document.querySelector(".product-desc, .description")?.textContent?.trim()?.slice(0,500),
    price:    parseFloat(document.querySelector(".price, .product-price")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
    imageUrl: document.querySelector(".product-img img, .swiper-slide img")?.src,
  }));
}

async function scrapeAli(page) {
  return page.evaluate(() => ({
    name:     document.querySelector("h1")?.textContent?.trim(),
    desc:     document.querySelector("[class*='description']")?.textContent?.trim()?.slice(0,500),
    price:    parseFloat(document.querySelector("[class*='price'] span")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
    imageUrl: document.querySelector(".magnifier-image, [class*='gallery'] img")?.src,
  }));
}

async function scrapeDHgate(page) {
  return page.evaluate(() => ({
    name:     document.querySelector(".product-title-wrap h1, h1.product-name")?.textContent?.trim(),
    desc:     document.querySelector(".product-description")?.textContent?.trim()?.slice(0,500),
    price:    parseFloat(document.querySelector(".price-now, .sale-price")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
    imageUrl: document.querySelector(".main-img img, .item-gallery img")?.src,
  }));
}

async function scrapeBanggood(page) {
  return page.evaluate(() => ({
    name:     document.querySelector("h1")?.textContent?.trim(),
    desc:     document.querySelector(".product-description-block")?.textContent?.trim()?.slice(0,500),
    price:    parseFloat(document.querySelector(".main-price, .now-price")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
    imageUrl: document.querySelector(".imgs-box img")?.src,
  }));
}

// — Tier 2 scrapers (stealth handled by puppeteer-extra-plugin-stealth) —

async function scrapeAmazon(page) {
  await page.waitForSelector("#productTitle", { timeout: 10000 }).catch(() => {});
  return page.evaluate(() => ({
    name:     document.querySelector("#productTitle")?.textContent?.trim(),
    desc:     document.querySelector("#feature-bullets li:first-child")?.textContent?.trim()?.slice(0,500),
    price:    parseFloat(document.querySelector(".a-price-whole")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
    imageUrl: document.querySelector("#landingImage, #imgBlkFront")?.src,
  }));
}

async function scrapeWalmart(page) {
  await page.waitForSelector("h1", { timeout: 10000 }).catch(() => {});
  return page.evaluate(() => ({
    name:     document.querySelector("h1")?.textContent?.trim(),
    desc:     document.querySelector("[data-testid='product-description']")?.textContent?.trim()?.slice(0,500),
    price:    parseFloat(document.querySelector("[itemprop='price']")?.getAttribute("content") || "0"),
    imageUrl: document.querySelector("[data-testid='hero-image'] img")?.src,
  }));
}

async function scrapeTarget(page) {
  await page.waitForSelector("h1[data-test='product-title']", { timeout: 10000 }).catch(() => {});
  return page.evaluate(() => ({
    name:     document.querySelector("h1[data-test='product-title']")?.textContent?.trim(),
    desc:     document.querySelector("[data-test='item-details-description']")?.textContent?.trim()?.slice(0,500),
    price:    parseFloat(document.querySelector("[data-test='product-price']")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
    imageUrl: document.querySelector("[data-test='product-image'] img")?.src,
  }));
}

async function scrapeWayfair(page) {
  return page.evaluate(() => ({
    name:     document.querySelector("h1")?.textContent?.trim(),
    desc:     document.querySelector("[data-enzyme-id='ProductDetailDescription']")?.textContent?.trim()?.slice(0,500),
    price:    parseFloat(document.querySelector(".BasePriceBlock, .SalePrice")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
    imageUrl: document.querySelector(".MediaCarousel img, .Image__Element img")?.src,
  }));
}

async function scrapeHomeDepot(page) {
  return page.evaluate(() => ({
    name:     document.querySelector("h1")?.textContent?.trim(),
    desc:     document.querySelector(".product-description__content")?.textContent?.trim()?.slice(0,500),
    price:    parseFloat(document.querySelector("[itemprop='price']")?.getAttribute("content") || document.querySelector(".price__numbers")?.textContent?.replace(/[^0-9.]/g,"") || "0"),
    imageUrl: document.querySelector(".mediagallery__mainimage img")?.src,
  }));
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
  const urls    = args.filter((a) => a.startsWith("http"));

  if (!urls.length) {
    console.log("\nUsage:");
    console.log("  node scripts/scrape-product.mjs <url1> [url2 ...] [--category 'Furniture']\n");
    console.log("Example:");
    console.log('  node scripts/scrape-product.mjs https://www.cjdropshipping.com/product/xxxx https://www.amazon.com/dp/xxxx --category "Fitness"\n');
    process.exit(1);
  }

  const research    = loadResearchSheet();
  const productsDir = join(__dirname, "../public/products");
  const tmpDir      = join(__dirname, "../.tmp-imgs");
  mkdirSync(productsDir, { recursive: true });
  mkdirSync(tmpDir,      { recursive: true });

  const results = { inserted: [], flagged: [], rejected: [] };

  for (const url of urls) {
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
    const category = catArg || demand?.sheetCategory?.trim() || guessCategory(scraped.name);

    // 5. Slug + Image
    const slug    = toSlug(scraped.name);
    let imageUrl  = "/hero/hero-1.jpg";

    if (scraped.imageUrl) {
      try {
        const tmpPath   = join(tmpDir, `${slug}-tmp`);
        const finalPath = join(productsDir, `${slug}.jpg`);
        await downloadImage(scraped.imageUrl, tmpPath);
        compressImage(tmpPath, finalPath);
        imageUrl = `/products/${slug}.jpg`;
        console.log(`    📸 Image → public/products/${slug}.jpg`);
      } catch (e) {
        console.log(`    ⚠ Image failed (${e.message}) — using placeholder`);
      }
    }

    // 6. Price
    const rawUsd  = scraped.price || (demand?.avgPrice ? parseFloat(demand.avgPrice) : 15);
    const priceJmd = calcPriceJmd(rawUsd);

    // 7. Insert
    const product = {
      name:        scraped.name,
      slug,
      description: scraped.desc || `Premium ${scraped.name}. Fast delivery across Jamaica.`,
      price_jmd:   priceJmd,
      category,
      image_url:   imageUrl,
      stock:       50,
      active:      true,
    };

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
