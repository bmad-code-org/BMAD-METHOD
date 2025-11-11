# Technical/Architecture Research Validation Checklist

## 🚨 CRITICAL: Source Verification and Fact-Checking (PRIORITY)

### Version Number Verification (MANDATORY)

- [ ] **EVERY** technology version number has cited source with URL
- [ ] Version numbers verified via WebSearch from {{current_year}} (NOT from training data!)
- [ ] Official documentation/release pages cited for each version
- [ ] Release dates included with version numbers
- [ ] LTS status verified from official sources (with URL)
- [ ] No "assumed" or "remembered" version numbers - ALL must be verified

### Technical Claim Source Verification

- [ ] **EVERY** feature claim has source (official docs, release notes, website)
- [ ] Performance benchmarks cite source (official benchmarks, third-party tests with URLs)
- [ ] Compatibility claims verified (official compatibility matrix, documentation)
- [ ] Community size/popularity backed by sources (GitHub stars, npm downloads, official stats)
- [ ] "Supports X" claims verified via official documentation with URL
- [ ] No invented capabilities or features

### Source Quality for Technical Data

- [ ] Official documentation prioritized (docs.technology.com > blog posts)
- [ ] Version info from official release pages (highest credibility)
- [ ] Benchmarks from official sources or reputable third-parties (not random blogs)
- [ ] Community data from verified sources (GitHub, npm, official registries)
- [ ] Pricing from official pricing pages (with URL and date verified)

### Multi-Source Verification (Critical Technical Claims)

- [ ] Major technical claims (performance, scalability) verified by 2+ sources
- [ ] Technology comparisons cite multiple independent sources
- [ ] "Best for X" claims backed by comparative analysis with sources
- [ ] Production experience claims cite real case studies or articles with URLs
- [ ] No single-source critical decisions without flagging need for verification

### Anti-Hallucination for Technical Data

- [ ] No invented version numbers or release dates
- [ ] No assumed feature availability without verification
- [ ] If current data not found, explicitly states "Could not verify {{current_year}} information"
- [ ] Speculation clearly labeled (e.g., "Based on trends, technology may...")
- [ ] No "probably supports" or "likely compatible" without verification

## Technology Evaluation

### Comprehensive Profiling

For each evaluated technology:

- [ ] Core capabilities and features are documented
- [ ] Architecture and design philosophy are explained
- [ ] Maturity level is assessed (experimental, stable, mature, legacy)
- [ ] Community size and activity are measured
- [ ] Maintenance status is verified (active, maintenance mode, abandoned)

### Practical Considerations

- [ ] Learning curve is evaluated
- [ ] Documentation quality is assessed
- [ ] Developer experience is considered
- [ ] Tooling ecosystem is reviewed
- [ ] Testing and debugging capabilities are examined

### Operational Assessment

- [ ] Deployment complexity is understood
- [ ] Monitoring and observability options are evaluated
- [ ] Operational overhead is estimated
- [ ] Cloud provider support is verified
- [ ] Container/Kubernetes compatibility is checked (if relevant)

## Comparative Analysis

### Multi-Dimensional Comparison

- [ ] Technologies are compared across relevant dimensions
- [ ] Performance benchmarks are included (if available)
- [ ] Scalability characteristics are compared
- [ ] Complexity trade-offs are analyzed
- [ ] Total cost of ownership is estimated for each option

### Trade-off Analysis

- [ ] Key trade-offs between options are identified
- [ ] Decision factors are prioritized based on user needs
- [ ] Conditions favoring each option are specified
- [ ] Weighted analysis reflects user's priorities

## Real-World Evidence

### Production Experience

- [ ] Real-world production experiences are researched
- [ ] Known issues and gotchas are documented
- [ ] Performance data from actual deployments is included
- [ ] Migration experiences are considered (if replacing existing tech)
- [ ] Community discussions and war stories are referenced

### Source Quality

- [ ] Multiple independent sources validate key claims
- [ ] Recent sources from {{current_year}} are prioritized
- [ ] Practitioner experiences are included (blog posts, conference talks, forums)
- [ ] Both proponent and critic perspectives are considered

## Decision Support

### Recommendations

- [ ] Primary recommendation is clearly stated with rationale
- [ ] Alternative options are explained with use cases
- [ ] Fit for user's specific context is explained
- [ ] Decision is justified by requirements and constraints

### Implementation Guidance

- [ ] Proof-of-concept approach is outlined
- [ ] Key implementation decisions are identified
- [ ] Migration path is described (if applicable)
- [ ] Success criteria are defined
- [ ] Validation approach is recommended

### Risk Management

- [ ] Technical risks are identified
- [ ] Mitigation strategies are provided
- [ ] Contingency options are outlined (if primary choice doesn't work)
- [ ] Exit strategy considerations are discussed

## Architecture Decision Record

### ADR Completeness

- [ ] Status is specified (Proposed, Accepted, Superseded)
- [ ] Context and problem statement are clear
- [ ] Decision drivers are documented
- [ ] All considered options are listed
- [ ] Chosen option and rationale are explained
- [ ] Consequences (positive, negative, neutral) are identified
- [ ] Implementation notes are included
- [ ] References to research sources are provided

## References and Source Documentation (CRITICAL)

### References Section Completeness

- [ ] Report includes comprehensive "References and Sources" section
- [ ] Sources organized by category (official docs, benchmarks, community, architecture)
- [ ] Every source includes: Title, Publisher/Site, Date Accessed, Full URL
- [ ] URLs are clickable and functional (documentation links, release pages, GitHub)
- [ ] Version verification sources clearly listed
- [ ] Inline citations throughout report reference the sources section

### Technology Source Documentation

- [ ] For each technology evaluated, sources documented:
  - Official documentation URL
  - Release notes/changelog URL for version
  - Pricing page URL (if applicable)
  - Community/GitHub URL
  - Benchmark source URLs
- [ ] Comparison data cites source for each claim
- [ ] Architecture pattern sources cited (articles, books, official guides)

### Source Quality Metrics

- [ ] Report documents total sources cited
- [ ] Official sources count (highest credibility)
- [ ] Third-party sources count (benchmarks, articles)
- [ ] Version verification count (all technologies verified {{current_year}})
- [ ] Outdated sources flagged (if any used)

### Citation Format Standards

- [ ] Inline citations format: [Source: Docs URL] or [Version: 1.2.3, Source: Release Page URL]
- [ ] Consistent citation style throughout
- [ ] No vague citations like "according to the community" without specifics
- [ ] GitHub links include star count and last update date
- [ ] Documentation links point to current stable version docs

## Document Quality

### Anti-Hallucination Final Check

- [ ] Spot-check 5 random version numbers - can you find the cited source?
- [ ] Verify feature claims against official documentation
- [ ] Check any performance numbers have benchmark sources
- [ ] Ensure no "cutting edge" or "latest" without specific version number
- [ ] Cross-check technology comparisons with cited sources

### Structure and Completeness

- [ ] Executive summary captures key findings
- [ ] No placeholder text remains (all {{variables}} are replaced)
- [ ] References section is complete and properly formatted
- [ ] Version verification audit trail included
- [ ] Document ready for technical fact-checking by third party

## Research Completeness

### Coverage

- [ ] All user requirements were addressed
- [ ] All constraints were considered
- [ ] Sufficient depth for the decision at hand
- [ ] Optional analyses were considered and included/excluded appropriately
- [ ] Web research was conducted for current market data

### Data Freshness

- [ ] Current {{current_year}} data was used throughout
- [ ] Version information is up-to-date
- [ ] Recent developments and trends are included
- [ ] Outdated or deprecated information is flagged or excluded

---

## Issues Found

### Critical Issues

_List any critical gaps or errors that must be addressed:_

- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]

### Minor Improvements

_List minor improvements that would enhance the report:_

- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]

### Additional Research Needed

_List areas requiring further investigation:_

- [ ] Topic 1: [Description]
- [ ] Topic 2: [Description]

---

**Validation Complete:** ☐ Yes ☐ No
**Ready for Decision:** ☐ Yes ☐ No
**Reviewer:** \***\*\_\*\***
**Date:** \***\*\_\*\***
