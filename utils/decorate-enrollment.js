import { get, map } from 'lodash'
import { toMoney } from '@/utils/helpers'

const types = { monthly: 'Mensal', yearly: 'Anual' }

export default (enrollment, lesson = {}) => {
  const type = get(types, enrollment.type)
  const className = lesson.title || 'Aulas Regulares'
  const pricing = map(enrollment.pricing, obj => ({ ...obj, display: `${obj.desc} - ${toMoney(obj.value)}` }))
  return {
    ...enrollment,
    type,
    pricing,
    className,
    name: `${className} - ${type}`,
  }
}
