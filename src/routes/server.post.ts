import Route from '../structure/Route'
import Server from '../models/Server'
import Discord from '../discord/Discord'

import type ClientServer from '../types/client/Server'

export default new Route(
  async (req, res) => {
    const { guildID } = req.params

    const newServer = req.body as ClientServer
    const discord = new Discord(req)

    const existingServer = await Server.findOne({ id: guildID })
    if (!existingServer) return res.status(404).send({ err: 'No server in mongodb' })

    try {
      if (
        !existingServer.tempVoiceChannels.usingCreatedChannels &&
        newServer.tempVoiceChannels.usingCreatedChannels
      ) {
        const category = await discord.createChannel(
          newServer.id,
          'Temporary VCs',
          'GUILD_CATEGORY'
        )
        const channel = await discord.createChannel(
          newServer.id,
          'Join to create!',
          'GUILD_VOICE',
          category.id
        )

        existingServer.tempVoiceChannels.categoryID = category.id
        existingServer.tempVoiceChannels.createChannelID = channel.id
      } else {
        if (
          existingServer.tempVoiceChannels.usingCreatedChannels &&
          !newServer.tempVoiceChannels.usingCreatedChannels
        ) {
          if (
            existingServer.tempVoiceChannels.createChannelID !==
            newServer.tempVoiceChannels.createChannelID
          ) {
            await discord.deleteChannel(existingServer.tempVoiceChannels.createChannelID)
          }

          if (
            existingServer.tempVoiceChannels.categoryID !== newServer.tempVoiceChannels.categoryID
          ) {
            await discord.deleteChannel(existingServer.tempVoiceChannels.categoryID)
          }
        }

        existingServer.tempVoiceChannels.categoryID = newServer.tempVoiceChannels.categoryID
        existingServer.tempVoiceChannels.createChannelID =
          newServer.tempVoiceChannels.createChannelID
      }

      const namingFormat = newServer.tempVoiceChannels.namingFormat.replace(/[ ]*\|[ ]*/gm, '┃')

      if (!newServer.tempVoiceChannels.active) {
        if (existingServer.tempVoiceChannels.usingCreatedChannels) {
          await discord.deleteChannel(existingServer.tempVoiceChannels.createChannelID)
          await discord.deleteChannel(existingServer.tempVoiceChannels.categoryID)
        }
        existingServer.tempVoiceChannels.createChannelID = ''
        existingServer.tempVoiceChannels.categoryID = ''
      }

      existingServer.tempVoiceChannels.namingFormat = namingFormat
      existingServer.tempVoiceChannels.active = newServer.tempVoiceChannels.active
      existingServer.tempVoiceChannels.usingCreatedChannels =
        newServer.tempVoiceChannels.usingCreatedChannels

      const updatedServer = await existingServer.save()
      return res.status(200).send(updatedServer)
    } catch (err) {
      console.error('@server.post', err)
      return res.status(500).send({ err })
    }
  },
  { withAuthorization: true, params: ['guildID'] }
)
