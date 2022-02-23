import express from 'express'
import expressSession from 'express-session'
import cookieParser from 'cookie-parser'
import corsPackage from 'cors'

const createApp = () => {
  const app = express()

  app.use(
    corsPackage({
      origin: 'https://base-client.vercel.app',
      credentials: true,
    })
  )

  app.use(express.json())
  app.use(cookieParser())

  app.use(
    expressSession({
      secret: 'cat',
      cookie: {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 6.75,
      },
    })
  )

  return app
}

export default createApp
