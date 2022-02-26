import Route from '../structure/Route'
import discord from '../utils/discord'

export default new Route(
  async (req, res) => {
    const headers = discord.getHeaders(req)

    try {
      const user = (await discord.api.get('/users/@me', { headers })).data
      const guilds = (await discord.api.get('/users/@me/guilds', { headers })).data

      user.guilds = guilds.filter((guild: any) => guild.permissions & 0x8)

      return res.status(200).send(user)
    } catch (err) {
      console.error('@me.post', err)
      return res.status(500).send({ err })
    }
  },
  { withAuthorization: true }
)
