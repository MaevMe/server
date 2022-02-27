import Route from '../structure/Route'
import Server from '../models/Server'
import discord from '../utils/discord'
import mongoose from 'mongoose'
import type ServerType from '../types/Server'

export default new Route(
  async (req, res) => {
    const { serverData } = req.body
    const { mongoServerID } = req.params
    const headers = discord.getHeaders(req)

    console.log(serverData)

    const { voiceChannels, categories, createChannelsChecked, ...server } =
      serverData as ServerType & { createChannelsChecked: boolean }

    server.tempVoiceChannels.namingFormat = server.tempVoiceChannels.namingFormat.replace(
      /[ ]*\|[ ]*/gm,
      '┃'
    )

    try {
      if (createChannelsChecked && !server.tempVoiceChannels.usingCreatedChannels) {
        const createdCategory = (
          await discord.api.post(
            `guilds/${mongoServerID}`,
            { name: 'Temporary Voice Channels', type: 4 },
            { headers }
          )
        ).data
        server.tempVoiceChannels.categoryID = createdCategory.id

        const createdChannel = (
          await discord.api.post(
            `guilds/${mongoServerID}`,
            { name: 'Join to Create a VC', type: 2, parent_id: createdCategory.id },
            { headers }
          )
        ).data
        server.tempVoiceChannels.createChannel = createdChannel.id

        server.tempVoiceChannels.usingCreatedChannels = true
      } else if (!createChannelsChecked && server.tempVoiceChannels.usingCreatedChannels) {
        const oldServer = await Server.findById(mongoServerID)

        if (oldServer.createChannel !== server.tempVoiceChannels.createChannel) {
          await discord.api.delete(`/channels/${oldServer.createChannel}`, { headers })
        }

        if (oldServer.categoryID !== server.tempVoiceChannels.categoryID) {
          await discord.api.delete(`/channels/${oldServer.categoryID}`, { headers })
        }

        server.tempVoiceChannels.usingCreatedChannels = false
      }

      const updatedServer = await Server.findByIdAndUpdate(
        new mongoose.Types.ObjectId(server._id),
        server
      )
      return res.status(200).send(updatedServer)
    } catch (err) {
      console.error('@server.post', err)
      return res.status(500).send({ err })
    }
  },
  { withAuthorization: true, params: ['mongoServerID'] }
)
