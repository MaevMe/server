import axios from 'axios'
import { Request } from 'express'

const discord = {
  api: axios.create({ baseURL: 'https://discord.com/api' }),
  getHeaders: (req: Request, bot?: boolean) => {
    // const { tokenType, accessToken } = req.session
    // return { authorization: `${tokenType} ${accessToken}` }

    const { tokenType, accessToken } = req.session

    const botAuth = `Bot ${process.env.TOKEN}`
    const humanAuth = `${tokenType} ${accessToken}`

    return {
      authorization: bot ? botAuth : humanAuth,
    }
  },
}

export default discord
