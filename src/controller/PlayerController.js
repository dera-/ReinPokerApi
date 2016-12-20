import ControllerBase from './ControllerBase.js';
import GameError from '../exception/GameError';
import PlayerService from '../domain/service/PlayerService';

export default class PlayerController extends ControllerBase {
  async get(request, response) {
    const callback = (req, res) => {
      const serialCode = this.getSerialCode(req);
      const playerService = new PlayerService();
      playerService.login(serialCode).then((result)=>{
        res.status(200);
        res.json({'data': result});
      });
    };
    await this.done(request, response, callback);
  }

  post(request, response) {
      new Promise((resolve)=>{
        this.before(request);
        resolve();
      }).then(() => {
        const serialCode = this.getSerialCode(request);
        const playerService = new PlayerService();
        return Promise.resolve(playerService.register(serialCode))
      }).then((result)=>{
        response.status(200);
        response.json({'success': true});
      }).catch((error)=>{
        console.log(error);
        response.status(500);
        response.json({'error': error});
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
