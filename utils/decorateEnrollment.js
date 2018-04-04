import { get } from 'lodash'

const types = { tuition: 'Avulsa', monthly: 'Mensal', yearly: 'Anual' }

export default (enrollment) => {
  const type = get(types, enrollment.type)
  return {
    ...enrollment,
    type,
    name: `${enrollment.className} - ${type}`,
  }
}
