(function() {
    console.clear();
    console.log('%c ULTIMATE CRM & INTEGRATION SCANNER v2.0', 'background: linear-gradient(90deg, #FF8C42, #FFB088); color: white; font-size: 16px; padding: 10px 20px; border-radius: 5px; font-weight: bold;');
    console.log('%c' + '='.repeat(55), 'color: #FF8C42;');

    var results = {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        categories: {},
        totalDetected: 0
    };

    // ─── DETECTOR DEFINITIONS ────────────────────────────────
    var detectors = [
        // CRMs
        { cat: 'CRM', name: 'HubSpot', check: function() { return !!(window._hsq || window.hbspt || document.querySelector('script[src*="hs-scripts.com"]')); }, details: function() { return window._hsq ? 'Tracking active' : 'Script loaded'; } },
        { cat: 'CRM', name: 'Salesforce', check: function() { return !!(window.SFDCSessionVars || window.sforce || document.querySelector('script[src*="salesforce"]') || document.querySelector('script[src*="pardot"]')); }, details: function() { return window.sforce ? 'Full SDK' : 'Script detected'; } },
        { cat: 'CRM', name: 'Pipedrive', check: function() { return !!(window.LeadBooster || document.querySelector('script[src*="pipedrive"]')); }, details: function() { return window.LeadBooster ? 'LeadBooster active' : 'Script loaded'; } },
        { cat: 'CRM', name: 'Zoho', check: function() { return !!(window.$zoho || window.ZOHO || document.querySelector('script[src*="zoho"]')); }, details: function() { return window.$zoho ? 'SalesIQ active' : 'Script loaded'; } },
        { cat: 'CRM', name: 'Microsoft Dynamics', check: function() { return !!(document.querySelector('script[src*="dynamics.com"]') || window.MsCrmMkt); }, details: function() { return 'Dynamics 365'; } },
        { cat: 'CRM', name: 'Copper CRM', check: function() { return !!(document.querySelector('script[src*="copper"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'CRM', name: 'Freshsales', check: function() { return !!(document.querySelector('script[src*="freshsales"]') || window.FreshsalesAnalytics); }, details: function() { return 'Script detected'; } },
        { cat: 'CRM', name: 'Close.io', check: function() { return !!(document.querySelector('script[src*="close.com"]') || document.querySelector('script[src*="close.io"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'CRM', name: 'Insightly', check: function() { return !!(document.querySelector('script[src*="insightly"]')); }, details: function() { return 'Script detected'; } },

        // Email & Marketing
        { cat: 'Email Marketing', name: 'Mailchimp', check: function() { return !!(window.mc4wp || document.querySelector('[id*="mc_embed_signup"]') || document.querySelector('script[src*="mailchimp"]')); }, details: function() { return window.mc4wp ? 'mc4wp plugin' : 'Embed form'; } },
        { cat: 'Email Marketing', name: 'Klaviyo', check: function() { return !!(window._klOnsite || window.klaviyo || document.querySelector('script[src*="klaviyo"]')); }, details: function() { return window._klOnsite ? 'Onsite tracking' : 'Script loaded'; } },
        { cat: 'Email Marketing', name: 'ActiveCampaign', check: function() { return !!(window.ActiveCampaign || document.querySelector('script[src*="activehosted.com"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Email Marketing', name: 'ConvertKit', check: function() { return !!(window.ckSiteTags || document.querySelector('script[src*="convertkit"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Email Marketing', name: 'Drip', check: function() { return !!(window._dc || document.querySelector('script[src*="getdrip.com"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Email Marketing', name: 'Brevo (SendinBlue)', check: function() { return !!(window.Brevo || window.sendinblue || document.querySelector('script[src*="brevo"]') || document.querySelector('script[src*="sendinblue"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Email Marketing', name: 'Omnisend', check: function() { return !!(window.omnisend || document.querySelector('script[src*="omnisend"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Email Marketing', name: 'Mailerlite', check: function() { return !!(window.MailerLiteObject || document.querySelector('script[src*="mailerlite"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Email Marketing', name: 'GetResponse', check: function() { return !!(document.querySelector('script[src*="getresponse"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Email Marketing', name: 'AWeber', check: function() { return !!(document.querySelector('script[src*="aweber"]')); }, details: function() { return 'Script detected'; } },

        // Chat & Support
        { cat: 'Chat & Support', name: 'Intercom', check: function() { return !!(window.Intercom || window.intercomSettings); }, details: function() { return window.intercomSettings ? 'App ID: ' + (window.intercomSettings.app_id || 'unknown') : 'SDK loaded'; } },
        { cat: 'Chat & Support', name: 'Drift', check: function() { return !!(window.drift || document.querySelector('script[src*="drift"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Chat & Support', name: 'Zendesk', check: function() { return !!(window.zE || window.zESettings || document.querySelector('script[src*="zendesk"]')); }, details: function() { return window.zE ? 'Widget active' : 'Script loaded'; } },
        { cat: 'Chat & Support', name: 'Tawk.to', check: function() { return !!(window.Tawk_API || document.querySelector('script[src*="tawk.to"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Chat & Support', name: 'Crisp', check: function() { return !!(window.$crisp || window.CRISP_WEBSITE_ID); }, details: function() { return window.CRISP_WEBSITE_ID ? 'ID: ' + window.CRISP_WEBSITE_ID : 'SDK loaded'; } },
        { cat: 'Chat & Support', name: 'LiveChat', check: function() { return !!(window.LiveChatWidget || window.__lc || document.querySelector('script[src*="livechat"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Chat & Support', name: 'Tidio', check: function() { return !!(window.tidioChatApi || document.querySelector('script[src*="tidio"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Chat & Support', name: 'Freshchat', check: function() { return !!(window.fcWidget || document.querySelector('script[src*="freshchat"]')); }, details: function() { return 'Script detected'; } },
        { cat: 'Chat & Support', name: 'WhatsApp Widget', check: function() { return !!(document.querySelector('[href*="wa.me"]') || document.querySelector('[href*="api.whatsapp.com"]')); }, details: function() { return 'Link detected'; } },

        // Automation
        { cat: 'Automation', name: 'Zapier', check: function() { return !!(document.querySelector('form[action*="hooks.zapier.com"]') || document.querySelector('script[src*="zapier"]')); }, details: function() { var f = document.querySelectorAll('form[action*="hooks.zapier.com"]'); return f.length ? f.length + ' webhook(s)' : 'Script detected'; } },
        { cat: 'Automation', name: 'Make (Integromat)', check: function() { return !!(document.querySelector('form[action*="hook.integromat.com"]') || document.querySelector('form[action*="hook.eu1.make.com"]')); }, details: function() { return 'Webhook detected'; } },
        { cat: 'Automation', name: 'n8n', check: function() { return !!(document.querySelector('form[action*="n8n"]') || document.querySelector('script[src*="n8n"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Automation', name: 'Pabbly', check: function() { return !!(document.querySelector('form[action*="pabbly"]') || document.querySelector('script[src*="pabbly"]')); }, details: function() { return 'Detected'; } },

        // Payments
        { cat: 'Payments', name: 'Stripe', check: function() { return !!(window.Stripe || document.querySelector('script[src*="stripe.com"]')); }, details: function() { return window.Stripe ? 'SDK loaded' : 'Script detected'; } },
        { cat: 'Payments', name: 'PayPal', check: function() { return !!(window.paypal || document.querySelector('script[src*="paypal.com"]')); }, details: function() { return window.paypal ? 'SDK loaded' : 'Script detected'; } },
        { cat: 'Payments', name: 'Square', check: function() { return !!(window.Square || document.querySelector('script[src*="squareup.com"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Payments', name: 'Paddle', check: function() { return !!(window.Paddle || document.querySelector('script[src*="paddle.com"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Payments', name: 'Chargebee', check: function() { return !!(window.Chargebee || document.querySelector('script[src*="chargebee"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Payments', name: 'Recurly', check: function() { return !!(window.recurly || document.querySelector('script[src*="recurly"]')); }, details: function() { return 'Detected'; } },

        // Analytics
        { cat: 'Analytics', name: 'Google Analytics', check: function() { return !!(window.gtag || window.ga); }, details: function() { return window.gtag ? 'GA4 (gtag)' : 'Universal Analytics'; } },
        { cat: 'Analytics', name: 'GTM', check: function() { return !!window.google_tag_manager; }, details: function() { var s = document.querySelector('script[src*="googletagmanager.com/gtm.js"]'); var m = s && s.src.match(/id=([A-Z0-9-]+)/); return m ? 'ID: ' + m[1] : 'Active'; } },
        { cat: 'Analytics', name: 'Segment', check: function() { return !!(window.analytics && window.analytics.track); }, details: function() { return 'SDK loaded'; } },
        { cat: 'Analytics', name: 'Mixpanel', check: function() { return !!window.mixpanel; }, details: function() { return 'SDK loaded'; } },
        { cat: 'Analytics', name: 'Amplitude', check: function() { return !!window.amplitude; }, details: function() { return 'SDK loaded'; } },
        { cat: 'Analytics', name: 'PostHog', check: function() { return !!(window.posthog || document.querySelector('script[src*="posthog"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Analytics', name: 'Hotjar', check: function() { return !!(window.hj || window._hjSettings); }, details: function() { return window._hjSettings ? 'ID: ' + window._hjSettings.hjid : 'Active'; } },
        { cat: 'Analytics', name: 'Microsoft Clarity', check: function() { return !!(window.clarity || document.querySelector('script[src*="clarity.ms"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Analytics', name: 'Heap', check: function() { return !!(window.heap || document.querySelector('script[src*="heap"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Analytics', name: 'FullStory', check: function() { return !!(window.FS || document.querySelector('script[src*="fullstory"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Analytics', name: 'Lucky Orange', check: function() { return !!(window.__lo_site_id || document.querySelector('script[src*="luckyorange"]')); }, details: function() { return 'Detected'; } },

        // Ad Pixels
        { cat: 'Ad Pixels', name: 'Meta Pixel', check: function() { return !!window.fbq; }, details: function() { var s = Array.from(document.scripts).find(function(sc) { return sc.innerHTML.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/); }); var m = s && s.innerHTML.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/); return m ? 'Pixel: ' + m[1] : 'Active'; } },
        { cat: 'Ad Pixels', name: 'TikTok Pixel', check: function() { return !!window.ttq; }, details: function() { return 'Active'; } },
        { cat: 'Ad Pixels', name: 'Pinterest Tag', check: function() { return !!window.pintrk; }, details: function() { return 'Active'; } },
        { cat: 'Ad Pixels', name: 'Snapchat Pixel', check: function() { return !!window.snaptr; }, details: function() { return 'Active'; } },
        { cat: 'Ad Pixels', name: 'LinkedIn Insight', check: function() { return !!window._linkedin_data_partner_ids; }, details: function() { return 'IDs: ' + window._linkedin_data_partner_ids; } },
        { cat: 'Ad Pixels', name: 'Twitter/X Pixel', check: function() { return !!(window.twq || document.querySelector('script[src*="static.ads-twitter.com"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Ad Pixels', name: 'Reddit Pixel', check: function() { return !!(window.rdt || document.querySelector('script[src*="reddit"]')); }, details: function() { return 'Detected'; } },

        // Forms & Landing Pages
        { cat: 'Forms & Landing', name: 'Typeform', check: function() { return !!(document.querySelector('[data-tf-widget]') || document.querySelector('script[src*="typeform"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Forms & Landing', name: 'Jotform', check: function() { return !!(document.querySelector('script[src*="jotform"]') || document.querySelector('form[action*="jotform"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Forms & Landing', name: 'Gravity Forms', check: function() { return !!(document.querySelector('.gform_wrapper') || window.gf_global); }, details: function() { return 'Detected'; } },
        { cat: 'Forms & Landing', name: 'WPForms', check: function() { return !!(document.querySelector('.wpforms-form')); }, details: function() { return 'Detected'; } },
        { cat: 'Forms & Landing', name: 'Elementor', check: function() { return !!(window.elementorFrontend || document.querySelector('[data-elementor-type]')); }, details: function() { return 'Detected'; } },
        { cat: 'Forms & Landing', name: 'ClickFunnels', check: function() { return !!(document.querySelector('script[src*="clickfunnels"]') || document.querySelector('meta[name="generator"][content*="ClickFunnels"]')); }, details: function() { return 'Detected'; } },

        // Attribution & Tracking
        { cat: 'Attribution', name: 'AnyTrack', check: function() { return !!(window.anytrack || document.querySelector('script[src*="anytrack"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Attribution', name: 'Hyros', check: function() { return !!(document.querySelector('script[src*="hyros"]') || document.querySelector('script[src*="hyros.com"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Attribution', name: 'SegMetrics', check: function() { return !!(document.querySelector('script[src*="segmetrics"]')); }, details: function() { return 'Detected'; } },
        { cat: 'Attribution', name: 'Triple Whale', check: function() { return !!(document.querySelector('script[src*="triplewhale"]') || window.TriplePixel); }, details: function() { return 'Detected'; } },
        { cat: 'Attribution', name: 'Wicked Reports', check: function() { return !!(document.querySelector('script[src*="wickedreports"]')); }, details: function() { return 'Detected'; } }
    ];

    // ─── RUN ALL DETECTORS ───────────────────────────────────
    var currentCat = '';
    detectors.forEach(function(d) {
        if (d.cat !== currentCat) {
            currentCat = d.cat;
            var colors = {
                'CRM': '#1e40af', 'Email Marketing': '#059669', 'Chat & Support': '#dc2626',
                'Automation': '#7c3aed', 'Payments': '#f59e0b', 'Analytics': '#065f46',
                'Ad Pixels': '#1877f2', 'Forms & Landing': '#be185d', 'Attribution': '#0891b2'
            };
            console.log('\n%c ' + d.cat.toUpperCase(), 'background: ' + (colors[d.cat] || '#333') + '; color: white; padding: 5px; border-radius: 3px;');
        }

        try {
            if (d.check()) {
                if (!results.categories[d.cat]) results.categories[d.cat] = {};
                results.categories[d.cat][d.name] = d.details();
                results.totalDetected++;
                console.log('  ' + d.name + ' - ' + d.details());
            }
        } catch(e) {}
    });

    // ─── DEEP ANALYSIS ───────────────────────────────────────
    console.log('\n%c DEEP ANALYSIS', 'background: #374151; color: white; padding: 5px; border-radius: 3px;');

    // Check localStorage keys for integrations
    var lsKeys = [];
    try {
        for (var i = 0; i < localStorage.length; i++) {
            lsKeys.push(localStorage.key(i));
        }
    } catch(e) {}

    var integrationPatterns = ['hubspot', 'intercom', 'drift', 'crisp', 'tawk', 'klaviyo', 'segment', 'mixpanel', 'amplitude', 'posthog', 'hotjar', 'clarity', 'stripe'];
    var lsFindings = [];
    lsKeys.forEach(function(key) {
        integrationPatterns.forEach(function(pattern) {
            if (key.toLowerCase().indexOf(pattern) !== -1) {
                lsFindings.push(key);
            }
        });
    });

    if (lsFindings.length) {
        console.log('  localStorage traces:', lsFindings);
        results.deepAnalysis = { localStorage: lsFindings };
    }

    // Check cookies
    var cookieStr = document.cookie;
    var cookiePatterns = ['_fbp', '_fbc', '_ga', '_gid', '_gcl', '_hjid', '_clck', 'mp_', 'ajs_'];
    var cookieFindings = [];
    cookiePatterns.forEach(function(p) {
        if (cookieStr.indexOf(p) !== -1) cookieFindings.push(p);
    });

    if (cookieFindings.length) {
        console.log('  Cookie traces:', cookieFindings);
        if (!results.deepAnalysis) results.deepAnalysis = {};
        results.deepAnalysis.cookies = cookieFindings;
    }

    // Third-party script domains
    var domains = [];
    Array.from(document.scripts).forEach(function(s) {
        if (s.src && s.src.indexOf(window.location.hostname) === -1) {
            try { domains.push(new URL(s.src).hostname); } catch(e) {}
        }
    });
    results.thirdPartyDomains = Array.from(new Set(domains));
    console.log('  Third-party domains:', results.thirdPartyDomains.length);

    // ─── SUMMARY ─────────────────────────────────────────────
    console.log('\n%c RESUMEN', 'background: linear-gradient(90deg, #10b981, #059669); color: white; font-size: 14px; padding: 10px; border-radius: 5px;');
    console.log('  Total integraciones detectadas:', results.totalDetected);

    Object.keys(results.categories).forEach(function(cat) {
        var tools = Object.keys(results.categories[cat]);
        console.log('  ' + cat + ': ' + tools.join(', '));
    });

    // Export
    window.scanResults = results;
    console.log('\n  Resultados en: window.scanResults');
    console.log('  Ejecuta downloadScanJSON() para JSON');
    console.log('  Ejecuta downloadScanHTML() para reporte HTML');

    window.downloadScanJSON = function() {
        var dataStr = JSON.stringify(results, null, 2);
        var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        var name = 'crm-scan_' + (window.location.hostname || 'local') + '_' + new Date().toISOString().slice(0, 10) + '.json';
        var link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', name);
        link.click();
    };

    window.downloadScanHTML = function() {
        var hostname = window.location.hostname || 'local';
        var date = new Date().toISOString().slice(0, 10);
        var sections = Object.keys(results.categories).map(function(cat) {
            var items = Object.entries(results.categories[cat]).map(function(e) {
                return '<tr><td style="padding:8px;color:#FFB088">' + e[0] + '</td><td style="padding:8px;color:#a0a0a0">' + e[1] + '</td></tr>';
            }).join('');
            return '<div style="background:#141414;padding:20px;border-radius:10px;margin-bottom:15px;border:1px solid #222"><h3 style="color:#FF8C42;margin-bottom:10px">' + cat + '</h3><table style="width:100%">' + items + '</table></div>';
        }).join('');

        var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>CRM Scan - ' + hostname + '</title><style>body{font-family:system-ui;background:#0a0a0a;color:#e5e5e5;padding:40px;max-width:900px;margin:0 auto}h1{color:#FF8C42}table{border-collapse:collapse;width:100%}td{border-bottom:1px solid #222}</style></head><body><h1>CRM & Integration Scan</h1><p style="color:#808080">Site: ' + hostname + ' | Date: ' + date + ' | Total: ' + results.totalDetected + ' integrations</p>' + sections + '<div style="margin-top:30px;padding:20px;background:#141414;border-radius:10px;border:1px solid #222"><h3 style="color:#FF8C42">Third-Party Domains (' + results.thirdPartyDomains.length + ')</h3><p style="color:#a0a0a0;font-size:0.9em">' + results.thirdPartyDomains.join(', ') + '</p></div></body></html>';

        var blob = new Blob([html], {type: 'text/html'});
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'crm-scan_' + hostname + '_' + date + '.html';
        link.click();
        URL.revokeObjectURL(url);
    };
})();