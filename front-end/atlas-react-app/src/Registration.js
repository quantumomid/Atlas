import { Component } from 'react';
import RegisterForm from './RegisterForm'

class Registration extends Component {
  state ={
    username: '',
    password: '',
    passwordConfirmation: '',
    email: '',
    message: '',
  }
  async handleSubmit(event){
    event.preventDefault()
    const { email, username, password, passwordConfirmation } = this.state
    const { saveScore } = this.props
    
    //data sent back from POST fetch request in backend (includes any errors and whether registration was a success)
    // const responseData = await responseFromPostFetch(`${process.env.REACT_APP_API_URL}/users`, { username, password, passwordConfirmation})
    const postFetch = await fetch(`${process.env.REACT_APP_API_URL}/users`, 
    {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, email, password, passwordConfirmation, saveScore})
    })
    const { message } = await postFetch.json()
    this.setState({message})
  }
  handleChange(event){
    const { name, value } = event.target
    this.setState({[name]: value})
  }
  
  render() {
    const { username, email, password, passwordConfirmation, message } = this.state
    return (
      <div>
      <RegisterForm
      handleChange={(event) => this.handleChange(event)}
      handleSubmit={(event) => this.handleSubmit(event)} 
      email={email}
      username={username}
      password={password}
      passwordConfirmation={passwordConfirmation}
      />
      <div>{message}</div>
      </div>     )
    }
    
  }
  
  export default Registration
  