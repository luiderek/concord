import React from 'react';

export default function Room(props) {
  return (
    <div className='room'>
      <i className="fa-solid fa-hashtag"></i> {props.name}
    </div>
  );
}
