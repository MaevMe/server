import mongoose from 'mongoose'

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO)
    console.log('🙊 MongoDB Connectd')
  } catch (error) {
    console.log('@mongo', error)
  }
}

export default connectMongo
