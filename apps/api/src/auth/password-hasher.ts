import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const keyLength = 64;
const hashVersion = "scrypt";

export class PasswordHasher {
  static async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString("base64url");
    const derivedKey = await this.derive(password, salt);

    return `${hashVersion}$${salt}$${derivedKey.toString("base64url")}`;
  }

  static async verify(password: string, storedHash: string): Promise<boolean> {
    const [version, salt, encodedKey] = storedHash.split("$");

    if (version !== hashVersion || !salt || !encodedKey) {
      return false;
    }

    const expectedKey = Buffer.from(encodedKey, "base64url");

    if (expectedKey.length !== keyLength) {
      return false;
    }

    const derivedKey = await this.derive(password, salt);

    return timingSafeEqual(derivedKey, expectedKey);
  }

  private static derive(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      scrypt(password, salt, keyLength, (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      });
    });
  }
}
