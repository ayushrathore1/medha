const SITE_URL = (
  import.meta.env.VITE_SITE_URL ||
  "https://medharevision.shopcampuskart.in"
).replace(/\/$/, "");

const DEFAULT_IMAGE =
  "https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/6.svg?updatedAt=1767677218473";

export function siteOrigin() {
  return SITE_URL;
}

export function absoluteUrl(path = "/") {
  if (!path) return `${SITE_URL}/`;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function ensureMeta(attr, key, content) {
  if (content == null || content === "") return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function ensureLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id, data) {
  const scriptId = `medha-jsonld-${id}`;
  let el = document.getElementById(scriptId);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = scriptId;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Update document head for the current SPA route (Googlebot executes JS).
 */
export function applyPageSeo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd,
  jsonLdId = "page",
} = {}) {
  const fullTitle = title
    ? title.includes("Medha")
      ? title
      : `${title} | Medha Revision`
    : "Medha Revision | RTU Notes, Topics & Past Papers";

  document.title = fullTitle;

  const desc =
    description ||
    "Medha Revision — RTU syllabus topics, notes, and previous year question papers for B.Tech students.";

  ensureMeta("name", "description", desc);
  ensureMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  ensureMeta("name", "googlebot", noindex ? "noindex, nofollow" : "index, follow");

  const url = absoluteUrl(path || window.location.pathname + window.location.search);
  ensureLink("canonical", url);

  ensureMeta("property", "og:title", fullTitle);
  ensureMeta("property", "og:description", desc);
  ensureMeta("property", "og:url", url);
  ensureMeta("property", "og:image", image);
  ensureMeta("property", "og:type", type);
  ensureMeta("property", "og:site_name", "Medha Revision");

  ensureMeta("name", "twitter:card", "summary_large_image");
  ensureMeta("name", "twitter:title", fullTitle);
  ensureMeta("name", "twitter:description", desc);
  ensureMeta("name", "twitter:image", image);

  setJsonLd(jsonLdId, jsonLd || null);
}

export function breadcrumbJsonLd(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function learningResourceJsonLd({
  name,
  description,
  path,
  about = [],
  educationalLevel = "B.Tech",
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description,
    url: absoluteUrl(path),
    learningResourceType: "Study guide",
    educationalLevel,
    about: about.map((topic) => ({ "@type": "Thing", name: topic })),
    provider: {
      "@type": "Organization",
      name: "Medha Revision",
      url: SITE_URL,
    },
    isAccessibleForFree: true,
    inLanguage: "en-IN",
  };
}

export function searchResultsJsonLd({ query, path, results = [] }) {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `Search: ${query}`,
    url: absoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: results.length,
      itemListElement: results.slice(0, 12).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}
