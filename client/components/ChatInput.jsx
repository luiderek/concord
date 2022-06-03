import React from 'react';
import socket from '../lib/socket-instance';

export default function ChatInput(props) {

  const postMessage = e => {
    e.preventDefault();
    const { user, roomID } = props;

    // Bad SQL returns from an empty context value was breaking the website.
    // My error handling can use improvement so it breaks things less.
    if (e.target.elements[0].value === '') {
      return;
    }

    fetch('/api/msg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': window.localStorage.getItem('react-context-jwt')
      },
      // eventually read from context state current room.
      body: JSON.stringify({
        room: roomID,
        userID: user.userId,
        message: e.target.elements[0].value
      })
    }).then(res => res.json())
      .then(data => {
        socket.emit('message submit', data);
        e.target.reset(); // Clear form.
      })
      .catch(err => console.error(err));
  };

  return (
    <form method='post' onSubmit={postMessage}>
      <input
        className='chat-input'
        placeholder={`Message #${props.roomName}`}>
      </input>
    </form>
  );
}
