# Email-Based Authentication Testing

- Use services like Mailosaur or in-house SMTP capture; extract magic links via regex or HTML parsing helpers.
- Preserve browser storage (local/session) when processing links—restore state before visiting the authenticated page.
- Cache email payloads with `cypress-data-session` or equivalent so retries don’t exhaust inbox quotas.
- Cover negative cases: expired links, reused links, and multiple requests in rapid succession.
- Ensure the workflow logs the email ID and link for troubleshooting, but scrub PII before committing artifacts.

_Source: Email authentication blog, Murat testing toolkit._
