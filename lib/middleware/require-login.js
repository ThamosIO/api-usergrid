import User from '../models/users';

export default function* requireLogin(next) {
  const auth = this.request.header.authorization;
  const token = auth.split('Bearer ')[1];

  const user = yield User.findOne({ token });

  this.req.user = user;

  yield next;
}
