import * as Crypto from 'expo-crypto';

/**
 * Generates a cryptographically secure random number between 0 and 1
 * Replaces Math.random() for security compliance
 * 
 * @returns A random number between 0 (inclusive) and 1 (exclusive), similar to Math.random()
 */
export function secureRandom(): number {
  const bytes = Crypto.getRandomBytes(4);
  // Convert 4 bytes to a 32-bit unsigned integer, then normalize to 0-1 range
  // getRandomBytes(4) always returns exactly 4 bytes
  const byte0 = bytes[0] ?? 0;
  const byte1 = bytes[1] ?? 0;
  const byte2 = bytes[2] ?? 0;
  const byte3 = bytes[3] ?? 0;
  const uint32 = (byte0 << 24) | (byte1 << 16) | (byte2 << 8) | byte3;
  return uint32 / 0xffffffff;
}

