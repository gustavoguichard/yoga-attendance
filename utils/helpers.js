import { round } from 'lodash'

export const percent = (amount, total = 100) => `${round((amount / total) * 100)}%`
