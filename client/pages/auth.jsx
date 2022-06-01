import React from 'react';
import SignUpModal from '../components/SignUpModal';
import SignInModal from '../components/SignInModal';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

export default class Auth extends React.Component {

  render() {
    const { user, handleSignIn } = this.context;

    if (user) return <Redirect to="" />;

    return (
      <>
        <h4 className='auth-header'> This is the auth page. I will be your guide. </h4>
        <div className="button-wrapper">
          <SignUpModal />
          <SignInModal onSignIn={handleSignIn} />
        </div>
      </>
    );
  }
}
Auth.contextType = AppContext;