import React, { Component } from 'react';
import Homepage from './Homepage';
import Game from './Game';
import Registration from './Registration';
import Login from './Login';
import Logout from './Logout';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


class App extends Component {
    render() {
      return (
        <Router>
          <div>
          <main>
            <nav>
              <ul className="app-banners">
                <li className="app-title-banner">
                <Link to="/">Homepage</Link>
                </li>
                <div className="app-nav-banners">
                  <li>
                  <Link to="/game">Game</Link>
                  </li>
                  <li>
                  <Link to="/register">Register</Link>
                  </li>
                  <li>
                  <Link to="/login">Login</Link>
                  </li>
                  <div>
                    <Logout />
                  </div>
                </div>
              </ul>
            </nav>
            <Switch>
              <Route path="/game">
                <Game />
              </Route>
              <Route path="/register">
                <Registration />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/">
                <Homepage />
              </Route>
            </Switch>
            </main>
          </div>
        </Router>
      )
    }
}

export default App