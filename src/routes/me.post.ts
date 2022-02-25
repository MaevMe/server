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

    user.guilds = guilds.filter((guild: any) => guild.permissions & 0x8)

    return res.send(user)
  },
  { auth: true }
)
