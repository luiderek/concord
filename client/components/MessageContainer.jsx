import React from 'react';
import Message from './Message';
import AppContext from '../lib/app-context';
import ScrollToBottom from 'react-scroll-to-bottom';

export default function MessageContainer(props) {
  return (
    <div className='message-container'>
      <ScrollToBottom className='message-container'>
        <AppContext.Consumer>
          {context => {
            return context.messages.map(msg => (
              <Message key={msg.message_id}
                time={new Date(msg.post_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                name={msg.username}
                content={msg.content}
                msgID={msg.message_id}
                edited={msg.edited}
                sameUser={msg.username === context.user.username} />
            ));
          }
          }
        </AppContext.Consumer>
      </ScrollToBottom>
    </div>
  );
}

MessageContainer.context = AppContext;
