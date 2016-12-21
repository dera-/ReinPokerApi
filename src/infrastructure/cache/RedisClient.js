import Redis from 'redis-node';
import RedisConfig from '../../../config/redis';

let env = process.env.NODE_ENV || 'default';

const DEFAULT_EXPIRE_SECOND = 600;

export default class RedisClient {
  constructor(){
    this.client = Redis.createClient(RedisConfig[env].port, RedisConfig[env].host);
  }

  set(key, object) {
    return new Promise((resolve, reject)=>{
      this.client.set(key, JSON.stringify(object), (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  expire(key, expireTime = DEFAULT_EXPIRE_SECOND) {
    return new Promise((resolve, reject)=>{
      this.client.expire(key, expireTime, (error, result)=>{
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  setEx(key, object, expireTime = DEFAULT_EXPIRE_SECOND) {
    return this.set(key, object)
      .then(result => this.expire(key, expireTime));
  }

  get(key) {
    return new Promise((resolve, reject)=>{
      this.client.get(key, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(JSON.parse(result));
      });
    });
  }

  cache(key, callback, expireTime = DEFAULT_EXPIRE_SECOND) {
    return this.get(key)
      .then(result => {
        if (result !== null) {
          return Promise.resolve(result);
        } else {
          return callback();
        }
      })
      .then(result => {
        this.setEx(key, result, expireTime);
        return Promise.resolve(result);
      });
  }
}
