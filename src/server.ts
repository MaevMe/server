import createApp from './config/createApp'
import useDiscordAuth from './config/useDiscordAuth'
import axios from 'axios'

import dotenv from 'dotenv'
dotenv.config()

declare module 'express-session' {
  interface SessionData {
    accessToken: string
    tokenType: string
  }
}

const launch = async () => {
  const PORT = process.env.PORT || 5050
  const app = createApp()

  useDiscordAuth(app)

  app.get('/', (req, res) => {
    res.send({ hello: 'world' })
  })

  app.patch(
    '/me',
    (req, res, next) => {
      const { tokenType, accessToken } = req.session

      console.log('@me, session:', req.session)

      if (!tokenType || !accessToken) return res.send({ error: 'No tokens stored in session' })

      return next()
    },
    async (req, res) => {
      const { tokenType, accessToken } = req.session

      const headers = {
        authorization: `${tokenType} ${accessToken}`,
      }

      const { data } = await axios.get('https://discord.com/api/users/@me', { headers })
      return res.send(data)
    }
  )

  app.listen(PORT, () => console.log(`🚀 Launched at ${PORT}`))
}

launch()
