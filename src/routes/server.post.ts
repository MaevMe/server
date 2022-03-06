import Route from '../structure/Route'
import Server from '../models/Server'
import Discord from '../discord/Discord'

import type ServerFromClient from '../types/client/Server'

export default new Route(
  async (req, res) => {
    const { guildID } = req.params
    const newServer = req.body
    const discord = new Discord(req)

    const { _id, tempVoiceChannels: newSettings, id } = newServer as ServerFromClient
    const namingFormat = newSettings.namingFormat.replace(/[ ]*\|[ ]*/gm, '┃')

    const existingServer = await Server.findById(_id)
    if (!existingServer) return res.status(404).send({ err: 'No server in mongodb' })

    existingServer.tempVoiceChannels.namingFormat = namingFormat
    const { tempVoiceChannels: oldSettings } = existingServer

    try {
      if (!oldSettings.usingCreatedChannels && newSettings.usingCreatedChannels) {
        const category = await discord.createChannel(id, 'Temporary VCs', 'GUILD_CATEGORY')
        const channel = await discord.createChannel(
          id,
          'Join to create',
          'GUILD_VOICE',
          category.id
        )

        // update categoryID, createChannelID and usingCreatedChannels to true
      } else if (oldSettings.usingCreatedChannels && !newSettings.usingCreatedChannels) {
        if (oldSettings.createChannelID !== newSettings.createChannelID) {
          // old settings create channel id
          await discord.deleteChannel('odkeodi')
        }

        if (oldSettings.categoryID !== newSettings.categoryID) {
          // old settings category id
          await discord.deleteChannel('dokedoedieo')
        }

        // update categoryID, createChannelID and usingCreatedChannels to false
      } else {
        // update ids of category and create channel to new settings ids
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
