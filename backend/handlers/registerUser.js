import { DB } from 'https://deno.land/x/sqlite/mod.ts'
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { isEmail } from "https://deno.land/x/isemail/mod.ts";


const db = new DB('./atlas.db')

async function passwordEncryptor(password) {
  const salt = await bcrypt.genSalt(8)
  const passwordEncrypted = await bcrypt.hash(password, salt)
  return passwordEncrypted
}

function emailValidator(email) {
  if (email.length === 0) throw new Error('Email cannot be blank')
  if(!isEmail(email)) throw new Error('Must be valid email')
  if (email.length > 50) throw new Error('Email must be less than 50 characters')
  const [emailCheck] = [...db.query(`SELECT 1 FROM users WHERE email = ?;`, [email]).asObjects()]
  if (emailCheck) throw new Error('Email already in use')
}

function usernameValidator(username){
  if (username.length === 0) throw new Error('Username cannot be blank')
  if (username.length > 20) throw new Error('Username must be less than 20 characters')
  const [usernameCheck] = [...db.query(`SELECT 1 FROM users WHERE username = ?;`, [username]).asObjects()]
  if (usernameCheck) throw new Error('Username already in use')
  const acceptedCharacters = '1234567890qwertyuiopasdfghjklzxcvbnm'
  if (!(username.split('').every(character => acceptedCharacters.includes(character.toLowerCase())))) throw new Error('Username can only include numbers and letters')
}

function passwordValidator(password, confirmedPassword) {
  const numbers = '1234567890'
  const letters = 'qwertyuiopasdfghjklzxcvbnm'
  if (!(password.split('').some(character => numbers.includes(character.toLowerCase())))) throw new Error('Password must include at least one number')
  if (!(password.split('').some(character => letters.includes(character.toLowerCase())))) throw new Error('Password must include at least one letter')
  if (password.length < 8 || password.length > 30) throw new Error('Passwords must be between 8 and 30 characters')
  if (password !== confirmedPassword) throw new Error('Passwords must be equal')
}

function signUpValidator(email, username, password, confirmedPassword) {
  emailValidator(email)
  usernameValidator(username)
  passwordValidator(password, confirmedPassword)
}

const registerUser = async (server) => {
  
  //retrieve typed details from form elements from front-end
  const { email, username, password, passwordConfirmation } = await server.body;
  // console.log('registerrrrrinnnnnggg......... :)')
  // console.log(username, password, passwordConfirmation)
  
  //retrieve any EXISTING user details from database for provided/typed username/email and throw error if a user already exists and send back to front-end
  
  
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
  await db.query(`INSERT INTO users(username, email, password_encrypted, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'));`, [username, email, passwordEncrypted]); 
  
  await server.json({message: 'Success'}) //return to stories page after submission
  
}

export default registerUser