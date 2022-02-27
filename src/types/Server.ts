import type { APIChannel } from 'discord-api-types/v9'

type Server = {
  id: string
  _id: string
  name: string
  tempVoiceChannels: {
    active: boolean
    createChannel: string
    namingFormat: string
    categoryID: string
    userLimit: number
    includeTextChannel: boolean
    usingCreatedChannels: boolean
  }
  categories: APIChannel[]
  voiceChannels: APIChannel[]
}

export default Server
