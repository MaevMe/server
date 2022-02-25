import Route from '../structure/Route'
import Server from '../models/Server'

export default new Route(
  async (req, res) => {
    const { server } = req.body
    const { mongoServerID } = req.params

    try {
      const updatedServer = await Server.findByIdAndUpdate(mongoServerID, server)
      res.send(updatedServer)
    } catch (err) {
      res.status(500).send({ err })
    }
  },
  { auth: true, params: ['mongoServerID'] }
)
