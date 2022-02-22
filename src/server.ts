import createApp from './config/createApp'
import useDiscordAuth from './config/useDiscordAuth'
import api from './utils/api'

import dotenv from 'dotenv'
dotenv.config()

declare module 'express-session' {
  interface SessionData {
    accessToken: string
    tokenType: string
  }
}

const launch = async () => {
  const { URL, CLIENT } = process.env
  const PORT = process.env.PORT || 5050
  const app = createApp()

  useDiscordAuth(app, URL || 'http://localhost:3000', CLIENT || 'http://localhost:3000')

  app.get('/', (req, res) => {
    res.send({ hello: 'world' })
  })

  app.patch(
    '/me',
    (req, res, next) => {
      const { tokenType, accessToken } = req.session

      console.log('@cookies', req.cookies['connect.sid'])

      if (!tokenType || !accessToken)
        return res.send({
          error: 'No tokenType or accessToken in session',
          session: req.session,
        })

      return next()
    },
    async (req, res) => {
      const headers = api.getHeaders(req)
      const { data } = await api.discord.axios.get('https://discord.com/api/users/@me', { headers })

      return res.send(data)
    }
  )

  app.listen(PORT, () => console.log(`🚀 Launched at ${PORT}`))
}

launch()
