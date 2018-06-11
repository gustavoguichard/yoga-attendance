import numeral from 'numeral'
import { compact, deburr, filter, get, map, toLower } from 'lodash'

export const searchInFields = (items, fields, text) => {
  const normalize = txt => deburr(toLower(txt))
  const searchText = normalize(text)
  return filter(items, item =>
    compact(map(fields, field => {
      const fieldValue = get(item, field)
      return normalize(fieldValue).includes(searchText)
    })).length)
}

export const toMoney = amount => `R${numeral(amount).format('$ 0.00')}`
export const percent = (amount, total = 100) => numeral(amount / total).format('0%')

export const isAnotherTeacher = (person, current) => {
  const { teacher, _id } = person
  return teacher && current._id !== _id
}
