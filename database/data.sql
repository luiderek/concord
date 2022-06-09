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
  'music',
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
