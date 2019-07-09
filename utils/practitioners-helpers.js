import { storage } from '@/api/firebase'

export const uploadPicture = async (object, file) => {
  const time = new Date().getTime().toString()
  const result = await storage
    .ref()
    .child('practitioners')
    .child(object._id || time)
    .child(file.name)
    .put(file)
  const photoURL = await result.ref.getDownloadURL()
  return { ...object, picture: photoURL }
}
