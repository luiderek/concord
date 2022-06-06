import React from 'react';
import AppContext from '../lib/app-context';
import Room from './Room';
import CreateRoomModal from './CreateRoomModal';
import ChangeServerModal from './ChangeServerModal';

export default function RoomSidebar(props) {
  return (
    <div className='room-sidebar'>
      <ChangeServerModal serverName={props.serverName} />
      <CreateRoomModal/>
      <AppContext.Consumer>
        {context => {
          return context.rooms.map(msg => (
              <Room key={msg.room_id}
                name={msg.room_name}
                isActive={msg.room_name === context.roomName} />
          ));
        }
        }
      </AppContext.Consumer>
    </div>
  );
}

RoomSidebar.context = AppContext;
