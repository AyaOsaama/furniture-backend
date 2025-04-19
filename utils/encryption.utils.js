const crypto = require('crypto');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY_ENCRYPT


exports.encrypt=(text)=> {
  const iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey),iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

exports.decrypt=(text)=> {
  let parts = text.split(':');
  let iv = Buffer.from(parts[0],'hex');
  let encryptedText = Buffer.from(parts[1],'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey),iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
