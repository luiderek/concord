/* eslint-disable camelcase */
require('dotenv/config');
const path = require('path');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./auth-middleware.js');
const db = require('./db');
const ClientError = require('./client-error');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const app = express();
const publicPath = path.join(__dirname, 'public');

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', socket => {

  socket.on('message submit', content => {
    io.emit('message submit', content);
  });

  socket.on('message delete', target => {
    io.emit('message delete', target);
  });
});

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
}

app.use(express.static(publicPath));
app.use(express.json());

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("username", "hashpass")
        values ($1, $2)
        returning "user_id", "username", "created_at"
      `;
      const params = [username, hashedPassword];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "user_id",
           "hashpass"
      from "users"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { user_id, hashpass } = user;
      return argon2
        .verify(hashpass, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId: user_id, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

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
    .then(result => {
      // I believe this addresses an issue that causes failures when an
      // error JSON object is returned, and an array method is called on that.
      // Basically when you load in, it tries to load messages before the authtoken is finished.
      if (typeof result.rows === 'object') {
        res.json([]);
      } else {
        res.json(result.rows);
      }
    })
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
    .then(data => {
      res.status(201).json({ ...data.rows[0], username: req.user.username });
    })
    .catch(err => next(err));
});

app.delete('/api/msg/:messageID', (req, res, next) => {
  const messageID = Number(req.params.messageID);
  if (typeof messageID !== 'number' || messageID % 1 !== 0 || messageID < 0) {
    throw new ClientError(400, 'messageID must be a positive integer');
  }
  const sql = `
    delete from "messages"
     where "message_id"=$1
     returning "message_id", "content";
  `;
  const params = [messageID];
  db.query(sql, params)
    .then(data => res.status(200).json(data.rows[0]))
    .catch(err => next(err));
});

app.use(errorMiddleware);

// replaced app.listen with server.listen now that socket.io is here.
server.listen(process.env.PORT, () => {
  process.stdout.write(`~~~ Listening on port ${process.env.PORT} ~~~\n`);
});
