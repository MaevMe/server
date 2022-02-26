import Route from '../structure/Route'
import Server from '../models/Server'
import discord from '../utils/discord'

export default new Route(
  async (req, res) => {
    // FIX: 401 Response
    const { serverID } = req.params
    const headers = discord.getHeaders(req, true)

    try {
      const server = await Server.findOne({ id: serverID })
      const channels = (await discord.api.get(`/guilds/${serverID}/channels`, { headers })).data

      if (!server) res.status(404).send({ err: 'No server' })
      console.log('@server', server)

      server.voiceChannels = channels
        .filter((channel: any) => channel.type === 2)
        .map((channel: any) => {
          channel.id, channel.name
        })

      server.categories = channels
        .filter((channel: any) => channel.type === 4)
        .map((channel: any) => {
          channel.id, channel.name
        })

      res.send(server)
    } catch (err) {
      console.error(err)
      res.status(500).send({ err })
    }
  },
  { withAuthorization: true, params: ['serverID'] }
)
