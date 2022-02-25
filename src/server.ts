import createApp from './config/createApp'
import useDiscordAuth from './config/useDiscordAuth'
import connectMongo from './config/connectMongo'
import axios from 'axios'
import createRoutes from './config/createRoutes'

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
  await createRoutes('./src/routes', app, 'routes')

  useDiscordAuth(app)

  app.get('/', (req, res) => {
    res.send('Hello world!')
  })

  app.listen(PORT, () => console.log(`🚀 Launched at ${PORT}`))
}

launch()
