/**
 * TechP2 Lead Scraper - Parish-Validated
 * Searches specific towns per parish, validates address, confirms (876) phone
 * Target: 500+ leads per parish
 */
import puppeteer, { type Browser } from "puppeteer";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ScrapedLead {
  business_name: string;
  phone: string;
  address?: string;
  parish: string;
  category: "Agriculture" | "Hardware" | "Both";
  business_type?: string;
}

// Parish towns for validated searching
const PARISH_TOWNS: Record<string, string[]> = {
  "St. Ann": [
    "Ocho Rios", "St Ann's Bay", "Runaway Bay", "Brown's Town", "Claremont",
    "Lime Hall", "Moneague", "Discovery Bay", "Priory", "Steer Town"
  ],
  "Portland": [
    "Port Antonio", "Buff Bay", "Hope Bay", "Annotto Bay Portland", "Fellowship Portland",
    "Manchioneal", "Long Bay Portland", "Fairy Hill", "Moore Town", "Windsor"
  ],
  "St. Mary": [
    "Port Maria", "Oracabessa", "Annotto Bay", "Highgate", "Gayle",
    "Castleton", "Richmond", "Islington", "Boscobel", "Robins Bay"
  ],
  "St. Thomas": [
    "Morant Bay", "Port Morant", "Yallahs", "Bath St Thomas", "Seaforth",
    "Cedar Valley", "Llandewey", "Trinityville", "White Horses", "Duckenfield"
  ]
};

// Town -> parish lookup for address validation
const TOWN_PARISH: Record<string, string> = {};
for (const [parish, towns] of Object.entries(PARISH_TOWNS)) {
  for (const town of towns) {
    const key = town.toLowerCase().replace(" portland", "").replace(" st thomas", "");
    TOWN_PARISH[key] = parish;
  }
}

// Also accept full parish name in address
const PARISH_ALIASES: Record<string, string[]> = {
  "St. Ann": ["st. ann", "saint ann", "st ann"],
  "Portland": ["portland"],
  "St. Mary": ["st. mary", "saint mary", "st mary"],
  "St. Thomas": ["st. thomas", "saint thomas", "st thomas"]
};

function validateParishFromAddress(address: string, expectedParish: string): boolean {
  if (!address) return true; // no address = can't reject
  const addr = address.toLowerCase();
  
  // Check if any other parish is explicitly mentioned
  for (const [parish, aliases] of Object.entries(PARISH_ALIASES)) {
    if (parish !== expectedParish) {
      for (const alias of aliases) {
        if (addr.includes(alias)) return false; // Wrong parish mentioned
      }
    }
  }
  
  // Kingston / corporate area markers = reject
  const kingstonMarkers = ["kingston", "halfway tree", "cross roads", "new kingston", "portmore", "spanish town", "clarendon", "manchester", "westmoreland", "hanover", "trelawny"];
  for (const m of kingstonMarkers) {
    if (addr.includes(m)) return false;
  }
  
  return true;
}

const AGRI_KEYWORDS = [
  "agricultural supplies", "farm supplies", "fertilizer shop", "seeds nursery",
  "agro chemical", "farm equipment dealer", "livestock supplies", "crop supplies",
  "irrigation supplies", "greenhouse supplies", "plant nursery", "farmers supplies"
];

const HW_KEYWORDS = [
  "hardware store", "building materials", "lumber yard", "plumbing supplies",
  "electrical supplies", "paint store", "roofing materials", "construction supplies",
  "tools and equipment", "cement supplier", "steel supplier", "tiles supplier"
];

async function scrapeGoogleMaps(
  browser: Browser,
  keyword: string,
  town: string,
  parish: string,
  catType: "Agriculture" | "Hardware"
): Promise<ScrapedLead[]> {
  const leads: ScrapedLead[] = [];
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36");

  try {
    const q = encodeURIComponent(`${keyword} ${town} Jamaica`);
    await page.goto(`https://www.google.com/maps/search/${q}`, {
      waitUntil: "networkidle2",
      timeout: 35000,
    });
    await new Promise(r => setTimeout(r, 3000));

    // Scroll to load more results - do it more aggressively
    for (let i = 0; i < 15; i++) {
      await page.evaluate(() => {
        const feed = document.querySelector('[role="feed"]');
        if (feed) feed.scrollTop += 1200;
      });
      await new Promise(r => setTimeout(r, 1000));
    }

    const extracted: { name: string; phone: string; address: string }[] = await page.evaluate(() => {
      const results: { name: string; phone: string; address: string }[] = [];
      const cards = document.querySelectorAll('[role="feed"] > div');
      cards.forEach((card: Element) => {
        const nameEl = card.querySelector('a[href*="/maps/place/"]');
        const name = (nameEl as HTMLElement)?.getAttribute("aria-label") || nameEl?.textContent?.trim() || "";
        const cardText = card.textContent || "";
        const phoneMatch = cardText.match(/\(876\)\s*\d{3}[-\s]?\d{4}|\b876[-\s]?\d{3}[-\s]?\d{4}\b/);
        const phone = phoneMatch ? phoneMatch[0] : "";
        const spans = Array.from(card.querySelectorAll("span"));
        const addrSpan = spans.find((s: Element) =>
          /\d+\s+\w+|Main St|Rd|Ave|Blvd|Dr|Ln|Hwy|Street|Road|Avenue|Plaza|Centre/i.test(s.textContent || "")
        );
        const address = addrSpan?.textContent?.trim() || "";
        if (name && name.length > 2 && phone) results.push({ name, phone, address });
      });
      return results;
    });

    let inserted = 0;
    for (const r of extracted) {
      if (!r.phone) continue;
      if (!validateParishFromAddress(r.address, parish)) {
        console.log(`    REJECTED (wrong parish): ${r.name} | ${r.address}`);
        continue;
      }
      leads.push({
        business_name: r.name,
        phone: r.phone,
        address: r.address || undefined,
        parish,
        category: catType,
        business_type: keyword,
      });
      inserted++;
    }

    console.log(`    ${keyword} / ${town}: ${extracted.length} cards, ${inserted} valid with (876) phone`);
  } catch (err) {
    console.warn(`Maps failed: ${(err as Error).message}`);
  } finally {
    await page.close();
  }

  return leads;
}

async function upsertLeads(leads: ScrapedLead[]) {
  let inserted = 0;
  let skipped = 0;

  for (const lead of leads) {
    const { data: existing } = await supabase
      .from("tp2_leads")
      .select("id")
      .eq("phone", lead.phone);

    if (existing && existing.length > 0) { skipped++; continue; }

    const nameLower = lead.business_name.toLowerCase();
    let size = "Small";
    let score = 50;
    if (/(co-op|cooperative|limited|ltd|national|group|enterprise)/.test(nameLower)) { size = "Large"; score = 70; }
    else if (/(trading|supplies|distributors|wholesale|depot)/.test(nameLower)) { size = "Medium"; score = 60; }
    const priority = score >= 65 ? "High" : score >= 55 ? "Medium" : "Low";

    const { error } = await supabase.from("tp2_leads").insert({
      business_name: lead.business_name,
      phone: lead.phone,
      address: lead.address,
      parish: lead.parish as any,
      category: lead.category,
      business_type: lead.business_type,
      status: "New",
      priority,
      size,
      source: "Online",
      follow_up_required: false,
    });

    if (!error) inserted++;
    else if (!error.message?.includes("duplicate")) console.warn("Insert:", error.message, lead.business_name);
  }

  return { inserted, skipped };
}

async function main() {
  console.log("TechP2 Parish-Validated Scraper\n");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const allLeads: ScrapedLead[] = [];
  let totalInserted = 0;
  let totalSkipped = 0;

  for (const [parish, towns] of Object.entries(PARISH_TOWNS)) {
    console.log(`\nParish: ${parish} (${towns.length} towns)`);

    for (const town of towns) {
      console.log(`  Town: ${town}`);
      // Agri keywords
      for (const kw of AGRI_KEYWORDS) {
        const leads = await scrapeGoogleMaps(browser, kw, town, parish, "Agriculture");
        allLeads.push(...leads);
      }
      // HW keywords
      for (const kw of HW_KEYWORDS) {
        const leads = await scrapeGoogleMaps(browser, kw, town, parish, "Hardware");
        allLeads.push(...leads);
      }

      // Upsert after each town to save progress
      const { inserted, skipped } = await upsertLeads(allLeads.splice(0));
      totalInserted += inserted;
      totalSkipped += skipped;
      console.log(`  => Town done: +${inserted} inserted (${skipped} dupes) | Total: ${totalInserted}`);
    }

    // Check count per parish
    const { count } = await supabase
      .from("tp2_leads")
      .select("*", { count: "exact", head: true })
      .eq("parish", parish);
    console.log(`  === ${parish}: ${count} leads total ===`);
  }

  await browser.close();

  const out = path.join(process.cwd(), "scripts", `leads-validated-${Date.now()}.json`);
  console.log(`\nTotal inserted: ${totalInserted} | Skipped dupes: ${totalSkipped}`);
  console.log("Done.");
}

main().catch(console.error);
