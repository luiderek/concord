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
app.use(express.json());

app.get('/api/msg', (req, res, next) => {
  const sql = `
     select "users"."user_id",
           "message_id",
           "room_id",
           "content",
           "post_time",
           "username"
      from "messages"
      join "users" using ("user_id")
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
     select "users"."user_id",
           "message_id",
           "room_id",
           "content",
           "post_time",
           "username"
      from "messages"
      join "users" using ("user_id")
     where "room_id"=$1
  `;
  const params = [roomID];
  db.query(sql, params)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/msg/', (req, res, next) => {
  const { userID, message, room } = req.body;
  if (!message) { throw new ClientError(400, 'message required field'); }
  if (!userID) { throw new ClientError(400, 'userID required field'); }
  if (!room) { throw new ClientError(400, 'room required field'); }
  const sql = `
    insert into "messages" ("content", "user_id", "room_id")
    values ($1, $2, $3)
    returning *;
  `;
  const params = [message, userID, room];
  db.query(sql, params)
    .then(data => res.status(201).json(data.rows[0]))
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
