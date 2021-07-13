import React, { Component } from 'react';
import Homepage from './Homepage';
import Game from './Game';
import RegisterPage from './RegisterPage';
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
    isLoggedIn: false,
    inGame: false
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

  setInGameStatus() {
    this.setState({inGame: true})
  }

  clearInGameStatus() {
    this.setState({inGame: false})
  }

  render() {
    const { isLoggedIn, inGame } = this.state
    return (
        <div>
        <main>
          <nav>
            <ul className="app-banners">
              <div className="app-title-banner">
              <Link to="/"><div className="homepage-title">Around the World in 100 points</div></Link>
              <div className="slogan">Can you name every country?</div>
              </div>
              <div className="app-nav-banners">
                <li>
                {!inGame &&
                <Link to="/game">Game</Link>}
                {inGame && <div className="selected-page">Game</div>}
                </li>
                {!isLoggedIn &&
                <li>
                <Link to="/register">Register</Link>
                </li>}
                {!isLoggedIn &&
                <li>
                <Link to="/login">Login</Link>
                </li>}
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
              setInGameStatus={() => this.setInGameStatus()}
              clearInGameStatus={() => this.clearInGameStatus()}
              />
            </Route>
            { !isLoggedIn &&
            <Route path="/register">
              <RegisterPage/>
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