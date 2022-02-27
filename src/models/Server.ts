import { Schema, model } from 'mongoose'

const serverSchema = new Schema({
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

export default model('Server', serverSchema)
