import { yahoodb, yahooProcessedDb, YahooScrappedRecord} from "./db";
import * as cheerio from 'cheerio';


export function processYahoo() {
    const state = yahooProcessedDb.getState();
    const stocks: YahooScrappedRecord[] = state.stocks;
    const processed = stocks.map(it => {
        console.log("ticker", it.ticker)
        const $ = cheerio.load(it.yahooPageContent);
        return {
            "ticker": it.ticker,
            "name": it.name,
            "market": it.market,
            "url": it.url,
            "50-day moving average": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div.Fl\\(end\\).W\\(50\\%\\).smartphone_W\\(100\\%\\) > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(6) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "200-day moving average": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div.Fl\\(end\\).W\\(50\\%\\).smartphone_W\\(100\\%\\) > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(7) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "52-week high": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div.Fl\\(end\\).W\\(50\\%\\).smartphone_W\\(100\\%\\) > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(4) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "52-week low": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div.Fl\\(end\\).W\\(50\\%\\).smartphone_W\\(100\\%\\) > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(5) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "52-week change": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div.Fl\\(end\\).W\\(50\\%\\).smartphone_W\\(100\\%\\) > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(2) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),

            "Market cap (intra-day)": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(1) > div > div > div > div > table > tbody > tr.Bxz\\(bb\\).H\\(36px\\).BdY.Bdc\\(\\$seperatorColor\\).fi-row.Bgc\\(\\$hoverBgColor\\)\\:h > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "Trailing PE": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(1) > div > div > div > div > table > tbody > tr:nth-child(3) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "Price/sales": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(1) > div > div > div > div > table > tbody > tr:nth-child(6) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "Price/book": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(1) > div > div > div > div > table > tbody > tr:nth-child(7) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),

            "Operating Margin (ttm)": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(3) > div > div:nth-child(2) > div > div > table > tbody > tr.Bxz\\(bb\\).H\\(36px\\).BdB.Bdbc\\(\\$seperatorColor\\) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),

            "Return on Assets": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(3) > div > div:nth-child(3) > div > div > table > tbody > tr.Bxz\\(bb\\).H\\(36px\\).BdY.Bdc\\(\\$seperatorColor\\) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "Return on Equity": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(3) > div > div:nth-child(3) > div > div > table > tbody > tr.Bxz\\(bb\\).H\\(36px\\).BdB.Bdbc\\(\\$seperatorColor\\) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),

            "Quarterly revenue growth (yoy)": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(3) > div > div:nth-child(4) > div > div > table > tbody > tr:nth-child(3) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "Quarterly earnings growth (yoy)": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(3) > div > div:nth-child(4) > div > div > table > tbody > tr:nth-child(8) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),

            "Total debt/equity (mrq)": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(3) > div > div:nth-child(5) > div > div > table > tbody > tr:nth-child(4) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "Book value per share": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(3) > div > div:nth-child(5) > div > div > table > tbody > tr:nth-child(6) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),

            "Operating cash flow (ttm)": $(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(3) > div > div:nth-child(6) > div > div > table > tbody > tr.Bxz\\(bb\\).H\\(36px\\).BdY.Bdc\\(\\$seperatorColor\\) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html(),
            "Levered free cash flow (ttm)": $(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(3) > div > div:nth-child(6) > div > div > table > tbody > tr.Bxz\\(bb\\).H\\(36px\\).BdB.Bdbc\\(\\$seperatorColor\\) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html(),

            "% held by institutions": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div.Fl\\(end\\).W\\(50\\%\\).smartphone_W\\(100\\%\\) > div > div:nth-child(2) > div > div > table > tbody > tr:nth-child(6) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),

            "Forward annual dividend yield": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div.Fl\\(end\\).W\\(50\\%\\).smartphone_W\\(100\\%\\) > div > div:nth-child(3) > div > div > table > tbody > tr:nth-child(2) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "Trailing Annual Dividend Yield": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div.Fl\\(end\\).W\\(50\\%\\).smartphone_W\\(100\\%\\) > div > div:nth-child(3) > div > div > table > tbody > tr:nth-child(4) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "5-year average dividend yield": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div.Fl\\(end\\).W\\(50\\%\\).smartphone_W\\(100\\%\\) > div > div:nth-child(3) > div > div > table > tbody > tr:nth-child(5) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html()),
            "Payout ratio": parseFloatAndPercent($(`#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div.Fl\\(end\\).W\\(50\\%\\).smartphone_W\\(100\\%\\) > div > div:nth-child(3) > div > div > table > tbody > tr:nth-child(6) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)`).html())
        };
    });
    yahoodb.set('stocks', processed).write()
}

function parseFloatAndPercent(s: string){
    try {
        return parseFloat(s.replace('%', ''))
    } catch (e) {
        return null
    }
}
