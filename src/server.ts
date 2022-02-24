import createApp from './config/createApp'
import useDiscordAuth from './config/useDiscordAuth'
import connectMongo from './config/connectMongo'
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
  await connectMongo()

  const PORT = process.env.PORT || 5050
  const app = createApp()

  useDiscordAuth(app)

  app.get('/', (req, res) => {
    res.send('Hello world!')
  })

  app.patch(
    '/me',
    (req, res, next) => {
      const { tokenType, accessToken } = req.session

      if (!tokenType || !accessToken) {
        return res.send({ error: 'No tokens stored in session' })
      }

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
