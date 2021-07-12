import { Component } from 'react';

class Login extends Component {
  
  state = {
    username: '',
    password: '',
    message: '',
  }
  
  async handleSubmit(event) {
    event.preventDefault()
    const { username, password } = this.state
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
    return (
      <div className = 'centre'>
      <div className = 'page'>
      <div className='login'>
        <div className='title'>Login</div>
        <form className='login-form' onSubmit={(event) => this.handleSubmit(event)} >
          <div className='login-variable'>Username: <input className='login-input' name='username' type="text" value={username} onChange={(event) => this.setState({username: event.target.value})} /></div>
          <div className='login-variable'>Password: <input className='login-input' name='password' type="password" value={password} onChange={(event) => this.setState({password: event.target.value})} /></div>
          <button className='submit-button' type='submit' disabled={ username.length === 0 || password.length < 8 }>Login</button>
        </form>
        <div className='login-response'>{message}</div>
      </div>
      </div>
      </div>
      )
    }
  }
    
    export default Login
    
    