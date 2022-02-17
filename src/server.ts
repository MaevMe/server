import createApp from './config/createApp'
import useDiscordAuth from './config/useDiscordAuth'
import api from './utils/api'

import dotenv from 'dotenv'
dotenv.config()

declare module 'express-session' {
  interface SessionData {
    accessToken: string
    tokenType: string
    refreshToken: string
  }
}

const launch = async () => {
  const PORT = process.env.PORT || 5050
  const app = createApp()

  useDiscordAuth(app, 'http://localhost:5050', 'http://localhost:3000')

  app.get(
    '/me',
    (req, res, next) => {
      const { tokenType, accessToken } = req.session
      if (!tokenType || !accessToken) return

      next()
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
