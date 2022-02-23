import axios from 'axios'
import { Express } from 'express'

const useDiscordAuth = (app: Express) => {
  const { CLIENT_ID, CLIENT_SECRET } = process.env
  const scope = encodeURIComponent(['identify', 'guilds'].join(' '))

  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('🚨 Missing Client ID or Client Secret')

  app.get('/forward', (req, res) => {
    const query = [
      `client_id=${CLIENT_ID}`,
      `redirect_uri=${encodeURIComponent('https://base-client.vercel.app' + '/callback')}`,
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
        redirect_uri: 'https://base-client.vercel.app/callback',
        code: code as string,
        grant_type: 'authorization_code',
        scope,
      })

      try {
        // Deal with 401 response
        const { data } = await axios.post('https://discord.com/api/oauth2/token', params)
        const { token_type, access_token } = data

        if (token_type && access_token) {
          req.session.tokenType = token_type
          req.session.accessToken = access_token

          return res.send({ session: req.session })
        }

        return res.send({ error: 'No tokens' })
      } catch (error) {
        console.error('@CALLBACK ERROR:', error)
      }
    }

    return res.send({ error: 'No code' })
  })
}

export default useDiscordAuth
