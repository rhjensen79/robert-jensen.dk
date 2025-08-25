// Fix JavaScript console errors and improve performance

// Prevent Cloudflare Rocket Loader conflicts
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFixes);
    } else {
        initFixes();
    }
    
    function initFixes() {
        // Fix potential undefined variables
        if (typeof preconnect === 'undefined') {
            window.preconnect = function() {};
        }
        
        // Ensure console methods exist (for older browsers)
        if (!window.console) {
            window.console = {
                log: function() {},
                warn: function() {},
                error: function() {}
            };
        }
        
        // Fix theme switcher if it exists
        const themeSwitcher = document.querySelector('.themeswitch a');
        if (themeSwitcher && !themeSwitcher.onclick && !themeSwitcher.href) {
            themeSwitcher.href = '#';
            themeSwitcher.onclick = function(e) {
                e.preventDefault();
                // Theme switching logic handled by main theme JS
                return false;
            };
        }
        
        // Add error handling for missing elements
        const missingElements = document.querySelectorAll('a:not([href])');
        missingElements.forEach(function(link) {
            if (!link.href && !link.onclick) {
                link.href = '#';
                link.onclick = function(e) {
                    e.preventDefault();
                    return false;
                };
            }
        });
    }
    
    // Global error handler to catch and suppress minor errors
    window.addEventListener('error', function(e) {
        // Suppress Cloudflare Rocket Loader errors
        if (e.message && e.message.includes('preconnect')) {
            e.preventDefault();
            return true;
        }
        
        // Suppress Identifier 'preconnect' has already been declared errors
        if (e.message && e.message.includes('Identifier') && e.message.includes('preconnect')) {
            e.preventDefault();
            return true;
        }
        
        // Log other errors for debugging
        console.warn('Suppressed error:', e.message);
        return false;
    });
    
})();