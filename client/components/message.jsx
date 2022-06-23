import React from 'react';
import DeleteConfirmModal from './delete-message-modal';
import EditMessageInput from './edit-message-input';

export default function Message(props) {
  function updateCurrentlyEditing(e) {
    props.setEditing(props.msgID);
  }

  const isEditing = props.currentlyEditing === props.msgID;

  return (
    <>
      <div className={`message ${isEditing ? 'edit-highlight' : ''}`}>
        <span>
          <span>{props.time}</span>
          <span>{props.name}</span>
          {!isEditing && (
            <span className={`${
                props.isLiveType
                  ? props.isLiveType === 'finished'
                      ? 'fade-in'
                      : 'live-typed'
                  : ''
            }`
              }>
              {props.content}
              {props.edited === true && (
                <span className="edited-marker">(edited)</span>
              )}
            </span>
          )}
        </span>
        {props.sameUser && !isEditing && props.isLiveType !== true && (
          <span className="icon-wrapper">
            <i
              className="fa-solid fa-pencil"
              onClick={updateCurrentlyEditing}
            />
            <DeleteConfirmModal {...props} />
          </span>
        )}
      </div>
      {isEditing && <EditMessageInput {...props} />}
    </>
  );
}
