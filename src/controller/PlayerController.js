import ControllerBase from './ControllerBase.js';
import GameError from '../exception/GameError';
import PlayerService from '../domain/service/PlayerService';

export default class PlayerController extends ControllerBase {
  async get(request, response) {
    this.beforePromise(request).then(() =>{
      const serialCode = this.getSerialCode(request);
      const playerService = new PlayerService();
      return Promise.resolve(playerService.login(serialCode));
    }).then((result)=>{
        response.status(200);
        response.json({'data': result});
      }).catch((error)=>{
        this.showError(response, error);
      });
  }

  post(request, response) {
      this.beforePromise(request).then(() => {
        const serialCode = this.getSerialCode(request);
        const playerService = new PlayerService();
        return Promise.resolve(playerService.register(serialCode));
      }).then((result)=>{
        response.status(200);
        response.json({'success': true});
      }).catch((error)=>{
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
