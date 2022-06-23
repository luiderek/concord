import React, { useState } from 'react';
import socket from '../lib/socket-instance';

export default function EditMessageInput(props) {

  const [formValue, formSetter] = useState(props.content);

  const handleInputChange = e => {
    formSetter(e.target.value);
  };

  const handleKeyDown = e => {
    // if escape pressed
    if (e.keyCode === 27) {
      closeEditing();
    }
  };

  const closeEditing = () => {
    props.setEditing(null);
  };

  const postMessage = e => {
    e.preventDefault();
    fetch(`/api/msg/${props.msgID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': window.localStorage.getItem('react-context-jwt')
      },
      body: JSON.stringify({
        content: formValue
      })
    }).then(res => res.json())
      .then(data => {
        socket.emit('message edit', data);
      })
      .catch(err => console.error(err));
    closeEditing();
  };

  return (
    <>
      <form method='post' onSubmit={postMessage}>
        <input
          className='chat-input edit-input'
          type='text'
          value={`${formValue}`}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          >
        </input>
      </form>
      <div className='edit-message-guide-text'>
        <span>escape to <a className='edit-msg-fake-link' onClick={closeEditing}>cancel</a></span>
        <span>●</span>
        <span>enter to <a className='edit-msg-fake-link' onClick={postMessage}>save</a></span>
      </div>
    </>
  );
}
