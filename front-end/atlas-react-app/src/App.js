import React, { Component } from 'react';
import Homepage from './Homepage';
import Game from './Game';
import RegisterPage from './RegisterPage';
import Login from './Login';
import Logout from './Logout';
import Aboutus from './Aboutus'
import {
  Switch,
  Route,
  Link,
  withRouter,
  NavLink
} from "react-router-dom";
// import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

class App extends Component {

  state = {
    isLoggedIn: false,
    inGame: false,
    onRegister: false,
    onLogin: false,
    inAboutus: false
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

  setInAboutusStatus() {
    this.setState({inAboutus: true})
  }

  clearInAboutusStatus() {
    this.setState({inAboutus: false})
  }

  setOnRegisterStatus() {
    this.setState({onRegister: true})
  }

  clearOnRegisterStatus() {
    this.setState({onRegister: false})
  }

  setOnLoginStatus() {
    this.setState({onLogin: true})
  }

  clearOnLoginStatus() {
    this.setState({onLogin: false})
  }

  render() {
    const { isLoggedIn, inGame, onLogin, onRegister, inAboutus } = this.state
    return (
        <div>
        <main>
          {/* <nav>
            <ul className="app-banners">
              <div className="app-title-banner">
              <Link to="/"><div className="homepage-title">Atlas</div></Link>
              <div className="slogan">Around the World in 101 Questions</div>
              </div>
              <ul className="app-nav-banners">
                <li>
                {!inGame &&
                <Link to="/game">Game</Link>}
                {inGame && <div className="selected-page">Game</div>}
                </li>                
                <li>
                {!isLoggedIn && !onRegister &&
                <Link to="/register">Register</Link>}
                {!isLoggedIn && onRegister && <div className="selected-page">Register</div>}
                </li>
                <li>
                {!isLoggedIn && !onLogin &&
                <Link to="/login">Login</Link>}
                {!isLoggedIn && onLogin && <div className="selected-page">Login</div>}
                </li>
                {isLoggedIn &&
                <li>
                  <Logout
                  handleLogout={() => this.handleLoginAndLogout()} />
                </li>
                }
                <li>
                {!inAboutus && <Link to='/aboutus'>About us</Link>}
                {inAboutus && <div className="selected-page">About us</div>}
                </li>
              </ul>
            </ul>
          </nav> */}
          <div className="app-title-banner">
            <Link to="/"><div className="homepage-title">Atlas</div></Link>
            <div className="slogan">Around the World in 101 Questions</div>
          </div>
          <nav>
            <NavLink
              className="navLink"
              activeClassName="selected-page"
              exact to="/"
            >
              Home
            </NavLink>
            <NavLink
              className="navLink"
              activeClassName="selected-page"
              exact to="/game"
            >
              Play
            </NavLink>
            <NavLink
              className="navLink"
              activeClassName="selected-page"
              exact to="/register"
            >
              Register
            </NavLink>
            <NavLink
              className="navLink"
              activeClassName="selected-page"
              exact to="/login"
            >
              Login
            </NavLink>
            <NavLink
              className="navLink"
              activeClassName="selected-page"
              exact to="/aboutus"
            >
              About us
            </NavLink>
          </nav>
          <Switch>
            <Route path="/game">
              <Game 
              isLoggedIn={isLoggedIn}
              setInGameStatus={() => this.setInGameStatus()}
              clearInGameStatus={() => this.clearInGameStatus()}
              />
            </Route>
            <Route path='/aboutus'>
              <Aboutus
              setInAboutusStatus={() => this.setInAboutusStatus()}
              clearInAboutusStatus={() => this.clearInAboutusStatus()} 
              />
            </Route>
            { !isLoggedIn &&
            <Route path="/register">
              <RegisterPage
              setOnRegisterStatus={() => this.setOnRegisterStatus()}
              clearOnRegisterStatus={() => this.clearOnRegisterStatus()}
              />
            </Route>
            }
            { !isLoggedIn &&
            <Route path="/login">
              <Login
              handleLogin={() => this.handleLoginAndLogout()} 
              setOnLoginStatus={() => this.setOnLoginStatus()}
              clearOnLoginStatus={() => this.clearOnLoginStatus()}
              />
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