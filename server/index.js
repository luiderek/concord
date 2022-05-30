require('dotenv/config');
const path = require('path');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const db = require('./db');
const ClientError = require('./client-error');

const app = express();
const publicPath = path.join(__dirname, 'public');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
}

app.use(express.static(publicPath));

app.get('/api/msg', (req, res, next) => {
  const sql = `
    select "user_id",
           "room_id",
           "content"
      from "messages"
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/msg/:roomID', (req, res, next) => {
  const roomID = Number(req.params.roomID);
  if (typeof roomID !== 'number' || roomID % 1 !== 0 || roomID < 0) {
    throw new ClientError(400, 'roomID must be a positive integer');
  }
  const sql = `
    select "user_id",
           "room_id",
           "content"
      from "messages"
     where "room_id"=$1
  `;
  const params = [roomID];
  db.query(sql, params)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
