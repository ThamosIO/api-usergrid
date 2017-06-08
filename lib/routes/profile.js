import Router from 'koa-router';
import User from '../models/users';
import requireLogin from '../middleware/require-login';

const router = new Router({
  prefix: '/api/profile',
});

function* getProfile() {
  // Maybe not useful to get it again
  const profile = yield User.findOne({ token: this.req.user.token });

  this.body = profile;
  this.status = 200;

  return this.status;
}

router
  .use('/', requireLogin)
  .get('/', getProfile);

module.exports = router;
