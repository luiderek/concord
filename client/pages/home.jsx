import React from 'react';
import MessageContainer from '../components/MessageContainer';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import RoomSidebar from '../components/RoomSidebar';
import ChatInput from '../components/ChatInput';
import { Swipe } from 'react-swipe-component';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarShow: true
    };
  }

  componentDidMount() {
    if (window.innerWidth < 500) {
      this.setState({ sidebarShow: false });
    }
  }

  onSwipeLeftListener = () => {
    this.setState({ sidebarShow: false });
  };

  onSwipeRightListener = () => {
    this.setState({ sidebarShow: true });
  };

  render() {
    if (!this.context.user) return <Redirect to="auth" />;

    return (
      <>
        <Swipe
          nodeName="div"
          className={`${this.state.sidebarShow ? 'swipe-selector' : 'swipe-selector-active'}`}
          onSwipedLeft={this.onSwipeLeftListener}
          onSwipedRight={this.onSwipeRightListener}
          preventDefault='true'
          detectTouch='true'
         />
        <RoomSidebar serverName="default" {...this.context} isShow={this.state.sidebarShow} />
        <div className="layout-container">
          <MessageContainer />
          <ChatInput {...this.context} />
        </div>
      </>
    );
  }
}
Home.contextType = AppContext;
