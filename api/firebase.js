import firebase from 'firebase/app'
import 'firebase/storage'

const config = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: 'centroiyengar.firebaseapp.com',
  databaseURL: 'https://centroiyengar.firebaseio.com',
  projectId: 'centroiyengar',
  storageBucket: process.env.FIREBASE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

if (!firebase.apps.length) firebase.initializeApp(config)

export const storage = firebase.storage()

export default firebase
