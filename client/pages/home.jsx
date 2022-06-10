import React from 'react';
import MessageContainer from '../components/MessageContainer';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import RoomSidebar from '../components/RoomSidebar';
import ChatInput from '../components/ChatInput';

export default class Home extends React.Component {
  render() {
    if (!this.context.user) return <Redirect to="auth" />;

    return (
      <>
        <RoomSidebar serverName="default" {...this.context}/>
        <MessageContainer room={1} />
        <ChatInput {...this.context} />
      </>
    );
  }
}
Home.contextType = AppContext;
