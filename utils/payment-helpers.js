import { find, includes, map, replace, some, sumBy, toInteger } from 'lodash'
import { toMoney } from '@/utils/helpers'
import decorate from '@/utils/decorateEnrollment'

export const calculateEnrollment = ({ enrollmentPrice, data, discount, note }) => {
  const { name } = decorate(data)
  const { value } = find(data.pricing, p => p._id === enrollmentPrice) || { value: 0 }
  const result = { name, note }
  if (includes(discount, '%')) {
    const perc = 100 - toInteger(replace(discount, '%', ''))
    return { ...result, discount: `Desconto: ${discount}`, value, total: (value * perc) / 100 }
  } else if (includes(discount, '-')) {
    return { ...result, discount: `Desconto: ${toMoney(discount)}`, value, total: value + (discount * 1) }
  } else if (discount) {
    return { ...result, discount: 'Valor combinado', value, total: discount * 1 }
  }
  return { ...result, value, total: value }
}

export const calculatePayment = ({ enrollments, family }) => {
  const hasRegularClass = some(enrollments, e => !e.data.classroom)
  const familyDiscount = (hasRegularClass && family.length) ? -10 : 0
  const payments = map(enrollments, calculateEnrollment)
  const detailing = familyDiscount
    ? [...payments, { name: 'Desconto família', value: familyDiscount, total: familyDiscount }]
    : payments
  return {
    detailing,
    total: Math.max(sumBy(detailing, 'total'), 0),
  }
}

export const describePayment = person => {
  const calculate = calculatePayment(person)
  return {
    detailing: map(calculate.detailing, p =>
      ({ ...p, total: toMoney(p.total), value: toMoney(p.value) })
    ),
    total: toMoney(calculate.total),
  }
}
