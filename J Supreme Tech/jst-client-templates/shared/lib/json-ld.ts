/**
 * shared/lib/json-ld.ts — JSON-LD structured data builder.
 *
 * Usage:
 *   const ld = buildLocalBusinessSchema({ name: "Acme Bakery", ... });
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
 *
 * Covers all 21 schema types referenced in the JBOS spec.
 * NEVER fabricate reviews, ratings, or compliance claims — those fields must
 * come from real data or be omitted entirely.
 */

// ─── Shared primitives ────────────────────────────────────────────────────────

interface PostalAddress {
  street?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
}

interface OpeningHoursSpec {
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

interface GeoCoordinates { latitude: number; longitude: number; }

// ─── LocalBusiness (and subtypes) ─────────────────────────────────────────────

export interface LocalBusinessInput {
  name: string;
  description?: string;
  url?: string;
  telephone?: string;
  email?: string;
  image?: string | string[];
  logo?: string;
  address?: PostalAddress;
  geo?: GeoCoordinates;
  openingHours?: OpeningHoursSpec[];
  priceRange?: string;
  currenciesAccepted?: string;
  paymentAccepted?: string;
  sameAs?: string[];
  /** Schema.org subtype, e.g. "BeautySalon", "AutoRepair", "Restaurant" */
  type?: string;
}

export function buildLocalBusinessSchema(input: LocalBusinessInput) {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "LocalBusiness",
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.url && { url: input.url }),
    ...(input.telephone && { telephone: input.telephone }),
    ...(input.email && { email: input.email }),
    ...(input.image && { image: input.image }),
    ...(input.logo && { logo: input.logo }),
    ...(input.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: input.address.street,
        addressLocality: input.address.city,
        addressRegion: input.address.region,
        postalCode: input.address.postalCode,
        addressCountry: input.address.country,
      },
    }),
    ...(input.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: input.geo.latitude,
        longitude: input.geo.longitude,
      },
    }),
    ...(input.openingHours && {
      openingHoursSpecification: input.openingHours.map(h => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.dayOfWeek,
        opens: h.opens,
        closes: h.closes,
      })),
    }),
    ...(input.priceRange && { priceRange: input.priceRange }),
    ...(input.currenciesAccepted && { currenciesAccepted: input.currenciesAccepted }),
    ...(input.paymentAccepted && { paymentAccepted: input.paymentAccepted }),
    ...(input.sameAs && { sameAs: input.sameAs }),
  };
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductInput {
  name: string;
  description?: string;
  image?: string;
  brand?: string;
  sku?: string;
  price?: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  url?: string;
}

export function buildProductSchema(input: ProductInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.image && { image: input.image }),
    ...(input.brand && { brand: { "@type": "Brand", name: input.brand } }),
    ...(input.sku && { sku: input.sku }),
    ...(input.price !== undefined && {
      offers: {
        "@type": "Offer",
        price: input.price,
        priceCurrency: input.currency ?? "JMD",
        availability: `https://schema.org/${input.availability ?? "InStock"}`,
        ...(input.url && { url: input.url }),
      },
    }),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export interface ServiceInput {
  name: string;
  description?: string;
  provider?: string;
  serviceType?: string;
  areaServed?: string;
  url?: string;
}

export function buildServiceSchema(input: ServiceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.provider && { provider: { "@type": "Organization", name: input.provider } }),
    ...(input.serviceType && { serviceType: input.serviceType }),
    ...(input.areaServed && { areaServed: input.areaServed }),
    ...(input.url && { url: input.url }),
  };
}

// ─── Article / BlogPosting ────────────────────────────────────────────────────

export interface ArticleInput {
  headline: string;
  description?: string;
  image?: string;
  author?: string;
  publisher?: string;
  publisherLogo?: string;
  datePublished?: string;
  dateModified?: string;
  url?: string;
  type?: "Article" | "BlogPosting" | "NewsArticle";
}

export function buildArticleSchema(input: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "Article",
    headline: input.headline,
    ...(input.description && { description: input.description }),
    ...(input.image && { image: input.image }),
    ...(input.author && { author: { "@type": "Person", name: input.author } }),
    ...(input.publisher && {
      publisher: {
        "@type": "Organization",
        name: input.publisher,
        ...(input.publisherLogo && { logo: { "@type": "ImageObject", url: input.publisherLogo } }),
      },
    }),
    ...(input.datePublished && { datePublished: input.datePublished }),
    ...(input.dateModified && { dateModified: input.dateModified }),
    ...(input.url && { mainEntityOfPage: { "@type": "WebPage", "@id": input.url } }),
  };
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

export interface BreadcrumbItem { name: string; href: string; }

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href,
    })),
  };
}

// ─── FAQPage ──────────────────────────────────────────────────────────────────

export interface FAQItem { question: string; answer: string; }

export function buildFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

// ─── Event ────────────────────────────────────────────────────────────────────

export interface EventInput {
  name: string;
  startDate: string;
  endDate?: string;
  description?: string;
  location?: string;
  url?: string;
  image?: string;
  organizer?: string;
  status?: "EventScheduled" | "EventCancelled" | "EventPostponed";
  mode?: "OnlineEventAttendanceMode" | "OfflineEventAttendanceMode" | "MixedEventAttendanceMode";
}

export function buildEventSchema(input: EventInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    startDate: input.startDate,
    ...(input.endDate && { endDate: input.endDate }),
    ...(input.description && { description: input.description }),
    ...(input.location && { location: { "@type": "Place", name: input.location } }),
    ...(input.url && { url: input.url }),
    ...(input.image && { image: input.image }),
    ...(input.organizer && { organizer: { "@type": "Organization", name: input.organizer } }),
    eventStatus: `https://schema.org/${input.status ?? "EventScheduled"}`,
    eventAttendanceMode: `https://schema.org/${input.mode ?? "OfflineEventAttendanceMode"}`,
  };
}

// ─── WebSite (SiteLinksSearchBox) ─────────────────────────────────────────────

export function buildWebsiteSchema(url: string, name: string, searchUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url,
    name,
    ...(searchUrl && {
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${searchUrl}?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    }),
  };
}
