import Route from '../structure/Route'
import Discord from '../discord/Discord'

export default new Route(
  async (req, res) => {
    try {
      const discord = new Discord(req)

      const user = await discord.getCurrentUser()
      return res.status(200).send(user)
    } catch (err) {
      console.error('@me.post', err)
      return res.status(500).send({ err })
    }
  },
  { withAuthorization: true }
)
