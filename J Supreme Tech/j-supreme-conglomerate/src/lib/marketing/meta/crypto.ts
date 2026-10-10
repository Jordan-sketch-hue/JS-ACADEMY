/**
 * Token encryption at rest (AES-256-GCM).
 *
 * Meta access tokens are bearer credentials — a Page token can post as the brand
 * indefinitely. We never store them in plaintext: `meta_connections.access_token`
 * holds the output of `encryptToken()`, and only the server publish path decrypts.
 *
 * Key: `META_TOKEN_ENC_KEY` = base64 of 32 random bytes (`openssl rand -base64 32`).
 * Payload layout: base64( iv[12] | authTag[16] | ciphertext ).
 */
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALG = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey(): Buffer {
  const raw = process.env.META_TOKEN_ENC_KEY;
  if (!raw) throw new Error("META_TOKEN_ENC_KEY is not set.");
  const key = Buffer.from(raw.trim(), "base64");
  if (key.length !== 32) {
    throw new Error(
      `META_TOKEN_ENC_KEY must decode to 32 bytes (got ${key.length}). Regenerate with: openssl rand -base64 32`,
    );
  }
  return key;
}

/** Encrypt a token → base64( iv | tag | ciphertext ). */
export function encryptToken(plaintext: string): string {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALG, getKey(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

/** Reverse `encryptToken`. Throws if the key is wrong or the payload was tampered. */
export function decryptToken(payloadB64: string): string {
  const buf = Buffer.from(payloadB64, "base64");
  if (buf.length < IV_LEN + TAG_LEN + 1) throw new Error("Ciphertext too short.");
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const enc = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALG, getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}

/** True when a usable 32-byte key is configured — lets callers degrade gracefully. */
export function hasTokenEncryptionKey(): boolean {
  try {
    getKey();
    return true;
  } catch {
    return false;
  }
}
