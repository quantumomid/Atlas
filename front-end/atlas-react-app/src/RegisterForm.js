import React from 'react'

function RegisterForm(props){
    const { handleSubmit, handleChange, email, username, password, passwordConfirmation } = props
    let validSignup 
   try {
        signUpValidator(email, username, password, passwordConfirmation)
        validSignup = true
    } catch (err) {}
    return (
        <div>
            <h1>Register!!!</h1>
            <form onSubmit={handleSubmit}>

                <label>Email:
                        <input 
                            onChange={handleChange}
                            name='email' 
                            type='email'
                            value={email}
                        />
                    </label>

                <label>Username:
                    <input 
                        onChange={handleChange}
                        name='username' 
                        type='text'
                        value={username}
                    />
                </label>

                <label>Password:
                    <input 
                        onChange={handleChange}
                        name='password'
                        type='password'
                        value={password}
                        minLength="8" required  
                    />
                </label>

                <label>Password Confirmation:
                    <input 
                        onChange={handleChange}
                        name='passwordConfirmation'
                        type='password'
                        value={passwordConfirmation}
                        minLength="8" required  
                    />
                </label>

                <button 
                type="submit"
                disabled= {!validSignup}
                >
                Sign-up
                </button>

            </form>
        </div>
    )
}

export default RegisterForm

function signUpValidator(email, username, password, passwordConfirmation) {
    emailValidator(email)
    usernameValidator(username)
    passwordValidator(password, passwordConfirmation)
  }
  
  function passwordValidator(password, passwordConfirmation) {
    const numbers = '1234567890'
    const letters = 'qwertyuiopasdfghjklzxcvbnm'
    if (!(password.split('').some(character => numbers.includes(character.toLowerCase())))) throw new Error('Password must include at least one number')
    if (!(password.split('').some(character => letters.includes(character.toLowerCase())))) throw new Error('Password must include at least one letter')
    if (password.length < 8 || password.length > 30) throw new Error('Passwords must be between 8 and 30 characters')
    if (password !== passwordConfirmation) throw new Error('Passwords must be equal')
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