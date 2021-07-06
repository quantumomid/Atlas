import React from 'react'

function RegisterForm(props){
    const { handleSubmit, handleChange, email, username, password, passwordConfirmation } = props
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

                <button type="submit">Sign-up</button>

            </form>
        </div>
    )
}

export default RegisterForm