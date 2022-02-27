import Route from '../structure/Route'
import Server from '../models/Server'
import discord from '../utils/discord'
import {
  RESTGetAPIGuildChannelsResult,
  APIChannel,
  RESTGetAPIGuildResult,
} from 'discord-api-types/v9'

const map = (channel: APIChannel) => {
  return { id: channel.id, name: channel.name }
}

export default new Route(
  async (req, res) => {
    // FIX: 401 Response
    const { guildID } = req.params
    const headers = discord.getHeaders(req, true)

    try {
      const server = await Server.findOne({ id: guildID })

      const guild: RESTGetAPIGuildResult = (
        await discord.api.get(`/guilds/${guildID}`, { headers })
      ).data

      const channels: RESTGetAPIGuildChannelsResult = (
        await discord.api.get(`/guilds/${guildID}/channels`, { headers })
      ).data

      if (!server) return res.status(404).send({ err: 'No server' })
      if (!channels) return res.status(404).send({ err: 'No channels' })

      const voiceChannels = channels.filter(({ type }) => type === 2).map(map)
      const categories = channels.filter(({ type }) => type === 4).map(map)

      return res.status(200).send({ ...server._doc, categories, voiceChannels, guild })
    } catch (err) {
      console.error('@server.get', err)
      return res.status(500).send({ err })
    }
  },
  { withAuthorization: true, params: ['guildID'] }
)
