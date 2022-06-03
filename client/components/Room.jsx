import React from 'react';

export default function Room(props) {

  function handleRoomClick(e) {
    const url = new URL(window.location);
    url.hash = '/' + props.name;
    window.location.replace(url);
    return null;
  }

  return (
    <div className='room' onClick={handleRoomClick} key={props.room_id}>
      <i className="fa-solid fa-hashtag"></i> {props.name}
    </div>
  );
}
