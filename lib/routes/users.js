import Router from 'koa-router';
import User from '../models/users';
import requireLogin from '../middleware/require-login';

const router = new Router({
  prefix: '/api/users',
});

function* getUsers() {
  const users = yield User.find();

  this.body = users;
  this.status = 200;

  return this.status;
}

router
  .use('/', requireLogin)
  .get('/', getUsers);

module.exports = router;
