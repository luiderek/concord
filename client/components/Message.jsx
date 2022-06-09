import React from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import EditMessageInput from './EditMessageInput';

export default function Message(props) {
  function updateCurrentlyEditing(e) {
    props.setEditing(props.msgID);
  }

  const isEditedMsg = props.currentlyEditing === props.msgID;

  return (
    <>
      <div className={`message ${isEditedMsg ? 'edit-highlight' : ''}`}>
        <span>
          <span>{props.time}</span>
          <span>{props.name}</span>
          {!isEditedMsg && (
            <span className={`${
                props.isLiveType
                  ? props.isLiveType === 'finished'
                      ? 'fade-in'
                      : 'live-typed'
                  : ''
            }`
              }>
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
        {props.sameUser && !isEditedMsg && props.isLiveType !== true && (
          <span className="icon-wrapper">
            <i
              className="fa-solid fa-pencil"
              onClick={updateCurrentlyEditing}
            />
            <DeleteConfirmModal {...props} />
          </span>
        )}
      </div>
      {isEditedMsg && <EditMessageInput {...props} />}
    </>
  );
}
