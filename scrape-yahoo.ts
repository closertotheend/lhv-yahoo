import {lhvdbCopy, yahooProcessedDb} from "./db";
import {Page} from "puppeteer";
import {closePuppeteer, getPage} from "./puppeteerHelper";
import * as cheerio from 'cheerio';

const EXCHANGE_AND_SUFFIX = {
    'Tallinn Stock Exchange': '.TL',
    'Riga Stock Exchange': '.RG',
    'Vilnius Stock Exchange': null,
    'Helsinki Stock Exchange': '.HE',
    'Stockholm Stock Exchange': '.ST',
    'American Stock Exchange': '',
    'NASDAQ': '',
    'New York Stock Exchange': '',
    'XETRA': '.F',
    'Australian Securities Exchange': '.AX',
    'Belgrade Stock Exchange': null,
    'Bucharest Stock Exchange': null,
    'Budapest Stock Exchange': null,
    'Bulgarian Stock Exchange': null,
    'Copenhagen Stock Exchange': '.CO',
    'Eurex Deutsche Börse': '.F',
    'Euronext Paris Monep': '.PA',
    'Hong Kong Exchanges': '.HK',
    'London Stock Exchange': '.L',
    'London Stock Exchange IOB': '.IL',
    'Mexican Stock Exchange': '.MX',
    'Milano Stock Exchange': '.MI',
    'Moscow Interbank Currency Exchange': '.ME',
    'Society des Bourses Francaises': '.PA',
    'Toronto Stock Exchange': '.TO',
    'Vienna Stock Exchange': '.VI',
    'Warsaw Stock Exchange': null,
    'Zagreb Stock Exchange': null
}

async function getPageContent(url: string, page: Page) {
    try {
        await page.goto(url, {timeout: 10000});
    } catch (e) {
        console.error(e)
    }
    if (await page.$("button.btn.primary") !== null) {
        await page.click("button.btn.primary")
    }
    await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
    });
    try {
        await page.waitForNavigation({timeout: 10000});
    } catch (e) {
        console.error(e)
    }
    return await page.content();
}

type LhvStockRecord = { ticker: string, name: string, market: string };

function getSuffix(stock: LhvStockRecord) {
    return EXCHANGE_AND_SUFFIX[stock.market];
}

export async function scrapeYahoo() {
    const page = await getPage();
    const lhvDb = await lhvdbCopy.getState();
    const stocks: LhvStockRecord[] = lhvDb.stocks;
    yahooProcessedDb.defaults({stocks: []}).write();
    const lowDbStocks = yahooProcessedDb.get('stocks') as any;
    for await (const stock of stocks) {
        let suffix = getSuffix(stock);
        if(lowDbStocks.find(it => it.ticker === stock.ticker).value()){
            continue;
        }
        if (suffix === null) {
            continue;
        }
        const tickerAdjusted = `${stock.ticker}${suffix}`;
        const url = `https://uk.finance.yahoo.com/quote/${tickerAdjusted}/key-statistics?p=${tickerAdjusted}`;
        const yahooRawPageContent = await getPageContent(url, page);

        const $ = cheerio.load(yahooRawPageContent);
        const $Main = $('#Main');
        if ($Main.length === 0) {
            continue;
        }
        const yahooPageContent = $Main.html();

        (lowDbStocks as any)
            .push({...stock, tickerAdjusted, url, yahooPageContent})
            .write();
        console.log(stock.ticker);
    }
    await closePuppeteer();
}
