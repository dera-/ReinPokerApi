import PlayerAiDao from '../../infrastructure/db/dao/PlayerAiDao';
import DbConnection from '../../infrastructure/db/DbConnection';
import GameError from '../../exception/GameError';
import LearningFileService from './LearningFileService';
import LearningDataModel from '../model/LearningDataModel';

export default class PlayerAiService {
  constructor() {
    this.playerAiDao = new PlayerAiDao();
    this.learningFileService = new LearningFileService();
    this.gameDb = DbConnection.getConnection('game');
  }

  /**
   * @Param Number userId
   * @Return Object
   */
  async getRandomAiData(userId) {
    const aiNums = await this.playerAiDao.getMaxId();
    if (aiNums < 2) {
      throw new GameError('取得対象のAIデータが存在しませんでした', 'INTERNAL_ERORR', 500);
    }
    const myAi = await this.playerAiDao.getByPlayerId(userId);
    const tryNum = 5;
    let current = 0;
    while (current < tryNum) {
      const randomId = Math.round(Math.random() * aiNums) + 1;
      console.log('randomId:' + randomId);
      if (randomId === myAi.id) {
        continue;
      }
      const randomAiData = await this.playerAiDao.get(randomId);
      if (Object.keys(randomAiData).length === 0) {
        current++;
      } else {
        const actualAiData = await this.includeLearningData(randomAiData);
        return actualAiData;
      }
    }
    throw new GameError('AIデータの取得に失敗しました', 'INTERNAL_ERORR', 500);
  }

  async includeLearningData(aiData) {
    const learningData = await this.learningFileService.loadData(aiData.player_id);
    aiData['pre_flop'] = learningData.getData('preflop');
    aiData['flop'] = learningData.getData('flop');
    aiData['turn'] = learningData.getData('turn');
    aiData['river'] = learningData.getData('river');
    return aiData;
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
