import RedisClient from '../RedisClient';
import AccessTokenModel from '../../../domain/model/AccessTokenModel';
import AccessTokenModelFactory from '../../../domain/factory/AccessTokenModelFactory';

//TODO deleteとexistの作成
const EXPIRE_TIME = 1800;
export default class BattleTokenRedisDao {

  constructor() {
    this.redisClient = new RedisClient();
  }

  async set(userId, token) {
    await this.redisClient.setEx(this.getRedisKey(userId), token, EXPIRE_TIME);
  }

  async get(userId) {
    const data = await this.redisClient.get(this.getRedisKey(userId));
    return datat;
  }

  getRedisKey(userId) {
    return 'rein_poker:acces_token:plyer_id' + userId;
  }
}
