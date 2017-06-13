import User from '../models/users';

export default async function requireLogin(next) {
  const auth = this.request.header.authorization;
  const token = auth.split('Bearer ')[1];

  const user = await User.findOne({ token });

  this.req.user = user;

  await next;
}
