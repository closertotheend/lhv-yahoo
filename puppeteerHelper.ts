import * as puppeteer from 'puppeteer'

let browser;
let page;

export async function getPage() {
    if (!browser) {
        browser = await puppeteer.launch({headless: true});
    }
    if (!page) {
        page = await browser.newPage();
    }
    return page;
}

export async function closePuppeteer() {
    if (browser) {
        await browser.close()
        browser = null
        page = null
    }
}

