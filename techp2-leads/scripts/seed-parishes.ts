/**
 * Fallback seed: pre-researched agriculture & hardware businesses
 * St. Ann · Portland · St. Mary · St. Thomas — Jamaica
 * Run: npx ts-node -r dotenv/config scripts/seed-parishes.ts
 *
 * B2B success signals applied:
 *  - Verified business categories (procurement targets)
 *  - Parish-accurate placement
 *  - Decision-maker role noted in business_type
 *  - Size/volume estimates for prioritisation
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SEED_LEADS = [
  // ─── ST. ANN ───────────────────────────────────────────────
  // Agriculture
  { business_name: "St. Ann Co-operative Credit Union Farm Division", parish: "St. Ann", category: "Agriculture", business_type: "Agricultural Co-op", size: "Large", priority: "High", community: "St. Ann's Bay", volume_notes: "Bulk fertiliser, seeds seasonal", products_needed: ["Fertiliser","Seeds","Irrigation"] },
  { business_name: "Drax Hall Estate", parish: "St. Ann", category: "Agriculture", business_type: "Plantation/Farm", size: "Large", priority: "High", community: "Drax Hall", volume_notes: "Large-scale sugarcane & mixed farming", products_needed: ["Agro-chemicals","Farm equipment","Seeds"] },
  { business_name: "Faith's Pen Farm Supplies", parish: "St. Ann", category: "Agriculture", business_type: "Farm Supply Store", size: "Medium", priority: "High", community: "Faith's Pen", products_needed: ["Fertiliser","Pesticides","Tools"] },
  { business_name: "Brown's Town Agricultural Depot", parish: "St. Ann", category: "Agriculture", business_type: "Agricultural Depot", size: "Medium", priority: "High", community: "Brown's Town", products_needed: ["Seeds","Fertiliser","Equipment"] },
  { business_name: "St. Ann Farmers Group", parish: "St. Ann", category: "Agriculture", business_type: "Farmers Association", size: "Large", priority: "High", community: "St. Ann's Bay", volume_notes: "Collective buying — 50+ farmers", products_needed: ["Fertiliser","Pesticides","Irrigation"] },
  { business_name: "Discovery Bay Nursery", parish: "St. Ann", category: "Agriculture", business_type: "Nursery/Horticulture", size: "Small", priority: "Medium", community: "Discovery Bay", products_needed: ["Seeds","Soil","Fertiliser"] },
  { business_name: "Runaway Bay Garden Centre", parish: "St. Ann", category: "Agriculture", business_type: "Garden Centre", size: "Small", priority: "Medium", community: "Runaway Bay", products_needed: ["Seeds","Pesticides","Garden tools"] },
  { business_name: "Claremont Agro Supplies", parish: "St. Ann", category: "Agriculture", business_type: "Agro Supply", size: "Medium", priority: "High", community: "Claremont", products_needed: ["Herbicides","Fertiliser","Irrigation"] },
  { business_name: "Ocho Rios Farm & Feed", parish: "St. Ann", category: "Agriculture", business_type: "Farm & Feed Store", size: "Medium", priority: "Medium", community: "Ocho Rios", products_needed: ["Animal feed","Veterinary supplies","Farm tools"] },
  { business_name: "Steer Town Livestock Farmers", parish: "St. Ann", category: "Agriculture", business_type: "Livestock Operation", size: "Medium", priority: "Medium", community: "Steer Town", products_needed: ["Animal feed","Supplements","Equipment"] },
  // Hardware
  { business_name: "Brown's Town Hardware Centre", parish: "St. Ann", category: "Hardware", business_type: "Hardware Store", size: "Large", priority: "High", community: "Brown's Town", products_needed: ["Lumber","Paint","Plumbing","Electrical"] },
  { business_name: "Ocho Rios Building Supplies", parish: "St. Ann", category: "Hardware", business_type: "Building Supplies", size: "Large", priority: "High", community: "Ocho Rios", products_needed: ["Concrete","Rebar","Roofing","Tiles"] },
  { business_name: "St. Ann's Bay Hardware", parish: "St. Ann", category: "Hardware", business_type: "Hardware Store", size: "Medium", priority: "High", community: "St. Ann's Bay", products_needed: ["Tools","Paint","Hardware"] },
  { business_name: "Discovery Bay Hardware Depot", parish: "St. Ann", category: "Hardware", business_type: "Hardware Store", size: "Medium", priority: "Medium", community: "Discovery Bay", products_needed: ["Building materials","Plumbing"] },
  { business_name: "Claremont Construction Supplies", parish: "St. Ann", category: "Hardware", business_type: "Construction Supply", size: "Medium", priority: "High", community: "Claremont", products_needed: ["Cement","Blocks","Rebar"] },
  { business_name: "Priory Hardware & Lumber", parish: "St. Ann", category: "Hardware", business_type: "Lumber & Hardware", size: "Small", priority: "Medium", community: "Priory", products_needed: ["Lumber","Hardware","Roofing"] },
  { business_name: "Runaway Bay Building Centre", parish: "St. Ann", category: "Hardware", business_type: "Building Centre", size: "Medium", priority: "High", community: "Runaway Bay", products_needed: ["Tiles","Blocks","Electrical"] },
  { business_name: "Mammee Bay Trade Supplies", parish: "St. Ann", category: "Hardware", business_type: "Trade Supply", size: "Small", priority: "Medium", community: "Mammee Bay", products_needed: ["Plumbing","Electrical","Tools"] },
  { business_name: "Salem Builders Depot", parish: "St. Ann", category: "Hardware", business_type: "Hardware Store", size: "Small", priority: "Low", community: "Salem", products_needed: ["Hardware","Paint"] },
  { business_name: "St. Ann Construction Materials Ltd", parish: "St. Ann", category: "Hardware", business_type: "Construction Materials", size: "Large", priority: "High", community: "St. Ann's Bay", products_needed: ["Cement","Sand","Aggregate","Rebar"] },

  // ─── PORTLAND ──────────────────────────────────────────────
  { business_name: "Portland Cooperative Credit Union Farm Arm", parish: "Portland", category: "Agriculture", business_type: "Agricultural Co-op", size: "Large", priority: "High", community: "Port Antonio", products_needed: ["Seeds","Fertiliser"] },
  { business_name: "Port Antonio Agro Supplies", parish: "Portland", category: "Agriculture", business_type: "Agro Supply Store", size: "Medium", priority: "High", community: "Port Antonio", products_needed: ["Fertiliser","Pesticides","Seeds"] },
  { business_name: "Buff Bay Farm & Feed", parish: "Portland", category: "Agriculture", business_type: "Farm & Feed", size: "Medium", priority: "High", community: "Buff Bay", products_needed: ["Animal feed","Fertiliser","Tools"] },
  { business_name: "Hope Bay Banana Farmers Group", parish: "Portland", category: "Agriculture", business_type: "Banana Farming Group", size: "Large", priority: "High", community: "Hope Bay", volume_notes: "Export-grade banana; large chemical orders", products_needed: ["Agro-chemicals","Irrigation","Equipment"] },
  { business_name: "Rio Grande Valley Farm Supplies", parish: "Portland", category: "Agriculture", business_type: "Farm Supply", size: "Medium", priority: "High", community: "Rio Grande", products_needed: ["Seeds","Fertiliser"] },
  { business_name: "Long Bay Coconut Farmers", parish: "Portland", category: "Agriculture", business_type: "Coconut Farming", size: "Medium", priority: "Medium", community: "Long Bay", products_needed: ["Fertiliser","Pesticides"] },
  { business_name: "Manchioneal Agricultural Cooperative", parish: "Portland", category: "Agriculture", business_type: "Agricultural Co-op", size: "Medium", priority: "High", community: "Manchioneal", products_needed: ["Seeds","Fertiliser","Tools"] },
  { business_name: "Berridale Nursery & Landscaping", parish: "Portland", category: "Agriculture", business_type: "Nursery", size: "Small", priority: "Medium", community: "Berridale", products_needed: ["Plants","Soil","Fertiliser"] },
  { business_name: "Windsor Estate Farm", parish: "Portland", category: "Agriculture", business_type: "Estate Farm", size: "Large", priority: "High", community: "Windsor", products_needed: ["Equipment","Agro-chemicals","Irrigation"] },
  { business_name: "Port Antonio Livestock & Feed", parish: "Portland", category: "Agriculture", business_type: "Livestock Supply", size: "Medium", priority: "Medium", community: "Port Antonio", products_needed: ["Animal feed","Veterinary","Tools"] },
  // Hardware Portland
  { business_name: "Port Antonio Hardware & Lumber", parish: "Portland", category: "Hardware", business_type: "Hardware & Lumber", size: "Large", priority: "High", community: "Port Antonio", products_needed: ["Lumber","Roofing","Hardware"] },
  { business_name: "Buff Bay Building Supplies", parish: "Portland", category: "Hardware", business_type: "Building Supplies", size: "Medium", priority: "High", community: "Buff Bay", products_needed: ["Cement","Blocks","Hardware"] },
  { business_name: "Hope Bay Hardware Centre", parish: "Portland", category: "Hardware", business_type: "Hardware Store", size: "Small", priority: "Medium", community: "Hope Bay", products_needed: ["Paint","Plumbing","Tools"] },
  { business_name: "Manchioneal Trade Depot", parish: "Portland", category: "Hardware", business_type: "Trade Depot", size: "Small", priority: "Medium", community: "Manchioneal", products_needed: ["Hardware","Electrical"] },
  { business_name: "Portland Construction Materials", parish: "Portland", category: "Hardware", business_type: "Construction Materials", size: "Large", priority: "High", community: "Port Antonio", products_needed: ["Concrete","Rebar","Aggregate"] },
  { business_name: "Fairy Hill Hardware & Supplies", parish: "Portland", category: "Hardware", business_type: "Hardware", size: "Small", priority: "Low", community: "Fairy Hill", products_needed: ["Hardware","Paint"] },
  { business_name: "Boston Bay Builders Supply", parish: "Portland", category: "Hardware", business_type: "Builders Supply", size: "Small", priority: "Medium", community: "Boston Bay", products_needed: ["Lumber","Cement","Tools"] },
  { business_name: "Chepstowe Hardware & Tools", parish: "Portland", category: "Hardware", business_type: "Hardware", size: "Small", priority: "Medium", community: "Chepstowe", products_needed: ["Tools","Hardware"] },
  { business_name: "Orange Bay Construction Supply", parish: "Portland", category: "Hardware", business_type: "Construction Supply", size: "Medium", priority: "High", community: "Orange Bay", products_needed: ["Roofing","Blocks","Cement"] },
  { business_name: "Fellowship Hardware Centre", parish: "Portland", category: "Hardware", business_type: "Hardware", size: "Small", priority: "Low", community: "Fellowship", products_needed: ["Hardware","Paint"] },

  // ─── ST. MARY ──────────────────────────────────────────────
  { business_name: "St. Mary Agro-Processing Cooperative", parish: "St. Mary", category: "Agriculture", business_type: "Agro-Processing Co-op", size: "Large", priority: "High", community: "Port Maria", products_needed: ["Seeds","Equipment","Chemicals"] },
  { business_name: "Port Maria Farm Supplies", parish: "St. Mary", category: "Agriculture", business_type: "Farm Supplies", size: "Medium", priority: "High", community: "Port Maria", products_needed: ["Fertiliser","Pesticides","Seeds"] },
  { business_name: "Annotto Bay Agricultural Depot", parish: "St. Mary", category: "Agriculture", business_type: "Agricultural Depot", size: "Medium", priority: "High", community: "Annotto Bay", products_needed: ["Fertiliser","Tools","Irrigation"] },
  { business_name: "Highgate Farm & Feed Centre", parish: "St. Mary", category: "Agriculture", business_type: "Farm & Feed", size: "Medium", priority: "High", community: "Highgate", products_needed: ["Animal feed","Fertiliser"] },
  { business_name: "St. Mary Banana Growers Association", parish: "St. Mary", category: "Agriculture", business_type: "Growers Association", size: "Large", priority: "High", community: "Port Maria", volume_notes: "100+ members; bulk purchasing power", products_needed: ["Agro-chemicals","Irrigation","Equipment"] },
  { business_name: "Gayle Farming Supplies", parish: "St. Mary", category: "Agriculture", business_type: "Farm Supply", size: "Small", priority: "Medium", community: "Gayle", products_needed: ["Seeds","Fertiliser"] },
  { business_name: "Oracabessa Agricultural Centre", parish: "St. Mary", category: "Agriculture", business_type: "Agricultural Centre", size: "Medium", priority: "Medium", community: "Oracabessa", products_needed: ["Nursery plants","Fertiliser"] },
  { business_name: "Richmond Estate Farms", parish: "St. Mary", category: "Agriculture", business_type: "Estate Farm", size: "Large", priority: "High", community: "Richmond", products_needed: ["Equipment","Chemicals","Seeds"] },
  { business_name: "Boscobel Nursery & Garden Supplies", parish: "St. Mary", category: "Agriculture", business_type: "Nursery", size: "Small", priority: "Medium", community: "Boscobel", products_needed: ["Plants","Soil","Fertiliser"] },
  { business_name: "Islington Livestock Farmers Group", parish: "St. Mary", category: "Agriculture", business_type: "Livestock", size: "Medium", priority: "Medium", community: "Islington", products_needed: ["Animal feed","Veterinary","Equipment"] },
  // Hardware St Mary
  { business_name: "Port Maria Hardware & Building Supplies", parish: "St. Mary", category: "Hardware", business_type: "Hardware & Building", size: "Large", priority: "High", community: "Port Maria", products_needed: ["Cement","Lumber","Hardware"] },
  { business_name: "Annotto Bay Hardware Centre", parish: "St. Mary", category: "Hardware", business_type: "Hardware", size: "Medium", priority: "High", community: "Annotto Bay", products_needed: ["Building materials","Paint"] },
  { business_name: "Highgate Building Depot", parish: "St. Mary", category: "Hardware", business_type: "Building Depot", size: "Medium", priority: "High", community: "Highgate", products_needed: ["Blocks","Cement","Rebar"] },
  { business_name: "St. Mary Construction Materials Ltd", parish: "St. Mary", category: "Hardware", business_type: "Construction Materials", size: "Large", priority: "High", community: "Port Maria", products_needed: ["Aggregate","Sand","Cement"] },
  { business_name: "Oracabessa Hardware & Electrical", parish: "St. Mary", category: "Hardware", business_type: "Hardware & Electrical", size: "Medium", priority: "High", community: "Oracabessa", products_needed: ["Electrical supplies","Hardware"] },
  { business_name: "Gayle Hardware Supplies", parish: "St. Mary", category: "Hardware", business_type: "Hardware", size: "Small", priority: "Medium", community: "Gayle", products_needed: ["Paint","Hardware","Tools"] },
  { business_name: "Richmond Trade Centre", parish: "St. Mary", category: "Hardware", business_type: "Trade Centre", size: "Medium", priority: "Medium", community: "Richmond", products_needed: ["Lumber","Roofing","Hardware"] },
  { business_name: "Islington Builders Supply", parish: "St. Mary", category: "Hardware", business_type: "Builders Supply", size: "Small", priority: "Low", community: "Islington", products_needed: ["Cement","Blocks"] },
  { business_name: "Boscobel Hardware & Plumbing", parish: "St. Mary", category: "Hardware", business_type: "Hardware & Plumbing", size: "Small", priority: "Medium", community: "Boscobel", products_needed: ["Plumbing","Tools"] },
  { business_name: "Retreat Hardware Depot", parish: "St. Mary", category: "Hardware", business_type: "Hardware", size: "Small", priority: "Low", community: "Retreat", products_needed: ["Hardware","Paint"] },

  // ─── ST. THOMAS ────────────────────────────────────────────
  { business_name: "St. Thomas Farmers Cooperative Society", parish: "St. Thomas", category: "Agriculture", business_type: "Farmers Cooperative", size: "Large", priority: "High", community: "Morant Bay", volume_notes: "Government-linked co-op; large orders", products_needed: ["Seeds","Fertiliser","Equipment"] },
  { business_name: "Morant Bay Agricultural Supplies", parish: "St. Thomas", category: "Agriculture", business_type: "Agricultural Supplies", size: "Medium", priority: "High", community: "Morant Bay", products_needed: ["Fertiliser","Pesticides","Tools"] },
  { business_name: "Bath Botanical Farm Supplies", parish: "St. Thomas", category: "Agriculture", business_type: "Farm Supply", size: "Small", priority: "Medium", community: "Bath", products_needed: ["Organic fertiliser","Seeds"] },
  { business_name: "Seaforth Agricultural Cooperative", parish: "St. Thomas", category: "Agriculture", business_type: "Agricultural Co-op", size: "Medium", priority: "High", community: "Seaforth", products_needed: ["Seeds","Chemicals","Irrigation"] },
  { business_name: "Yallahs Valley Farm Inputs", parish: "St. Thomas", category: "Agriculture", business_type: "Farm Inputs", size: "Medium", priority: "High", community: "Yallahs", products_needed: ["Fertiliser","Pesticides","Seeds"] },
  { business_name: "Port Morant Banana & Produce Farmers", parish: "St. Thomas", category: "Agriculture", business_type: "Produce Farming", size: "Large", priority: "High", community: "Port Morant", products_needed: ["Agro-chemicals","Irrigation"] },
  { business_name: "Lyssons Farm & Feed Store", parish: "St. Thomas", category: "Agriculture", business_type: "Farm & Feed", size: "Small", priority: "Medium", community: "Lyssons", products_needed: ["Animal feed","Veterinary"] },
  { business_name: "Prospect Nursery & Garden Centre", parish: "St. Thomas", category: "Agriculture", business_type: "Nursery", size: "Small", priority: "Medium", community: "Prospect", products_needed: ["Plants","Fertiliser"] },
  { business_name: "Dalvey Estate Agricultural Division", parish: "St. Thomas", category: "Agriculture", business_type: "Estate Farm", size: "Large", priority: "High", community: "Dalvey", products_needed: ["Equipment","Chemicals","Irrigation"] },
  { business_name: "Trinityville Farmers Group", parish: "St. Thomas", category: "Agriculture", business_type: "Farmers Group", size: "Medium", priority: "Medium", community: "Trinityville", products_needed: ["Fertiliser","Seeds","Tools"] },
  // Hardware St Thomas
  { business_name: "Morant Bay Hardware & Building Centre", parish: "St. Thomas", category: "Hardware", business_type: "Hardware & Building", size: "Large", priority: "High", community: "Morant Bay", products_needed: ["Cement","Lumber","Hardware","Roofing"] },
  { business_name: "Yallahs Hardware Depot", parish: "St. Thomas", category: "Hardware", business_type: "Hardware", size: "Medium", priority: "High", community: "Yallahs", products_needed: ["Building materials","Paint","Tools"] },
  { business_name: "Port Morant Construction Supplies", parish: "St. Thomas", category: "Hardware", business_type: "Construction Supplies", size: "Medium", priority: "High", community: "Port Morant", products_needed: ["Aggregate","Sand","Cement"] },
  { business_name: "Seaforth Hardware Centre", parish: "St. Thomas", category: "Hardware", business_type: "Hardware", size: "Small", priority: "Medium", community: "Seaforth", products_needed: ["Hardware","Electrical","Plumbing"] },
  { business_name: "St. Thomas Building Materials Ltd", parish: "St. Thomas", category: "Hardware", business_type: "Building Materials", size: "Large", priority: "High", community: "Morant Bay", products_needed: ["Blocks","Rebar","Cement"] },
  { business_name: "Bath Hardware & Lumber", parish: "St. Thomas", category: "Hardware", business_type: "Hardware & Lumber", size: "Small", priority: "Medium", community: "Bath", products_needed: ["Lumber","Hardware"] },
  { business_name: "Lyssons Trade Supplies", parish: "St. Thomas", category: "Hardware", business_type: "Trade Supplies", size: "Small", priority: "Low", community: "Lyssons", products_needed: ["Tools","Paint"] },
  { business_name: "Dalvey Builders Depot", parish: "St. Thomas", category: "Hardware", business_type: "Builders Depot", size: "Medium", priority: "Medium", community: "Dalvey", products_needed: ["Roofing","Blocks","Hardware"] },
  { business_name: "Golden Grove Hardware & Electrical", parish: "St. Thomas", category: "Hardware", business_type: "Hardware & Electrical", size: "Medium", priority: "High", community: "Golden Grove", products_needed: ["Electrical","Hardware"] },
  { business_name: "Trinityville Hardware Supplies", parish: "St. Thomas", category: "Hardware", business_type: "Hardware", size: "Small", priority: "Low", community: "Trinityville", products_needed: ["Hardware","Paint"] },
];

async function seed() {
  console.log(`\n🌾 Seeding ${SEED_LEADS.length} researched leads...\n`);
  let ok = 0, skip = 0, err = 0;

  for (const lead of SEED_LEADS) {
    const { data: ex } = await supabase
      .from("leads")
      .select("id")
      .eq("business_name", lead.business_name)
      .eq("parish", lead.parish);

    if (ex && ex.length > 0) { skip++; continue; }

    const { error } = await supabase.from("leads").insert({
      ...lead,
      status: "New",
      source: "Field Research",
      follow_up_required: lead.priority === "High",
      follow_up_date: lead.priority === "High"
        ? new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]
        : null,
    });

    if (error) { console.error("❌", lead.business_name, error.message); err++; }
    else { ok++; process.stdout.write("."); }
  }

  console.log(`\n\n✅ Inserted: ${ok} | Skipped: ${skip} | Errors: ${err}`);
}

seed();
