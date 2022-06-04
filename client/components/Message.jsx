import React from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import EditMessageInput from './EditMessageInput';

export default function Message(props) {
  return (
    <>
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
          Turns out, user-select:none also prevents span bleed.
          Might be a useful trick in the future for this stuff. */}
        {props.edited === true &&
          <span className='edited-marker'>
            (edited)
          </span>
        }
      </span>

      {props.sameUser ? <i className="fa-solid fa-pencil"></i> : '' }
      {props.sameUser ? <DeleteConfirmModal {...props} /> : '' }
    </div>
    { true === false && <EditMessageInput /> }
    </>
  );
}
