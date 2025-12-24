// ============================================
// IN-APP BROWSER DETECTION
// ============================================
// Detected: TikTok, Facebook, Instagram
(function () {
    const ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

    // Also check for ?test=true in URL for debugging
    const urlParams = new URLSearchParams(window.location.search);
    const isTest = urlParams.get('test') === 'true';

    // Comprehensive detection
    const isInstagram = ua.indexOf('instagram') > -1;
    const isFacebook = ua.indexOf('fbav') > -1 || ua.indexOf('fban') > -1 || ua.indexOf('fbiossdk') > -1;
    const isTikTok = ua.indexOf('tiktok') > -1 || ua.indexOf('musical_ly') > -1 || ua.indexOf('bytedance') > -1;

    // Generic WebView detection (often used by in-app browsers)
    // Checks for 'wv' (Android WebView) or 'Line' (Line app) or 'Snapchat'
    // but excludes standalone Chrome/Safari explicitly if possible to avoid false positives?
    // For now, sticking to the specific requested apps + robust TikTok check logic.

    const isInApp = isInstagram || isFacebook || isTikTok || isTest;

    if (isInApp) {
        const showPopup = () => {
            const popup = document.getElementById('in-app-browser-popup');
            if (popup) {
                popup.classList.remove('hidden');
                // Ensure it stays on top and blocks interaction
                popup.style.display = 'flex';
                // Prevent scrolling on body
                document.body.style.overflow = 'hidden';

                // Close when clicking outside (on the background)
                popup.addEventListener('click', (e) => {
                    if (e.target === popup) {
                        popup.classList.add('hidden');
                        popup.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showPopup);
        } else {
            showPopup();
        }
    }
})();

// ============================================
// DOMAIN LOCK PROTECTION
// ============================================
// Redirects to official site if page is used on unauthorized domain

(function () {
    'use strict';

    // Official domain (without protocol)
    const officialDomain = 'qrclash.pages.dev';
    const officialUrl = 'https://qrclash.pages.dev/';

    // Get current hostname
    const currentHostname = window.location.hostname;

    // Check if current domain matches official domain
    if (currentHostname !== officialDomain && currentHostname !== 'www.' + officialDomain) {
        // Also check if not running locally (for development)
        if (currentHostname !== 'localhost' &&
            currentHostname !== '127.0.0.1' &&
            !currentHostname.startsWith('192.168.') &&
            !currentHostname.startsWith('10.') &&
            currentHostname !== '') {

            // Redirect to official site
            window.location.replace(officialUrl);

            // Backup redirect methods
            setTimeout(function () {
                window.location.href = officialUrl;
            }, 100);

            // Stop page execution
            throw new Error('Unauthorized domain');
        }
    }

    // Additional check - prevent iframe embedding from other domains
    if (window.self !== window.top) {
        try {
            if (window.top.location.hostname !== officialDomain &&
                window.top.location.hostname !== 'www.' + officialDomain) {
                window.top.location.replace(officialUrl);
            }
        } catch (e) {
            // If we can't access parent frame (cross-origin), redirect anyway
            window.location.replace(officialUrl);
        }
    }

})();

// ============================================
// COPY PROTECTION SYSTEM
// ============================================
// Multiple layers of protection to prevent content copying

(function () {
    'use strict';

    // Disable right-click context menu
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    }, false);

    // Disable text selection
    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
        return false;
    }, false);

    // Disable copy event
    document.addEventListener('copy', function (e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', '');
        return false;
    }, false);

    // Disable cut event
    document.addEventListener('cut', function (e) {
        e.preventDefault();
        return false;
    }, false);

    // Disable keyboard shortcuts for copying
    document.addEventListener('keydown', function (e) {
        // Ctrl+C, Ctrl+X, Ctrl+A, Ctrl+U (view source), Ctrl+S (save), F12 (dev tools)
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C' ||
            e.key === 'x' || e.key === 'X' ||
            e.key === 'a' || e.key === 'A' ||
            e.key === 'u' || e.key === 'U' ||
            e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            return false;
        }

        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (dev tools)
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' ||
                e.key === 'J' || e.key === 'j' ||
                e.key === 'C' || e.key === 'c'))) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+Shift+K (Firefox console)
        if (e.ctrlKey && e.shiftKey && (e.key === 'K' || e.key === 'k')) {
            e.preventDefault();
            return false;
        }
    }, false);

    // Disable drag and drop
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
        return false;
    }, false);

    // Apply CSS to prevent text selection
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
        }
        
        input, textarea {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
        
        img {
            pointer-events: none !important;
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
        }
    `;
    document.head.appendChild(style);

    // Detect and prevent screenshot tools (limited effectiveness)
    document.addEventListener('keyup', function (e) {
        // Print Screen detection (limited)
        if (e.key === 'PrintScreen') {
            navigator.clipboard.writeText('');
        }
    }, false);

    // Prevent image saving
    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            return false;
        });
        img.setAttribute('draggable', 'false');
    });

    // Monitor for new images added dynamically
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.tagName === 'IMG') {
                    node.addEventListener('contextmenu', function (e) {
                        e.preventDefault();
                        return false;
                    });
                    node.setAttribute('draggable', 'false');
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Disable printing
    window.addEventListener('beforeprint', function (e) {
        e.preventDefault();
        return false;
    }, false);

    window.addEventListener('afterprint', function (e) {
        e.preventDefault();
        return false;
    }, false);

    // Override print function
    window.print = function () {
        return false;
    };

    // Detect DevTools opening (basic detection)
    let devtoolsOpen = false;
    const threshold = 160;

    setInterval(function () {
        if (window.outerWidth - window.innerWidth > threshold ||
            window.outerHeight - window.innerHeight > threshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                // Optional: redirect or show warning
                // window.location.href = 'about:blank';
            }
        } else {
            devtoolsOpen = false;
        }
    }, 1000);

    // Disable console
    if (typeof console !== 'undefined') {
        console.log = function () { };
        console.warn = function () { };
        console.error = function () { };
        console.info = function () { };
        console.debug = function () { };
    }

    // Watermark overlay (invisible but detectable)
    const watermark = document.createElement('div');
    watermark.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        background: transparent;
    `;
    watermark.setAttribute('data-protection', 'active');
    document.body.appendChild(watermark);

})();

// ============================================
// MAIN APPLICATION CODE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const step1 = document.getElementById('step-1'); // Select Chest
    const step2 = document.getElementById('step-2'); // User Info
    const step3 = document.getElementById('step-3'); // Generator
    const step4 = document.getElementById('step-4'); // Verify
    const connectBtn = document.getElementById('connect-btn');
    const usernameInput = document.getElementById('username');
    const gemOptions = document.querySelectorAll('.gem-option');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const statusText = document.getElementById('status-text');
    const foundUsername = document.getElementById('found-username');
    const selectedItemImage = document.getElementById('selected-item-image');
    const selectedGemsDisplay = document.getElementById('selected-gems-display');

    // Step 4 Elements
    const finalUsername = document.getElementById('final-username');
    const finalItemImage = document.getElementById('final-item-image');

    let selectedGems = null;
    let selectedImageSrc = null;

    // Gem selection (Step 1 -> Step 2)
    gemOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedGems = option.dataset.gems;
            // Capture the image source
            const img = option.querySelector('img');
            if (img) {
                selectedImageSrc = img.src;
            }

            selectedGemsDisplay.textContent = selectedGems; // Display name directly

            step1.classList.add('hidden');
            step2.classList.remove('hidden');
        });
    });

    // Connect button (Step 2 -> Step 3)
    connectBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();

        if (!username) {
            alert('Please enter your username');
            return;
        }

        // Set values in Step 3
        foundUsername.textContent = username;
        if (selectedImageSrc) {
            selectedItemImage.src = selectedImageSrc;
            // Set values in Step 4 as well
            finalItemImage.src = selectedImageSrc;
        }
        finalUsername.textContent = username;

        step2.classList.add('hidden');
        step3.classList.remove('hidden');

        simulateProcess();
    });

    function simulateProcess() {
        const steps = [
            { progress: 10, text: 'Connecting to servers...' },
            { progress: 30, text: `Searching for ${usernameInput.value}...` },
            { progress: 50, text: 'Player Found!' },
            { progress: 70, text: 'Extracting Magic Rewards...' },
            { progress: 90, text: 'Finalizing generation...' },
            { progress: 100, text: 'Completed!' }
        ];

        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep >= steps.length) {
                clearInterval(interval);
                setTimeout(() => {
                    step3.classList.add('hidden');
                    step4.classList.remove('hidden');
                }, 1000);
                return;
            }

            const step = steps[currentStep];
            progressBar.style.width = `${step.progress}%`;
            progressText.textContent = `${step.progress}%`;
            statusText.textContent = step.text;

            currentStep++;
        }, 800); // Update every 800ms
    }

    // Stats Animation
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    animateValue(document.getElementById('stat-claimed'), 0, 2040, 2000);
    animateValue(document.getElementById('stat-chests'), 0, 1262, 2000);
    animateValue(document.getElementById('stat-online'), 400, 450, 2000);

    // Live Stats Updates
    function startLiveStats() {
        const claimedEl = document.getElementById('stat-claimed');
        const chestsEl = document.getElementById('stat-chests');
        const onlineEl = document.getElementById('stat-online');

        // Parse current values (remove commas)
        let claimed = 2040;
        let chests = 1262;
        let online = 450;

        setInterval(() => {
            // Random increments/fluctuations
            claimed += Math.floor(Math.random() * 3); // 0-2 new claims
            chests += Math.floor(Math.random() * 2);  // 0-1 new chests
            online += Math.floor(Math.random() * 11) - 5; // -5 to +5 fluctuation

            // Update DOM
            claimedEl.textContent = claimed.toLocaleString();
            chestsEl.textContent = chests.toLocaleString();
            onlineEl.textContent = online.toLocaleString();
        }, 1000);
    }

    // Start live updates after initial animation finishes (approx 2s)
    setTimeout(startLiveStats, 2000);
});
