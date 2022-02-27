import Route from '../structure/Route'
import Server from '../models/Server'
import discord from '../utils/discord'
import type ServerType from '../types/Server'

export default new Route(
  async (req, res) => {
    const { guildID } = req.params
    const newServer = req.body
    const headers = discord.getHeaders(req)

    const { _id, tempVoiceChannels: newSettings, id } = newServer as ServerType
    const namingFormat = newSettings.namingFormat.replace(/[ ]*\|[ ]*/gm, '┃')

    const existingServer = await Server.findById(_id)
    if (!existingServer) return res.status(404).send({ err: 'No server in mongodb' })

    existingServer.tempVoiceChannels.namingFormat = namingFormat
    const { tempVoiceChannels: oldSettings } = existingServer

    try {
      if (!oldSettings.usingCreatedChannels && newSettings.usingCreatedChannels) {
        const createdCategory = (
          await discord.api.post(
            `guilds/${id}`,
            { name: 'Temporary Voice Channels', type: 4 },
            { headers }
          )
        ).data

        const createdChannel = (
          await discord.api.post(
            `guilds/${id}`,
            { name: 'Join to Create a VC', type: 2, parent_id: createdCategory.id },
            { headers }
          )
        ).data

        existingServer.tempVoiceChannels.categoryID = createdCategory.id
        existingServer.tempVoiceChannels.createChannel = createdChannel.id
        existingServer.tempVoiceChannels.usingCreatedChannels = true
      } else if (oldSettings.usingCreatedChannels && !newSettings.usingCreatedChannels) {
        if (oldSettings.createChannel !== newSettings.createChannel) {
          await discord.api.delete(`/channels/${oldSettings.createChannel}`, { headers })
        }

        if (oldSettings.categoryID !== newSettings.categoryID) {
          await discord.api.delete(`/channels/${oldSettings.categoryID}`, { headers })
        }

        existingServer.tempVoiceChannels.categoryID = newSettings.categoryID
        existingServer.tempVoiceChannels.createChannel = newSettings.createChannel
        existingServer.tempVoiceChannels.usingCreatedChannels = false
      } else {
        existingServer.tempVoiceChannels.categoryID = newSettings.categoryID
        existingServer.tempVoiceChannels.createChannel = newSettings.createChannel
      }

      const updatedServer = await existingServer.save()
      return res.status(200).send(updatedServer)
    } catch (err) {
      console.error('@server.post', err)
      return res.status(500).send({ err })
    }
  },
  { withAuthorization: true, params: ['guildID'] }
)
