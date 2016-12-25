import GameError from '../exception/GameError';
import mainConfig from '../../config/main';

export default class ControllerBase {
  before(req) {
    if(false === this.isAuthorized(req)) {
      throw new GameError('認証されていないアクセスです', 'UNAUTHORIZED', 401);
    }
  }

  beforePromise(request) {
    return new Promise(resolve => {
      this.before(request);
      resolve();
    });
  }

  isAuthorized(req) {
    const accessId = req.get('x-access-id');
    if (typeof accessId === "undefined") {
      return false;
    }
    return parseInt(accessId, 10) === mainConfig.access_id;
  }

  getRequestBody(request) {
    const body = Object.keys(request.body);
    return JSON.parse(body[0]);
  }

  showError(response, error) {
      console.log(error);
      response.status(error.status || 500);
      response.json({'error': error});
  }
}
