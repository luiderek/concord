# Concord

A full stack JavaScript solo project using Express, Node, PostgreSQL, React.

A text chat-room clone of discord, featuring real time text, the ability to create rooms and servers, and CRUD operations to a database which typically wouldn't be in an actual chat app, but this is still primarily intended as a demo project.


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
 
          Component relationship chart (As of 6/10/22)

