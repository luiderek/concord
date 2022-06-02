import React from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import AppContext from '../lib/app-context';

export default function MessageContainer(props) {
  return (
    <div className='message-container'>
      <AppContext.Consumer>
        {context => {
          return context.messages.map(msg => (
            <Message key={msg.message_id}
              time={new Date(msg.post_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              name={msg.username}
              content={msg.content}
              msgID={msg.message_id}
              sameUser={msg.username === context.user.username} />
          ));
        }
        }
      </AppContext.Consumer>
      <AppContext.Consumer>
        {context => {
          return <ChatInput {...context} />;
        }
        }
      </AppContext.Consumer>
    </div>
  );
}

MessageContainer.context = AppContext;
