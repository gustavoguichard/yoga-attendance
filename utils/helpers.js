import numeral from 'numeral'
import { compact, deburr, filter, includes, get, map, toLower } from 'lodash'

export const searchInFields = (items, fields, text) => {
  const searchText = deburr(toLower(text))
  return filter(items, item =>
    compact(map(fields, field =>
      includes(deburr(toLower(get(item, field))), searchText)
    )).length)
}

export const toMoney = amount => `R${numeral(amount).format('$ 0.00')}`
export const percent = (amount, total = 100) => numeral(amount / total).format('0%')
