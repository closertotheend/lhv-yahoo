import {scoredb, yahoodb} from "./db";
import * as _ from 'lodash'


function calculateScore() {
    const state = yahoodb.getState().stocks;

    const pe = _.orderBy(state.filter(it => it["Trailing PE"]), ["Trailing PE"], ["desc"]);
    const om = _.orderBy(state.filter(it => it["Operating Margin (ttm)"]), ["Operating Margin (ttm)"]);
    const roa = _.orderBy(state.filter(it => it["Return on Assets"]), ["Return on Assets"]);
    const roe = _.orderBy(state.filter(it => it["Return on Equity"]), ["Return on Equity"]);
    const qrg = _.orderBy(state.filter(it => it["Quarterly revenue growth (yoy)"]), ["Quarterly revenue growth (yoy)"]);
    const qeg = _.orderBy(state.filter(it => it["Quarterly earnings growth (yoy)"]), ["Quarterly earnings growth (yoy)"]);
    const de = _.orderBy(state.filter(it => it["Total debt/equity (mrq)"]), ["Total debt/equity (mrq)"], ["desc"]);
    const tady = _.orderBy(state.filter(it => it["Trailing Annual Dividend Yield"]), ["Trailing Annual Dividend Yield"]);

    const scored = state.map(it => ({
        ...it,
        score:
            pe.findIndex(that => that.ticker === it.ticker) +
            om.findIndex(that => that.ticker === it.ticker) +
            roa.findIndex(that => that.ticker === it.ticker) +
            roe.findIndex(that => that.ticker === it.ticker)+
            qrg.findIndex(that => that.ticker === it.ticker)+
            qeg.findIndex(that => that.ticker === it.ticker)+
            de.findIndex(that => that.ticker === it.ticker)+
            tady.findIndex(that => that.ticker === it.ticker)
    }));
    const scoredSorted = _.orderBy(scored, ["score"], ["desc"]);
    scoredb.set('stocks', scoredSorted).write();
}


(async () => {
    calculateScore();
})()
