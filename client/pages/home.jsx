import React from 'react';
import MessageContainer from '../components/MessageContainer';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import RoomSidebar from '../components/RoomSidebar';
import ChatInput from '../components/ChatInput';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftSidebarActive: false
    };
  }

  render() {
    if (!this.context.user) return <Redirect to="auth" />;

    return (
      <>
        { this.state.leftSidebarActive &&
          <RoomSidebar serverName="default" {...this.context} />
        }
        <div className="layout-container">
          <MessageContainer />
          <ChatInput {...this.context} />
        </div>
      </>
    );
  }
}
Home.contextType = AppContext;
