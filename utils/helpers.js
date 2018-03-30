import {
  compact, get, reduce, includes,
  lowerCase, filter, map, first, split,
  upperCase, orderBy, groupBy,
} from 'lodash'

export const searchInFields = (items, fields, text) => {
  const searchText = lowerCase(text)
  return filter(items, item =>
    compact(
      map(fields, field => includes(lowerCase(get(item, field)), searchText))
    ).length
  )
}

export const applyFnToField = (items, field, fn) =>
  reduce(items, (acc, curr) =>
    [...acc, {
      ...curr,
      [field]: fn(get(curr, field)),
    }], [])
