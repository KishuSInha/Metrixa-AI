const { chromium } = require("playwright");

let browser = null;
let context = null;
let page = null;

async function getBrowserPage() {
    if (page) return page;

    console.log("Launching Chromium for Metrixa...");
    browser = await chromium.launch({
        headless: false // Visible for trust and manual login if needed
    });

    context = await browser.newContext({
        viewport: { width: 1280, height: 800 }
    });

    page = await context.newPage();

    // Handle closure cleanup
    browser.on('disconnected', () => {
        browser = null;
        context = null;
        page = null;
    });

    return page;
}

async function closeBrowser() {
    if (browser) {
        await browser.close();
    }
}

module.exports = { getBrowserPage, closeBrowser };
