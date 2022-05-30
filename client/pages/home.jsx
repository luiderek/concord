import React from 'react';
import MessageContainer from '../components/MessageContainer';

export default function Home(props) {

  return (
    <div>
      <MessageContainer room={1} />
    </div>
  );
}
