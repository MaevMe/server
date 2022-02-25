import express from 'express'
import expressSession from 'express-session'
import cookieParser from 'cookie-parser'
import corsPackage from 'cors'
// const MongoDBStore = require('connect-mongodb-session')(session);
import mongoStore from 'connect-mongodb-session'
import mongoose from 'mongoose'

const createApp = () => {
  if (!process.env.SECRET || !process.env.MONGO) throw new Error('🚨 Missing Secret in .env')

  const app = express()

  app.use(
    corsPackage({
      // origin: (origin, callback) => {
      //   if (!origin) return callback(null, true)
      // const whitelist = ['https://www.maev.me', /^.+maev\.me$/, 'https://maev.me']

      //   if (whitelist.indexOf(origin) === -1) {
      //     const message = `The CORS policy for this origin doesn't allow access from the particular origin.`
      //     return callback(new Error(message), false)
      //   }

      //   return callback(null, true)
      // },
      origin: ['https://www.maev.me', /^.+maev\.me$/, 'https://maev.me'],
      credentials: true,
    })
  )

  app.use(express.json())
  app.use(cookieParser(process.env.SECRET))
  // app.set('trust proxy', 10)

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
      store,
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
