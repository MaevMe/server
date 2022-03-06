import createApp from './config/createApp'
import useDiscordAuth from './discord/hooks/useDiscordAuth'
import connectMongo from './config/connectMongo'
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

  const { ENV } = process.env
  const PORT = process.env.PORT || 5050
  const app = createApp()

  await createRoutes(ENV === 'production' ? './build/routes' : './src/routes', app, 'routes')

  useDiscordAuth(app)

  app.get('/', (req, res) => {
    res.send('Hello world!')
  })

  app.listen(PORT, () => console.log(`🚀 Launched at ${PORT}`))
}

launch()
