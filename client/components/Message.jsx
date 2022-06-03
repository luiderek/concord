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
        {/* The edited-marker needs to be on it's own span for copy-paste.
          But I'd need to rework the message display grid, so it'll do. */}
        {props.edited === true &&
          <span className='edited-marker'>
            (edited)
          </span>
        }
      </span>

      {props.sameUser ? <i className="fa-solid fa-pencil"></i> : '' }
      {props.sameUser ? <DeleteConfirmModal {...props} /> : '' }
    </div>
  );
}
