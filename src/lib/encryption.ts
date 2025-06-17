// Client-side encryption for journal entries
// Uses Web Crypto API for secure encryption

export class JournalEncryption {
  private static readonly ALGORITHM = 'AES-GCM'
  private static readonly KEY_LENGTH = 256
  private static readonly IV_LENGTH = 12
  private static readonly SALT_LENGTH = 16
  private static readonly ITERATIONS = 100000

  // Derive encryption key from user's password
  private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    )

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: this.ITERATIONS,
        hash: 'SHA-256'
      },
      passwordKey,
      { name: this.ALGORITHM, length: this.KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    )
  }

  // Encrypt journal content
  static async encrypt(content: string, password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(content)

    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH))
    const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH))

    // Derive key from password
    const key = await this.deriveKey(password, salt)

    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt({ name: this.ALGORITHM, iv }, key, data)

    // Combine salt, iv, and encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
    combined.set(salt, 0)
    combined.set(iv, salt.length)
    combined.set(new Uint8Array(encrypted), salt.length + iv.length)

    // Convert to base64 for storage
    return btoa(String.fromCharCode.apply(null, Array.from(combined)))
  }

  // Decrypt journal content
  static async decrypt(encryptedContent: string, password: string): Promise<string> {
    try {
      // Convert from base64
      const combined = Uint8Array.from(atob(encryptedContent), (c) => c.charCodeAt(0))

      // Extract salt, iv, and encrypted data
      const salt = combined.slice(0, this.SALT_LENGTH)
      const iv = combined.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH)
      const encrypted = combined.slice(this.SALT_LENGTH + this.IV_LENGTH)

      // Derive key from password
      const key = await this.deriveKey(password, salt)

      // Decrypt the data
      const decrypted = await crypto.subtle.decrypt({ name: this.ALGORITHM, iv }, key, encrypted)

      // Convert back to string
      const decoder = new TextDecoder()
      return decoder.decode(decrypted)
    } catch (error) {
      throw new Error('Failed to decrypt: Invalid password or corrupted data')
    }
  }

  // Generate a secure encryption key for the user
  static generateSecurePassword(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
  }

  // Store encryption key securely in browser (for convenience)
  static async storeKey(key: string): Promise<void> {
    // In production, consider using IndexedDB with additional security
    localStorage.setItem('journal_key', key)
  }

  // Retrieve stored encryption key
  static getStoredKey(): string | null {
    return localStorage.getItem('journal_key')
  }

  // Remove stored encryption key
  static clearStoredKey(): void {
    localStorage.removeItem('journal_key')
  }
}
