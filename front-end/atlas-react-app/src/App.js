import React, { Component } from 'react';
import Homepage from './Homepage';
import Game from './Game';
import Registration from './Registration';
import Login from './Login';
import Logout from './Logout';
import {
  Switch,
  Route,
  Link,
  withRouter
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

  async handleLoginAndLogout() {
    await this.isUserLoggedIn()
    //redirects to homepage
    this.props.history.push("/")
  }

  render() {
    const { isLoggedIn } = this.state
    return (
        <div>
        <main>
          <nav>
            <ul className="app-banners">
              <li className="app-title-banner">
              <Link to="/">Homepage</Link>
              <div>Trendy Slogan</div>
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
                  handleLogout={() => this.handleLoginAndLogout()} />
                </div>
                }
              </div>
            </ul>
          </nav>
          <Switch>
            <Route path="/game">
              <Game 
              isLoggedIn={isLoggedIn}
              />
            </Route>
            { !isLoggedIn &&
            <Route path="/register">
              <Registration />
            </Route>
            }
            { !isLoggedIn &&
            <Route path="/login">
              <Login
              handleLogin={() => this.handleLoginAndLogout()} />
            </Route>
            }
            <Route path="/">
              <Homepage
              isLoggedIn={isLoggedIn} />
            </Route>
          </Switch>
          </main>
        </div>
    )
  }
}

export default withRouter(App)