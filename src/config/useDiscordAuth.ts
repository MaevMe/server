import { Express, Request } from 'express'
import api from '../utils/api'

const useDiscordAuth = (app: Express, REDIRECT_URI: string, HOME_PAGE: string) => {
  const { CLIENT_ID, CLIENT_SECRET } = process.env
  const scope = encodeURIComponent(['identify', 'guilds'].join(' '))

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return console.error('🚨 Missing Client ID or Client Secret for Discord Authentication')
  }

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
        }
      } catch (error) {
        console.error(error)
      }
    }

    return res.redirect(HOME_PAGE)
  })

  // Refresh function, when to run?
  const refresh = async (req: Request, refreshToken: string) => {
    const headers = api.getHeaders(req)

    const params = new URLSearchParams({
      client_id: CLIENT_ID as string,
      client_secret: CLIENT_SECRET as string,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    })

    const { data } = await api.discord.axios.post('/oauth2/token', params, { headers })
    const { token_type, access_token, refresh_token } = data

    if (token_type && access_token && refresh_token) {
      req.session.tokenType = token_type
      req.session.accessToken = access_token
      req.session.refreshToken = refresh_token
    }

    if (refresh_token) refresh(req, refresh_token)
  }
}

export default useDiscordAuth
