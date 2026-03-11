(function() {
    console.clear();
    console.log('%c WP INTEGRATION AUDITOR v2.0', 'background: #FF8C42; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
    console.log('%c' + '='.repeat(50), 'color: #FF8C42;');

    const audit = {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        wordpress: {},
        pixels: {},
        analytics: {},
        ecommerce: {},
        apis: {},
        scripts: [],
        dataLayer: {},
        cookies: {}
    };

    // 1. WORDPRESS & PLUGINS
    console.log('\n%c WORDPRESS & PLUGINS', 'background: #10b981; color: white; padding: 5px; border-radius: 3px;');

    const wpVersion = document.querySelector('meta[name="generator"]');
    if (wpVersion) {
        audit.wordpress.version = wpVersion.content;
        console.log('  WordPress detectado:', wpVersion.content);
    }

    if (window.woocommerce_params || document.querySelector('.woocommerce')) {
        audit.wordpress.woocommerce = true;
        console.log('  WooCommerce detectado');
    }

    if (window.CE2 || document.querySelector('script[src*="crazyegg"]')) {
        audit.analytics.crazyEgg = true;
        console.log('  Crazy Egg detectado');
        const ceScript = document.querySelector('script[src*="crazyegg"]');
        if (ceScript) {
            const match = ceScript.src.match(/\/(\d+)\/(\d+)\.js/);
            if (match) {
                audit.analytics.crazyEggAccount = match[1];
                console.log('    Account ID:', match[1]);
            }
        }
    }

    // 2. META PIXEL
    console.log('\n%c META PIXEL & CAPI', 'background: #1877f2; color: white; padding: 5px; border-radius: 3px;');

    if (window.fbq) {
        audit.pixels.metaPixel = true;
        console.log('  Meta Pixel detectado');

        if (window._fbq && window._fbq.pixelId) {
            audit.pixels.metaPixelId = window._fbq.pixelId;
            console.log('    Pixel ID:', window._fbq.pixelId);
        }

        const fbScripts = Array.from(document.scripts).filter(s => s.innerHTML.includes('fbq'));
        fbScripts.forEach(script => {
            const pixelMatch = script.innerHTML.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/);
            if (pixelMatch) {
                audit.pixels.metaPixelId = pixelMatch[1];
                console.log('    Pixel ID encontrado:', pixelMatch[1]);
            }

            if (script.innerHTML.includes('server_event') ||
                script.innerHTML.includes('event_id') ||
                script.innerHTML.includes('external_id')) {
                audit.apis.metaCAPI = true;
                console.log('    CAPI detectado (Conversions API)');
            }
        });
    }

    if (document.querySelector('script[src*="facebook-for-wordpress"]')) {
        audit.wordpress.metaPlugin = true;
        console.log('  Plugin oficial de Meta para WordPress detectado');
    }

    // 3. GOOGLE ANALYTICS / GTM
    console.log('\n%c GOOGLE ANALYTICS & GTM', 'background: #ea4335; color: white; padding: 5px; border-radius: 3px;');

    if (window.gtag || window.dataLayer) {
        audit.analytics.googleAnalytics = true;
        console.log('  Google Analytics detectado');

        const gaScripts = Array.from(document.scripts).filter(s =>
            s.src.includes('googletagmanager.com/gtag') || s.innerHTML.includes('gtag')
        );

        gaScripts.forEach(script => {
            const measurementMatch = script.innerHTML.match(/['"]config['"],\s*['"]([G-|UA-|AW-][A-Z0-9]+)['"]/);
            if (measurementMatch) {
                audit.analytics.gaMeasurementId = measurementMatch[1];
                console.log('    Measurement ID:', measurementMatch[1]);
            }
        });
    }

    if (window.google_tag_manager) {
        audit.analytics.gtm = true;
        console.log('  Google Tag Manager detectado');

        const gtmScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
        if (gtmScript) {
            const gtmMatch = gtmScript.src.match(/id=([A-Z0-9-]+)/);
            if (gtmMatch) {
                audit.analytics.gtmId = gtmMatch[1];
                console.log('    GTM ID:', gtmMatch[1]);
            }
        }
    }

    // 4. OTHER PIXELS
    console.log('\n%c OTRAS INTEGRACIONES', 'background: #6b7280; color: white; padding: 5px; border-radius: 3px;');

    if (window.ttq) { audit.pixels.tiktok = true; console.log('  TikTok Pixel detectado'); }
    if (window.pintrk) { audit.pixels.pinterest = true; console.log('  Pinterest Tag detectado'); }
    if (window.snaptr) { audit.pixels.snapchat = true; console.log('  Snapchat Pixel detectado'); }

    if (window._linkedin_data_partner_ids) {
        audit.pixels.linkedin = true;
        audit.pixels.linkedinId = window._linkedin_data_partner_ids;
        console.log('  LinkedIn Insight Tag detectado:', window._linkedin_data_partner_ids);
    }

    if (window.hj || window._hjSettings) {
        audit.analytics.hotjar = true;
        console.log('  Hotjar detectado');
        if (window._hjSettings && window._hjSettings.hjid) {
            console.log('    Hotjar ID:', window._hjSettings.hjid);
        }
    }

    if (window.clarity) {
        audit.analytics.clarity = true;
        console.log('  Microsoft Clarity detectado');
    }

    // 5. DATA LAYER
    console.log('\n%c DATA LAYER', 'background: #8b5cf6; color: white; padding: 5px; border-radius: 3px;');

    if (window.dataLayer) {
        audit.dataLayer.exists = true;
        audit.dataLayer.events = [];

        window.dataLayer.forEach(item => {
            if (item.event && !audit.dataLayer.events.includes(item.event)) {
                audit.dataLayer.events.push(item.event);
            }
        });

        console.log('  DataLayer encontrado');
        console.log('    Eventos:', audit.dataLayer.events);
        console.log('    Total elementos:', window.dataLayer.length);
    }

    // 6. THIRD-PARTY SCRIPTS
    console.log('\n%c SCRIPTS DE TERCEROS', 'background: #ef4444; color: white; padding: 5px; border-radius: 3px;');

    const thirdPartyScripts = Array.from(document.scripts)
        .filter(script => script.src && !script.src.includes(window.location.hostname))
        .map(script => {
            try { return new URL(script.src).hostname; } catch { return null; }
        })
        .filter(Boolean);

    audit.scripts = [...new Set(thirdPartyScripts)];
    console.log('  Scripts de terceros detectados:');
    audit.scripts.forEach(host => console.log('    ', host));

    // 7. COOKIES
    console.log('\n%c COOKIES RELEVANTES', 'background: #f59e0b; color: white; padding: 5px; border-radius: 3px;');

    const cookies = document.cookie.split(';');
    const relevantCookies = { facebook: [], google: [], analytics: [] };

    cookies.forEach(cookie => {
        const [name] = cookie.trim().split('=');
        if (name.includes('_fb') || name.includes('fr')) relevantCookies.facebook.push(name);
        if (name.includes('_ga') || name.includes('_gid') || name.includes('_gcl')) relevantCookies.google.push(name);
        if (name.includes('_hj') || name.includes('ce_') || name.includes('_pin')) relevantCookies.analytics.push(name);
    });

    audit.cookies = relevantCookies;
    if (relevantCookies.facebook.length) console.log('    Facebook cookies:', relevantCookies.facebook);
    if (relevantCookies.google.length) console.log('    Google cookies:', relevantCookies.google);
    if (relevantCookies.analytics.length) console.log('    Analytics cookies:', relevantCookies.analytics);

    // 8. ECOMMERCE EVENTS
    console.log('\n%c EVENTOS E-COMMERCE', 'background: #14b8a6; color: white; padding: 5px; border-radius: 3px;');

    const wcEvents = { viewContent: false, addToCart: false, initiateCheckout: false, purchase: false };

    Array.from(document.scripts).forEach(script => {
        if (script.innerHTML.includes('ViewContent')) wcEvents.viewContent = true;
        if (script.innerHTML.includes('AddToCart')) wcEvents.addToCart = true;
        if (script.innerHTML.includes('InitiateCheckout')) wcEvents.initiateCheckout = true;
        if (script.innerHTML.includes('Purchase')) wcEvents.purchase = true;
    });

    audit.ecommerce.events = wcEvents;
    Object.entries(wcEvents).forEach(([event, exists]) => {
        if (exists) console.log('    ' + event + ' configurado');
    });

    // 9. SUMMARY
    console.log('\n%c RESUMEN DE AUDITORÍA', 'background: #059669; color: white; font-size: 14px; padding: 10px; border-radius: 5px;');
    console.table({
        'WordPress': audit.wordpress,
        'Píxeles': audit.pixels,
        'Analytics': audit.analytics,
        'APIs': audit.apis,
        'E-commerce': audit.ecommerce,
        'DataLayer': audit.dataLayer,
        'Cookies': audit.cookies,
        'Third-Party Scripts': audit.scripts.length + ' detected'
    });

    // 10. RECOMMENDATIONS
    console.log('\n%c RECOMENDACIONES', 'background: #facc15; color: #1e1e1e; padding: 8px; border-radius: 5px;');

    if (audit.pixels.metaPixel && !audit.apis.metaCAPI) {
        console.log('  Meta Pixel sin CAPI - Considera implementar Conversions API');
    }
    if (!audit.analytics.gtm && Object.keys(audit.pixels).length > 2) {
        console.log('  Múltiples píxeles sin GTM - Considera usar Google Tag Manager');
    }
    if (audit.wordpress.woocommerce && !audit.ecommerce.events.purchase) {
        console.log('  WooCommerce sin evento Purchase - Verifica la configuración');
    }

    // Export
    window.auditResults = audit;
    console.log('\n  Resultados en: window.auditResults');
    console.log('  Ejecuta downloadAuditResults() para descargar JSON');
    console.log('  Ejecuta downloadAuditHTML() para descargar reporte HTML');

    window.downloadAuditResults = function() {
        const dataStr = JSON.stringify(audit, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const name = 'audit_' + (window.location.hostname || 'local') + '_' + new Date().toISOString().slice(0, 10) + '.json';
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', name);
        link.click();
    };

    window.downloadAuditHTML = function() {
        const hostname = window.location.hostname || 'local';
        const date = new Date().toISOString().slice(0, 10);
        const sections = Object.entries(audit).map(function(entry) {
            return '<div style="background:#141414;padding:15px;border-radius:8px;margin-bottom:15px;border:1px solid #222"><h3 style="color:#FFB088">' + entry[0] + '</h3><pre style="color:#e5e5e5;font-size:0.85em">' + JSON.stringify(entry[1], null, 2) + '</pre></div>';
        }).join('');
        var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>WP Audit - ' + hostname + '</title><style>body{font-family:system-ui;background:#0a0a0a;color:#e5e5e5;padding:40px;max-width:900px;margin:0 auto}h1{color:#FF8C42}pre{overflow-x:auto}</style></head><body><h1>WP Integration Audit</h1><p style="color:#808080">Site: ' + hostname + ' | Date: ' + date + '</p>' + sections + '</body></html>';
        var blob = new Blob([html], {type:'text/html'});
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url; link.download = 'wp-audit_' + hostname + '_' + date + '.html'; link.click();
        URL.revokeObjectURL(url);
    };
})();