INSERT INTO "users" (
  "username",
  "hashpass"
)
VALUES (
  'derek',
  'letmein'
);

INSERT INTO "users" (
  "username",
  "hashpass"
)
VALUES (
  'admin',
  'password123'
);

INSERT INTO "users" (
  "username",
  "hashpass"
)
VALUES (
  'friend',
  'thisisme'
);

INSERT INTO "servers" (
  "serv_name",
  "serv_pic",
  "creator"
)
VALUES (
  'server one',
  'no picture lol',
  1
);

INSERT INTO "rooms" (
  "room_name",
  "server_id"
)
VALUES (
  'general',
  1
);

INSERT INTO "rooms" (
  "room_name",
  "server_id"
)
VALUES (
  'bucket',
  1
);

INSERT INTO "messages" (
  "content",
  "user_id",
  "room_id"
)
VALUES (
  'this is my very first message',
  1,
  1
);

INSERT INTO "messages" (
  "content",
  "user_id",
  "room_id"
)
VALUES (
  'i do not exist',
  3,
  1
);


INSERT INTO "messages" (
  "content",
  "user_id",
  "room_id"
)
VALUES (
  'you are already banned',
  2,
  1
);
