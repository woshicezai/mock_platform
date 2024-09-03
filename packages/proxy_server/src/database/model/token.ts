import { Schema, model } from 'mongoose'

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // 1小时后过期
  },
  isRevoked: {
    type: Boolean,
    default: false
  }
})

export default model('Token', tokenSchema)
