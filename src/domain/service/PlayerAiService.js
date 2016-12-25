import PlayerAiDao from '../../infrastructure/db/dao/PlayerAiDao';
import DbConnection from '../../infrastructure/db/DbConnection';
import GameError from '../../exception/GameError';

export default class PlayerAiService {
  constructor() {
    this.playerAiDao = new PlayerAiDao();
    this.gameDb = DbConnection.getConnection('game');
  }

  /**
   * @Param Number userId
   * @Return Object
   */
  async getRandomAiData(userId) {
    const aiNums = await this.playerAiDao.getCount();
    if (aiNums < 2) {
      throw new GameError('取得対象のAIデータが存在しませんでした', 'INTERNAL_ERORR', 500);
    }
    const myAi = await this.playerAiDao.getByPlayerId(userId);
    const tryNum = 3;
    let current = 0;
    while (current < tryNum) {
      const randomId = Math.round(Math.random() * aiNums);
      if (randomId === myAi.id) {
        continue;
      }
      const randomAiData = this.playerAiDao.get(randomId);
      if (Object.keys(randomAiData).length === 0) {
        current++;
      } else {
        return randomAiData;
      }
    }
    throw new GameError('AIデータの取得に失敗しました', 'INTERNAL_ERORR', 500);
  }

  /**
   * @Param Number userId
   * @Param Object results
   * @Return String
   */
  async updateResults(userId, results) {
    const data = [];
    const myAi = await this.playerAiDao.getByPlayerId(userId);
    data['player_id'] = userId;
    data['battle_count'] = myAi.battle_count + 1;
    if (results.is_win) {
      data['win_count'] = myAi.win_count + 1;
    } else {
      data['win_count'] = myAi.win_count;
    }
    try{
      await this.gameDb.beginTransaction();
      await this.playerAiDao.updateResults(data);
      await this.gameDb.commit();
    } catch(ex) {
      this.gameDb.rollback();
      throw new GameError('AIデータの更新に失敗しました', 'INTERNAL_ERORR', 500);
    }
  }
}