import { Schema, model } from 'mongoose'
import Server from '../types/models/Server'

const serverSchema = new Schema<Server>({
  id: {
    type: String,
    unique: true,
  },
  tempVoiceChannels: {
    active: Boolean,
    createChannelID: String,
    namingFormat: String,
    categoryID: String,
    userLimit: Number,
    includeTextChannel: Boolean,
    usingCreatedChannels: Boolean,
  },
})

export default model<Server>('Server', serverSchema)
