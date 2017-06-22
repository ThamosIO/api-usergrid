import logger from 'winston';

import User from '../models/users';

export async function requireLogin(ctx, next) {
  const auth = this.request.header.authorization;
  const token = auth.split('Bearer ')[1];

  const user = await User.findOne({ token });

  this.req.user = user;

  await next();
}

export async function responseTime(ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;

  logger.info(`[${ctx.status}] | ${ctx.method} ${ctx.url} - ${ms}`);
}
