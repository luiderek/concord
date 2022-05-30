INSERT INTO "users" (
  "username",
  "hashpass",
  "avatar"
)
VALUES (
  'derek',
  'letmein',
  'https://cdn.shopify.com/s/files/1/1061/1924/products/Flushed_Emoji_Icon_5e6ce936-4add-472b-96ba-9082998adcf7_large.png?v=1571606089'
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
  'this is my second message from user-id 1 in room-id 1',
  1,
  1
);
