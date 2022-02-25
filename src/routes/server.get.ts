import Route from '../structure/Route'
import Server from '../models/Server'

export default new Route(
  async (req, res) => {
    const { serverID } = req.params

    try {
      const server = await Server.findOne({ id: serverID })
      res.send(server)
    } catch (err) {
      res.status(500).send({ err })
    }
  },
  { auth: true, params: ['serverID'] }
)
