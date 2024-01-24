import { Schema, model } from 'mongoose'

const urlSchema = new Schema({
  title: String,
  url: String,
  data: Object,
  isProxy: Boolean,
  author: String,
  date: { type: Date, default: Date.now }
})

const URLModel = model('UrlSchema', urlSchema)

export default URLModel
