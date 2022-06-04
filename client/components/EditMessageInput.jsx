import React from 'react';
// This is non optimal but I want things up and running first.

export default function EditMessageInput(props) {

  const postMessage = e => {
    e.preventDefault();

    // Bad SQL returns from an empty context value was breaking the website.
    // My error handling can use improvement so it breaks things less.

    // fetch('/api/msg', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-access-token': window.localStorage.getItem('react-context-jwt')
    //   },
    //   // eventually read from context state current room.
    //   body: JSON.stringify({
    //     room: roomID,
    //     userID: user.userId,
    //     message: e.target.elements[0].value
    //   })
    // }).then(res => res.json())
    //   .then(data => {
    //     socket.emit('message submit', data);
    //     e.target.reset(); // Clear form.
    //   })
    //   .catch(err => console.error(err));
  };

  return (
    <>
      <form method='post' onSubmit={postMessage}>
        <input
          className='chat-input edit-input'
          placeholder="placeholder"
          type='text'>
        </input>
      </form>
      <div className='edit-message-guide-text'>
        <span>escape to <a className='edit-msg-fake-link'>cancel</a></span>
        <span>●</span>
        <span>enter to <a className='edit-msg-fake-link'>save</a></span>
      </div>
    </>
  );
}
