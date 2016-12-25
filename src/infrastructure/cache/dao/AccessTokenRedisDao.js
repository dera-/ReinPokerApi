import RedisClient from '../RedisClient';
import AccessTokenModel from '../../../domain/model/AccessTokenModel';
import AccessTokenModelFactory from '../../../domain/factory/AccessTokenModelFactory';

const EXPIRE_TIME = 1800;
export default class AccessTokenRedisDao {

  constructor() {
    this.redisClient = new RedisClient();
  }

  async set(ip, model) {
    await this.redisClient.setEx(this.getRedisKey(ip), model.getData(), EXPIRE_TIME);
  }

  async get(ip) {
    const data = await this.redisClient.get(this.getRedisKey(ip));
    console.log(data);
    if (false === data.hasOwnProperty('user_id') || false === data.hasOwnProperty('access_token')) {
      return null;
    }
    return AccessTokenModelFactory.get(data.user_id, data.access_token);
  }

  async expire(ip) {
    await this.redisClient.expire(this.getRedisKey(ip), EXPIRE_TIME);
  }

  getRedisKey(ip) {
    return 'rein_poker:acces_token:ip' + ip;
  }
}
