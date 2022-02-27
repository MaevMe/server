import express from 'express'
import expressSession from 'express-session'
import cookieParser from 'cookie-parser'
import corsPackage from 'cors'
import createStore from './createStore'

const createApp = () => {
  if (!process.env.SECRET) throw new Error('🚨 Missing Secret in .env')

  const app = express()
  const store = createStore()

  app.use(
    corsPackage({
      origin:
        process.env.ENV === 'production'
          ? 'localhost:3000'
          : ['https://www.maev.me', /^.+maev\.me$/, 'https://maev.me'],
      credentials: true,
    })
  )

  app.use(express.json())
  app.use(cookieParser(process.env.SECRET))
  app.set('trust proxy', 1)

  app.use(
    expressSession({
      store,
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        sameSite: process.env.ENV === 'production' ? true : 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 6.75,
      },
    })
  )

  return app
}

export default createApp
