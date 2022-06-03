/* eslint-disable camelcase */
import React from 'react';
import Home from './pages/home';
import AppContext from './lib/app-context';
import parseRoute from './lib/parse-route';
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
      messages: [],
      rooms: [],
      roomID: null
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

    this.socket.on('new room', incomingRoom => {
      const { room_id, room_name } = incomingRoom;
      const newRooms = [...this.state.rooms, { room_id, room_name }];
      this.setState({ rooms: newRooms });
    });

    const token = window.localStorage.getItem('react-context-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false });

    if (token) {
      this.loadPastMessages(token);
      this.loadRoomList(1, token);
    }

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(2);
      const currentRoom = this.state.rooms.find(x => x.room_name === hash);
      if (currentRoom) {
        this.setState({
          roomID: currentRoom.room_id
        });
      }
      // This thing causes a lot of breaks because sometimes rooms is null.

      this.setState({
        route: parseRoute(window.location.hash)
      });
    });

  }

  loadPastMessages(token) {
    if (token !== null) {
      fetch('/api/msg/1', {
        headers: {
          'x-access-token': token
        }
      })
        .then(response => response.json())
        .then(data => {
          this.setState({ messages: data });
        })
        .catch(err => console.error(err));
    }
  }

  loadRoomList(serverID, token) {
    fetch(`/api/rooms/${serverID}`, {
      headers: {
        'x-access-token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ rooms: data });
      })
      .catch(err => console.error(err));
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
    // welp, I guess that's all it took. some sleep and time away. phew.
    this.loadPastMessages(token);
    this.loadRoomList(1, token);
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ user: null, roomID: null });
  }

  renderPage() {
    const { path } = this.state.route;
    const pathValid = true; // Replace this with an actual check later.
    if (path === 'auth') {
      return <Auth />;
    }
    if (pathValid) {
      return <Home path={path}/>;
    }
    return <NotFound />;
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, route, messages, rooms, roomID } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut, messages, rooms, roomID };
    return (
      <AppContext.Provider value={contextValue}>
        <>
        <div className={route.path === 'auth' ? 'container' : 'layout-container'}>
          {this.renderPage()}
        </div>
        </>
      </AppContext.Provider>
    );
  }
}
