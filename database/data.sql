INSERT INTO "users" (
  "username",
  "hashpass"
)
VALUES (
  'admin',
  'password123'
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
  'videos',
  1
);


INSERT INTO "rooms" (
  "room_name",
  "server_id"
)
VALUES (
  'memes',
  1
);

INSERT INTO "messages" (
  "content",
  "user_id",
  "room_id",
  "edited"
)
VALUES (
  'general chat is best chat',
  1,
  1,
  true
);


INSERT INTO "messages" (
  "content",
  "user_id",
  "room_id"
)
VALUES (
  'only cat videos no dog videos',
  1,
  2
);


INSERT INTO "messages" (
  "content",
  "user_id",
  "room_id"
)
VALUES (
  'only text based memes, image upload not supported',
  1,
  3
);
