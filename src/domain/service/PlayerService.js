import PlayerDao from '../../infrastructure/db/dao/PlayerDao';
import PlayerAiDao from '../../infrastructure/db/dao/PlayerAiDao';
import SerialCodeDao from '../../infrastructure/db/dao/SerialCodeDao';
import AccessTokenRedisDao from '../../infrastructure/cache/dao/AccessTokenRedisDao';
import DbConnection from '../../infrastructure/db/DbConnection';
import GameError from '../../exception/GameError';
import AccessTokenFactory from '../../factory/AccessTokenFactory';

export default class PlayerService {
  constructor() {
    this.playerDao = new PlayerDao();
    this.playerAiDao = new PlayerAiDao();
    this.serialCodeDao = new SerialCodeDao();
    this.accessTokenRedisDao = new AccessTokenRedisDao();
    this.gameDb = DbConnection.getConnection('game');
  }

  /**
   * @Param string code シリアルコード
   * @Return Object
   * @TODO トークン発行
   */
  async login(code) {
    const userId = await this.serialCodeDao.getUserIdByCode(code);
    if (userId === null) {
      throw new GameError('該当のユーザーが見つかりませんでした', 'NOT_FOUND', 404);
    }
    const user = await this.playerDao.get(userId);
    if (Object.keys(user).length === 0) {
      throw new GameError('該当のユーザーは削除されていました', 'CONFLICT', 409);
    }
    return {id:userId, token: this.getAccessToken(userId)};
  }

  /**
   * @Param string code シリアルコード
   * @TODO トークン発行
   */
  async register(code) {
    let userId = null;
    const record = await this.serialCodeDao.getByCode(code);
    if (Object.keys(record).length === 0 || record.user_id !== null) {
      throw new GameError('未使用シリアルコードが見つかりませんでした', 'NOT_FOUND', 404);
    }
    try{
      await this.gameDb.beginTransaction();
      const data = await this.playerDao.insert({name: 'プレイヤー君', money: 10000, paid: true});
      await this.playerAiDao.insert({player_id: data.insertId, name: 'AIちゃん', file_key: 'file' + data.insertId + '_'});
      await this.serialCodeDao.updateUserId(record.id, data.insertId);
      await this.gameDb.commit();
      userId = data.insertId;
    } catch(ex) {
      this.gameDb.rollback();
      throw new GameError('ユーザーデータ登録に失敗しました', 'INTERNAL_ERORR', 500);
    }
    return {id:userId, token: this.getAccessToken(userId)};
  }

  async getAccessToken(userId) {
    try {
      const token = AccessTokenFactory.get();
      this.accessTokenRedisDao.set(userId, token);
      return token;
    } catch(err) {
      throw new GameError('アクセストークンの取得・保存に失敗しました', 'INTERNAL_ERORR', 500);
    }
  }
}
