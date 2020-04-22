import {scoredb, yahoodb} from "./db";
import * as _ from 'lodash'
import {scrapeLhv} from "./scrape-lhv";
import {scrapeYahoo} from "./scrape-yahoo";
import {processYahoo} from "./process-yahoo";


function calculateScore() {
    const state = yahoodb.getState().stocks;

    const pe = _.orderBy(state.filter(it => it["Trailing PE"]), ["Trailing PE"], ["desc"]);
    const ps = _.orderBy(state.filter(it => it["Price/sales"]), ["Price/sales"], ["desc"]);
    const pb = _.orderBy(state.filter(it => it["Price/book"]), ["Price/book"], ["desc"]);

    const om = _.orderBy(state.filter(it => it["Operating Margin (ttm)"]), ["Operating Margin (ttm)"]);

    const roa = _.orderBy(state.filter(it => it["Return on Assets"]), ["Return on Assets"]);
    const roe = _.orderBy(state.filter(it => it["Return on Equity"]), ["Return on Equity"]);

    const qrg = _.orderBy(state.filter(it => it["Quarterly revenue growth (yoy)"]), ["Quarterly revenue growth (yoy)"]);
    const qeg = _.orderBy(state.filter(it => it["Quarterly earnings growth (yoy)"]), ["Quarterly earnings growth (yoy)"]);

    const de = _.orderBy(state.filter(it => it["Total debt/equity (mrq)"]), ["Total debt/equity (mrq)"], ["desc"]);
    const tady = _.orderBy(state.filter(it => it["Trailing Annual Dividend Yield"]), ["Trailing Annual Dividend Yield"]);
    const fiveyeardiv = _.orderBy(state.filter(it => it["5-year average dividend yield"]), ["5-year average dividend yield"]);
    const payr = _.orderBy(state.filter(it => it["Payout ratio"]), ["Payout ratio"], ["desc"]);

    const change52 = _.orderBy(state.filter(it => it["52-week change"]), ["52-week change"], ["desc"]);

    const scored = state.map(it => ({
        ...it,
        score:
            0.5 * pe.findIndex(that => that.ticker === it.ticker) +
            0.5 * ps.findIndex(that => that.ticker === it.ticker) +
            pb.findIndex(that => that.ticker === it.ticker) +
            om.findIndex(that => that.ticker === it.ticker) +
            2 * roa.findIndex(that => that.ticker === it.ticker) +
            roe.findIndex(that => that.ticker === it.ticker) +
            2 * qrg.findIndex(that => that.ticker === it.ticker) +
            qeg.findIndex(that => that.ticker === it.ticker) +
            de.findIndex(that => that.ticker === it.ticker) +
            tady.findIndex(that => that.ticker === it.ticker)+
            fiveyeardiv.findIndex(that => that.ticker === it.ticker)+
            payr.findIndex(that => that.ticker === it.ticker) +
            change52.findIndex(that => that.ticker === it.ticker)
    }));
    const scoredSorted = _.orderBy(scored, ["score"], ["desc"]);
    scoredb.set('stocks', scoredSorted).write();
}


try {
    (async () => {
        // scrapeLhv()
        // scrapeYahoo()
        // processYahoo()
        // calculateScore();
    })()
} catch (e) {
    console.error(e)
}
