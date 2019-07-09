import { storage } from '@/api/firebase'

export const uploadPicture = async (object, { image, name }) => {
  const time = new Date().getTime().toString()
  const result = await storage
    .ref()
    .child('practitioners')
    .child(object._id || time)
    .child(name)
    .put(image)
  const photoURL = await result.ref.getDownloadURL()
  return { ...object, picture: photoURL }
}
