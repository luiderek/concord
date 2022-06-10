# Concord

A full stack JavaScript solo project using Express, Node, PostgreSQL, React.
A text chat-room clone of discord. 


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
