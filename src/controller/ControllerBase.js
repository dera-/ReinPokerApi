import GameError from '../exception/GameError';

export default ControllerBase {
  before(req) {
    if(false === this.isAuthorized(req)) {
      throw new GameError('認証されていないアクセスです', 'NO_AUTHRITHED', 401);
    }
  }

  isAuthorized(req) {
    return true;
  }

  done(req, res, fn) {
    try {
      this.before(req);
      fn(res);
    } catch(err) {
      res.locals.message = err.message;
      res.locals.error = err;
      res.status(err.status || 500);
      res.json({'error': 'error'});
    }
  }
}
