import express from 'express'
import expressSession from 'express-session'
import cookieParser from 'cookie-parser'
import corsPackage from 'cors'

const cors = {
  origin: [/^.+maev\.me$/, 'https://maev.me', 'https://api.maev.me', 'https://www.maev.me/'],
  credentials: true,
}

const createApp = () => {
  const app = express()

  // app.enable('trust proxy')
  app.use(corsPackage(cors))
  app.use(cookieParser())

  if (!process.env.SECRET) throw new Error('🚨 Missing SECRET variable in .env')

  app.use(
    expressSession({
      secret: process.env.SECRET,
      cookie: {
        secure: process.env.ENV === 'PROD',
        sameSite: process.env.ENV === 'PROD' ? 'strict' : 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 6.75,
        domain: 'maev.me',
      },
    })
  )

  return app
}

export default createApp
