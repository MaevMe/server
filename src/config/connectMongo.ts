import mongoose from 'mongoose'

const connectMongo = async () => {
  try {
    if (!process.env.MONGO) throw new Error('🚨 Missing Mongo in .env')

    await mongoose.connect(process.env.MONGO)
    console.log('🙊 MongoDB Connectd')
  } catch (error) {
    console.log('@mongo', error)
  }
}

export default connectMongo
