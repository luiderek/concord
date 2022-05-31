import React from 'react';
import Message from './Message';
import AppContext from '../lib/app-context';

export default function MessageContainer(props) {
  return (
    <div className='message-container'>
      <AppContext.Consumer>
        {context => {
          return context.messages.map(msg => (
            <Message key={msg.message_id}
              time={new Date(msg.post_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              name={`uid:${msg.user_id}`}
              content={msg.content} />
          ));
        }
        }
      </AppContext.Consumer>
    </div>
  );
}

MessageContainer.context = AppContext;
