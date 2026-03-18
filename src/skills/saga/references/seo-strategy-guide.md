# Saga's SEO Strategy Guide

**When to load:** During Content & Language phase (step-05) for any public website project

---

## Core Principle

**SEO is content strategy, not an afterthought.** Keywords, URL structure, and page-level optimization should be planned during the project brief — not bolted on during development.

---

## 1. Keyword Strategy

### Keyword Research Process

1. **Gather existing research** — Ask client for keywords they want to rank for
2. **Analyze competitors** — What terms do competing businesses rank for?
3. **Map user intent** — What would a real person search for?
4. **Localize per language** — Keywords don't translate directly

### Keyword Categories by Intent

| Category | Intent | Example (Mechanic) |
|----------|--------|---------------------|
| **Service** | Looking for specific service | "bilservice Öland" |
| **Location** | Near-me searches | "bilverkstad norra Öland" |
| **Problem** | Has a specific issue | "AC reparation bil" |
| **Brand** | Looking for the business | "Källa Fordonservice" |
| **Informational** | Seeking knowledge | "när byta bromsklossar" |

### Keyword Localization

Keywords don't translate word-for-word. For each language:

- What would a **native speaker** actually search?
- What **local terminology** is used? (e.g., "däck" vs "tire" vs "Reifen")
- What **misspellings** are common?
- What **long-tail phrases** exist? (e.g., "bilverkstad med AC-service nära mig")

---

## 2. URL Structure

### Best Practices

- **Short and descriptive** — `/tjanster/ac-service` not `/page?id=42`
- **Lowercase, hyphens** — `/dack-service` not `/Däck_Service`
- **Keyword-rich** — Include primary keyword in slug
- **Consistent pattern** — Same depth/format across the site
- **No special characters** — Use ASCII equivalents (å→a, ä→a, ö→o in URL slugs)

### Multi-language URL Patterns

**Recommended: Subdirectory structure**

```
example.com/          → Primary language (Swedish)
example.com/en/       → English
example.com/de/       → German
```

**Alternative: Translated slugs**

```
example.com/tjanster/dackservice      → Swedish
example.com/en/services/tyre-service  → English
example.com/de/dienste/reifenservice  → German
```

### Page-Keyword Map

Create a table mapping every page to its target keywords:

```markdown
| Page | URL Slug | Primary Keyword (SE) | Primary Keyword (EN) | Primary Keyword (DE) |
|------|----------|---------------------|---------------------|---------------------|
| Hem | / | bilverkstad Öland | car repair Öland | Autowerkstatt Öland |
| Service | /service | bilservice | car service | Autoservice |
| AC service | /ac-service | AC service bil | car AC service | Klimaanlage Auto |
```

This map is referenced by Freya during page specification to ensure every page targets the right keywords.

---

## 3. Heading Hierarchy

### Rules

- **One H1 per page** — The main page title, contains primary keyword
- **Logical H2→H3 flow** — No skipping levels
- **Keywords in headings** — Natural, not stuffed
- **H1 ≠ Page Title tag** — They can differ (H1 visible on page, title tag in search results)

### Example

```
H1: Bilservice på Öland — Källa Fordonservice
  H2: Våra tjänster
    H3: Service och underhåll
    H3: AC-service
    H3: Däckservice
  H2: Varför välja oss?
  H2: Kontakta oss
```

---

## 4. Internal Linking Strategy

### Principles

- **Every page should link to at least 2 other pages** on the site
- **Use descriptive anchor text** — "Läs mer om vår AC-service" not "Klicka här"
- **Link related content** — Service pages link to vehicle type pages and vice versa
- **Create hub pages** — Main service page links to all sub-service pages
- **Footer links** — Provide site-wide navigation fallback

### Link Hierarchy

```
Hem (hub)
├── Service → links to vehicle types
├── Reparationer → links to related services
├── AC service → links to booking
├── Däckservice → links to seasonal articles
├── Articles → link to related services
└── Vehicle types → link to relevant services
```

---

## 5. Local SEO

### NAP Consistency (Name, Address, Phone)

**The exact same business information must appear:**
- On every page of the website (header/footer)
- In Google Business Profile
- In directory listings
- In structured data

```
Name: Källa Fordonservice
Address: Löttorpsvägen 31, 387 73 Löttorp
Phone: 0485-270 70
Email: info@kallafordon.se
```

### Google Business Profile

Ensure client has:
- [ ] Claimed and verified Google Business Profile
- [ ] Correct business hours
- [ ] Correct business category (e.g., "Auto Repair Shop")
- [ ] Photos uploaded
- [ ] Description with keywords
- [ ] Service area defined

### Local Keywords

Include location in key pages:
- Page titles: "Bilverkstad i Löttorp på Öland"
- Meta descriptions: "...norra Öland..."
- H1 headings: "Bilservice på Öland"
- Body text: Natural mention of location

---

## 6. Multi-Language SEO

### hreflang Tags

Every page must declare its language variants:

```html
<link rel="alternate" hreflang="sv" href="https://example.com/tjanster/" />
<link rel="alternate" hreflang="en" href="https://example.com/en/services/" />
<link rel="alternate" hreflang="de" href="https://example.com/de/dienste/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/tjanster/" />
```

### Canonical URLs

- Each language version has its own canonical URL
- `x-default` points to the primary language
- No duplicate content issues between language versions

### Per-Language Optimization

Each language version needs **independently optimized**:
- Page title
- Meta description
- H1 heading
- Image alt text
- Structured data

Do NOT just translate the Swedish SEO — research what users in each language actually search for.

---

## 7. Image SEO

### File Naming

- **Descriptive names:** `kalla-fordonservice-ac-service.jpg` not `IMG_4521.jpg`
- **Hyphens between words:** `dack-service-oland.jpg`
- **No special characters:** Use ASCII in filenames

### Alt Text

- **Describe the image content** for screen readers
- **Include keyword naturally** where relevant
- **All languages** must have alt text

```markdown
Alt Text:
- SE: "Mekaniker utför AC-service på personbil i Källa Fordonservice verkstad"
- EN: "Mechanic performing AC service on car at Källa Fordonservice workshop"
- DE: "Mechaniker führt Klimaanlagen-Service am Auto in der Källa Fordonservice Werkstatt durch"
```

### Image Format & Size

- **WebP** for modern browsers (with JPEG/PNG fallback)
- **Lazy loading** for below-the-fold images
- **Responsive images** with srcset for different screen sizes
- **Max file size:** < 200KB per image (< 100KB preferred)
- **Max page weight:** < 3MB total (images + CSS + JS)
- **Dimensions:** Always specify width and height attributes (prevents CLS)
- **Hero images:** Max 400KB, serve responsive versions (mobile: 768px wide, desktop: 1920px wide)

---

## 8. Content SEO Principles

### Write for Humans First

- Natural language, not keyword stuffing
- Answer the user's actual question
- Provide genuine value

### Keyword Placement (Natural)

| Location | Priority | Guideline |
|----------|----------|-----------|
| Page title tag | High | Include primary keyword |
| H1 heading | High | Include primary keyword (can differ from title) |
| Meta description | High | Include primary keyword + CTA |
| First paragraph | Medium | Mention primary keyword early |
| H2 headings | Medium | Include secondary keywords |
| Body text | Medium | Natural mentions, no stuffing |
| Image alt text | Medium | Describe image, keyword if relevant |
| URL slug | Medium | Short, keyword-rich |
| Internal link text | Low | Descriptive, keyword when natural |

### Content Length Guidelines

| Page Type | Minimum Words | Guideline |
|-----------|--------------|-----------|
| Landing page | 300 | Focused, action-oriented |
| Service page | 400-600 | Describe service, benefits, process |
| Article/blog | 600-1200 | In-depth, informational |
| About page | 300-500 | Story, trust, credentials |
| Contact page | 150-300 | Clear, practical |

---

## 9. Structured Data (Schema.org)

### Required for Local Business Sites

```json
{
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "name": "Källa Fordonservice",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Löttorpsvägen 31",
    "addressLocality": "Löttorp",
    "postalCode": "387 73",
    "addressCountry": "SE"
  },
  "telephone": "+46485-27070",
  "url": "https://kallafordon.se",
  "openingHoursSpecification": [...]
}
```

### Common Schema Types

| Schema Type | Use For |
|------------|---------|
| `LocalBusiness` / `AutoRepair` | Business identity |
| `Service` | Individual service pages |
| `FAQPage` | FAQ sections |
| `BreadcrumbList` | Navigation breadcrumbs |
| `Article` | Blog/news articles |
| `Organization` | About/corporate pages |

### Plan During Project Brief

Document which schema types each page needs:

```markdown
| Page | Schema Type | Key Properties |
|------|-------------|----------------|
| Hem | LocalBusiness | name, address, phone, hours |
| Service | Service | name, description, provider |
| Nyheter article | Article | headline, datePublished, author |
```

---

## 10. Technical SEO Checklist

Capture these decisions during platform requirements:

- [ ] **XML Sitemap** — Auto-generated, includes all languages, referenced in robots.txt
- [ ] **Robots.txt** — Allows crawling, blocks admin/private pages, references sitemap
- [ ] **SSL/HTTPS** — All pages served over HTTPS
- [ ] **Mobile-first** — Responsive, passes Google Mobile-Friendly test
- [ ] **Core Web Vitals** — LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] **Page speed** — < 3 seconds on 4G, total page weight < 3MB
- [ ] **404 handling** — Custom 404 page with navigation
- [ ] **Redirects** — 301 redirects for old URLs (if site migration)
- [ ] **Canonical URLs** — Self-referencing canonical on every page
- [ ] **Structured data** — Schema.org markup on key pages
- [ ] **hreflang** — Language alternates declared (if multilingual)
- [ ] **Favicon** — Site icon for browser tabs, bookmarks, and mobile home screen (multiple sizes: 16x16, 32x32, 180x180, 192x192)
- [ ] **Security headers** — HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy (configure at server/hosting level)
- [ ] **Image optimization** — All images < 200KB, WebP format, width/height specified, lazy loading below fold
- [ ] **CSS/JS optimization** — Minified, compressed (gzip/brotli), no render-blocking resources

---

## Output: SEO Strategy Section

When completing step-05, produce this section for the content-language document:

```markdown
## SEO Strategy

### Page-Keyword Map

| Page | URL Slug | Primary Keyword (SE) | Primary Keyword (EN) | Primary Keyword (DE) |
|------|----------|---------------------|---------------------|---------------------|
| ... | ... | ... | ... | ... |

### URL Structure

Pattern: `example.com/{slug}` (SE), `example.com/en/{slug}` (EN), `example.com/de/{slug}` (DE)

### Local SEO

- **Business Name:** ...
- **Address:** ...
- **Phone:** ...
- **Google Business Profile:** Claimed? Yes/No
- **Business Category:** ...

### Structured Data Plan

| Page | Schema Type |
|------|-------------|
| All pages | LocalBusiness (in footer/header) |
| Service pages | Service |
| Articles | Article |

### Keyword Usage Guidelines

- Page titles: Primary keyword + brand name
- H1: Primary keyword (can differ from title tag)
- Meta descriptions: Primary keyword + benefit + CTA
- Body: Natural keyword density, no stuffing
- Images: Descriptive alt text with keyword where relevant
```

---

## Related Resources

- **Meta Content Guide:** `../freya/meta-content-guide.md` — Page-level meta content specification
- **Content Language Template:** `../../templates/1-project-brief/content-language.template.md`
- **Platform Requirements:** `../../templates/1-project-brief/platform-requirements.template.md`

---

*SEO is a first-class citizen in WDS — planned at project brief, applied at page specification, verified at quality gate.*
