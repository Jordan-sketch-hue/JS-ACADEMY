import { readFileSync, writeFileSync } from "fs";

const CWD = "C:\\Users\\jader\\J Supreme Tech\\ferguson-law";
const TS_PATH = `${CWD}\\src\\app\\booking\\type-select\\page.tsx`;
const BK_PATH = `${CWD}\\src\\app\\booking\\page.tsx`;

// ── type-select: insert property_sale after property_purchase ──────────────
let ts = readFileSync(TS_PATH, "utf8").replace(/\r\n/g, "\n");

const OLD_DIASPORA = `  {
    id: "diaspora",
    label: "Diaspora land transaction",`;

const NEW_SALE_THEN_DIASPORA = `  {
    id: "property_sale",
    label: "Sell property in Jamaica",
    desc: "Conveyancing, title transfer, capital gains, closing",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" style={{ width: 36, height: 36 }}>
        <rect width="40" height="40" rx="10" fill="#1B4D32" fillOpacity=".1" />
        <path d="M8 22 L20 10 L32 22 V34 H24V26H16V34H8V22Z" fill="#1B4D32" />
        <line x1="20" y1="18" x2="20" y2="28" stroke="#C8A65C" strokeWidth="2" strokeLinecap="round" />
        <line x1="15" y1="23" x2="25" y2="23" stroke="#C8A65C" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "diaspora",
    label: "Diaspora land transaction",`;

if (!ts.includes(OLD_DIASPORA)) { console.error("marker not found in type-select"); process.exit(1); }
ts = ts.replace(OLD_DIASPORA, NEW_SALE_THEN_DIASPORA);

// also add to MATTER_LABELS in type-select
ts = ts.replace(
  `  property_purchase: "Property Purchase",`,
  `  property_purchase: "Property Purchase",\n  property_sale: "Property Sale",`
);

writeFileSync(TS_PATH, ts.replace(/\n/g, "\r\n"), "utf8");
console.log("✓ type-select patched");

// ── booking/page.tsx: add property_sale to MATTER_TYPE_LABELS ────────────
let bk = readFileSync(BK_PATH, "utf8").replace(/\r\n/g, "\n");

bk = bk.replace(
  `  property_purchase: "Property Purchase",`,
  `  property_purchase: "Property Purchase",\n  property_sale: "Property Sale",`
);

writeFileSync(BK_PATH, bk.replace(/\n/g, "\r\n"), "utf8");
console.log("✓ booking/page.tsx patched");
