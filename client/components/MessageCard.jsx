import React from 'react';

export default function MessageCard(props) {

  // {...props} was the way to pass down props
  // without resorting to props.props.props, which was cursed code.

  return (
    <div className='message-card'>
      <span>
        {props.time}
      </span>
      <span>
        {props.name}
      </span>
      <span>
        {props.content}
      </span>
    </div>
  );
}
