import { Schema, model } from 'mongoose'
import Second from '../types/Second'

const serverSchema = new Schema<Second>({
  id: String,
  tempVoiceChannels: {
    active: Boolean,
    createChannel: String,
    namingFormat: String,
    categoryID: String,
    userLimit: Number,
    includeTextChannel: Boolean,
    usingCreatedChannels: Boolean,
  },
})

export default model<Second>('Server', serverSchema)
