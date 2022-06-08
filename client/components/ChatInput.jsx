import React, { useState } from 'react';
import socket from '../lib/socket-instance';

export default function ChatInput(props) {

  const [currentlyBroadcasting, toggleBroadcast] = useState(false);
  const [broadcastID, changeBroadcastID] = useState(Math.random());
  // Object { message_id: 9, content: "testing", post_time: "2022-06-08T05:03:39.427Z", user_id: 3, room_id: 1, edited: false, username: "aaaaah" }

  const handleFocus = e => {
    // Open line.
    // My first problem is that to slip something into the message component and for it to maintain it's order,
    // it needs to have a message_id, which I can only really get from hitting the SQL at some point.
    // is it ordered by key?
    // is it possible to generate a key?
    //
    // console.log('handle focus:', e);
    if (!currentlyBroadcasting) {
      toggleBroadcast(true);
      // console.log('props', props);
      const rttMessage = {
        content: '',
        user_id: props.user.userID,
        room_id: props.roomID,
        username: props.user.username,
        message_id: broadcastID,
        post_time: new Date()
      };
      // as far as I can see, the problems about using a random number is when the key itself is Math.random.
      // my goal is for it to not overlap, and it shouldn't change if I only change the key after closing a message.
      socket.emit('rtt open', rttMessage);
    }

  };

  const handleChange = e => {
    if (currentlyBroadcasting) {
      const rttMessage = {
        content: e.target.value,
        user_id: props.user.userID,
        room_id: props.roomID,
        username: props.user.username,
        message_id: broadcastID,
        post_time: new Date()
      };
      // console.log('handlechange called:', e.target.value);
      socket.emit('rtt update', rttMessage);
    }
  };

  const handleBlur = e => {
    if (e.target.value === '') {
      // console.log('input is blurred with empty form');
      // Close line would be appropriate here.
      if (currentlyBroadcasting) {
        toggleBroadcast(false);
        socket.emit('rtt close', broadcastID);
        changeBroadcastID(Math.random());
      }
    }
  };

  const postMessage = e => {
    e.preventDefault();
    const { user, roomID } = props;

    toggleBroadcast(false);
    socket.emit('rtt close', broadcastID);
    changeBroadcastID(Math.random());

    // console.log(props);
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
        // console.log('submitted data', data);
        socket.emit('message submit', data);
        e.target.reset(); // Clear form.
      })
      .catch(err => console.error(err));
  };

  return (
    <form method='post' onSubmit={postMessage}>
      <input
        className='chat-input'
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={`Message #${props.roomName}`}>
      </input>
    </form>
  );
}
