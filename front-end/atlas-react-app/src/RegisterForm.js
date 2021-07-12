import React from 'react'
import UniqueUsernameError from './UniqueUsernameError'
import UniqueEmailError from './UniqueEmailError'
import './css_styling.css'


function RegisterForm(props){
    const { handleSubmit, handleChange, email, username, password, passwordConfirmation, handleBlur, touched } = props
    let validSignup 
   try {
        signUpValidator(email, username, password, passwordConfirmation, touched)
        validSignup = true
    } catch (err) {}
    
    const [emailError, usernameError, passwordError, passwordConfirmationError] = createErrorMessages(email, username, password, passwordConfirmation, touched)
   
    return (
        <div className = 'centre'>
            <div className = 'page'>
            <div className = 'title' >Register!!!</div>
            <form onSubmit={handleSubmit}>
                <label>Email:
                        <input 
                            onChange={handleChange}
                            onBlur={(event) => handleBlur(event)}
                            name='email' 
                            type='email'
                            value={email}
                        />
                    </label >
                <p>{emailError}</p>
                <div className = 'registerformerrormessage'>
                <UniqueEmailError email={email} touched={touched.email}/>
                </div>


                <label>Username:
                    <input 
                        onChange={handleChange}
                        onBlur={(event) => handleBlur(event)}
                        name='username' 
                        type='text'
                        value={username}
                    />
                </label>
                <div className = 'registerformerrormessage'>
                <p>{usernameError}</p>
                <UniqueUsernameError username={username} touched={touched.username}/>
                </div>

                <label>Password:
                    <input 
                        onChange={handleChange}
                        onBlur={(event) => handleBlur(event)}
                        name='password'
                        type='password'
                        value={password}
                        minLength="8" required  
                    />
                </label>
                <div className = 'registerformerrormessage'>
                <p>{passwordError}</p>
                </div>

                <label>Password Confirmation:
                    <input 
                        onChange={handleChange}
                        onBlur={(event) => handleBlur(event)}
                        name='passwordConfirmation'
                        type='password'
                        value={passwordConfirmation}
                        minLength="8" required  
                    />
                </label>
                <div className = 'registerformerrormessage'>
                <p>{passwordConfirmationError}</p>
                </div>


                <button 
                type="submit"
                disabled= {!validSignup}
                >
                Sign-up
                </button>

            </form>
            </div>
        </div>
    )
}

export default RegisterForm

function signUpValidator(email, username, password, passwordConfirmation, touched) {
    emailValidator(email, touched)
    usernameValidator(username, touched)
    passwordValidator(password, touched)
    if (password !== passwordConfirmation) throw new Error('Passwords must be equal')
  }
  
  function passwordValidator(password, touched) {
    if(!touched.password) return 
    const numbers = '1234567890'
    const letters = 'qwertyuiopasdfghjklzxcvbnm'
    if (password.length < 8 || password.length > 30) throw new Error('Passwords must be between 8 and 30 characters')
    if (!(password.split('').some(character => numbers.includes(character.toLowerCase())))) throw new Error('Password must include at least one number')
    if (!(password.split('').some(character => letters.includes(character.toLowerCase())))) throw new Error('Password must include at least one letter')
  }
  
  function usernameValidator(username, touched){
    if(!touched.username) return 
    if (username.length === 0) throw new Error('Username cannot be blank')
    if (username.length > 20) throw new Error('Username must be less than 20 characters')
    const acceptedCharacters = '1234567890qwertyuiopasdfghjklzxcvbnm'
    if (!(username.split('').every(character => acceptedCharacters.includes(character.toLowerCase())))) throw new Error('Username can only include numbers and letters')
  }
  
  function emailValidator(email, touched) {
    if(!touched.email) return 
    if (email.length === 0) throw new Error('Email cannot be blank')
  }

  function createErrorMessages(email, username, password, passwordConfirmation, touched) {  
    let emailError, usernameError, passwordError, passwordConfirmationError
    try {
        emailValidator(email, touched)
    } catch (err) {
        emailError = err.message
    }
    try {
        // if (username) usernameValidator(username, touched)
        usernameValidator(username, touched)
    } catch (err) {
        usernameError = err.message
    }
    try {
        // if (password) passwordValidator(password, touched)
        passwordValidator(password, touched)
    } catch (err) {
        passwordError = err.message
    }
    // if (touched.passwordConfirmation && passwordConfirmation && password !== passwordConfirmation ) passwordConfirmationError = 'Passwords must be equal'
    if (touched.passwordConfirmation && password !== passwordConfirmation ) passwordConfirmationError = 'Passwords must be equal'
    return [emailError, usernameError, passwordError, passwordConfirmationError]
  }