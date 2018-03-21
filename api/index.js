import feathers from '@feathersjs/feathers'
import auth from '@feathersjs/authentication-client'
import socketio from '@feathersjs/socketio-client'
import storage from '@/utils/feathers-storage'
import io from 'socket.io-client'

const socket = io('http://localhost:3030')
const api = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage }))

export default api
