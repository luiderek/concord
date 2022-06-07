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

  socket.on('message edit', content => {
    io.emit('message edit', content);
  });

  socket.on('message delete', target => {
    io.emit('message delete', target);
  });

  socket.on('new room', data => {
    io.emit('new room', data);
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
           "username",
           "edited"
      from "messages"
      join "users" using ("user_id")
     where "room_id"=$1
     order by "post_time" asc;
  `;
  const params = [roomID];
  db.query(sql, params)
    .then(result => {
      // console.log('rows:', result.rows);
      res.json(result.rows);
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

app.patch('/api/msg/:messageID', (req, res, next) => {
  const messageID = Number(req.params.messageID);
  const { content } = req.body;
  if (typeof messageID !== 'number' || messageID % 1 !== 0 || messageID < 0) {
    throw new ClientError(400, 'messageID must be a positive integer');
  }
  if (!content) { throw new ClientError(400, 'content required field'); }
  const sql = `
     update "messages"
     set "content"=$2, "edited"=true
     where "message_id"=$1
     returning *;
  `;
  const params = [messageID, content];
  db.query(sql, params)
    .then(data => {
      res.status(200).send({ ...data.rows[0], username: req.user.username });
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

app.post('/api/rooms/', (req, res, next) => {
  const { roomname, id } = req.body;
  if (!roomname) { throw new ClientError(400, 'roomname required field'); }
  if (!id) { throw new ClientError(400, 'id required field'); }
  const sql = `
    insert into "rooms" ("room_name", "server_id")
    values ($1, $2)
    returning *;
  `;
  const params = [roomname, id];
  db.query(sql, params)
    .then(data => {
      res.status(201).json(data.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/rooms/:serverID', (req, res, next) => {
  const serverID = Number(req.params.serverID);
  if (typeof serverID !== 'number' || serverID % 1 !== 0 || serverID < 0) {
    throw new ClientError(400, 'roomID must be a positive integer');
  }
  const sql = `
     select "room_name",
            "room_id"
      from  "rooms"
     where  "server_id"=$1
  `;
  const params = [serverID];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/servers/', (req, res, next) => {
  const sql = `
     select "server_id", "serv_name"
     from "servers"
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/servers/', (req, res, next) => {
  const { serverName } = req.body;
  if (!serverName) { throw new ClientError(400, 'serverName required field'); }
  const serverInsertSQL = `
    insert into "servers" ("serv_name", "serv_pic", "creator")
    values ($1, 'no pic', 1)
    returning *;
  `;
  const firstRoomSQL = `
    insert into "rooms" ("room_name", "server_id")
    values( 'general', $1);
  `;
  let params = [serverName];
  // After successfully creating the server, insert the room 'general'.
  db.query(serverInsertSQL, params)
    .then(data => {
      res.status(201).json(data.rows[0]);
      params = [data.rows[0].server_id];
      db.query(firstRoomSQL, params)
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

// replaced app.listen with server.listen now that socket.io is here.
server.listen(process.env.PORT, () => {
  process.stdout.write(`~~~ Listening on port ${process.env.PORT} ~~~\n`);
});
