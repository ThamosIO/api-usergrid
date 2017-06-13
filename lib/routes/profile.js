import Router from 'koa-router';
import User from '../models/users';
import requireLogin from '../middleware/require-login';

const router = new Router({
  prefix: '/api/profile',
});

async function getProfile() {
  const profile = await User.findOne({ token: this.req.user.token });

  this.body = profile;
  this.status = 200;

  return this.status;
}

router
  .use('/', requireLogin)
  .get('/', getProfile);

module.exports = router;
