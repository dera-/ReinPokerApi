import crypto from 'crypto';
import config from '../../config/main';

export default class CipherUtil {
  static encrypt(str) {
    const cipher = crypto.createCipher('aes192', config.salt_key);
    cipher.update(str, 'utf8', 'hex');
    return cipher.final('hex');
  }

  static decrypt(str) {
    const decipher = crypto.createDecipher('aes192', config.salt_key);
    decipher.update(str, 'hex', 'utf8');
    return decipher.final('utf8');
  }
}
