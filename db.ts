import * as low from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync'

export type LhvStockRecord = { ticker: string, name: string, market: string }
export type YahooScrappedRecord = LhvStockRecord & { tickerAdjusted: string, url: string, yahooPageContent: string }

export const lhvdbCopy = low(new FileSync('lhvdb-copy.json'))
export const yahooProcessedDb = low(new FileSync('yahooProcessed.json'))
export const lhvdb = low(new FileSync('lhvdb.json'))


export const yahoodb = low(new FileSync('yahoodb.json'))
export const scoredb = low(new FileSync('scoredb.json'))
