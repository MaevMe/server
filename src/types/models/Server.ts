import { Document } from 'mongoose'

export interface Server extends Document {
  id: string
  tempVoiceChannels: {
    active: boolean
    usingCreatedChannels: boolean
    createChannelID: string
    categoryID: string
    namingFormat: string
    userLimit: number
    includeTextChannel: boolean
  }
}

export default Server
