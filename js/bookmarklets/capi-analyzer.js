(function() {
    console.clear();
    console.log('%c META CAPI DEEP ANALYZER v2.0', 'background: #1877f2; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
    console.log('%c' + '='.repeat(50), 'color: #1877f2;');

    var capiAnalysis = {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        pixelIds: [],
        capiSource: null,
        serverEvents: [],
        eventParameters: {},
        plugins: {},
        networkRequests: [],
        implementation: null,
        gtmContainers: []
    };

    // 1. AUTO-DETECT PIXEL IDs
    console.log('\n%c DETECTANDO PIXEL IDs', 'background: #059669; color: white; padding: 5px; border-radius: 3px;');

    // From fbq init calls
    Array.from(document.scripts).forEach(function(script) {
        var content = script.innerHTML;
        var matches = content.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/g);
        if (matches) {
            matches.forEach(function(m) {
                var id = m.match(/['"](\d+)['"]/);
                if (id && capiAnalysis.pixelIds.indexOf(id[1]) === -1) {
                    capiAnalysis.pixelIds.push(id[1]);
                    console.log('  Pixel ID encontrado:', id[1]);
                }
            });
        }
    });

    // From _fbq object
    if (window._fbq && window._fbq.pixelId) {
        if (capiAnalysis.pixelIds.indexOf(window._fbq.pixelId) === -1) {
            capiAnalysis.pixelIds.push(window._fbq.pixelId);
        }
    }

    if (capiAnalysis.pixelIds.length === 0) {
        console.log('  No se encontraron Pixel IDs en esta página');
    }

    // 2. DETECT CAPI SOURCE
    console.log('\n%c ANALIZANDO FUENTE DEL CAPI', 'background: #7c3aed; color: white; padding: 5px; border-radius: 3px;');

    // AnyTrack
    if (window.anytrack || document.querySelector('script[src*="anytrack"]')) {
        capiAnalysis.plugins.anytrack = true;
        capiAnalysis.capiSource = 'AnyTrack';
        console.log('  AnyTrack detectado - Probable fuente del CAPI');
        if (window.anytrack) {
            console.log('    AnyTrack Config:', window.anytrack);
        }
    }

    // Meta official plugin
    var metaIndicators = ['facebook-for-wordpress', 'facebook_for_wordpress', 'facebookpixel', 'facebook-pixel-for-wordpress'];
    metaIndicators.forEach(function(indicator) {
        if (document.querySelector('script[src*="' + indicator + '"]') ||
            document.querySelector('link[href*="' + indicator + '"]')) {
            capiAnalysis.plugins.metaOfficial = true;
            if (!capiAnalysis.capiSource) capiAnalysis.capiSource = 'Meta Official Plugin';
            console.log('  Plugin oficial de Meta detectado');
        }
    });

    // PixelYourSite
    if (window.pysOptions || document.querySelector('script[src*="pixelyoursite"]')) {
        capiAnalysis.plugins.pixelYourSite = true;
        if (!capiAnalysis.capiSource) capiAnalysis.capiSource = 'PixelYourSite';
        console.log('  PixelYourSite detectado');
    }

    // GTM detection
    if (window.google_tag_manager) {
        var gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com/gtm.js"]');
        gtmScripts.forEach(function(s) {
            var match = s.src.match(/id=([A-Z0-9-]+)/);
            if (match) {
                capiAnalysis.gtmContainers.push(match[1]);
                console.log('  GTM Container:', match[1]);
            }
        });

        if (window.dataLayer) {
            window.dataLayer.forEach(function(item) {
                if (item.event && (item.event.indexOf('facebook') !== -1 || item.event.indexOf('fb') !== -1)) {
                    capiAnalysis.plugins.gtmIntegration = true;
                    console.log('    Evento GTM de Facebook:', item);
                }
            });
        }
    }

    if (!capiAnalysis.capiSource) {
        console.log('  No se detectó una fuente clara de CAPI');
    }

    // 3. ANALYZE EVENTS & PARAMETERS
    console.log('\n%c ANALIZANDO EVENTOS', 'background: #dc2626; color: white; padding: 5px; border-radius: 3px;');

    var capturedEvents = [];
    var originalFbq = window.fbq;

    if (originalFbq) {
        window.fbq = function() {
            var args = Array.from(arguments);
            capturedEvents.push({
                type: args[0],
                event: args[1],
                params: args[2],
                timestamp: new Date().toISOString()
            });

            if (args[2] && args[2].event_id) {
                console.log('  Event ID detectado (CAPI activo):', args[2].event_id);
                capiAnalysis.serverEvents.push({
                    event: args[1],
                    eventId: args[2].event_id,
                    params: args[2]
                });
            }

            if (args[2] && args[2].external_id) {
                console.log('  External ID detectado:', args[2].external_id);
            }

            return originalFbq.apply(this, arguments);
        };
        console.log('  Interceptor de fbq instalado - Navega por el sitio para capturar eventos');
    } else {
        console.log('  fbq no detectado en esta página');
    }

    // 4. SCAN SCRIPTS FOR CAPI CONFIG
    console.log('\n%c CONFIGURACIÓN EN SCRIPTS', 'background: #0891b2; color: white; padding: 5px; border-radius: 3px;');

    Array.from(document.scripts).forEach(function(script) {
        var content = script.innerHTML;
        if (content.includes('server_event') || content.includes('event_id') ||
            content.includes('external_id') || content.includes('action_source')) {
            console.log('  Script con configuración CAPI encontrado');

            var eventIdMatch = content.match(/event_id['":\s]+([a-zA-Z0-9_-]+)/g);
            if (eventIdMatch) console.log('    Event ID pattern:', eventIdMatch);

            var actionSourceMatch = content.match(/action_source['":\s]+(['"])(.*?)\1/);
            if (actionSourceMatch) {
                capiAnalysis.implementation = actionSourceMatch[2];
                console.log('    Action Source:', actionSourceMatch[2]);
            }
        }

        if (content.includes('anytrack') && content.includes('facebook')) {
            capiAnalysis.plugins.anytracFbIntegration = true;
        }
    });

    // 5. WOOCOMMERCE-CAPI CONFIG
    console.log('\n%c WOOCOMMERCE-CAPI', 'background: #10b981; color: white; padding: 5px; border-radius: 3px;');

    if (window.wp && window.wp.hooks) {
        console.log('  WordPress Hooks disponibles');
        ['added_to_cart', 'removed_from_cart', 'checkout_completed'].forEach(function(hook) {
            if (window.wp.hooks.hasFilter(hook)) {
                console.log('    Hook activo:', hook);
            }
        });
    }

    if (window.wc_add_to_cart_params) {
        console.log('  WooCommerce params:', window.wc_add_to_cart_params);
    }

    // 6. MONITOR ADD-TO-CART
    ['click', 'submit'].forEach(function(eventType) {
        document.addEventListener(eventType, function(e) {
            if (e.target.classList.contains('add_to_cart_button') ||
                e.target.classList.contains('single_add_to_cart_button')) {
                console.log('  Add to Cart detectado');
                setTimeout(function() {
                    if (capturedEvents.length > 0) {
                        var last = capturedEvents[capturedEvents.length - 1];
                        if (last.event === 'AddToCart' && last.params && last.params.event_id) {
                            console.log('    CAPI activo para AddToCart:', last.params.event_id);
                        }
                    }
                }, 100);
            }
        }, true);
    });

    // 7. DIAGNOSIS
    setTimeout(function() {
        console.log('\n%c DIAGNÓSTICO CAPI', 'background: #059669; color: white; font-size: 14px; padding: 10px; border-radius: 5px;');
        console.log('%c' + '='.repeat(50), 'color: #059669;');

        console.log('\n  PIXEL IDs:', capiAnalysis.pixelIds.length ? capiAnalysis.pixelIds.join(', ') : 'Ninguno detectado');
        console.log('  FUENTE CAPI:', capiAnalysis.capiSource || 'No detectada');
        console.log('  GTM:', capiAnalysis.gtmContainers.length ? capiAnalysis.gtmContainers.join(', ') : 'No detectado');

        if (capiAnalysis.plugins.anytrack) {
            console.log('\n  AnyTrack sincroniza automáticamente eventos browser con server-side');
            console.log('    Verifica en: https://dashboard.anytrack.io');
        }

        console.log('\n  EVENTOS CAPTURADOS:', capturedEvents.length);
        capturedEvents.forEach(function(evt) {
            console.log('    ', evt.event + ':', evt.params);
        });

        console.log('\n  RECOMENDACIONES:');
        if (!capiAnalysis.capiSource) {
            console.log('    Implementa CAPI para mejorar tracking post-iOS14');
        }
        console.log('    Verifica Event Match Quality en Facebook Events Manager');
        console.log('    Usa Facebook Pixel Helper extension para validar eventos');

        window.capiAnalysis = capiAnalysis;
        console.log('\n  Resultados en: window.capiAnalysis');
        console.log('  Ejecuta downloadCAPIResults() para descargar JSON');

        window.downloadCAPIResults = function() {
            var dataStr = JSON.stringify(capiAnalysis, null, 2);
            var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            var name = 'capi-analysis_' + (window.location.hostname || 'local') + '_' + new Date().toISOString().slice(0, 10) + '.json';
            var link = document.createElement('a');
            link.setAttribute('href', dataUri);
            link.setAttribute('download', name);
            link.click();
        };
    }, 2000);
})();