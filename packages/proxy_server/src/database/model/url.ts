import { Schema, model } from 'mongoose'

const urlSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  url: String,
  data: Object,
  isProxy: Boolean,
  author: String,
  date: { type: Date, default: Date.now }
})

const URLModel = model('UrlSchema', urlSchema)

export default URLModel
