// Simple text size management without text-size-adjust
class TextSizeManager {
    constructor() {
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        this.init();
    }

    init() {
        this.preventIOSZoom();
        this.applyMobileOptimizations();
    }

    preventIOSZoom() {
        // Critical fix for iOS zoom on input focus
        if (this.isIOS) {
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.style.fontSize = '16px';
            });

            // Add iOS class for CSS targeting
            document.documentElement.classList.add('ios-device');
        }
    }

    applyMobileOptimizations() {
        // Add mobile class for responsive adjustments
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            document.documentElement.classList.add('mobile-device');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new TextSizeManager();
});