import ControllerBase from './ControllerBase.js';
import GameError from '../exception/GameError';
import PlayerService from '../domain/service/PlayerService';
import PlayerAiDataLoginValidation from '../validation/PlayerAiDataLoginValidation';
import LearningDataValidation from '../validation/LearningDataValidation';

export default class PlayerAiController extends ControllerBase {
  getRandom(request, response) {
    this.beforePromise(request).then(() => {
      const aiData = request.body.ai_data;
      const learningData = request.body.learning_data;
      const playerAiDataLoginValidation = new PlayerAiDataLoginValidation();
      const learningDataValidation = new LearningDataValidation();
      return Promise.all(playerAiDataLoginValidation.run(aiData), learningDataValidation.run(learningData));
    }).then((aiData, learningData) => {
      const ip = request.connection.remoteAddress;
      const serialCode = this.getSerialCode(request);
      const playerService = new PlayerService();
      return Promise.resolve(playerService.login(serialCode, aiData, learningData, ip));
    }).then((result) => {
        response.status(200);
        response.json({'success': true, 'data': result});
      }).catch((error) => {
        this.showError(response, error);
      });
  }

  updateResults(request, response) {
    this.beforePromise(request).then(() => {
      const aiData = request.body.ai_data;
      const learningData = request.body.learning_data;
      const playerAiDataLoginValidation = new PlayerAiDataLoginValidation();
      const learningDataValidation = new LearningDataValidation();
      return Promise.all(playerAiDataLoginValidation.run(aiData), learningDataValidation.run(learningData));
    }).then((aiData, learningData) => {
      const ip = request.connection.remoteAddress;
      const serialCode = this.getSerialCode(request);
      const playerService = new PlayerService();
      return Promise.resolve(playerService.register(serialCode, aiData, learningData, ip));
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
      throw GameError('認証されていないアクセスです', 'UNAUTHORIZED', 401);
    }
    return serialCode;
  }
}