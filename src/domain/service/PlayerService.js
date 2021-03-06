import PlayerDao from '../../infrastructure/db/dao/PlayerDao';
import PlayerAiDao from '../../infrastructure/db/dao/PlayerAiDao';
import SerialCodeDao from '../../infrastructure/db/dao/SerialCodeDao';
import AccessTokenRedisDao from '../../infrastructure/cache/dao/AccessTokenRedisDao';
import DbConnection from '../../infrastructure/db/DbConnection';
import GameError from '../../exception/GameError';
import AccessTokenModelFactory from '../factory/AccessTokenModelFactory';
import LearningFileService from './LearningFileService';
import LearningDataModel from '../model/LearningDataModel';

export default class PlayerService {
  constructor() {
    this.playerDao = new PlayerDao();
    this.playerAiDao = new PlayerAiDao();
    this.serialCodeDao = new SerialCodeDao();
    this.accessTokenRedisDao = new AccessTokenRedisDao();
    this.learningFileService = new LearningFileService();
    this.gameDb = DbConnection.getConnection('game');
  }

  /**
   * @Param String code シリアルコード
   * @Return String
   */
  async login(code, aiData, learningData, ip) {
    const userId = await this.serialCodeDao.getUserIdByCode(code);
    if (userId === null) {
      throw new GameError('該当のユーザーが見つかりませんでした', 'NOT_FOUND', 404);
    }
    // @HACK ユーザー存在チェックだがなくてもいい気がする
    const user = await this.playerDao.get(userId);
    if (Object.keys(user).length === 0) {
      throw new GameError('該当のユーザーは削除されていました', 'CONFLICT', 409);
    }
    try{
      await this.gameDb.beginTransaction();
      aiData['player_id'] = userId;
      await this.playerAiDao.updateData(aiData);
      await this.gameDb.commit();
    } catch(ex) {
      this.gameDb.rollback();
      throw new GameError('AIデータの更新に失敗しました', 'INTERNAL_ERORR', 500);
    }
    // 学習データセーブ
    await this.learningFileService.saveData(userId, this.getLearningDataModel(learningData));

    // トークン発行
    const token = await this.getAccessToken(ip, userId);
    return token;
  }

  /**
   * @Param String code シリアルコード
   * @Return String
   */
  async register(code, aiData, learningData, ip) {
    let userId = null;
    const record = await this.serialCodeDao.getByCode(code);
    if (Object.keys(record).length === 0 || record.user_id !== null) {
      throw new GameError('未使用シリアルコードが見つかりませんでした', 'NOT_FOUND', 404);
    }
    try{
      await this.gameDb.beginTransaction();
      userId = await this.playerDao.insert({name: aiData.name, money: 10000, paid: true});  //moneyとpaidはとりあえずべた書き(未実装要素なので)
      aiData['player_id'] = userId;
      await this.playerAiDao.insert(aiData);
      await this.serialCodeDao.updateUserId(record.id, userId);
      await this.gameDb.commit();
    } catch(ex) {
      this.gameDb.rollback();
      throw new GameError('ユーザーデータ登録に失敗しました', 'INTERNAL_ERORR', 500);
    }
    // 学習データセーブ
    await this.learningFileService.saveData(userId, this.getLearningDataModel(learningData));

    // トークン発行
    const token = await this.getAccessToken(ip, userId);
    return token;
  }

  async getAccessToken(ip, userId) {
    try {
      const tokenModel = AccessTokenModelFactory.generate(userId);
      console.log(tokenModel.getData());
      await this.accessTokenRedisDao.set(ip, tokenModel);
      return tokenModel.accessToken;
    } catch(err) {
      throw new GameError('アクセストークンの取得・保存に失敗しました', 'INTERNAL_ERORR', 500);
    }
  }

  getLearningDataModel(learningData) {
    return new LearningDataModel(learningData.pre_flop, learningData.flop, learningData.turn, learningData.river);
  }
}
