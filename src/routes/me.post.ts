import Route from '../structure/Route'
import axios from 'axios'

export default new Route(
  async (req, res) => {
    const { tokenType, accessToken } = req.session

    const headers = {
      authorization: `${tokenType} ${accessToken}`,
    }

    const user = (await axios.get('https://discord.com/api/users/@me', { headers })).data
    const guilds = (await axios.get('https://discord.com/api/users/@me/guilds', { headers })).data

    user.guilds = guilds

    return res.send(user)
  },
  { auth: true }
)
