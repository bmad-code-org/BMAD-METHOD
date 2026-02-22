# SEO Validation Guide

**For:** WDS Agents performing Agentic Development
**Purpose:** Verify SEO implementation against specification before presenting to user
**When:** After a public page is built and previewable (browser or deployed)

---

## Core Principle

**Every public page must pass SEO validation before approval.**

The agent verifies all measurable SEO criteria using browser tools (Puppeteer, MCP browser-tools, or manual inspection). SEO failures caught during development cost minutes to fix. SEO failures caught after deployment cost rankings and traffic.

---

## When to Run SEO Validation

| Trigger | Action |
|---------|--------|
| Public page section complete (4c/4d) | Run SEO checks before presenting |
| Full page implementation complete | Run complete SEO audit |
| Pre-deployment review | Full validation against spec + project brief |
| Post-deployment verification | Validate live URL matches specification |

---

## Reference Documents

Before running validation, gather:

1. **Page specification** — SEO & Search section (keywords, URL, headings, meta)
2. **Project brief** — SEO Strategy section (page-keyword map, structured data plan)
3. **SEO Strategy Guide** — `../../data/agent-guides/saga/seo-strategy-guide.md`

---

## SEO Validation Checklist

### Level 1: Critical (Must Pass)

These are the top errors found in real-world SEO audits. Failing any of these blocks approval.

#### 1.1 Page Title Tag

```
Verify:
- Title tag exists and is not empty
- Length ≤ 60 characters (check each language)
- Contains primary keyword
- Contains brand name
- Is unique (different from other pages)
- Matches specification

Report:
"Page title is 'Bilservice på Öland | Källa Fordonservice' (51 chars)
— contains keyword 'bilservice', includes brand. ✓ Passes"

"Page title is 'Home' (4 chars)
— too short, no keyword, no brand. ✗ Fails"
```

#### 1.2 Meta Description

```
Verify:
- Meta description tag exists and is not empty
- Length 150-160 characters
- Contains primary keyword
- Contains call-to-action
- Matches specification

Report:
"Meta description is 156 chars, contains 'bilservice Öland', ends with
'Ring oss idag!' ✓ Passes"

"Meta description is missing. ✗ Fails — 80% of audited sites miss this"
```

#### 1.3 H1 Heading

```
Verify:
- Exactly ONE <h1> tag on the page
- Contains primary keyword (natural, not stuffed)
- Is visible (not hidden)
- Matches specification

Report:
"Found 1 <h1>: 'Bilservice och reparationer på Öland'
— contains keyword 'bilservice'. ✓ Passes"

"Found 0 <h1> tags. ✗ Fails — 75% of audited sites have H1 issues"

"Found 3 <h1> tags. ✗ Fails — only one H1 allowed per page"
```

#### 1.4 Heading Hierarchy

```
Verify:
- Headings follow logical order (H1 → H2 → H3)
- No skipped levels (H1 → H3 without H2)
- No duplicate H1

Report:
"Heading hierarchy: H1 → H2 → H3 → H2 → H3 ✓ Logical flow"

"Heading hierarchy: H1 → H3 (skipped H2) ✗ Fix: Change H3 to H2"
```

#### 1.5 Image Alt Text

```
Verify:
- ALL images have alt attributes
- Alt text is descriptive (not empty, not "image")
- Alt text exists in all required languages
- Decorative images have alt="" (empty, not missing)

Report:
"Found 8 images:
  hero-image: alt='Källa Fordonservice verkstad...' ✓
  service-ac: alt='AC-service på personbil' ✓
  icon-phone: alt='' (decorative) ✓
  team-photo: alt attribute MISSING ✗

Result: 7/8 images pass. 1 missing alt text."
```

---

### Level 2: Important (Should Pass)

#### 2.1 Open Graph / Social Sharing

```
Verify:
- og:title tag present
- og:description tag present
- og:image tag present (valid URL, image exists)
- og:type tag present
- twitter:card tag present

Report:
"Social sharing tags:
  og:title: 'Bilservice Öland — Källa Fordonservice' ✓
  og:description: present (148 chars) ✓
  og:image: '/images/social/hem-social.jpg' ✓ (file exists)
  og:type: 'website' ✓
  twitter:card: 'summary_large_image' ✓
All social tags present."

"Missing: og:image ✗ — 70% of audited sites miss social tags"
```

#### 2.2 Structured Data (Schema.org)

```
Verify:
- JSON-LD script tag exists
- Schema type matches project brief plan
- Required properties present (name, address, phone for LocalBusiness)
- JSON is valid (parseable)

Report:
"Structured data found:
  @type: 'AutoRepair' ✓
  name: 'Källa Fordonservice' ✓
  address: complete ✓
  telephone: '+46485-27070' ✓
  openingHours: present ✓
JSON-LD validates. ✓ Passes"

"No structured data found. ✗ Fails — spec requires LocalBusiness schema"
```

#### 2.3 Internal Links

```
Verify:
- Page has at least 2 internal links to other pages
- Links have descriptive anchor text (not "click here", "read more")
- No broken internal links (404s)
- No redirect chains (link → 301 → 301 → page)

Report:
"Internal links found: 5
  'Läs mer om AC-service' → /ac-service ✓ Descriptive
  'Ring oss' → tel:+46485-27070 ✓ CTA
  'Klicka här' → /kontakt ✗ Non-descriptive anchor text

Result: 4/5 links pass."
```

#### 2.4 URL / Slug

```
Verify:
- URL slug matches specification
- Slug is lowercase
- Uses hyphens (not underscores or spaces)
- No special characters (ä, ö, å)
- Keyword present in slug

Report:
"URL slug: /ac-service ✓ Matches spec, lowercase, keyword present"

"URL slug: /Sida?id=42 ✗ Not descriptive, no keyword"
```

#### 2.5 Canonical URL

```
Verify:
- <link rel="canonical"> tag present
- Points to the correct URL (self-referencing)
- One canonical per page

Report:
"Canonical: <link rel='canonical' href='https://kallafordon.se/ac-service'> ✓"

"Canonical tag missing. ✗ Fails"
```

---

### Level 3: Technical (Verify on Deployment)

These checks apply to the deployed/preview site, not the prototype.

#### 3.1 Performance

```
Verify:
- Total page weight < 3MB
- Largest image < 400KB (hero) / < 200KB (other)
- Time to First Byte (TTFB) < 1.5s
- No uncompressed images (should be WebP or compressed JPEG)

Report:
"Page weight: 1.8MB ✓ (target < 3MB)
  hero.jpg: 380KB ✓ (target < 400KB)
  team.jpg: 1.2MB ✗ (target < 200KB — compress!)
  icon.svg: 3KB ✓
TTFB: 0.8s ✓ (target < 1.5s)"
```

#### 3.2 robots.txt

```
Verify:
- robots.txt exists (not 404)
- Allows crawling of public pages
- References sitemap
- Blocks admin/private pages

Report:
"robots.txt: exists ✓
  Sitemap reference: present ✓
  Public pages: allowed ✓
  /wp-admin/: blocked ✓"
```

#### 3.3 XML Sitemap

```
Verify:
- Sitemap exists at /sitemap.xml (or referenced location)
- Contains all public pages
- All URLs return 200 (no broken links)
- Includes all language versions (if multilingual)

Report:
"Sitemap: 32 URLs, all return 200 ✓
  Includes /en/ versions ✓
  Includes /de/ versions ✓"
```

#### 3.4 hreflang Tags (Multilingual)

```
Verify:
- Each page declares all language alternates
- x-default points to primary language
- Tags are reciprocal (EN page links to SE, SE page links to EN)

Report:
"hreflang tags on /ac-service:
  sv: /ac-service ✓
  en: /en/ac-service ✓
  de: /de/ac-service ✓
  x-default: /ac-service ✓
All reciprocal. ✓ Passes"
```

#### 3.5 Security Headers

```
Verify:
- HSTS present
- X-Content-Type-Options present
- X-Frame-Options present
- Referrer-Policy present

Report:
"Security headers: 2/6 present ✗
  HSTS: missing
  CSP: missing
  X-Content-Type-Options: 'nosniff' ✓
  X-Frame-Options: 'DENY' ✓
  Referrer-Policy: missing
  Permissions-Policy: missing

Note: 95% of audited sites fail security headers."
```

#### 3.6 Favicon

```
Verify:
- Favicon exists (check <link rel="icon">)
- Multiple sizes available (16x16, 32x32, 180x180)

Report:
"Favicon: present ✓
  16x16: ✓
  32x32: ✓
  apple-touch-icon (180x180): ✓"
```

---

## Verification with Puppeteer

### Automated SEO Check Script Pattern

```javascript
// Navigate to page
await page.goto(pageUrl, { waitUntil: 'networkidle0' });

// 1. Title tag
const title = await page.title();
console.log(`Title: "${title}" (${title.length} chars)`);

// 2. Meta description
const metaDesc = await page.$eval(
  'meta[name="description"]',
  el => el.content
).catch(() => null);
console.log(`Meta desc: "${metaDesc}" (${metaDesc?.length || 0} chars)`);

// 3. H1 count and content
const h1s = await page.$$eval('h1', els => els.map(el => el.textContent.trim()));
console.log(`H1 tags: ${h1s.length} — "${h1s.join('", "')}"`);

// 4. Heading hierarchy
const headings = await page.$$eval('h1,h2,h3,h4,h5,h6', els =>
  els.map(el => ({ tag: el.tagName, text: el.textContent.trim().substring(0, 50) }))
);
console.log('Heading hierarchy:', headings.map(h => h.tag).join(' → '));

// 5. Images without alt
const imagesNoAlt = await page.$$eval('img', els =>
  els.filter(el => !el.hasAttribute('alt')).map(el => el.src)
);
console.log(`Images without alt: ${imagesNoAlt.length}`);

// 6. Open Graph tags
const ogTags = await page.$$eval('meta[property^="og:"]', els =>
  els.map(el => ({ property: el.getAttribute('property'), content: el.content }))
);
console.log(`OG tags: ${ogTags.length}`, ogTags);

// 7. Structured data
const jsonLd = await page.$$eval('script[type="application/ld+json"]', els =>
  els.map(el => JSON.parse(el.textContent))
).catch(() => []);
console.log(`Structured data: ${jsonLd.length} blocks`, jsonLd.map(j => j['@type']));

// 8. Canonical
const canonical = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => null);
console.log(`Canonical: ${canonical || 'MISSING'}`);

// 9. Internal links
const links = await page.$$eval('a[href]', els =>
  els.filter(el => el.href.startsWith(window.location.origin))
    .map(el => ({ text: el.textContent.trim().substring(0, 40), href: el.href }))
);
console.log(`Internal links: ${links.length}`);
```

---

## Narration Pattern

Group results by severity and narrate clearly:

```
## SEO Validation Report: {Page Name}

### Critical ✓/✗
  Title tag: "Bilservice Öland | Källa Fordonservice" (51 chars) ✓
  Meta description: "Komplett bilverkstad..." (156 chars) ✓
  H1: 1 found — "Bilservice och reparationer på Öland" ✓
  Heading hierarchy: H1 → H2 → H3 → H2 → H3 ✓
  Image alt text: 7/8 images have alt ✗ (team-photo missing)

### Important ✓/✗
  Open Graph: 5/5 tags present ✓
  Structured data: AutoRepair schema valid ✓
  Internal links: 5 found, 4/5 descriptive ✗ (1 "Klicka här")
  URL slug: /ac-service ✓
  Canonical: present, self-referencing ✓

### Technical (deployment only)
  Page weight: 1.8MB ✓
  Image sizes: 1 oversized (team.jpg 1.2MB) ✗
  Security headers: 2/6 ✗

### Summary
  Critical: 4/5 pass
  Important: 4/5 pass
  Technical: 1/3 pass

  Action needed: Fix 1 missing alt text, 1 non-descriptive link,
  1 oversized image, 4 security headers.
```

---

## Integration with Phase 5 Flow

```
4a: Announce & Gather
4b: Create Story File
4c: Implement Section
        ↓
   Agent runs Puppeteer verification (INLINE-TESTING-GUIDE)
   Agent runs SEO validation (THIS GUIDE) — for public pages only
        ↓
  All pass? ── No ──→ Agent fixes, re-verifies (loop)
        │
       Yes
        ↓
4d: Present for Testing
```

### Story File Addition

Add SEO criteria to the story file's Agent-Verifiable section:

```markdown
### SEO Criteria (Public Pages)

| # | Criterion | Expected | How to Verify |
|---|-----------|----------|---------------|
| S1 | Title tag | "Bilservice Öland \| Källa" ≤60 chars | Read document.title |
| S2 | Meta description | 150-160 chars, keyword present | Read meta[name=description] |
| S3 | H1 count | Exactly 1 | Count h1 elements |
| S4 | H1 keyword | Contains "bilservice" | Read h1 textContent |
| S5 | Heading hierarchy | H1→H2→H3, no skips | Scan all headings |
| S6 | Image alt coverage | 100% images have alt | Check img elements |
| S7 | OG tags | og:title, og:description, og:image | Check meta[property^=og:] |
| S8 | Internal links | ≥ 2, descriptive text | Count and check a[href] |
```

---

## Integration with Acceptance Testing

When creating test scenarios (Phase 4 [H] Handover / Phase 5 [T] Acceptance Testing), include SEO as a test category:

```yaml
seo_checks:
  - id: 'SEO-001'
    name: 'Page title correct'
    verify:
      - 'Title tag matches specification'
      - 'Title ≤ 60 characters'
      - 'Contains primary keyword'

  - id: 'SEO-002'
    name: 'Meta description correct'
    verify:
      - 'Meta description matches specification'
      - 'Length 150-160 characters'
      - 'Contains CTA'

  - id: 'SEO-003'
    name: 'Heading structure valid'
    verify:
      - 'Exactly one H1'
      - 'No skipped heading levels'

  - id: 'SEO-004'
    name: 'Image alt text complete'
    verify:
      - 'All content images have alt text'
      - 'Alt text in correct language'

  - id: 'SEO-005'
    name: 'Structured data valid'
    verify:
      - 'JSON-LD present and parseable'
      - 'Schema type matches plan'
      - 'Required properties present'
```

---

## Anti-Patterns

- **Never skip SEO validation on public pages** — It's not optional
- **Never approve a page with missing alt text** — 85% of real sites fail this
- **Never use "click here" or "read more" as link text** — Describe the destination
- **Never have more than one H1** — One per page, always
- **Never deploy without meta description** — 80% of sites miss this
- **Never assume SEO "can be added later"** — It's specification, not decoration

---

## Common Fixes (From 44 Real-World Audits)

| Issue | Frequency | Fix Time | Fix |
|-------|-----------|----------|-----|
| Missing alt text | 85% | 1 min/image | Add descriptive alt attribute |
| Missing meta description | 80% | 2 min/page | Add meta tag from spec |
| H1 missing or wrong | 75% | 1 min | Add/fix h1 tag |
| Missing OG tags | 70% | 3 min/page | Add og: meta tags from spec |
| Missing structured data | 65% | 5 min/page | Add JSON-LD script |
| Oversized images | 65% | 2 min/image | Compress + convert to WebP |
| Non-descriptive links | 30% | 1 min/link | Rewrite anchor text |
| Missing canonical | 40% | 1 min | Add link rel=canonical |

**Total estimated fix time for a typical page: 15-20 minutes**
These are all preventable by validating during development.

---

## Related Resources

- **Inline Testing Guide:** `INLINE-TESTING-GUIDE.md` — General Puppeteer verification
- **SEO Strategy Guide:** `../../data/agent-guides/saga/seo-strategy-guide.md` — SEO reference
- **SEO Content Instructions:** `../../4-ux-design/templates/instructions/seo-content.instructions.md` — Spec-level SEO
- **Specification Quality:** `../../data/agent-guides/freya/specification-quality.md` — Quality checklist
- **Meta Content Guide:** `../../data/agent-guides/freya/meta-content-guide.md` — Meta tag details

---

*SEO validation during development = zero SEO issues at launch. Validate as you build.*
