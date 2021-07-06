import React, { Component } from 'react';
import Homepage from './Hompage';
import Game from './Game';
import Registration from './Registration';
import Login from './Login';
import Logout from './Logout';


class App extends Component {
    render() {
      return (
        <div>
          <h1>Hello</h1>
          <Homepage />
          <Game />
          <Registration />
          <Login/>
          <Logout/>
        </div>  
      )
    }
}

export default App