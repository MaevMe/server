import express from 'express'
import expressSession from 'express-session'
import cookieParser from 'cookie-parser'
import corsPackage from 'cors'
// const MongoDBStore = require('connect-mongodb-session')(session);
import mongoStore from 'connect-mongodb-session'
import mongoose from 'mongoose'

const createApp = () => {
  const app = express()

  app.use(
    corsPackage({
      origin: 'https://www.maev.me',
      credentials: true,
    })
  )

  if (!process.env.SECRET || !process.env.MONGO) throw new Error('🚨 Missing Secret in .env')
  // trust proxy sets the session cookie on the backend
  // app.enable('trust proxy')

  app.use(express.json())
  app.use(cookieParser())
  app.set('trust proxy', 10)

  const MongoStore = mongoStore(expressSession)
  const store = new MongoStore({
    uri: process.env.MONGO,
    collection: 'sessions',
  })

  const connection = mongoose.connection

  connection.on('error', err => {
    console.log('@mongo connection', err)
  })

  app.use(
    expressSession({
      // store,
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: true,
        sameSite: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 6.75,
      },
    })
  )

  return app
}

export default createApp
