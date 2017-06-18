import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import MongooseStore from 'koa-session-mongoose';
import mongoose from 'mongoose';
import reqtree from 'require-tree';
import logger from 'winston';

import cors from '../forks/koa-cors/';
import requireLogin from './lib/middleware/require-login';
import settings from './settings.json';

const path = [`mongodb://${settings.server.host}/${settings.server.db}`].join('');

mongoose.connect(path);

export default class Server {
  constructor(hostname, port) {
    this.hostname = hostname;
    this.port = port;
    this.app = new Koa();
  }

  mountMiddleware() {
    this.app
      .use(async (ctx, next) => {
        const start = new Date();
        await next();
        const ms = new Date() - start;

        logger.info(`[${ctx.status}] | ${ctx.method} ${ctx.url} - ${ms}`);
      })
      .use(bodyParser())
      .use(cors());

    return this;
  }

  mountRoutes() {
    const routers = reqtree(`${__dirname}/lib/routes`);

    Object.keys(routers).forEach((route) => {
      if (route === 'auth') {
        this.app.use(routers[route].routes());
      } else {
        this.app.use(routers[route].routes(), requireLogin);
      }
    });

    return this;
  }

  mountDB() {
    this.app.use(session({
      store: new MongooseStore(),
    }));
  }

  listen() {
    return this.app.listen(this.port);
  }
}
