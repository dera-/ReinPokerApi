import PlayerDao from '../infrastructure/db/dao/PlayerDao';
import SerialCodeDao from '../infrastructure/db/dao/SerialCodeDao';
import DbConnection from '../infrastructure/db/DbConnection';

export default class PlayerService {
  constructor() {
    this.playerDao = new PlayerDao();
    this.serialCodeDao = new SerialCodeDao();
    this.gameDb = DbConnection.getConnection('game');
  }

  /**
   * @Param string code シリアルコード
   * @Return Object
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
    return user;
  }

  /**
   * @Param string code シリアルコード
   */
  async register(code) {
    const record = await this.serialCodeDao.getByCode(code);
    if (Object.keys(record).length === 0 || record.user_id !== null) {
      throw new GameError('未使用シリアルコードが見つかりませんでした', 'NOT_FOUND', 404);
    }
    try{
      await this.gameDb.beginTransaction();
      const data = await this.playerDao.insert({name: 'AIちゃん', money: 10000, paid: true});
      await this.serialCodeDao.updateUserId(record.id, data.id);
      await this.gameDb.commit();
    } catch(ex) {
      this.gameDb.rollback();
      throw new GameError('ユーザーデータ登録に失敗しました', 'INTERNAL_ERORR', 500);
    }
  }
}
