import Route from '../structure/Route'
import Server from '../models/Server'
import discord from '../utils/discord'
import { RESTGetAPIGuildChannelsResult, APIChannel } from 'discord-api-types/v9'

const map = (channel: APIChannel) => {
  return { id: channel.id, name: channel.name }
}

export default new Route(
  async (req, res) => {
    // FIX: 401 Response
    const { serverID } = req.params
    const headers = discord.getHeaders(req, true)

    try {
      const server = await Server.findOne({ id: serverID })
      const channels: RESTGetAPIGuildChannelsResult = (
        await discord.api.get(`/guilds/${serverID}/channels`, { headers })
      ).data

      if (!server) return res.status(404).send({ err: 'No server' })
      if (!channels) return res.status(404).send({ err: 'No channels' })

      const voiceChannels = channels.filter(channel => channel.type === 2).map(map)
      const categories = channels.filter(channel => channel.type === 4).map(map)

      return res.status(200).send({ ...server, categories, voiceChannels })
    } catch (err) {
      console.error('@server.get', err)
      return res.status(500).send({ err })
    }
  },
  { withAuthorization: true, params: ['serverID'] }
)
