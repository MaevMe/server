import Route from '../structure/Route'
import Server from '../models/Server'

export default new Route(
  async (req, res) => {
    const { serverData } = req.body
    const { mongoServerID } = req.params

    const { voiceChannels, categories, ...server } = serverData

    try {
      const updatedServer = await Server.findByIdAndUpdate(mongoServerID, server)
      return res.status(200).send(updatedServer)
    } catch (err) {
      console.error('@server.post', err)
      return res.status(500).send({ err })
    }
  },
  { withAuthorization: true, params: ['mongoServerID'] }
)
