import Route from '../structure/Route'
import discord from '../utils/discord'
import {
  RESTGetAPICurrentUserResult,
  RESTGetAPICurrentUserGuildsResult,
} from 'discord-api-types/v9'

export default new Route(
  async (req, res) => {
    const headers = discord.getHeaders(req)

    try {
      const user = (await discord.api.get('/users/@me', { headers }))
        .data as RESTGetAPICurrentUserResult
      const guilds = (await discord.api.get('/users/@me/guilds', { headers }))
        .data as RESTGetAPICurrentUserGuildsResult

      const guildsWithPermission = guilds.filter((guild: any) => guild.permissions & 0x8)

      return res.status(200).send({ ...user, guilds: guildsWithPermission })
    } catch (err) {
      console.error('@me.post', err)
      return res.status(500).send({ err })
    }
  },
  { withAuthorization: true }
)
