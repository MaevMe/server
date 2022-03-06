import Route from '../structure/Route'
import Server from '../models/Server'
import Discord from '../discord/Discord'

import { APIChannel } from 'discord-api-types/v9'

const map = (channel: APIChannel) => {
  return { id: channel.id, name: channel.name }
}

export default new Route(
  async (req, res) => {
    // FIX: 401 Response
    const { guildID } = req.params
    const discord = new Discord(req)

    try {
      const server = await Server.findOne({ id: guildID })
      const { guild, channels } = await discord.getGuild(guildID, true)

      if (!server) return res.status(404).send({ err: 'No server' })
      if (!channels) return res.status(404).send({ err: 'No channels' })

      const voiceChannels = channels.filter(({ type }) => type === 2).map(map)
      const categories = channels.filter(({ type }) => type === 4).map(map)

      // send ._doc, rather than entire document
      return res.status(200).send({ ...server, categories, voiceChannels, guild })
    } catch (err) {
      console.error('@server.get', err)
      return res.status(500).send({ err })
    }
  },
  { withAuthorization: true, params: ['guildID'] }
)
