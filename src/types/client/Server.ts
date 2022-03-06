import type { APIChannel } from 'discord-api-types/v9'

type Server = {
  id: string
  _id: string
  tempVoiceChannels: {
    active: boolean
    usingCreatedChannels: boolean
    createChannelID: string
    categoryID: string
    namingFormat: string
    userLimit: number
    includeTextChannel: boolean
  }
  categories: APIChannel[]
  voiceChannels: APIChannel[]
}

export default Server
