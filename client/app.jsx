import React from 'react';
import Home from './pages/home';
import AppContext from './lib/app-context';
import parseRoute from './lib/parse-route';
import PageContainer from './components/page-container';
import jwtDecode from 'jwt-decode';
import Auth from './pages/auth';
import NotFound from './pages/not-found';
import socket from './lib/socket-instance';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash),
      messages: []
    };
    this.socket = socket;
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    this.socket.on('connect', () => {
      // console.log('i have arrived');
    });

    // when other clients 'message submit', the data is pingponged back here.
    // the messages object updates, and so it rerenders.
    this.socket.on('message submit', incomingMsg => {
      const newMsgObj = [...this.state.messages, incomingMsg];
      this.setState({ messages: newMsgObj });
    });

    this.socket.on('message delete', incomingTarget => {
      const filteredMsgObj = this.state.messages.filter(
        x => x.message_id !== incomingTarget.message_id
      );
      this.setState({ messages: filteredMsgObj });
    });

    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('react-context-jwt');
    // console.log('the token is:', token);
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false });

    if (token !== null) {
      fetch('/api/msg/1', {
        headers: {
          'x-access-token': window.localStorage.getItem('react-context-jwt')
        }
      })
        .then(response => response.json())
        .then(data => {
          this.setState({ messages: data });
        })
        .catch(err => console.error(err));
    }

  }

  handleSignIn(result) {
    const { user, token } = result;
    // console.log('the token is:', token);
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ user: null });
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === '') {
      return <Home />;
    }
    if (path === 'auth') {
      return <Auth />;
    }
    return <NotFound />;
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, route, messages } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut, messages };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          <PageContainer>{this.renderPage()}</PageContainer>
        </>
      </AppContext.Provider>
    );
  }
}
