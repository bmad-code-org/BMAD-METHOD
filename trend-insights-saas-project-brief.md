# Project Brief: Trend Insights SaaS Platform

## Executive Summary

**Project Name**: Trend Insights Platform (working title: "TrendPipe" or "SignalScout")

**Vision**: Build a SaaS platform that democratizes trend discovery by automating the Internet Pipes methodology, enabling entrepreneurs, investors, and content creators to discover emerging opportunities before competitors.

**Problem Statement**:
Traditional market research is expensive ($5K-$50K), slow (weeks to months), biased (focus group participants lie), and limited in scale. Meanwhile, billions of authentic digital signals are freely available every day, but most people lack the methodology and tools to extract actionable insights from them.

**Solution**:
A SaaS platform that automates the Internet Pipes methodology to:
- Monitor multiple data sources (Google Trends, social media, e-commerce, news)
- Identify emerging trends using pattern recognition
- Validate trends across multiple independent sources
- Score opportunities based on market size, competition, timing, and feasibility
- Generate comprehensive trend reports with strategic recommendations

**Target Market**:
- **Primary**: Solo entrepreneurs and small business owners (0-10 employees) looking for product/business opportunities
- **Secondary**: Content creators seeking trending topics, angel investors validating theses, product managers researching features

**Business Model**:
- Freemium SaaS with tiered pricing
- Free: 3 trend searches/month, basic reports
- Pro ($29/mo): Unlimited searches, deep analysis, trend tracking, email alerts
- Team ($99/mo): Multiple users, API access, custom categories, priority support
- Enterprise ($299+/mo): White-label, custom integrations, dedicated analyst support

**Success Metrics**:
- 1,000 users within 6 months
- 100 paying customers within 12 months
- $10K MRR within 18 months
- 40%+ freemium-to-paid conversion rate

---

## Market Analysis

### Market Opportunity

**Total Addressable Market (TAM)**:
- 582M entrepreneurs globally (Global Entrepreneurship Monitor)
- 50M+ content creators (Linktree, 2024)
- Market research industry: $82B globally

**Serviceable Addressable Market (SAM)**:
- English-speaking entrepreneurs using online tools: ~150M
- Tech-savvy solopreneurs and creators: ~30M
- Willing to pay for market research tools: ~5M

**Serviceable Obtainable Market (SOM)**:
- Realistic Year 1 target: 10,000 users (0.03% of willing-to-pay segment)
- Realistic Year 1 paying: 1,000 customers (10% conversion)

### Competitive Landscape

**Direct Competitors**:

1. **Exploding Topics** ($39-$199/mo)
   - Strengths: Curated trending topics, good UI, established brand
   - Weaknesses: Limited customization, no methodology training, expensive
   - Differentiation: We provide methodology + automation + community

2. **Google Trends** (Free)
   - Strengths: Authoritative data, free, comprehensive
   - Weaknesses: Requires manual analysis, no opportunity scoring, steep learning curve
   - Differentiation: We add intelligence layer and actionable insights

3. **TrendHunter** ($149-$449/mo)
   - Strengths: Human-curated trends, innovation database
   - Weaknesses: Very expensive, B2B focused, not entrepreneur-friendly
   - Differentiation: We're accessible, automated, and entrepreneur-focused

**Indirect Competitors**:
- Traditional market research firms (Gartner, Forrester) - too expensive for our market
- Reddit, Twitter monitoring tools - require manual synthesis
- SEO tools (Ahrefs, SEMrush) - search-focused, not trend-focused

**Competitive Advantages**:
1. **Methodology-first**: We teach users the Internet Pipes framework, not just show data
2. **Automation + human insight**: Blend of automated data gathering and human-curated analysis
3. **Community-driven**: Users can share discovered trends, validate each other's findings
4. **Accessible pricing**: Start free, scale affordably
5. **Action-oriented**: Every report includes monetization strategies, not just insights

### Market Validation

**Evidence of Demand**:
- Exploding Topics has 100K+ users at $39-$199/mo (proven willingness to pay)
- Google Trends has 150M+ monthly users (proven interest in trend data)
- r/EntrepreneurRideAlong (500K members) constantly asks "what opportunities exist?"
- "Trend" + "business opportunity" keywords: 50K+ monthly searches

**Early Validation Signals**:
- BMAD Trend Insights expansion pack demonstrates methodology works
- Demo report shows concrete value (4 trends analyzed with opportunity scores)
- Framework is teachable and repeatable
- Free tools exist, so data accessibility is proven

---

## Product Vision

### Core Features (MVP - Month 0-3)

**1. Trend Discovery Engine**
- Input: Category/industry selection
- Process: Automated Google Trends analysis, social media monitoring (via APIs or web scraping)
- Output: List of 10-20 trending topics with basic metrics (search volume trend, social mentions)

**2. Single Trend Deep-Dive**
- Input: Specific trend name
- Process: Multi-source validation (Google Trends, Reddit, Amazon, YouTube, news)
- Output: Comprehensive report with:
  - Trend description and why it's emerging
  - Target demographics
  - Market size estimation
  - Competition assessment
  - Opportunity score (1-10)
  - Monetization strategies

**3. Trend Reports Dashboard**
- Save favorite trends
- Track trends over time
- Export reports (PDF, Markdown)
- Basic search and filtering

**4. User Onboarding**
- Internet Pipes methodology tutorial
- Interactive walkthrough
- Example trend analysis (permanent jewelry from demo)

### Phase 2 Features (Month 4-9)

**5. Trend Comparison Tool**
- Side-by-side comparison of multiple trends
- Opportunity matrix visualization
- Recommendation engine

**6. Automated Monitoring & Alerts**
- Set up trend trackers for specific categories
- Email/Slack alerts when new trends emerge
- Weekly trend digest

**7. Niche Explorer**
- Discover underserved segments within broader trends
- Demographic niche suggestions
- Intersection opportunity finder

**8. Trend Forecasting**
- Project 3-12 month trend trajectory
- Lifecycle stage identification
- Best entry timing recommendations

### Phase 3 Features (Month 10-18)

**9. Community Features**
- Share discovered trends with community
- Upvote/validate trends
- Discussion threads on specific trends
- User-contributed insights

**10. API Access**
- Programmatic trend discovery
- Webhook notifications
- Custom integrations

**11. Custom Data Sources**
- Add proprietary data sources
- Industry-specific monitoring
- Geographic targeting

**12. Team Collaboration**
- Shared workspaces
- Team trend boards
- Role-based permissions
- Comment and annotation

---

## Technical Overview

### Architecture Approach

**Frontend**:
- React/Next.js (SEO-friendly, modern)
- Tailwind CSS (rapid UI development)
- Recharts or D3.js (data visualization)
- Deploy: Vercel or Netlify

**Backend** (Supabase-Powered):
- **Supabase** as primary backend infrastructure:
  - PostgreSQL database (structured data: users, reports, trends, saved searches)
  - Built-in authentication (email/password, OAuth providers)
  - Row-level security (RLS) for multi-tenant data isolation
  - Real-time subscriptions (live trend updates)
  - Storage for report exports (PDFs, CSVs)
  - Edge Functions for serverless backend logic
  - Auto-generated REST & GraphQL APIs
- **Redis/Upstash** (optional caching layer for heavy computations)
- **Supabase Edge Functions** or **Vercel Edge Functions** for API routes

**Data Pipeline**:
- **Supabase Edge Functions** or **Python Cloud Functions** for scheduled data gathering
- **Google Trends API** via Pytrends library (Python)
- **Reddit API** (PRAW for Python or Snoowrap for JS)
- **YouTube Data API** (official Google API)
- **News API** or web scraping (BeautifulSoup, Playwright)
- **OpenAI API** or **Anthropic API** for trend analysis and report generation
- **Supabase Database Functions** for complex queries and data aggregation

**Authentication & Payments**:
- **Auth**: Supabase Auth (email/password, Google, GitHub OAuth)
- **Payments**: Stripe (subscription management, webhooks)
- **Email**: Resend or SendGrid (transactional emails)
- **User Management**: Supabase Auth + custom user metadata in PostgreSQL

### Data Strategy

**Data Sources**:
1. **Free APIs**: Google Trends (via Pytrends), Reddit API, YouTube Data API, HackerNews API
2. **Web Scraping**: Amazon Best Sellers, Etsy trending, TikTok hashtags (use responsibly)
3. **News Aggregation**: NewsAPI, RSS feeds
4. **LLM Enhancement**: Use GPT-4/Claude to synthesize insights from raw data

**Data Storage** (Supabase PostgreSQL):
- **User data**: Supabase Auth tables + custom profiles table
- **Trend data**: PostgreSQL with JSONB fields for flexible schema
- **Reports & searches**: PostgreSQL with full-text search enabled
- **Time-series metrics**: PostgreSQL with TimescaleDB extension (Supabase supports extensions)
- **File storage**: Supabase Storage (report PDFs, CSVs, user uploads)
- **Cached results**: Supabase's built-in caching + optional Redis/Upstash (24-hour TTL)
- **Real-time data**: Supabase Realtime for live trend updates

### Scalability Considerations (Supabase-Powered)

**MVP (0-1K users)** - Supabase Free Tier:
- Supabase Free tier (500MB database, 1GB file storage, 50K monthly active users)
- Vercel Free tier for frontend
- Manual data gathering with scheduled Edge Functions
- Simple query caching via Supabase

**Growth (1K-10K users)** - Supabase Pro ($25/mo):
- Upgrade to Supabase Pro (8GB database, 100GB file storage, 100K MAU)
- Background job queue via Supabase Edge Functions + pg_cron
- Vercel Pro for better performance
- Database connection pooling enabled
- CDN for static assets (Vercel Edge Network)

**Scale (10K-50K users)** - Supabase Team/Enterprise:
- Supabase dedicated database instance
- Database read replicas for analytics queries
- Separate data pipeline (Python workers or dedicated Edge Functions)
- Advanced caching with Upstash Redis
- Point-in-time recovery enabled

**Scale (50K+ users)** - Multi-Region:
- Multi-region Supabase deployment (US + EU)
- Microservices architecture (separate data pipeline service)
- Supabase Edge Functions at scale
- Database sharding for trend data (by category or time period)
- Advanced monitoring (Supabase Logs + Sentry)

### Why Supabase is Perfect for This SaaS

**Cost-Effective MVP** 💰:
- **Free tier**: 500MB DB + 1GB storage + 50K MAU = $0/mo until product-market fit
- **Pro tier**: Only $25/mo for 100K users (vs. $50-200/mo for separate DB + auth + storage)
- **Predictable scaling**: Clear pricing tiers as you grow

**Built-in Features Save Development Time** ⚡:
- **Authentication**: Email/password + OAuth in hours, not weeks
- **APIs**: Auto-generated REST & GraphQL APIs (no backend coding needed)
- **Real-time**: Live trend updates without WebSocket infrastructure
- **Storage**: File uploads for exports without S3 setup
- **Row-level security**: Multi-tenant security built-in

**Developer Experience** 🚀:
- **TypeScript SDK**: Type-safe database queries with auto-completion
- **Database Studio**: Visual database management (no SQL needed for basic ops)
- **Local development**: Supabase CLI for local testing
- **Migration system**: Version-controlled database schema
- **Excellent docs**: Comprehensive documentation and examples

**SaaS-Specific Benefits** 🎯:
- **Multi-tenancy**: RLS policies ensure users only see their data
- **Subscription tracking**: Easy integration with Stripe webhooks
- **Usage analytics**: Track API usage per user for billing
- **Instant APIs**: Create new features without backend deployments
- **Edge Functions**: Serverless functions for data pipelines

**Example Supabase Tables for This SaaS**:
```sql
-- Users (handled by Supabase Auth automatically)
-- profiles table (extends auth.users)
profiles:
  - id (uuid, references auth.users)
  - subscription_tier (text: 'free', 'pro', 'team', 'enterprise')
  - stripe_customer_id (text)
  - created_at (timestamp)
  - usage_this_month (integer)

-- Saved trends
saved_trends:
  - id (uuid, primary key)
  - user_id (uuid, references auth.users)
  - trend_name (text)
  - category (text)
  - opportunity_score (integer)
  - last_checked (timestamp)
  - created_at (timestamp)

-- Generated reports
reports:
  - id (uuid, primary key)
  - user_id (uuid, references auth.users)
  - report_type (text: 'discovery', 'deep-dive', 'comparison', 'forecast')
  - trends_analyzed (jsonb)
  - report_data (jsonb)
  - pdf_url (text, references storage.objects)
  - created_at (timestamp)

-- Trend data cache
trend_cache:
  - trend_name (text, primary key)
  - search_volume_data (jsonb)
  - social_mentions (jsonb)
  - last_updated (timestamp)
  - expires_at (timestamp)
```

**RLS Policy Example** (ensures users only see their own data):
```sql
-- Users can only see their own saved trends
CREATE POLICY "Users can view own saved trends"
ON saved_trends FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own trends
CREATE POLICY "Users can insert own saved trends"
ON saved_trends FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

## Go-to-Market Strategy

### Launch Plan

**Pre-Launch (Month -2 to 0)**:
1. Build MVP with core features (trend discovery + deep-dive)
2. Create 10 high-quality demo trend reports (beyond permanent jewelry)
3. Build landing page with email signup
4. Write 5 blog posts on trend discovery methodology
5. Reach out to 50 potential beta users from entrepreneur communities

**Launch (Month 1-3)**:
1. **Beta Launch**: 100 beta users, gather feedback
2. **Public Launch**: Product Hunt launch, Reddit (r/Entrepreneur, r/SideProject)
3. **Content Marketing**: Publish weekly trend reports, SEO-optimized
4. **Community Building**: Start Discord/Slack for early users
5. **Partnerships**: Reach out to startup accelerators, business coaches

**Growth (Month 4-12)**:
1. **Paid Acquisition**: Google Ads, Facebook Ads (target entrepreneurs)
2. **Content Flywheel**: User-generated trend reports become SEO content
3. **Referral Program**: Existing users invite others for credits
4. **Affiliate Program**: Business coaches, YouTubers promote for commission
5. **PR**: Pitch to tech blogs, entrepreneur publications

### Pricing Strategy

**Tier 1: Free** (Freemium hook)
- 3 trend searches per month
- Basic trend reports (text only, no deep analysis)
- Access to community-discovered trends
- Email newsletter with weekly trends

**Tier 2: Pro - $29/mo** (Target: Solo entrepreneurs)
- Unlimited trend searches
- Deep-dive analysis reports
- Trend comparison tool
- Automated monitoring (5 tracked trends)
- Priority email support
- Export to PDF/Markdown

**Tier 3: Team - $99/mo** (Target: Small teams, agencies)
- Everything in Pro
- 5 team members
- Unlimited tracked trends
- API access (1,000 requests/day)
- Custom categories
- Slack integration
- Dedicated support

**Tier 4: Enterprise - $299+/mo** (Target: Larger companies, consultants)
- Everything in Team
- Unlimited team members
- White-label reports
- Custom data source integration
- Priority data processing
- Dedicated account manager
- Custom contract terms

**Annual Billing Discount**: 20% off (increases LTV, reduces churn)

### Customer Acquisition Cost (CAC) Targets

- **Organic (SEO/Content)**: $5-10 per user (free tier), $50-100 per paying customer
- **Paid Ads**: $20-30 per user (free tier), $150-250 per paying customer
- **Referral**: $5-15 per user (incentive cost)
- **Blended CAC Target**: $75 per paying customer

**Payback Period**: 3-6 months (acceptable for SaaS)

---

## Financial Projections

### Startup Costs (Month 0-3)

**Development**:
- Developer time (if hiring): $15K-30K (or sweat equity if solo founder)
- Design/UX: $2K-5K (Figma, icons, branding)
- Tools & Services: $100-200/mo (Supabase free tier, Vercel free tier, OpenAI API for LLM, dev tools)
  - Supabase: $0/mo (free tier until 50K MAU)
  - Vercel: $0/mo (free tier)
  - OpenAI API: $50-100/mo (GPT-4 for trend analysis, start with GPT-3.5 for cheaper)
  - Domain: $15/year
  - Email service: $0-20/mo (Resend free tier or SendGrid)
  - Monitoring: $0 (Supabase Logs free tier)

**Marketing**:
- Landing page: $500 (domain, hosting, tools)
- Content creation: $1K (blog posts, demo reports)
- Ads budget: $1K (initial testing)

**Legal & Admin**:
- Business formation: $500
- Terms of service / Privacy policy: $500

**Total MVP Cost**: $20K-40K (or **$2-3K if solo bootstrapped with sweat equity + Supabase free tier**)

**Cost Breakdown (Bootstrap Path)**:
- Supabase + Vercel: $0/mo (free tiers)
- OpenAI API: $50-100/mo × 3 months = $150-300
- Domain + email: $50
- Design assets: $500 (icons, stock images, Figma)
- Legal templates: $500
- Marketing/ads: $1,000
- **Total**: ~$2,200-2,850 for MVP

### Revenue Projections (Conservative)

**Month 6**:
- Users: 1,000 (500 organic, 500 paid acquisition)
- Paying customers: 50 (5% conversion)
- MRR: $1,500 ($29 avg × 50)

**Month 12**:
- Users: 5,000
- Paying customers: 250 (5% conversion)
- MRR: $7,500

**Month 18**:
- Users: 10,000
- Paying customers: 600 (6% conversion after optimization)
- MRR: $18,000
- ARR: $216K

**Month 24**:
- Users: 25,000
- Paying customers: 1,500 (6% conversion)
- MRR: $45,000
- ARR: $540K

### Unit Economics

**Customer Lifetime Value (LTV)**:
- Avg subscription: $29/mo
- Avg customer lifetime: 18 months (estimated)
- Gross margin: 85% (after hosting, APIs, payment fees)
- LTV: $29 × 18 × 0.85 = $444

**Customer Acquisition Cost (CAC)**:
- Blended CAC target: $75

**LTV:CAC Ratio**: 5.9:1 (healthy, target is >3:1)

**Monthly Churn Target**: 5% (aggressive for early stage, aim to reduce to 3%)

---

## Team & Resources

### Roles Needed (MVP Stage)

**Solo Founder Path**:
- Founder: Full-stack developer + product + marketing (you!)
- AI Assistants: Use ChatGPT/Claude for content, coding, design
- Contractors: Designer (Fiverr/Upwork for branding)

**Co-Founder Path**:
- Technical Co-Founder: Backend + data pipeline
- Product Co-Founder: Frontend + UX + go-to-market

### Roles Needed (Post-Launch)

**Month 6-12**:
- Part-time Content Marketer ($2K-3K/mo)
- Part-time Customer Support ($1K-2K/mo)

**Month 12-24**:
- Full-time Developer ($60K-80K/year)
- Full-time Marketing Manager ($50K-70K/year)
- Data Analyst / Trend Curator ($40K-60K/year)

### Advisory Needs

- SaaS Growth Advisor (equity-based)
- Data Science / ML Advisor (equity-based)
- Market Research Industry Expert (paid consulting)

---

## Risks & Mitigations

### Technical Risks

**Risk 1: Data Source Reliability**
- **Mitigation**: Use multiple redundant data sources, build scrapers defensively, cache aggressively

**Risk 2: API Rate Limits**
- **Mitigation**: Implement smart caching, rotate API keys, offer "request trend analysis" vs. real-time

**Risk 3: LLM API Costs**
- **Mitigation**: Cache LLM outputs, use smaller models for simple tasks, consider self-hosted models at scale

### Market Risks

**Risk 4: Low Willingness to Pay**
- **Mitigation**: Prove value with free tier, showcase ROI case studies, offer money-back guarantee

**Risk 5: Competitor Response**
- **Mitigation**: Build community moat, focus on methodology education, move fast on features

**Risk 6: Market Saturation**
- **Mitigation**: Niche down initially (e.g., "trend discovery for e-commerce entrepreneurs"), expand later

### Business Risks

**Risk 7: Slow User Growth**
- **Mitigation**: Aggressive content marketing, SEO focus, paid ads testing, referral program

**Risk 8: High Churn**
- **Mitigation**: Onboarding excellence, regular value delivery (weekly trend emails), community engagement

**Risk 9: Monetization Challenges**
- **Mitigation**: Test pricing early, offer annual plans, add high-value features to paid tiers

---

## Success Criteria

### MVP Success (Month 3)
- ✅ Product live with core features
- ✅ 100 beta users signed up
- ✅ 10 demo trend reports published
- ✅ 5+ testimonials from beta users
- ✅ <2 critical bugs reported

### Launch Success (Month 6)
- ✅ 1,000 total users
- ✅ 50 paying customers
- ✅ $1,500 MRR
- ✅ Product Hunt top 5 of the day
- ✅ 10 blog posts published (SEO content)

### Product-Market Fit (Month 12)
- ✅ 5,000 total users
- ✅ 250 paying customers
- ✅ $7,500 MRR
- ✅ <5% monthly churn
- ✅ 40% of users return weekly
- ✅ NPS score >40

### Growth Stage (Month 18-24)
- ✅ 10,000+ total users
- ✅ 600+ paying customers
- ✅ $18,000+ MRR
- ✅ Profitable (revenue > costs)
- ✅ Clear path to $100K ARR

---

## Next Steps

### Immediate Actions (This Week)
1. ✅ Review this project brief and refine based on your vision
2. ⬜ Decide: Solo founder or seek co-founder?
3. ⬜ Choose tech stack based on your skills
4. ⬜ Create MVP feature spec (use BMAD PM agent to create PRD)
5. ⬜ Design database schema
6. ⬜ Set up development environment

### Short-term Actions (This Month)
1. ⬜ Build landing page with email capture
2. ⬜ Create 3 demo trend reports (permanent jewelry, glowing sunscreen, berberine)
3. ⬜ Start building MVP (focus on trend discovery engine first)
4. ⬜ Write 2 blog posts on Internet Pipes methodology
5. ⬜ Identify 20 potential beta users

### Long-term Actions (This Quarter)
1. ⬜ Complete MVP development
2. ⬜ Recruit 100 beta users
3. ⬜ Gather feedback, iterate on product
4. ⬜ Prepare for public launch
5. ⬜ Set up payment infrastructure (Stripe)

---

## Appendix: Key Questions to Answer

Before proceeding with PRD and Architecture, clarify:

**Product Decisions**:
- Should we start with web app only, or mobile-first?
- How automated vs. manual should trend analysis be (100% automated vs. human-curated)?
- Should we build a Chrome extension for quick trend lookups?

**Business Decisions**:
- Bootstrap or raise funding?
- Solo founder or co-founder search?
- Full-time or side project initially?

**Market Decisions**:
- Which customer segment to target first (entrepreneurs vs. investors vs. content creators)?
- Which geographic market (US-only vs. global from day 1)?
- Which categories to support initially (limit to 5-10 verticals or open-ended)?

**Technical Decisions**:
- ✅ **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions) - RECOMMENDED
- Build custom data pipeline or use existing trend APIs? (Recommended: Start with APIs, build custom later)
- Use GPT-4, Claude, or open-source models for analysis? (Recommended: Start with GPT-3.5-turbo for cost, upgrade to GPT-4 for quality)
- Prioritize speed (simple MVP) vs. quality (polished product)? (Recommended: Speed first, then iterate based on feedback)

---

**Status**: Draft v1.1 - Updated with Supabase backend architecture
**Tech Stack**: Next.js + Supabase + Stripe + OpenAI/Anthropic
**Next**: Use BMAD PM agent to create comprehensive PRD from this brief
**Contact**: [Your contact info]

