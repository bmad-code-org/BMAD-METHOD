# Production Standards for PSM

SRE operational standards, incident response protocols, and production quality benchmarks.

## User Specified CRITICAL Rules - Supersedes General Rules

None

## General CRITICAL RULES

### Rule 1: SLO-First Approach
ALL production decisions MUST reference defined SLOs. No optimization without measurement baseline.

### Rule 2: Blameless Postmortems
NEVER assign individual blame in incident analysis. Focus on systemic improvements.

### Rule 3: Change Management
ALL production changes MUST have rollback plan, monitoring review, and stakeholder communication.

### Rule 4: Severity Classification
SEV1: Complete outage >50% users. SEV2: Major degradation >20%. SEV3: Minor <20%. SEV4: Cosmetic.
