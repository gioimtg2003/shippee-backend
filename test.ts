import crypto from 'crypto';
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 1028,
});

const encryptPayload = (
  payload: string,
  publicKey: crypto.KeyObject,
): string => {
  const buffer = Buffer.from(payload, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
};

// Example usage
const payload = 'This is a secret message';
const encryptedPayload = encryptPayload(payload, publicKey);
console.log('Encrypted Payload:', encryptedPayload);

const decryptPayload = (
  encryptedPayload: string,
  privateKey: crypto.KeyObject,
): string => {
  const buffer = Buffer.from(encryptedPayload, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf8');
};

// Example usage
const decryptedPayload = decryptPayload(encryptedPayload, privateKey);
console.log('Decrypted Payload:', decryptedPayload);
