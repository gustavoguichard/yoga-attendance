import { filter, pick } from 'lodash'

const classroomFields = ['_id', 'title', 'tuition', 'teacher', 'practitioners', 'regularClass']
const enrollmentFields = ['_id', 'type', 'classId', 'pricing']
const practitionerFields = ['_id', 'fullName', 'nickName', 'email', 'phone', 'birthdate', 'picture', 'family', 'enrollments', 'teacher']

const cleanData = fields => data => pick(data, fields)

export const parsePractitioner = data => {
  const enrollments = filter(data.enrollments, e => !!e.enrollmentId)
  return cleanData(practitionerFields)({ ...data, enrollments })
}

export const parseClassroom = cleanData(classroomFields)

export const parseEnrollment = data => {
  const pricing = filter(data.pricing, pr => pr.desc !== '')
  return cleanData(enrollmentFields)({ ...data, pricing })
}
