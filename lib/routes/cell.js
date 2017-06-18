import Router from 'koa-router';

import Cell from '../models/cell';
import requireLogin from '../middleware/require-login';

const router = new Router({
  prefix: '/api/cells',
});

async function getCells(ctx) {
  const cells = await Cell.find();

  ctx.body = cells;
}

async function getCell(ctx) {
  const cell = await Cell.findOne({ _id: ctx.params.id });

  ctx.body = cell;
}

async function lockCell(ctx) {
  const cell = await Cell.lockAndUpdate({
    _id: ctx.params.id,
    char: ctx.params.char,
    userId: ctx.user._id,
  });

  ctx.body = cell;
}

router
  .use('/', requireLogin)
  .get('/', getCells)
  .get('/:id', getCell)
  .post('/:id/lock', lockCell);

module.exports = router;
