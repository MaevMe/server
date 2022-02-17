import express from 'express'
import express_session from 'express-session'
import cors from 'cors'

const createApp = () => {
  const app = express()
  const WHITELIST = ['https://maev.me', 'https://api.maev.me', 'https://www.maev.me']

  app.use(
    cors({
      // origin: process.env.CLIENT || 'http://localhost:3000',
      // origin: /^.+maev\.me$/,
      // origin: 'http://localhost:3000',
      origin: (origin, callback) => {
        if (origin && WHITELIST.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          console.log('@origin', origin)
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
    })
  )

  if (!process.env.SECRET) {
    throw new Error('Missing SECRET variable in your .env, which is needed for express-sessions')
  }

  app.use(
    express_session({
      secret: process.env.SECRET,
      cookie: {
        secure: process.env.ENV === 'PROD',
        sameSite: process.env.ENV === 'PROD' ? 'none' : 'lax',
        // sameSite: 'none',
        // secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 6.75,
      },
    })
  )

  return app
}

export default createApp
