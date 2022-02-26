import Route from '../structure/Route'
import Server from '../models/Server'

export default new Route(
  async (req, res) => {
    const { serverData } = req.body
    const { mongoServerID } = req.params

    const { voiceChannels, categories, ...server } = serverData

    try {
      const updatedServer = await Server.findByIdAndUpdate(mongoServerID, server)
      res.send(updatedServer)
    } catch (err) {
      res.status(500).send({ err })
    }
  },
  { auth: true, params: ['mongoServerID'] }
)
