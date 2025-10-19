// Universal browser theme support
class UniversalThemeManager {
    constructor() {
        this.themes = {
            light: {
                primary: '#d4af37',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                containerBg: 'rgba(255, 255, 255, 0.95)'
            },
            dark: {
                primary: '#b8941f',
                background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
                containerBg: 'rgba(45, 45, 45, 0.95)'
            }
        };
        this.init();
    }

    init() {
        this.applyUniversalTheme();
        this.setupColorSchemeListener();
        this.detectAndApplyBrowserSpecificStyles();
    }

    applyUniversalTheme() {
        // Apply CSS variables that work in all browsers
        const root = document.documentElement;
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = isDarkMode ? this.themes.dark : this.themes.light;
        
        root.style.setProperty('--theme-primary', theme.primary);
        root.style.setProperty('--theme-background', theme.background);
        root.style.setProperty('--theme-container-bg', theme.containerBg);
        
        this.updateMetaThemeColor(theme.primary);
    }

    updateMetaThemeColor(color) {
        // Update theme-color meta tags (ignored by unsupported browsers)
        const themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta) {
            themeMeta.content = color;
        }
        
        // Update Windows-specific meta tags
        const msTileColor = document.querySelector('meta[name="msapplication-TileColor"]');
        if (msTileColor) {
            msTileColor.content = color;
        }
    }

    detectAndApplyBrowserSpecificStyles() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Add browser-specific classes to body for CSS targeting
        if (userAgent.includes('firefox')) {
            document.body.classList.add('browser-firefox');
        } else if (userAgent.includes('opera') || userAgent.includes('opr/')) {
            document.body.classList.add('browser-opera');
        } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
            document.body.classList.add('browser-safari');
        } else if (userAgent.includes('chrome')) {
            document.body.classList.add('browser-chrome');
        } else if (userAgent.includes('edg/')) {
            document.body.classList.add('browser-edge');
        }
    }

    setupColorSchemeListener() {
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleColorSchemeChange = (e) => {
            const theme = e.matches ? this.themes.dark : this.themes.light;
            const root = document.documentElement;
            
            root.style.setProperty('--theme-primary', theme.primary);
            root.style.setProperty('--theme-background', theme.background);
            root.style.setProperty('--theme-container-bg', theme.containerBg);
            
            this.updateMetaThemeColor(theme.primary);
        };

        // Add listener (modern approach)
        if (colorSchemeQuery.addEventListener) {
            colorSchemeQuery.addEventListener('change', handleColorSchemeChange);
        } 
        // Fallback for older browsers
        else if (colorSchemeQuery.addListener) {
            colorSchemeQuery.addListener(handleColorSchemeChange);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.universalThemeManager = new UniversalThemeManager();
    });
} else {
    window.universalThemeManager = new UniversalThemeManager();
}