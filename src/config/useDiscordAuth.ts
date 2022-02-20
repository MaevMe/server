import { Express } from 'express'
import api from '../utils/api'

const useDiscordAuth = (app: Express, REDIRECT_URI: string, HOME_PAGE: string) => {
  const { CLIENT_ID, CLIENT_SECRET } = process.env
  const scope = encodeURIComponent(['identify', 'guilds'].join(' '))

  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('🚨 Missing Client ID or Client Secret')

  app.get('/forward', (req, res) => {
    const query = [
      `client_id=${CLIENT_ID}`,
      `redirect_uri=${encodeURIComponent(REDIRECT_URI + '/callback')}`,
      'response_type=code',
      `scope=${scope}`,
    ].join('&')

    return res.redirect(api.discord.url + '/oauth2' + '/authorize' + '?' + query)
  })

  app.get('/callback', async (req, res) => {
    const { code } = req.query

    if (code) {
      const params = new URLSearchParams({
        client_id: CLIENT_ID as string,
        client_secret: CLIENT_SECRET as string,
        redirect_uri: REDIRECT_URI + '/callback',
        code: code as string,
        grant_type: 'authorization_code',
        scope,
      })

      try {
        // Deal with 401 response
        const { data } = await api.discord.axios.post('/oauth2/token', params)
        const { token_type, access_token } = data

        if (token_type && access_token) {
          req.session.tokenType = token_type
          req.session.accessToken = access_token

          req.session.save()

          return res.cookie('token', access_token).redirect(HOME_PAGE)
        }
      } catch (error) {
        console.error(error)
      }
    }

    return res.redirect(HOME_PAGE)
  })
}

export default useDiscordAuth
