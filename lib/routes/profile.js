import Router from 'koa-router';
import User from '../models/users';
import { requireLogin } from '../middleware';

const router = new Router({
  prefix: '/api/profile',
});

async function getProfile(ctx) {
  const profile = await User.findOne({ token: this.req.user.token });

  ctx.body = profile;
  ctx.status = 200;
}

router
  .use('/', requireLogin)
  .get('/', getProfile);

module.exports = router;
