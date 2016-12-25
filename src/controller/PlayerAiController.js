import ControllerBase from './ControllerBase.js';
import GameError from '../exception/GameError';
import PlayerAiService from '../domain/service/PlayerAiService';
import AccessTokenRedisDao from '../infrastructure/cache/dao/AccessTokenRedisDao';
import AccessTokenModel from '../domain/model/AccessTokenModel';
import PlayerAiResultsValidation from '../validation/PlayerAiResultsValidation';

export default class PlayerAiController extends ControllerBase {
  getRandom(request, response) {
    this.beforePromise(request).then(() => {
      return Promise.resolve(this.getAuthorizedUserId(request));
    }).then((userId) => {
      const playerAiService = new PlayerAiService();
      return Promise.resolve(playerAiService.getRandomAiData(userId));
    }).then((data) => {
        response.status(200);
        response.json({'success': true, 'data': data});
      }).catch((error) => {
        this.showError(response, error);
      });
  }

  updateResults(request, response) {
    this.beforePromise(request).then(() => {
      const requestBody = this.getRequestBody(request);
      const results = requestBody.results;
      const playerAiResultsValidation = new PlayerAiResultsValidation();
      return Promise.all([this.getAuthorizedUserId(request), playerAiResultsValidation.run(results)]);
    }).then((values) => {
      const playerAiService = new PlayerAiService();
      return Promise.resolve(playerAiService.updateResults(values[0], values[1]));
    }).then(() => {
      response.status(200);
      response.json({'success': true});
    }).catch((error) => {
      this.showError(response, error);
    });
  }

  async getAuthorizedUserId(req) {
    const requestAccessToken = req.get('x-access-token');
    if (typeof requestAccessToken === "undefined") {
      throw new GameError('認証されていないアクセスです', 'UNAUTHORIZED', 401);
    }
    const ip = req.connection.remoteAddress;
    const accessTokenRedisDao = new AccessTokenRedisDao();
    const actualAccessTokenModel = await accessTokenRedisDao.get(ip);
    if (actualAccessTokenModel === null || actualAccessTokenModel.accessToken !== requestAccessToken) {
      throw new GameError('認証されていないアクセスです', 'UNAUTHORIZED', 401);
    }
    await accessTokenRedisDao.expire(ip);
    return actualAccessTokenModel.userId;
  }
}