import { get, map } from 'lodash'
import { toMoney } from '@/utils/helpers'

const types = { tuition: 'Avulsa', monthly: 'Mensal', yearly: 'Anual' }

export default (enrollment) => {
  const type = get(types, enrollment.type)
  const pricing = map(enrollment.pricing, obj => ({ ...obj, display: `${obj.desc} - ${toMoney(obj.value)}` }))
  return {
    ...enrollment,
    type,
    pricing,
    name: `${enrollment.className} - ${type}`,
  }
}
