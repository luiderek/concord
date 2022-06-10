import React from 'react';
import Room from './Room';
import CreateRoomModal from './CreateRoomModal';
import ChangeServerModal from './ChangeServerModal';

export default function RoomSidebar(props) {
  return (
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
    </div>
  );
}
