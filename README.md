# Martech Audit Toolkit

Browser console scripts for auditing marketing technology integrations on any website. Paste in DevTools or use the one-click bookmarklets.

**Live site:** [roger-ssw.github.io/mis-herramientas](https://roger-ssw.github.io/mis-herramientas/)

## Tools

### Full Martech Audit (All-in-One)
All 4 tools in a single script. One paste, complete analysis with unified HTML report export.

### 1. WP/WooCommerce Integration Auditor
Full audit for WordPress sites. Detects Meta Pixel, CAPI, Google Analytics, GTM, TikTok, Pinterest, Snapchat, LinkedIn, Hotjar, Clarity, cookies, DataLayer, and e-commerce events.

### 2. Meta CAPI Deep Analyzer
Deep analysis of Meta Conversions API. Auto-detects Pixel IDs, identifies CAPI source (AnyTrack, PixelYourSite, Meta official plugin), intercepts events in real-time.

### 3. CRM & Integration Scanner
50+ integrations across 10 categories:
- **CRMs:** HubSpot, Salesforce, Pipedrive, Zoho, Dynamics, Copper, Freshsales, Close
- **Email:** Mailchimp, Klaviyo, ActiveCampaign, ConvertKit, Drip, Brevo, Omnisend
- **Chat:** Intercom, Drift, Zendesk, Tawk.to, Crisp, LiveChat, Tidio
- **Automation:** Zapier, Make, n8n, Pabbly
- **Payments:** Stripe, PayPal, Square, Paddle, Chargebee, Recurly
- **Analytics:** GA4, GTM, Segment, Mixpanel, Amplitude, PostHog, Hotjar, Clarity, Heap, FullStory
- **Ad Pixels:** Meta, TikTok, Pinterest, Snapchat, LinkedIn, Twitter/X, Reddit
- **Forms:** Typeform, Jotform, Gravity Forms, WPForms, Elementor, ClickFunnels
- **Attribution:** Hyros, AnyTrack, Triple Whale, SegMetrics, Wicked Reports

### 4. Consent & Compliance Scanner (NEW)
- **12+ CMPs:** OneTrust, Cookiebot, CookieYes, Osano, TrustArc, Quantcast, Complianz, iubenda, Termly, Borlabs
- **GA4 Consent Mode v2** validation (ad_user_data, ad_personalization)
- **Cookie categorization** (necessary, analytics, marketing, unknown)
- **Tag conflict detection** (duplicate pixels, multiple GTM, render-blocking trackers)
- **Server-side tagging** detection (sGTM, transport_url)
- **Compliance risk scoring** (Low/Medium/High)

## Bookmarklets

Drag-and-drop bookmarklets available on the landing page. No copy-paste needed — one click runs the audit on any website.

## How to Use

1. Open the target website in your browser
2. Open DevTools (F12 > Console)
3. Copy the script from the tool page and paste it
4. Press Enter — results appear in the console
5. Run `downloadFullAuditHTML()` for a shareable report

Or use the bookmarklets for one-click execution.

## Project Structure

```
index.html                         — Landing page + bookmarklet installer
full-martech-audit.html            — All-in-one audit (4 tiers)
wp-integration-auditor.html        — WordPress/WooCommerce auditor
meta-capi-deep-analyzer.html       — Meta CAPI analyzer
ultimate-crm-scanner.html          — CRM & integration scanner
consent-compliance-scanner.html    — Consent & compliance scanner
css/shared.css                     — Shared styles
js/shared.js                       — Shared utilities
js/bookmarklets/                   — Standalone scripts for bookmarklet injection
```

## Stack

Pure HTML/CSS/JS. Zero dependencies. GitHub Pages.

---

by Roger SSW
