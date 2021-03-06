import React from 'react';
import Room from './room';
import Button from 'react-bootstrap/Button';
import CreateRoomModal from './create-room-modal';
import ChangeServerModal from './change-server-modal';

export default function RoomSidebar(props) {
  return (
    <div className={`float-sidebar ${!props.isShow && 'hide-sidebar-left'}`}>
      <div className="room-sidebar">
        <ChangeServerModal
          serverName={props.serverName}
          handleServerChange={props.handleServerChange}
        />
        <CreateRoomModal serverID={props.serverID} />
        {props.rooms.map(msg => (
          <Room
            key={msg.room_id}
            name={msg.room_name}
            serverName={props.serverName}
            isActive={msg.room_name === props.roomName}
          />
        ))}
        <div className="user-sign-out">
          <span>{props.user.username}</span>
          <Button onClick={props.handleSignOut}>sign out</Button>
        </div>
      </div>
    </div>
  );
}
