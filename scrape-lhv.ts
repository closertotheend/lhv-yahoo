import * as cheerio from 'cheerio';
import * as _ from 'lodash'
import {lhvdb} from "./db";
import {Page} from "puppeteer";
import {closePuppeteer, getPage} from "./puppeteerHelper";

async function stocksFromLHVPage(url: string, page: Page) {
    await page.goto(url, {waitUntil: 'networkidle2'});
    const content = await page.content();
    const $ = cheerio.load(content);
    const stocks = [];
    await $('tbody tr').each((i, e) => {
        const row = $(e).find('.small-text[valign=top]')
        if (row.length < 3) {
            return
        }
        stocks.push({ticker: $(row[0]).text(), name: $(row[1]).text(), market: $(row[2]).text()});
    });
    return stocks;
}

async function getExchanges(page: Page) {
    await page.goto('https://www.lhv.ee/search/shortname.cfm?l3=et&submit=1&type=12001&page=1', {waitUntil: 'networkidle2'});
    const content = await page.content();
    const $ = cheerio.load(content);
    const exchanges: {optionValue: string, exchangeName: string}[] = []
    await $("select.selectbox1").children().each((i, e) => {
        const exchangeName = $(e).text();
        if (!exchangeName) {
            return
        }
        exchanges.push({
            optionValue: $(e).attr().value,
            exchangeName
        })
    })
    return exchanges;
}

async function getLastPageOfExchange(page: Page, optionValue: string) {
    let lastpage = 1;
    await page.goto(`https://www.lhv.ee/search/shortname.cfm?submit=1&type=12001&flag_short=0&flag_game=0&query=&exchange=${optionValue}`, {waitUntil: 'networkidle2'});
    const content = await page.content();
    const $ = cheerio.load(content);
    const paginator = $('table[cellpadding="2"]  > tbody > tr > td.small-text[align=center] a')
    if (paginator.length > 0) {
        lastpage = parseInt(paginator.last().text());
    }
    return lastpage
}

async function scrapeLHVStocks(page: Page) {
    let stocks = [];
    const exchanges = await getExchanges(page);

    for (const {optionValue, exchangeName} of exchanges) {
        const lastPage = await getLastPageOfExchange(page, optionValue);
        let pageNumbers = _.range(1, lastPage + 1);
        for (const pageNumber of pageNumbers) {
            const stocksFromPage = await stocksFromLHVPage(`https://www.lhv.ee/search/shortname.cfm?l3=et&submit=1&type=12001&page=${pageNumber}&exchange=${optionValue}`, page);
            stocks = stocks.concat(stocksFromPage)
            console.log(`Scraping page ${pageNumber} of ${exchangeName}`)
        }
    }
    return stocks;
}

export async function scrapeLhv() {
    const page = await getPage();
    let stocks = await scrapeLHVStocks(page);
    await lhvdb.set('stocks', stocks).write();
    await closePuppeteer();
}
