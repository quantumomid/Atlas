import { DB } from 'https://deno.land/x/sqlite/mod.ts'
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const db = new DB('../atlas.db')

async function passwordEncryptor(password) {
    const salt = await bcrypt.genSalt(8)
    const passwordEncrypted = await bcrypt.hash(password, salt)
    return passwordEncrypted
  }

function signUpValidator(email, username, password, confirmedPassword) {
  if (email.length === 0) throw new Error('Email cannot be blank')
  if (username.length === 0) throw new Error('Username cannot be blank')
  if (password.length < 8) throw new Error('Passwords must be at least 8 characters')
  if (password !== confirmedPassword) throw new Error('Passwords must be equal')
}

const registerUser = async (server) => {

  //retrieve typed details from form elements from front-end
  const { email, username, password, passwordConfirmation } = await server.body;
  // console.log('registerrrrrinnnnnggg......... :)')
  // console.log(username, password, passwordConfirmation)

  //retrieve any EXISTING user details from database for provided/typed username/email and throw error if a user already exists and send back to front-end
  const emailCheck = [...db.query(`SELECT 1 FROM users WHERE email = ?;`, [email]).asObjects()]
  const usernameCheck = [...db.query(`SELECT 1 FROM users WHERE username = ?;`, [username]).asObjects()]

 try {
   signUpValidator(email, username, password, passwordConfirmation)
 } catch (err) {
   return await server.json({message: err.message})
 }
 
  //generate encrypted password
  const passwordEncrypted  = await passwordEncryptor(password)
  
  // TESTING
  // console.log(password)
  // console.log(passwordEncrypted)
  
  //save encrypted password with username into users table
  db.query(`INSERT INTO users(username, email, password_encrypted, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'));`, [username, email, passwordEncrypted]); 

  await server.json({hasRegistered: true}) //return to stories page after submission
  
}

export default registerUser