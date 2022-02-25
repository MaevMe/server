import expressSession from 'express-session'
import mongoStore from 'connect-mongodb-session'
import mongoose from 'mongoose'

const createStore = () => {
  if (!process.env.MONGO) throw new Error('🚨 Missing Mongo in .env')

  const MongoStore = mongoStore(expressSession)
  const store = new MongoStore({
    uri: process.env.MONGO,
    collection: 'sessions',
  })

  mongoose.connection.on('error', err => {
    console.error('@mongo store:', err)
  })

  return store
}

export default createStore
