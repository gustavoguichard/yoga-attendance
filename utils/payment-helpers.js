import moment from 'moment'
import { compact, get, groupBy, join, map, sumBy } from 'lodash'
import { sortByKey } from '@/utils/helpers'
import { getPrevDate } from '@/utils/date-helpers'

const classId = classroom => classroom.regularClass ? null : classroom._id

export const buildIndex = (practitionerId, months, classroom) => {
  const date = getPrevDate('month', months)
  const month = moment(date).format('YYYY-MM')
  return join(compact([practitionerId, classId(classroom), month]), '_')
}

export const formattedFrequency = (frequency, find, months, lesson) => {
  const grouped = groupBy(frequency, item => `${get(item, 'practitioner.displayName')}_${item.practitionerId}`)
  const sorted = sortByKey(grouped)
  const result = map(sorted, freq => {
    const sample = freq[0]
    const person = sample.practitioner
    const freqInClass = lesson ? freq.filter(f => f.classId === lesson._id) : []
    const index = buildIndex(sample.practitionerId, months, lesson || { regularClass: true })
    const payments = person ? find({ query: { index } }).data : []
    const payment = payments.map(({ _id, totalPaid, total, status, note }) =>
      ({ _id, totalPaid, total, status, note })
    )
    const percent = (freqInClass.length || freq.length) / freq.length
    const totalPaid = Math.round(sumBy(payment, 'totalPaid') * percent)
    const debth = (sumBy(payment, 'total') - totalPaid) * percent
    return {
      person,
      percent,
      payment,
      totalPaid,
      debth,
      total: freq.length,
      frequency: freqInClass.length,
    }
  })
  return result
}
