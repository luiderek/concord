import React from 'react';
import MessageContainer from '../components/MessageContainer';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import { Button } from 'react-bootstrap';
import RoomSidebar from '../components/RoomSidebar';

export default class Home extends React.Component {
  render() {
    const { user, handleSignOut } = this.context;
    if (!this.context.user) return <Redirect to="auth" />;

    return (
      <>
        <RoomSidebar />
        <MessageContainer room={1} />
        <div className='bottom-bar mt-2'>
          <span>{user.username}</span>
          <Button onClick={handleSignOut}>sign out</Button>
        </div>
      </>
    );
  }
}
Home.contextType = AppContext;
