import { get } from 'lodash'

const types = { tuition: 'Avulsa', monthly: 'Mensal', yearly: 'Anual' }

export default (enrollment) => ({
  ...enrollment,
  type: get(types, enrollment.type),
})
