import axios from 'axios'
import { Request } from 'express'

import {
  RESTPostAPIGuildChannelResult,
  RESTGetAPICurrentUserResult,
  RESTGetAPICurrentUserGuildsResult,
  RESTAPIPartialCurrentUserGuild,
  RESTGetAPIGuildResult,
  RESTGetAPIGuildChannelsResult,
  RESTDeleteAPIChannelResult,
} from 'discord-api-types/v9'

import { channelType } from './types/index'
import getChannelTypeNumber from './utils/getChannelTypeNumber.ts'

class Discord {
  #api = axios.create({ baseURL: 'https://discord.com/api/v9' })
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

  async getCurrentUser() {
    const user: RESTGetAPICurrentUserResult = (await this.#api.get('/users/@me', { headers: this.#getUserHeaders() })).data

    const guilds: RESTGetAPICurrentUserGuildsResult = (
      await this.#api.get('/users/@me/guilds', { headers: this.#getUserHeaders() })
    ).data

    const guildsWithPermission = guilds.filter((guild: RESTAPIPartialCurrentUserGuild) => parseInt(guild.permissions) & 0x8)

    return { ...user, guilds: guildsWithPermission }
  }

  async getGuild(guild_id: string, withChannels?: boolean) {
    const guild: RESTGetAPIGuildResult = (await this.#api.get(`/guilds/${guild_id}`, { headers: this.#getBotHeaders() })).data

    if (withChannels) {
      const channels: RESTGetAPIGuildChannelsResult = (
        await this.#api.get(`/guilds/${guild_id}/channels`, { headers: this.#getBotHeaders() })
      ).data

      return { guild, channels }
    }

    return { guild }
  }

  async createChannel(guild_id: string, name: string, type: channelType, parent_id?: string) {
    const channel: RESTPostAPIGuildChannelResult = (
      await this.#api.post(
        `guilds/${guild_id}/channels`,
        { name, type: getChannelTypeNumber(type), parent_id },
        { headers: this.#getBotHeaders() }
      )
    ).data

    return channel
  }

  async deleteChannel(id: string) {
    const channel: RESTDeleteAPIChannelResult = (await this.#api.delete(`/channels/${id}`, { headers: this.#getBotHeaders() }))
      .data

    return channel
  }
}

export default Discord
