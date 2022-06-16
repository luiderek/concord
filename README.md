# Concord • [Live Demo](https://chat-concord.herokuapp.com/)

A full stack JavaScript solo project using Express, Node, PostgreSQL, and React. A webapp for people who want to chat with others.

I have good memories of talking to people through google docs, and a chatroom implementation of real-time-text copying discord's styling seemed like a fun project to practice replicating designs, as well as working with sockets and manipulating a relational database. 

## Technologies Used

- React
- JavaScript, CSS3
- Node.js
- Express
- PostgreSQL
- Webpack
- [Socket.io](https://socket.io/)
- [React-Bootstrap](https://react-bootstrap.github.io/)

## Features

- Users can see, create, edit, and delete messages.
- Users can switch between different rooms within a server.
- Users can switch between different servers with their own individual rooms.
- Users can see other users typing live.
- Users can authenticate with a username and password.

## Getting Started

First load the repository in a container volume.

```
npm i
```
Install all dependencies.

```
npm run db:import
```
Set up the PostgreSQL schema along with initial data. 

```
npm run dev
```
Run the dev-server that reloads on any changes.

(Alternatively for production: `npm run build` `npm run start`)

Webpage can then be accessed at `localhost:3000`

## React Component Relationships
                               ┌─ CreateServer
                               │
               ┌─ RoomSidebar ─┼─ CreateRoom
     ┌── Home ─┤               │
     │         │               └─ Room
     │         │
     │         ├─ MessageContainer ─► Message
    App        │                      │
     │         └─ Chat Input          ├─ DeleteModal
     │                                │
     │                                └─ EditMsgInput
     │         ┌─ SignUp
     └─  Auth ─┤
               └─ SignIn

## Preview

![live typing](https://user-images.githubusercontent.com/12964172/172706458-6a532d48-74bc-43cc-810b-e6eabb8077c5.gif)
![change server](https://user-images.githubusercontent.com/12964172/172454099-ec135871-6103-4fb6-bcd8-8ea228457973.gif)

