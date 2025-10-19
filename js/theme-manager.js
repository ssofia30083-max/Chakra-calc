// Cross-browser theme management
class ThemeManager {
    constructor() {
        this.primaryColor = '#d4af37';
        this.supportsThemeColor = this.detectThemeColorSupport();
        this.init();
    }

    detectThemeColorSupport() {
        // Check if browser supports theme-color meta tag
        const testMeta = document.createElement('meta');
        testMeta.name = 'theme-color';
        testMeta.content = '#ffffff';
        document.head.appendChild(testMeta);

        const supports = testMeta.content !== '';
        document.head.removeChild(testMeta);

        return supports;
    }

    init() {
        this.applyThemeFallbacks();
        this.setupColorSchemeListener();
        this.applyBrowserSpecificThemes();
    }

    applyThemeFallbacks() {
        // Apply CSS variables for consistent theming
        document.documentElement.style.setProperty('--theme-primary', this.primaryColor);

        if (!this.supportsThemeColor) {
            console.log('Browser does not support theme-color, using CSS fallbacks');
            this.applyCSSTheming();
        }
    }

    applyCSSTheming() {
        // Apply visual theming via CSS for unsupported browsers
        const style = document.createElement('style');
        style.textContent = `
            /* Visual theme indicators for browsers without theme-color support */
            .theme-indicator {
                border-left: 4px solid var(--theme-primary, #d4af37);
            }
            
            /* Enhanced focus states for better visual theme */
            button:focus,
            input:focus {
                border-color: var(--theme-primary, #d4af37) !important;
            }
        `;
        document.head.appendChild(style);

        // Add theme indicator class to main container
        document.querySelector('.container')?.classList.add('theme-indicator');
    }

    applyBrowserSpecificThemes() {
        const userAgent = navigator.userAgent.toLowerCase();

        if (userAgent.includes('firefox')) {
            this.applyFirefoxTheme();
        } else if (userAgent.includes('opera')) {
            this.applyOperaTheme();
        }
    }

    applyFirefoxTheme() {
        // Firefox-specific theme enhancements
        document.documentElement.classList.add('browser-firefox');
    }

    applyOperaTheme() {
        // Opera-specific theme enhancements
        document.documentElement.classList.add('browser-opera');
    }

    setupColorSchemeListener() {
        // Listen for system dark/light mode changes
        if (window.matchMedia) {
            const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleColorScheme = (e) => {
                this.updateThemeForColorScheme(e.matches);
            };

            // Add event listener
            if (colorSchemeQuery.addEventListener) {
                colorSchemeQuery.addEventListener('change', handleColorScheme);
            } else {
                colorSchemeQuery.addListener(handleColorScheme);
            }

            // Initial call
            this.updateThemeForColorScheme(colorSchemeQuery.matches);
        }
    }

    updateThemeForColorScheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
        } else {
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
        }
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});