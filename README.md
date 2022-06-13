# Concord

A full stack JavaScript solo project using Express, Node, PostgreSQL, React.

You can check it out live [here](chat-concord.herokuapp.com/)!

This is just a chat-room discord clone, featuring real time text, the ability to create rooms and servers, and CRUD operations to a database.

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

