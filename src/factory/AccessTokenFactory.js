import crypto from 'crypto';

const DEFAULT_CHARACTER_COUNT = 32;

export default class AccessTokenFactory {
  static get() {
    const buf = crypto.randomBytes(DEFAULT_CHARACTER_COUNT);
    return buf.toString('base64');
  }
}
