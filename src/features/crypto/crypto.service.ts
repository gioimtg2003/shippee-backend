import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly CRYPTO_ENCRYPTION_KEY = process.env.CRYPTO_ENCRYPTION_KEY; // Must be 256 bits (32 characters)
  private readonly IV_LENGTH = 16; // For AES, this is always 16
  private readonly ENCRYPTION_ALGORITHM = 'aes-256-cbc';
  private readonly ENCODING = 'hex';
  private readonly SPLIT_KEY = '-';

  private readonly SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

  generateToken() {
    return crypto.randomBytes(this.IV_LENGTH).toString(this.ENCODING);
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      this.ENCRYPTION_ALGORITHM,
      Buffer.from(this.CRYPTO_ENCRYPTION_KEY),
      iv,
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return (
      iv.toString(this.ENCODING) +
      this.SPLIT_KEY +
      encrypted.toString(this.ENCODING)
    );
  }

  decrypt(text: string): string {
    const textParts = text.split(this.SPLIT_KEY);
    const iv = Buffer.from(textParts.shift(), this.ENCODING);
    const encryptedText = Buffer.from(textParts.join(':'), this.ENCODING);
    const decipher = crypto.createDecipheriv(
      this.ENCRYPTION_ALGORITHM,
      Buffer.from(this.CRYPTO_ENCRYPTION_KEY),
      iv,
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  hash(text: string): Promise<string> {
    return bcrypt.hash(text, this.SALT_ROUNDS);
  }

  compareHash(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }
}
