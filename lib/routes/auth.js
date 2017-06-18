import Router from 'koa-router';

import Authenticator from '../providers/Authenticator';
import User from '../models/users';
import { reddit } from '../providers/config.json';

const Reddit = new Authenticator(reddit);

const router = new Router({
  prefix: '/api/auth',
});

async function connect(ctx) {
  const url = await Reddit.connect();
  ctx.redirect(url);
}

async function login(ctx) {
  if (!ctx.code) {
    ctx.status = 401;
    return ctx.status;
  }

  const token = await Reddit.signIn(this.query.code);
  const profile = await Reddit.getUser(token);

  const { user, created } = await User.findOrCreate({
    identity: profile.name,
    redditId: profile.id,
    token,
  });

  if (!created) {
    User.update({ _id: user._id }, user);
  }

  ctx.status = 200;
  return user;
}

router
  .get('/reddit', connect)
  .get('/oauth2callback', login);

module.exports = router;
