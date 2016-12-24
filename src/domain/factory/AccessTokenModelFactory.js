import crypto from 'crypto';
import AccessTokenModel from '../model/AccessTokenModel';

const DEFAULT_CHARACTER_COUNT = 32;

export default class AccessTokenModelFactory {
  static generate(userId) {
    const buf = crypto.randomBytes(DEFAULT_CHARACTER_COUNT);
    const model = new AccessTokenModel(userId, buf.toString('base64'));
    return model;
  }

  static get(userId, token) {
    return new AccessTokenModel(userId, token);
  }
}
