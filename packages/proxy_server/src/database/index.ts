import mongoose from 'mongoose'

export default (): void => {
  mongoose.connect('mongodb://127.0.0.1:27017/mock_server', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  })
  const db = mongoose.connection

  // 成功连接
  db.on('connected', () => {
    console.log('MongoDB connection successful.')
  })

  // 连接发生错误
  db.on('error', (error) => {
    console.error('MongoDB connection error:', error)
  })

  // 连接断开
  db.on('disconnected', () => {
    console.log('MongoDB connection disconnected.')
  })
}
