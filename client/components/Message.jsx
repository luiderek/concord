import React from 'react';

export default function Message(props) {
  return (
    <div className='message'>
      <span>
        {props.time}
      </span>
      <span>
        {props.name}
      </span>
      <span>
        {props.content}
      </span>
      <i className="fa-solid fa-pencil"></i>
      <i className="fa-solid fa-trash-can"></i>
    </div>
  );
}
