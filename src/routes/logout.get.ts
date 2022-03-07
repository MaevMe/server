import Route from '../structure/Route'

export default new Route(
  async (req, res) => {
    try {
      req.session.destroy(err => {
        if (err) throw new Error('Session not destroyed.')
        return res.clearCookie('connect.sid').status(200).send()
      })
    } catch (err) {
      console.error('@logout', err)
      return res.status(500).send({ err })
    }
  },
  { withAuthorization: true }
)
