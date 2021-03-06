import React from 'react';
import SignUpModal from '../components/sign-up-modal';
import SignInModal from '../components/sign-in-modal';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

export default class Auth extends React.Component {

  render() {
    const { user, handleSignIn } = this.context;

    if (user) return <Redirect to="" />;

    return (
      <>
      <div className="container">
        <h4 className='auth-header'> Hello, welcome to Concord! </h4>
        <h4 className='auth-header'> This is a full stack webapp using: </h4>
        <h4 className='auth-header'> Express, PostgreSQL, WebSockets, React </h4>
        <div className="button-wrapper">
          <SignUpModal onSignIn={handleSignIn} />
          <SignInModal onSignIn={handleSignIn} />
        </div>
      </div>
      </>
    );
  }
}
Auth.contextType = AppContext;
