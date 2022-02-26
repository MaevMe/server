import Route from '../structure/Route'
import Server from '../models/Server'
import axios from 'axios'

export default new Route(
  async (req, res) => {
    const { serverID } = req.params
    console.log('serverID: ', serverID)

    const { tokenType, accessToken } = req.session

    const headers = {
      authorization: `${tokenType} ${accessToken}`,
    }
    console.log(headers)

    try {
      const server = await Server.findOne({ id: serverID })
      console.log('AFTER FIND ONE')
      const channels = (
        await axios.get(`https://discord.com/api/guilds/${serverID}/channels`, { headers })
      ).data
      console.log('channels: ', channels)

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
      console.log('server: ', server)

      res.send(server)
    } catch (err) {
      console.error(err)
      res.status(500).send({ err })
    }
  },
  { auth: true, params: ['serverID'] }
)
