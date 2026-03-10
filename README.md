# Martech Audit Toolkit

Browser console scripts for auditing marketing technology integrations on any website. Run them in DevTools to detect pixels, CRMs, analytics, attribution tools, and more.

## Tools

### 1. WP/WooCommerce Integration Auditor
Full audit for WordPress sites. Detects Meta Pixel, CAPI, Google Analytics, GTM, TikTok, Pinterest, Snapchat, LinkedIn, Hotjar, Clarity, cookies, DataLayer, and e-commerce events. Includes automated recommendations.

### 2. Meta CAPI Deep Analyzer
Deep analysis of Meta Conversions API configuration. Auto-detects Pixel IDs, identifies CAPI source (AnyTrack, PixelYourSite, Meta official plugin), intercepts events in real-time, and monitors event_id / external_id patterns.

### 3. Ultimate CRM & Integration Scanner
50+ integrations across 10 categories with structured detectors:
- **CRMs:** HubSpot, Salesforce, Pipedrive, Zoho, Dynamics, Copper, Freshsales, Close
- **Email:** Mailchimp, Klaviyo, ActiveCampaign, ConvertKit, Drip, Brevo, Omnisend
- **Chat:** Intercom, Drift, Zendesk, Tawk.to, Crisp, LiveChat, Tidio
- **Automation:** Zapier, Make, n8n, Pabbly
- **Payments:** Stripe, PayPal, Square, Paddle, Chargebee, Recurly
- **Analytics:** GA4, GTM, Segment, Mixpanel, Amplitude, PostHog, Hotjar, Clarity, Heap, FullStory
- **Ad Pixels:** Meta, TikTok, Pinterest, Snapchat, LinkedIn, Twitter/X, Reddit
- **Forms:** Typeform, Jotform, Gravity Forms, WPForms, Elementor, ClickFunnels
- **Attribution:** Hyros, AnyTrack, Triple Whale, SegMetrics, Wicked Reports

Includes deep analysis (localStorage, cookies, window objects) and dual export (JSON + HTML report).

## How to Use

1. Open the target website in your browser
2. Open DevTools (F12 > Console)
3. Copy the script from the tool page and paste it in the console
4. Press Enter — results appear in the console
5. Use `downloadScanJSON()` / `downloadScanHTML()` to export

## Project Structure

```
v2/
  index.html              — Landing page
  css/shared.css          — Shared styles
  js/shared.js            — Shared utilities (copy, export)
  tools/
    wp-integration-auditor.html
    meta-capi-deep-analyzer.html
    ultimate-crm-scanner.html
```

## Stack

Pure HTML/CSS/JS. Zero dependencies. Hosted on GitHub Pages.

---

by Roger SSW
