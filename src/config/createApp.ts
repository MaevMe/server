import express from 'express'
import express_session from 'express-session'
import cors from 'cors'

const createApp = () => {
  const app = express()

  // const server = __dirname.split('/').slice(0, -2).join('/')
  // app.use(express.static(server + '/public'))

  if (process.env.ENV === 'PROD') app.set('trust proxy', 1)

  app.use(
    cors({
      origin: process.env.CLIENT || 'http://localhost:3000',
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
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 6.75,
      },
    })
  )

  return app
}

export default createApp
