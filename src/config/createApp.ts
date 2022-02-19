import express from 'express'
import express_session from 'express-session'
import cors from 'cors'

const createApp = () => {
  const app = express()

  app.set('trust-proxy', 1)

  app.use(
    cors({
      origin: [/^.+maev\.me$/, 'https://maev.me', 'https://api.maev.me', 'https://www.maev.me/'],
      credentials: true,
    })
  )

  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    // Pass to next layer of middleware
    next()
  })

  if (!process.env.SECRET) {
    throw new Error('Missing SECRET variable in your .env, which is needed for express-sessions')
  }

  app.use(
    express_session({
      secret: process.env.SECRET,
      cookie: {
        secure: process.env.ENV === 'PROD',
        sameSite: process.env.ENV === 'PROD' ? 'none' : 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 6.75,
      },
    })
  )

  return app
}

export default createApp
