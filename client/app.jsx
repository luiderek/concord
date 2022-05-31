import React from 'react';
import Home from './pages/home';
import AppContext from './lib/app-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    fetch('/api/msg')
      .then(response => response.json())
      .then(data => {
        this.setState({ messages: data });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { messages } = this.state;
    const contextValue = { messages };
    return (
    <AppContext.Provider value={contextValue}>
      <Home />;
    </AppContext.Provider>
    );
  }
}
