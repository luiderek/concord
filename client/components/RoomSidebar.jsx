import React from 'react';
import AppContext from '../lib/app-context';
import Room from './Room';

export default function RoomSidebar(props) {
  return (
    <div className='room-sidebar'>
      <div className="server-name">Server Name</div>
      <i className="fa-solid fa-plus"></i>
      <AppContext.Consumer>
        {context => {
          return context.rooms.map(msg => (
              <Room key={msg.room_id}
                name={msg.room_name} />
          ));
        }
        }
      </AppContext.Consumer>
    </div>
  );
}

RoomSidebar.context = AppContext;
