import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import session from 'koa-generic-session';
import responseTime from 'koa-response-time';
import MongooseStore from 'koa-session-mongoose';
import mongoose from 'mongoose';
import reqtree from 'require-tree';
import logger from 'winston';

import requireLogin from './lib/middleware/require-login';
import settings from './settings.json';

const path = [`mongodb://${settings.server.host}/${settings.server.db}`].join('');

mongoose.connect(path);

export default class Server {
  constructor(hostname, port) {
    this.hostname = hostname;
    this.port = port;
    this.app = koa();
  }

  mountMiddleware() {
    this.app
      .use(responseTime())
      .use(function* requestDuration(next) {
        const start = new Date();
        yield next;
        const ms = new Date() - start;
        logger.info(`[${this.response.status}] | ${this.method} ${this.url} - ${ms}`);
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
