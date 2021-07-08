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
    
    try {
      signUpValidator(email, username, password, passwordConfirmation) 
    } catch (err) {
      return this.setState({message: err.message})
    }
    
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
    return (
      <div>
      <RegisterForm
      handleChange={(event) => this.handleChange(event)}
      handleSubmit={(event) => this.handleSubmit(event)} 
      username={this.state.username}
      password={this.state.password}
      passwordConfirmation={this.state.passwordConfirmation}
      />
      <div>{this.state.message}</div>
      </div>     )
    }
    
  }
  
  export default Registration
  
  function signUpValidator(email, username, password, confirmedPassword) {
    emailValidator(email)
    usernameValidator(username)
    passwordValidator(password, confirmedPassword)
  }
  
  function passwordValidator(password, confirmedPassword) {
    const numbers = '1234567890'
    const letters = 'qwertyuiopasdfghjklzxcvbnm'
    if (!(password.split('').some(character => numbers.includes(character.toLowerCase())))) throw new Error('Password must include at least one number')
    if (!(password.split('').some(character => letters.includes(character.toLowerCase())))) throw new Error('Password must include at least one letter')
    if (password.length < 8 || password.length > 30) throw new Error('Passwords must be between 8 and 30 characters')
    if (password !== confirmedPassword) throw new Error('Passwords must be equal')
  }
  
  function usernameValidator(username){
    if (username.length === 0) throw new Error('Username cannot be blank')
    if (username.length > 20) throw new Error('Username must be less than 20 characters')
    const acceptedCharacters = '1234567890qwertyuiopasdfghjklzxcvbnm'
    if (!(username.split('').every(character => acceptedCharacters.includes(character.toLowerCase())))) throw new Error('Username can only include numbers and letters')
  }
  
  function emailValidator(email) {
    if (email.length === 0) throw new Error('Email cannot be blank')
  }