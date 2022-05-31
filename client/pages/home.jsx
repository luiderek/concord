import React from 'react';
import MessageContainer from '../components/MessageContainer';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

export default class Home extends React.Component {

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    return (
        <MessageContainer room={1} />
    );
  }
}
Home.contextType = AppContext;
