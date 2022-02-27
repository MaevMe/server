import { Document } from 'mongoose'

export interface DocumentResult extends Document {
  _doc: any
}

export interface Second extends DocumentResult {
  id: string
  tempVoiceChannels: {
    active: boolean
    createChannel: string
    namingFormat: string
    categoryID: string
    userLimit: number
    includeTextChannel: boolean
    usingCreatedChannels: boolean
  }
}

export default Second
