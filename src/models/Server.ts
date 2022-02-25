import { Schema, model } from 'mongoose'

const serverSchema = new Schema({
  id: String,
  tempVoiceChannels: {
    active: Boolean,
    createChannel: String,
    namingFormat: String,
    categoryID: String,
  },
})

export default model('Server', serverSchema)
