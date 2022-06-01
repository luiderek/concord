import React from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';

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
      {props.sameUser ? <i className="fa-solid fa-pencil"></i> : '' }
      {props.sameUser ? <DeleteConfirmModal {...props} /> : '' }
    </div>
  );
}
