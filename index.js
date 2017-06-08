

import Server from './server';

const port = 4444;
const hostname = 'localhost';
const server = new Server(hostname, port);

server
  .mountMiddleware()
  .mountRoutes()
  .listen();
