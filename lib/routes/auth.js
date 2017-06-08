import bluebird from 'bluebird';
import Router from 'koa-router';

import Authenticator from '../providers/Authenticator';
import User from '../models/users';
import { reddit } from '../providers/config.json';

const Reddit = new Authenticator(reddit);

const router = new Router({
  prefix: '/api/auth',
});

function* connect() {
  const url = yield bluebird.resolve(Reddit.connect());
  this.redirect(url);
}

function* login() {
  if (!this.query.code) {
    this.status = 401;
    return this.status;
  }

  const token = yield Reddit.signIn(this.query.code);
  const profile = yield Reddit.getUser(token);

  const { err, user, created } = yield User.findOrCreate({
    identity: profile.name,
    redditId: profile.id,
    token,
  });

  if (!created) {
    User.update({ _id: user._id }, user);
  }

  this.status = 200;

  return this.status;
}

router
  .get('/reddit', connect)
  .get('/oauth2callback', login);

module.exports = router;