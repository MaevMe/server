import axios from 'axios'
import { Express } from 'express'

const useDiscordAuth = (app: Express) => {
  const scope = encodeURIComponent(['identify', 'guilds'].join(' '))

  const { CLIENT_ID, CLIENT_SECRET } = process.env
  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('🚨 Missing Client ID or Client Secret in .env')

  app.get('/forward', (req, res) => {
    const query = [
      `client_id=${CLIENT_ID}`,
      `redirect_uri=${encodeURIComponent('https://www.maev.me' + '/callback')}`,
      'response_type=code',
      `scope=${scope}`,
    ].join('&')

    return res.redirect('https://discord.com/api' + '/oauth2' + '/authorize' + '?' + query)
  })

  app.post('/callback', async (req, res) => {
    const { code } = req.body

    if (code) {
      const params = new URLSearchParams({
        client_id: CLIENT_ID as string,
        client_secret: CLIENT_SECRET as string,
        redirect_uri: 'https://www.maev.me/callback',
        code: code as string,
        grant_type: 'authorization_code',
        scope,
      })

      try {
        // TODO: Deal with 401 response
        const { data } = await axios.post('https://discord.com/api/oauth2/token', params)
        const { token_type, access_token } = data

        if (!token_type || !access_token) return res.send({ error: 'No token' })

        // TODO: Persist session across requests
        req.session.tokenType = token_type
        req.session.accessToken = access_token
        req.session.save()

        // return res.cookie('access token', access_token).send({ session: req.session })

        return res
          .cookie('accessToken', access_token, {
            expires: new Date(Date.now() + 604800000),
            secure: true,
            sameSite: true,
            httpOnly: true,
          })
          .send({ session: req.session })
      } catch (error) {
        console.error('@callback:', error)
        return res.status(500)
      }
    }

    return res.send({ error: 'No code' })
  })
}

export default useDiscordAuth
