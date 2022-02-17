import axios from 'axios'
import { Request } from 'express'

export default {
  discord: {
    url: 'https://discord.com/api',
    axios: axios.create({ baseURL: 'https://discord.com/api' }),
  },
  getHeaders: (req: Request) => {
    const { tokenType, accessToken } = req.session

    return {
      authorization: `${tokenType} ${accessToken}`,
    }
  },
}
