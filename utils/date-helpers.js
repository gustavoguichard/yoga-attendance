import moment from 'moment'

moment.locale('pt-BR')

export const getPrevDate = (unit = 'month', unitsAgo = 0) =>
  moment().subtract(unitsAgo, unit)

export const getStartOfDate = (unit = 'month', unitsAgo = 0) =>
  getPrevDate(unit, unitsAgo).startOf(unit)

export const getTimeRangeQuery = (unit = 'month', unitsAgo = 0) => ({
  $gte: getPrevDate(unit, unitsAgo).startOf(unit)._d,
  $lt: getPrevDate(unit, unitsAgo).endOf(unit)._d,
})

export const parseDate = (date, format = 'ddd DD/MM/YYYY') =>
  moment(date).format(format)

export const unparseDate = (date) => moment(date)._d

export const unitFromQuery = (units, add = 0) => {
  const base = parseInt(units, 10) || 0
  return Math.max(base + add, 0)
}

export const isInTimeFrame = (date, unit = 'month', unitsAgo = 0) => {
  const range = getTimeRangeQuery(unit, unitsAgo)
  return moment(date).isBetween(range.$gte, range.$lt, null, '[)')
}

export const filterByTimeAgo = (collecion, field, unit = 'month', unitsAgo = 0) =>
  collecion.filter(item => isInTimeFrame(item[field], unit, unitsAgo))

export const filterByTimeRange = (collecion, field, range) =>
  collecion.filter(item => moment(item[field]).isBetween(range.$gte, range.$lt, null, '[)'))
