import Route from '../structure/Route'
import discord from '../utils/discord'

export default new Route(
  async (req, res) => {
    const { tokenType, accessToken } = req.session
    const headers = discord.getHeaders(req)

    const user = (await discord.api.get('/users/@me', { headers })).data
    const guilds = (await discord.api.get('/users/@me/guilds', { headers })).data

    user.guilds = guilds.filter((guild: any) => guild.permissions & 0x8)

    return res.send(user)
  },
  { withAuthorization: true }
)
