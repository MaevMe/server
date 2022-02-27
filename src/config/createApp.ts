import express from 'express'
import expressSession from 'express-session'
import cookieParser from 'cookie-parser'
import corsPackage from 'cors'
import createStore from './createStore'

// TODO: Test origin variable and samesite setting to true/false rather than true/lax

const createApp = () => {
  if (!process.env.SECRET || !process.env.CLIENT) {
    throw new Error('🚨 Missing Secret or Client in .env')
  }

  const app = express()
  const store = createStore()

  app.use(
    corsPackage({
      origin: process.env.CLIENT,
      credentials: true,
    })
  )

  app.use(express.json())
  app.use(cookieParser(process.env.SECRET))

  if (process.env.ENV === 'production') app.set('trust proxy', 1)

  app.use(
    expressSession({
      store,
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.ENV === 'production',
        sameSite: process.env.ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 6.75,
      },
    })
  )

  return app
}

export default createApp
