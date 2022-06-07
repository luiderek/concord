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
      roomID: null,
      roomName: null,
      serverID: 1,
      serverName: 'default'
    };
    this.socket = socket;
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleServerChange = this.handleServerChange.bind(this);
  }

  componentDidMount() {
    this.socket.on('message submit', incomingMsg => {
      // ATM messages will only be appended if the room state matches.
      // But it should be better to handle this from the serverside.
      // I think serverside should broadcast to servers,
      // Clientside should filter it by rooms.
      if (incomingMsg.room_id === this.state.roomID) {
        const newMsgObj = [...this.state.messages, incomingMsg];
        this.setState({ messages: newMsgObj });
      }
    });

    this.socket.on('message edit', editMsg => {
      if (editMsg.room_id === this.state.roomID) {
        const index = this.state.messages.findIndex(
          x => x.message_id === editMsg.message_id
        );
        const newMsgObj = [...this.state.messages];
        newMsgObj[index] = editMsg;
        this.setState({ messages: newMsgObj });
      }
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
      this.loadServerList(token)
        .then(response => {
          const server = window.location.hash.slice(2).split('/')[0];
          const currentServer = response.find(x => x.serv_name === server);
          if (currentServer) {
            this.setState({
              serverID: currentServer.server_id,
              serverName: currentServer.serv_name
            });
            this.loadRoomThenMessages(
              token,
              currentServer.server_id,
              currentServer.serv_name
            );
          } else {
            this.loadRoomThenMessages(token, 1, 'default');
          }
        })
        .catch(err => console.error(err));
    }

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(2).split('/')[1];
      const currentRoom = this.state.rooms.find(x => x.room_name === hash);
      if (currentRoom) {
        this.setState({
          roomID: currentRoom.room_id,
          roomName: currentRoom.room_name
        });
        this.loadPastMessages(
          currentRoom.room_id,
          window.localStorage.getItem('react-context-jwt')
        );
      }
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  loadPastMessages(roomID, token) {
    if (token && roomID) {
      fetch(`/api/msg/${roomID}`, {
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
    return fetch(`/api/rooms/${serverID}`, {
      headers: {
        'x-access-token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ rooms: data });
        return data;
      })
      .catch(err => console.error(err));
  }

  loadServerList(token) {
    return fetch('/api/servers/', {
      headers: {
        'x-access-token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(err => console.error(err));
  }

  // Load all the rooms and messages from a specific server.
  loadRoomThenMessages(token, serverID, serverName) {
    if (token) {
      this.loadRoomList(serverID, token)
        .then(rooms => {
          const hash = window.location.hash.slice(2).split('/')[1];
          const currentRoom = rooms.find(x => x.room_name === hash);
          if (currentRoom) {
            // this.loadPastMessages(currentRoom.room_id, token);
            // I no longer need to call loadPastMessages because
            // updateHashRoute triggers hashChange, which does do that.
            this.setState({
              roomID: currentRoom.room_id,
              roomName: currentRoom.room_name
            });
            this.updateHashRoute(serverName, currentRoom.room_name);
          } else {
            // If the hash is invalid, just redirect to and load the first room.
            this.setState({
              roomID: rooms[0].room_id,
              roomName: rooms[0].room_name
            });
            this.updateHashRoute(serverName, rooms[0].room_name);
          }
        })
        .catch(err => console.error(err));
    }
  }

  // Perhaps sign-in needs to be going to a "which room" modal at the start?"
  // ATM it just tries to throw you into 'default, 1'.
  // This code might need some trimming / reworking.
  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    if (token) {
      this.loadServerList(token)
        .then(response => {
          const server = window.location.hash.slice(2).split('/')[0];
          const currentServer = response.find(x => x.serv_name === server);
          if (currentServer) {
            this.setState({
              serverID: currentServer.server_id,
              serverName: currentServer.serv_name
            });
            this.loadRoomThenMessages(
              token,
              currentServer.server_id,
              currentServer.serv_name
            );
          } else {
            this.loadRoomThenMessages(token, 1, 'default');
          }
        })
        .catch(err => console.error(err));
    }
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({
      user: null,
      roomID: null,
      serverName: 'default',
      serverID: 1
    });
  }

  handleServerChange(name, id) {
    this.setState({ serverID: id, serverName: name });
    const token = window.localStorage.getItem('react-context-jwt');
    this.loadRoomThenMessages(token, id, name);
  }

  updateHashRoute(serverName, roomName) {
    const url = new URL(window.location);
    url.hash = `#/${serverName}/` + roomName;
    window.location.replace(url);
  }

  renderPage() {
    const { path } = this.state.route;
    const pathValid = true; // Replace this with an actual check later.
    if (path === 'auth') {
      return <Auth />;
    }
    if (pathValid) {
      return <Home path={path} />;
    }
    return <NotFound />;
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const {
      user,
      route,
      messages,
      rooms,
      roomID,
      roomName,
      serverID,
      serverName
    } = this.state;
    const { handleSignIn, handleSignOut, handleServerChange } = this;
    const contextValue = {
      user,
      route,
      handleSignIn,
      handleSignOut,
      messages,
      rooms,
      roomID,
      roomName,
      serverID,
      serverName,
      handleServerChange
    };
    // This looks like a code smell. Need to ask / figure out how to properly refactor.
    return (
      <AppContext.Provider value={contextValue}>
        <>
          <div
            className={route.path === 'auth' ? 'container' : 'layout-container'}
          >
            {this.renderPage()}
          </div>
        </>
      </AppContext.Provider>
    );
  }
}
