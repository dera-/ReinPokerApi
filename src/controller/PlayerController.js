import ControllerBase from './ControllerBase.js';
import GameError from '../exception/GameError';
import PlayerService from '../domain/service/PlayerService';
import PlayerAiDataLoginValidation from '../validation/PlayerAiDataLoginValidation';
import LearningDataValidation from '../validation/LearningDataValidation';

export default class PlayerController extends ControllerBase {
  login(request, response) {
    this.beforePromise(request).then(() => {
      const requestBody = this.getRequestBody(request);
      const aiData = requestBody.ai_data;
      const learningData = requestBody.learning_data;
      const playerAiDataLoginValidation = new PlayerAiDataLoginValidation();
      const learningDataValidation = new LearningDataValidation();
      return Promise.all([playerAiDataLoginValidation.run(aiData), learningDataValidation.run(learningData)]);
    }).then((values) => {
      const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
      const serialCode = this.getSerialCode(request);
      const playerService = new PlayerService();
      return Promise.resolve(playerService.login(serialCode, values[0], values[1], ip));
    }).then((result) => {
        response.status(200);
        response.json({'success': true, 'data': result});
      }).catch((error) => {
        this.showError(response, error);
      });
  }

  register(request, response) {
    this.beforePromise(request).then(() => {
      const requestBody = this.getRequestBody(request);
      const aiData = requestBody.ai_data;
      const learningData = requestBody.learning_data;
      const playerAiDataLoginValidation = new PlayerAiDataLoginValidation();
      const learningDataValidation = new LearningDataValidation();
      return Promise.all([playerAiDataLoginValidation.run(aiData), learningDataValidation.run(learningData)]);
    }).then((values) => {
      const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
      const serialCode = this.getSerialCode(request);
      const playerService = new PlayerService();
      return Promise.resolve(playerService.register(serialCode, values[0], values[1], ip));
    }).then((result) => {
      response.status(200);
      response.json({'success': true, 'data': result});
    }).catch((error) => {
      this.showError(response, error);
    });
  }

  getSerialCode(req) {
    const serialCode = req.get('x-serial-code');
    if (typeof serialCode === "undefined") {
      throw new GameError('認証されていないアクセスです', 'UNAUTHORIZED', 401);
    }
    return serialCode;
  }
}
