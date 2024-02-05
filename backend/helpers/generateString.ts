import crypto from 'crypto';

export const generateRandomString = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  return Array.from(crypto.randomBytes(length), (byte) =>
    characters[byte % charactersLength]
  ).join('');
};
