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
  'default',
  'no pic',
  1
);

INSERT INTO "servers" (
  "serv_name",
  "serv_pic",
  "creator"
)
VALUES (
  'suspicious-server',
  'no pic',
  1
);

INSERT INTO "servers" (
  "serv_name",
  "serv_pic",
  "creator"
)
VALUES (
  'fun-server',
  'no pic',
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

INSERT INTO "rooms" (
  "room_name",
  "server_id"
)
VALUES (
  'general',
  2
);

INSERT INTO "rooms" (
  "room_name",
  "server_id"
)
VALUES (
  'general',
  3
);

INSERT INTO "messages" (
  "content",
  "user_id",
  "room_id",
  "edited"
)
VALUES (
  'default #general',
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

INSERT INTO "messages" (
  "content",
  "user_id",
  "room_id"
)
VALUES (
  'suspicious-server #general',
  1,
  4
);

INSERT INTO "messages" (
  "content",
  "user_id",
  "room_id"
)
VALUES (
  'fun-server #general',
  1,
  5
);
