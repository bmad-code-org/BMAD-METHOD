# App Store Launch Playbook

Guide for `bmad-apf-apple-deployment` and `bmad-apf-aso` agents.

## Pre-Submission Checklist

- [ ] App tested on physical devices
- [ ] All required device permissions declared
- [ ] Privacy nutrition labels complete
- [ ] App Store screenshots (6.7", 6.5", 5.5")
- [ ] App preview video (optional but recommended)
- [ ] App icon (1024x1024)
- [ ] Description optimized for ASO
- [ ] Keywords researched (100 char limit)
- [ ] Support URL and privacy policy URL live
- [ ] Age rating questionnaire complete

## Submission Flow

1. Archive in Xcode
2. Upload to App Store Connect via Fastlane
3. Submit for TestFlight beta review
4. Beta test with 10+ users (minimum 1 week)
5. Submit for App Store review
6. Respond to review feedback within 24 hours

## ASO Optimization

- Title: Brand + primary keyword (30 chars)
- Subtitle: Secondary value prop (30 chars)
- Keywords: Comma-separated, no spaces after commas
- Description: First 3 lines visible without "more"
- Screenshots: Show value, not just UI

## Common Rejection Reasons

- Incomplete metadata
- Crashes on review device
- Missing privacy policy
- Guideline 4.2 (minimum functionality)
- In-app purchase issues

## Post-Launch

- Monitor reviews daily
- Respond to reviews (especially negative)
- Track keyword rankings
- A/B test screenshots via Product Page Optimization
