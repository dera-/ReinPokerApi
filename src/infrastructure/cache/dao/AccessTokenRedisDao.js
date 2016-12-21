import RedisClient from '../RedisClient';

const EXPIRE_TIME = 1800;
export default class AccessTokenRedisDao {

  constructor() {
    this.redisClient = new RedisClient();
  }

  set(userId, token) {
    this.redisClient.setEx(this.getRedisKey(userId), token, EXPIRE_TIME);
  }

  get(userId) {
    return this.redisClient.get(this.getRedisKey(userId));
  }

  expire(userId) {
    this.redisClient.expire(this.getRedisKey(userId), EXPIRE_SECOND);
  }

  getRedisKey(userId) {
    return 'rein_poker:acces_token:user_id' + userId;
  }
}
