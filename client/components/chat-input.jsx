import React, { useState, useEffect, useRef } from 'react';
import socket from '../lib/socket-instance';

export default function ChatInput(props) {

  const [currentlyBroadcasting, toggleBroadcast] = useState(false);
  const [broadcastID, changeBroadcastID] = useState(Math.random());
  const [messageTime, updateMessageTime] = useState(null);

  const textInput = useRef(null);

  useEffect(() => {
    const listener = event => {
      if ((event.code === 'Enter' || event.code === 'NumpadEnter') &&
           !event.target.className.includes('chat-input')) {
        event.preventDefault();
        textInput.current.focus();
      }

    };

    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  const handleFocus = e => {
    if (!currentlyBroadcasting) {
      toggleBroadcast(true);
      updateMessageTime(new Date());
      const rttMessage = {
        content: '',
        user_id: props.user.userID,
        room_id: props.roomID,
        username: props.user.username,
        message_id: broadcastID,
        post_time: new Date(),
        isLiveType: true
      };
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
        post_time: messageTime,
        isLiveType: true
      };
      socket.emit('rtt update', rttMessage);
    }
  };

  const handleBlur = e => {
    if (e.target.value === '') {
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

    if (e.target.elements[0].value === '') {
      textInput.current.blur();
      handleBlur(e);
      return;
    }

    fetch('/api/msg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': window.localStorage.getItem('react-context-jwt')
      },
      body: JSON.stringify({
        room: roomID,
        userID: user.userId,
        message: e.target.elements[0].value,
        posttime: messageTime
      })
    }).then(res => res.json())
      .then(data => {
        socket.emit('rtt submit', { ID: broadcastID, newID: data.message_id, room_id: data.room_id, isLiveType: false });
        e.target.reset();
      })
      .catch(err => console.error(err))
      .finally(() => {
        toggleBroadcast(false);
        changeBroadcastID(Math.random());
        e.target[0].blur();
      });
  };

  return (
    <form method='post' onSubmit={postMessage}>
      <input
        className='chat-input'
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        ref={textInput}
        placeholder={`Message #${props.roomName}`}>
      </input>
    </form>
  );
}
