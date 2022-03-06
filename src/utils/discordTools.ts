import axios from 'axios'
import { Request } from 'express'

import {
  RESTPostAPIGuildChannelResult,
  RESTGetAPICurrentUserResult,
  RESTGetAPICurrentUserGuildsResult,
  RESTAPIPartialCurrentUserGuild,
  RESTGetAPIGuildResult,
  RESTGetAPIGuildChannelsResult,
  APIChannel,
} from 'discord-api-types/v9'

class Discord {
  #api = axios.create({ baseURL: 'https://discord.com/api' })
  req: Request

  constructor(req: Request) {
    this.req = req
  }

  #getUserHeaders() {
    return { authorization: `${this.req.session.tokenType} ${this.req.session.accessToken}` }
  }

  #getBotHeaders() {
    return { authorization: `Bot ${process.env.TOKEN}` }
  }

  async getCurrentUser(req) {
    const user: RESTGetAPICurrentUserResult = (
      await this.#api.get('/users/@me', { headers: this.#getUserHeaders() })
    ).data
    const guilds: RESTGetAPICurrentUserGuildsResult = (
      await this.#api.get('/users/@me/guilds', { headers: this.#getUserHeaders() })
    ).data

    const guildsWithPermission = guilds.filter(
      (guild: RESTAPIPartialCurrentUserGuild) => parseInt(guild.permissions) & 0x8
    )

    return { ...user, guilds: guildsWithPermission }
  }

  async getGuild(guild_id: string) {
    const guild: RESTGetAPIGuildResult = (
      await this.#api.get(`/guilds/${guild_id}`, { headers: this.#getBotHeaders() })
    ).data

    const channels: RESTGetAPIGuildChannelsResult = (
      await this.#api.get(`/guilds/${guild_id}/channels`, { headers: this.#getBotHeaders() })
    ).data

    const map = (channel: APIChannel) => {
      return { id: channel.id, name: channel.name }
    }

    const voiceChannels = channels.filter(({ type }) => type === 2).map(map)
    const categories = channels.filter(({ type }) => type === 4).map(map)

    return { categories, voiceChannels, guild }
  }

  async createChannel(guild_id: string, parent_id?: string) {
    const channel: RESTPostAPIGuildChannelResult = (
      await this.#api.post(
        `guilds/${guild_id}/channels`,
        { name: 'Join to Create a VC', type: 2, parent_id },
        { headers: this.#getUserHeaders() }
      )
    ).data

    return channel
  }
}

export default Discord
