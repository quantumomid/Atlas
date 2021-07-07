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

  state = {
    isLoggedIn: false
  }

  async componentDidMount() {
    this.isUserLoggedIn()
  }

  // checks if user successfully logged in and cookie set
  async isUserLoggedIn() {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/sessions/exists`,
      {
        credentials: 'include'
      }
    )
    const { isLoggedIn } = await response.json()
    this.setState({isLoggedIn})
  }

  render() {
    const { isLoggedIn } = this.state
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
                {!isLoggedIn && 
                <li>
                <Link to="/register">Register</Link>
                </li>}
                <li>
                {!isLoggedIn && <Link to="/login">Login</Link>}
                </li>
                {isLoggedIn && 
                <div>
                  <Logout
                  handleLogout={() => this.isUserLoggedIn()} />
                </div>
                }
              </div>
            </ul>
          </nav>
          <Switch>
            <Route path="/game">
              <Game />
            </Route>
            { !isLoggedIn &&
            <Route path="/register">
              <Registration />
            </Route>
            }
            { !isLoggedIn &&
            <Route path="/login">
              <Login
              handleLogin={() => this.isUserLoggedIn()} />
            </Route>
            }
            <Route path="/">
              <Homepage
              isLoggedIn={isLoggedIn} />
            </Route>
          </Switch>
          </main>
        </div>
      </Router>
    )
  }
}

export default App