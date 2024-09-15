import crypto from 'crypto'
import bcrypt from 'bcrypt' // 计算hash的

// 生成公钥和私钥
export function generateKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  })
}

// 解密密码
export function decryptPassword(encryptedPassword: string, privateKey: string): string {
  const buffer = Buffer.from(encryptedPassword, 'base64')
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    },
    buffer
  )
  return decrypted.toString('utf8')
}

// 生成hash
export function generateHash(message: string): string {
  return bcrypt.hashSync(message, 10)
}

// 生成客户端id
export function generateClientId(token: string) {
  const hash = crypto.createHash('sha256')
  const randomString = crypto.randomBytes(16).toString('hex')
  return hash
    .update(token + randomString)
    .digest('hex')
    .substring(0, 15)
}
