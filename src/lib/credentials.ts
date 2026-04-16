/**
 * Server-side utility for encrypting/decrypting per-user API credentials.
 * Uses AES-256-GCM via Node.js built-in crypto — no extra dependencies.
 *
 * Env var required: CREDENTIALS_ENCRYPTION_KEY (64 hex chars = 32 bytes)
 * Generate with: openssl rand -hex 32
 */

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_BYTES = 32

function getKey(): Buffer {
  const hex = process.env.CREDENTIALS_ENCRYPTION_KEY
  if (!hex) throw new Error('CREDENTIALS_ENCRYPTION_KEY env var is not set')
  const buf = Buffer.from(hex, 'hex')
  if (buf.length !== KEY_BYTES) {
    throw new Error('CREDENTIALS_ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)')
  }
  return buf
}

export function encryptCredentials(data: Record<string, string>): string {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const plaintext = JSON.stringify(data)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return JSON.stringify({
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64'),
  })
}

export function decryptCredentials(encryptedStr: string): Record<string, string> {
  const key = getKey()
  const { iv, tag, data } = JSON.parse(encryptedStr) as {
    iv: string
    tag: string
    data: string
  }
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'base64'))
  decipher.setAuthTag(Buffer.from(tag, 'base64'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data, 'base64')),
    decipher.final(),
  ])
  return JSON.parse(decrypted.toString('utf8'))
}
