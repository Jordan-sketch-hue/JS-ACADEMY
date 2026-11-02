/**
 * TechP2 Lead Scraper
 * Targets: Jamaica Yellow Pages, BusinessFinda JA, Jamaica Business Directory
 * Parishes: St. Ann, Portland, St. Mary, St. Thomas
 * Categories: Agriculture, Hardware
 */
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ScrapedLead {
  business_name: string;
  phone?: string;
  email?: string;
  address?: string;
  parish: string;
  category: "Agriculture" | "Hardware" | "Both";
  business_type?: string;
  source_url?: string;
  current_supplier?: string;
}

const PARISHES = ["St. Ann", "Portland", "St. Mary", "St. Thomas"];

// ─── Jamaica Yellow Pages ────────────────────────────────────────────
const YP_BASE = "https://www.yellowpagesja.com";

const YP_SEARCHES = [
  // Agriculture
  { query: "agricultural+supplies", cat: "Agriculture" as const },
  { query: "farm+supplies", cat: "Agriculture" as const },
  { query: "fertilizer+suppliers", cat: "Agriculture" as const },
  { query: "seeds+nursery", cat: "Agriculture" as const },
  { query: "irrigation+supplies", cat: "Agriculture" as const },
  { query: "farm+equipment", cat: "Agriculture" as const },
  { query: "livestock+supplies", cat: "Agriculture" as const },
  { query: "pesticides+agrochemicals", cat: "Agriculture" as const },
  { query: "greenhouse+supplies", cat: "Agriculture" as const },
  // Hardware
  { query: "hardware+store", cat: "Hardware" as const },
  { query: "building+materials", cat: "Hardware" as const },
  { query: "plumbing+supplies", cat: "Hardware" as const },
  { query: "electrical+supplies", cat: "Hardware" as const },
  { query: "tools+equipment", cat: "Hardware" as const },
  { query: "paint+supplies", cat: "Hardware" as const },
  { query: "roofing+materials", cat: "Hardware" as const },
  { query: "construction+supplies", cat: "Hardware" as const },
  { query: "lumber+timber", cat: "Hardware" as const },
];

async function scrapeYellowPages(
  browser: puppeteer.Browser,
  query: string,
  parish: string,
  category: "Agriculture" | "Hardware" | "Both"
): Promise<ScrapedLead[]> {
  const leads: ScrapedLead[] = [];
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
  );

  try {
    const searchUrl = `${YP_BASE}/search?q=${query}&location=${encodeURIComponent(parish)}`;
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    const html = await page.content();
    const $ = cheerio.load(html);

    // Yellow Pages JA listing selectors
    $(".listing, .business-listing, .result-item, .yp-listing").each((_, el) => {
      const name = $(el).find(".business-name, .listing-name, h2, h3").first().text().trim();
      const phone = $(el).find(".phone, .tel, [href^='tel:']").first().text().trim()
        || $(el).find("[href^='tel:']").attr("href")?.replace("tel:", "");
      const address = $(el).find(".address, .location").first().text().trim();
      const email = $(el).find("[href^='mailto:']").attr("href")?.replace("mailto:", "");

      if (name && name.length > 2) {
        leads.push({
          business_name: name,
          phone: phone?.replace(/\D/g, "").slice(-10) ? `(${phone?.replace(/\D/g, "").slice(-10, -7)})${phone?.replace(/\D/g, "").slice(-7, -4)}-${phone?.replace(/\D/g, "").slice(-4)}` : phone,
          email,
          address,
          parish,
          category,
          source_url: searchUrl,
        });
      }
    });

    // Also try paginated results
    const pages = await page.$$(".pagination a, .page-link");
    for (let i = 0; i < Math.min(pages.length, 5); i++) {
      try {
        await pages[i].click();
        await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 });
        const html2 = await page.content();
        const $2 = cheerio.load(html2);
        $2(".listing, .business-listing, .result-item").each((_, el) => {
          const name = $2(el).find(".business-name, h2, h3").first().text().trim();
          const phone = $2(el).find(".phone, [href^='tel:']").first().text().trim();
          if (name) leads.push({ business_name: name, phone, parish, category, source_url: page.url() });
        });
      } catch {/* continue */}
    }
  } catch (err) {
    console.warn(`YP scrape failed for ${query}/${parish}:`, (err as Error).message);
  } finally {
    await page.close();
  }

  return leads;
}

// ─── BusinessFinda JA ─────────────────────────────────────────────────
async function scrapeBusinessFinda(
  browser: puppeteer.Browser,
  category: string,
  parish: string,
  catType: "Agriculture" | "Hardware" | "Both"
): Promise<ScrapedLead[]> {
  const leads: ScrapedLead[] = [];
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

  try {
    const url = `https://www.businessfinda.com/jamaica/search?q=${encodeURIComponent(category)}&where=${encodeURIComponent(parish)}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    const html = await page.content();
    const $ = cheerio.load(html);

    $(".business-card, .listing-card, .company-item, article").each((_, el) => {
      const name = $(el).find("h2, h3, .name, .title").first().text().trim();
      const phone = $(el).find(".phone, [href^='tel:']").first().text().trim();
      const email = $(el).find("[href^='mailto:']").attr("href")?.replace("mailto:", "");
      const address = $(el).find(".address").first().text().trim();
      if (name && name.length > 2) {
        leads.push({ business_name: name, phone, email, address, parish, category: catType, source_url: url });
      }
    });
  } catch (err) {
    console.warn(`BusinessFinda scrape failed:`, (err as Error).message);
  } finally {
    await page.close();
  }

  return leads;
}

// ─── Jamaica Business Directory ───────────────────────────────────────
async function scrapeJamaicaBizDir(
  browser: puppeteer.Browser,
  keyword: string,
  parish: string,
  catType: "Agriculture" | "Hardware" | "Both"
): Promise<ScrapedLead[]> {
  const leads: ScrapedLead[] = [];
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36");

  try {
    const url = `https://jamaica-business-directory.com/?s=${encodeURIComponent(keyword + " " + parish)}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    const html = await page.content();
    const $ = cheerio.load(html);

    $(".post, .listing, .entry").each((_, el) => {
      const name = $(el).find("h2, h3, .entry-title").first().text().trim();
      const phone = $(el).find(".phone").text().trim();
      if (name && name.length > 2) {
        leads.push({ business_name: name, phone, parish, category: catType, source_url: url });
      }
    });
  } catch (err) {
    console.warn("JaBizDir failed:", (err as Error).message);
  } finally {
    await page.close();
  }

  return leads;
}

// ─── Google Maps fallback (Places-style search) ───────────────────────
async function scrapeGoogleMaps(
  browser: puppeteer.Browser,
  keyword: string,
  parish: string,
  catType: "Agriculture" | "Hardware" | "Both"
): Promise<ScrapedLead[]> {
  const leads: ScrapedLead[] = [];
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0");

  try {
    const q = encodeURIComponent(`${keyword} ${parish} Jamaica`);
    await page.goto(`https://www.google.com/maps/search/${q}`, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    await new Promise(r => setTimeout(r, 3000));

    // Scroll to load more results
    for (let i = 0; i < 8; i++) {
      await page.evaluate(() => {
        const feed = document.querySelector('[role="feed"]');
        if (feed) feed.scrollTop += 800;
      });
      await new Promise(r => setTimeout(r, 1000));
    }

    const html = await page.content();
    const $ = cheerio.load(html);

    // Maps result cards
    $('[data-result-index], .Nv2PK, .lI9IFe').each((_, el) => {
      const name = $(el).find('.qBF1Pd, .NrDZNb, [aria-label]').first().text().trim()
        || $(el).attr("aria-label")?.trim();
      const phone = $(el).find('.zdFBNc, [data-dtype="d3ph"]').text().trim();
      const address = $(el).find('.W4Efsd, .rllt__details').first().text().trim();
      if (name && name.length > 2) {
        leads.push({
          business_name: name,
          phone: phone || undefined,
          address: address || undefined,
          parish,
          category: catType,
          business_type: keyword,
          source_url: page.url(),
        });
      }
    });
  } catch (err) {
    console.warn("Google Maps scrape failed:", (err as Error).message);
  } finally {
    await page.close();
  }

  return leads;
}

// ─── B2B enrichment ───────────────────────────────────────────────────
function enrichB2B(lead: ScrapedLead): Partial<ScrapedLead> & {
  priority: string;
  size: string;
  b2b_score: number;
} {
  let score = 0;
  if (lead.phone) score += 30;
  if (lead.email) score += 25;
  if (lead.address) score += 15;

  // Size heuristics from business name
  const nameLower = lead.business_name.toLowerCase();
  let size = "Small";
  if (/(co-op|cooperative|group|enterprise|limited|ltd|jamaica|national)/.test(nameLower)) {
    size = "Large"; score += 20;
  } else if (/(trading|supplies|distributors|wholesale|depot)/.test(nameLower)) {
    size = "Medium"; score += 10;
  }

  // Category-specific B2B signals
  const agriSignals = ["farm", "agro", "agricultural", "nursery", "plantation", "crop", "livestock"];
  const hwSignals = ["hardware", "building", "construction", "lumber", "plumbing", "electrical", "paint"];
  const isAgri = agriSignals.some(s => nameLower.includes(s));
  const isHw = hwSignals.some(s => nameLower.includes(s));
  if (isAgri || isHw) score += 10;

  const priority = score >= 60 ? "High" : score >= 35 ? "Medium" : "Low";
  return { ...lead, priority, size, b2b_score: score };
}

// ─── Dedup + upsert ───────────────────────────────────────────────────
async function upsertLeads(leads: ScrapedLead[]) {
  const enriched = leads.map(enrichB2B);
  let inserted = 0;
  let skipped = 0;

  for (const lead of enriched) {
    // Dedup by phone or business name + parish
    const query = lead.phone
      ? supabase.from("tp2_leads").select("id").eq("phone", lead.phone)
      : supabase.from("tp2_leads").select("id")
          .eq("business_name", lead.business_name)
          .eq("parish", lead.parish);

    const { data: existing } = await query;
    if (existing && existing.length > 0) { skipped++; continue; }

    const { error } = await supabase.from("tp2_leads").insert({
      business_name: lead.business_name,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      parish: lead.parish as any,
      category: lead.category,
      business_type: lead.business_type,
      status: "New",
      priority: (lead as any).priority || "Medium",
      size: (lead as any).size || "Small",
      source: "Online",
      follow_up_required: false,
    });

    if (!error) inserted++;
    else console.warn("Insert error:", error.message, "for", lead.business_name);
  }

  return { inserted, skipped };
}

// ─── Main ─────────────────────────────────────────────────────────────
async function main() {
  console.log("🌾 TechP2 Lead Scraper — Agriculture & Hardware JA\n");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const allLeads: ScrapedLead[] = [];
  let total = 0;

  for (const parish of PARISHES) {
    console.log(`\n📍 Scraping ${parish}...`);

    for (const { query, cat } of YP_SEARCHES) {
      const leads = await scrapeYellowPages(browser, query, parish, cat);
      allLeads.push(...leads);
      if (leads.length) console.log(`  YP: ${query} → ${leads.length} results`);
    }

    for (const [kw, cat] of [
      ["agricultural supplies", "Agriculture"],
      ["farm supplies", "Agriculture"],
      ["hardware store", "Hardware"],
      ["building materials", "Hardware"],
      ["fertilizer", "Agriculture"],
      ["tools equipment", "Hardware"],
    ] as [string, "Agriculture" | "Hardware"][]) {
      const bf = await scrapeBusinessFinda(browser, kw, parish, cat);
      allLeads.push(...bf);
      const jb = await scrapeJamaicaBizDir(browser, kw, parish, cat);
      allLeads.push(...jb);
      const gm = await scrapeGoogleMaps(browser, kw, parish, cat);
      allLeads.push(...gm);
      if (bf.length + jb.length + gm.length)
        console.log(`  ${kw}: BF=${bf.length} JBD=${jb.length} Maps=${gm.length}`);
    }
  }

  await browser.close();

  console.log(`\n📊 Total scraped: ${allLeads.length} (before dedup)`);

  // Save raw to JSON as backup
  const out = path.join(process.cwd(), "scripts", `leads-raw-${Date.now()}.json`);
  fs.writeFileSync(out, JSON.stringify(allLeads, null, 2));
  console.log(`💾 Raw backup: ${out}`);

  // Upsert to Supabase
  const { inserted, skipped } = await upsertLeads(allLeads);
  console.log(`\n✅ Inserted: ${inserted} | Skipped (dupes): ${skipped}`);
  console.log("🎯 Done. Check your TechP2 CRM dashboard.");
}

main().catch(console.error);
