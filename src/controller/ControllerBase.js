import GameError from '../exception/GameError';
import mainConfig from '../../config/main';

export default class ControllerBase {
  before(req) {
    if(false === this.isAuthorized(req)) {
      throw new GameError('認証されていないアクセスです', 'UNAUTHORIZED', 401);
    }
  }

  isAuthorized(req) {
    const accessId = req.get('x-access-id');
    if (typeof accessId === "undefined") {
      return false;
    }
    return parseInt(accessId, 10) === mainConfig.access_id;
  }
}
