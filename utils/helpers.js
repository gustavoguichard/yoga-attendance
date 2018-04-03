import { compact, deburr, filter, includes, get, map, round, toLower } from 'lodash'

export const percent = (amount, total = 100) => `${round((amount / total) * 100)}%`

export const searchInFields = (items, fields, text) => {
  const searchText = deburr(toLower(text))
  return filter(items, item =>
    compact(map(fields, field =>
      includes(deburr(toLower(get(item, field))), searchText)
    )).length)
}
