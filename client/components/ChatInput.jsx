import React from 'react';

export default function ChatInput(props) {

  const postMessage = e => {
    e.preventDefault();
    // console.log('chatinput props', props);
    const { user } = props;
    fetch('/api/msg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // eventually read from context state current room and userID.
      body: JSON.stringify({
        room: 1,
        userID: user.userId,
        message: e.target.elements[0].value
      })
    }).then(res => res.json())
      .then(data => {
        e.target.reset(); // Clear form.
        location.reload(); // Refresh page. I know its terrible but it's funny.
      })
      .catch(err => console.error(err));
  };

  return (
    <form method='post' onSubmit={postMessage}>
      <input
        className='chat-input'
        placeholder='Message #room'>
      </input>
    </form>
  );
}
