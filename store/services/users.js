import api from '@/api'

export const servicePath = 'users'
export const store = {
  instanceDefaults: {},
}

api.service(servicePath).hooks({})
