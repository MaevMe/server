import mongoose from 'mongoose'

const connectMongo = async () => {
  try {
    if (!process.env.MONGO) throw new Error('🚨 Missing Mongo in .env')

    await mongoose.connect(process.env.MONGO, { sslValidate: true }).then(() => {
      console.log('🙊 MongoDB Connectd')
    })
  } catch (error) {
    console.error('@mongo connection', error)
  }
}

export default connectMongo
