import React from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import EditMessageInput from './EditMessageInput';

export default function Message(props) {
  function updateCurrentlyEditing(e) {
    props.setEditing(props.msgID);
  }

  return (
    <>
      <div className="message">
        <span>
          <span>{props.time}</span>
          <span>{props.name}</span>
          {props.currentlyEditing !== props.msgID && (
            <span>
              {props.content}
              {/* The edited-marker needs to be on it's own span for copy-paste.
          Turns out, user-select:none also prevents span bleed.
          Might be a useful trick in the future for this stuff. */}
              {props.edited === true && (
                <span className="edited-marker">(edited)</span>
              )}
            </span>
          )}
        </span>
        {props.sameUser && props.currentlyEditing !== props.msgID && (
          <span className="icon-wrapper">
            <i
              className="fa-solid fa-pencil"
              onClick={updateCurrentlyEditing}
            />
            <DeleteConfirmModal {...props} />
          </span>
        )}
      </div>
      {props.currentlyEditing === props.msgID && <EditMessageInput />}
    </>
  );
}
