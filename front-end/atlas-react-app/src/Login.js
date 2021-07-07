import { Component } from 'react';
import { Redirect } from 'react-router-dom'

class Login extends Component {
  
  state = {
    username: '',
    password: '',
    message: '',
  }
  
  async handleSubmit(event) {
    event.preventDefault()
    const { username, password } = this.state
    if (username.length === 0 || password.length < 8) return
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password}),
        credentials: 'include'
      }
      )
      const { message } = await response.json()
      this.setState({message})
      if (message === 'Success') {
        this.props.handleLogin()
      } else { 
        this.setState({username: '', password: ''})
      }
  }
    
  render() {
    const { username, password, message } = this.state
    if (message === 'Success') return <Redirect to='/' />
    return ( 
      <div className='login'>
        <h2>Login</h2>
        <form className='login-form' onSubmit={(event) => this.handleSubmit(event)} >
          <div className='login-variable'>Username: <input className='login-input' name='username' type="text" value={username} onChange={(event) => this.setState({username: event.target.value})} /></div>
          <div className='login-variable'>Password: <input className='login-input' name='password' type="password" value={password} onChange={(event) => this.setState({password: event.target.value})} /></div>
          <input className='submit-button' type='submit' value='Login'/>
        </form>
        <div className='login-response'>{message}</div>
      </div>
      )
    }
  }
    
    export default Login
    
    