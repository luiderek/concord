import React, { useEffect } from 'react';
import Message from './Message';

export default function MessageContainer(props) {

  // the equivalent of component on mount
  useEffect(() => {
    fetch('/api/msg')
      .then(response => response.json())
      .then(data => {
        for (const message of data) {
          // eslint-disable-next-line no-console
          console.log(message);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className='message-container'>
      <Message time='3:06 PM' name='user1' content='some sort of message content'/>
      <Message time='3:14 PM' name='user2' content='hi cool i am responding to you'/>
    </div>
  );
}
