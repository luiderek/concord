set client_min_messages to warning;

drop schema "public" cascade;
create schema "public";

CREATE TABLE users (
	user_id              serial NOT NULL,
	avatar               text NOT NULL,
	username             text NOT NULL,
	last_activity        timestamptz(6) DEFAULT now() NOT NULL,
	hashpass             text  NOT NULL,
	created_at           timestamptz(6) DEFAULT now() NOT NULL  ,
	CONSTRAINT pk_users PRIMARY KEY ( user_id )
 );

CREATE TABLE servers (
	server_id            serial NOT NULL,
	serv_name            text NOT NULL,
	serv_pic             text NOT NULL,
	creator              integer  NOT NULL,
	CONSTRAINT pk_servers PRIMARY KEY ( server_id )
 );

CREATE  TABLE membership (
	member_id            serial  NOT NULL,
	user_id              integer  NOT NULL,
	server_id            integer  NOT NULL,
	CONSTRAINT pk_membership PRIMARY KEY ( member_id )
 );

CREATE  TABLE rooms (
	room_id              serial NOT NULL,
	room_name            text DEFAULT 'general' NOT NULL,
	server_id            integer NOT NULL,
	CONSTRAINT pk_rooms PRIMARY KEY ( room_id )
 );

CREATE  TABLE messages (
	message_id           serial  NOT NULL,
	content              text  NOT NULL,
	post_time            timestamptz(6) DEFAULT now() NOT NULL,
	user_id              integer NOT NULL,
	room_id              integer NOT NULL,
	CONSTRAINT pk_messages PRIMARY KEY ( message_id )
 );

ALTER TABLE membership ADD CONSTRAINT fk_membership_users FOREIGN KEY ( user_id ) REFERENCES users( user_id );
ALTER TABLE membership ADD CONSTRAINT fk_membership_servers FOREIGN KEY ( server_id ) REFERENCES servers( server_id );
ALTER TABLE messages ADD CONSTRAINT fk_messages_users FOREIGN KEY ( user_id ) REFERENCES users( user_id );
ALTER TABLE messages ADD CONSTRAINT fk_messages_rooms FOREIGN KEY ( room_id ) REFERENCES rooms( room_id );
ALTER TABLE rooms ADD CONSTRAINT fk_rooms_servers FOREIGN KEY ( server_id ) REFERENCES servers( server_id );
ALTER TABLE servers ADD CONSTRAINT fk_servers_users FOREIGN KEY ( creator ) REFERENCES users( user_id );
