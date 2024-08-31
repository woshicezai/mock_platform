// models/User.ts
import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'

interface IUser extends Document {
  username: string
  password: string //实际存储的是hash值
  phone: string
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true }
  },
  { timestamps: true }
)

// // 密码加密中间件
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next()
//   this.password = await bcrypt.hash(this.password, 10)
//   next()
// })

// 密码验证方法
userSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default model<IUser>('User', userSchema)
