import { DB } from 'https://deno.land/x/sqlite/mod.ts'
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { isEmail } from "https://deno.land/x/isemail/mod.ts";
import { config } from 'https://deno.land/x/dotenv/mod.ts' // environment variables
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })
const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

// const db = new DB('./atlas.db')

async function passwordEncryptor(password) {
  const salt = await bcrypt.genSalt(8)
  const passwordEncrypted = await bcrypt.hash(password, salt)
  return passwordEncrypted
}

async function emailValidator(email) {
  if (email.length === 0) throw new Error('Email cannot be blank')
  if(!isEmail(email)) throw new Error('Must be valid email')
  if (email.length > 50) throw new Error('Email must be less than 50 characters')
  const [emailCheck] = (await client.queryObject(`SELECT 1 FROM users WHERE email = $1;`, email)).rows
  if (emailCheck) throw new Error('Email already in use')
}

async function usernameValidator(username){
  if (username.length === 0) throw new Error('Username cannot be blank')
  if (username.length > 20) throw new Error('Username must be less than 20 characters')
  const [usernameCheck] = (await client.queryArray(`SELECT 1 FROM users WHERE username = $1;`, username)).rows
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

async function signUpValidator(email, username, password, confirmedPassword) {
  await emailValidator(email)
  await usernameValidator(username)
  passwordValidator(password, confirmedPassword)
}

const registerUser = async (server) => {
  
  //retrieve typed details from form elements from front-end
  const { email, username, password, passwordConfirmation, saveScore } = await server.body;
  // console.log('registerrrrrinnnnnggg......... :)')
  // console.log(username, password, passwordConfirmation)
  
  //retrieve any EXISTING user details from database for provided/typed username/email and throw error if a user already exists and send back to front-end
  
  
  try {
    await signUpValidator(email, username, password, passwordConfirmation)
  } catch (err) {
    return await server.json({message: err.message})
  }
  
  //generate encrypted password
  const passwordEncrypted  = await passwordEncryptor(password)
  
  // TESTING
  // console.log(password)
  // console.log(passwordEncrypted)
  
  //save encrypted password with username into users table
  await client.queryObject(`
    INSERT INTO users(username, email, password_encrypted, created_at, updated_at) 
    VALUES ($1, $2, $3, NOW(), NOW());`,
    username, email, passwordEncrypted);
  

  // saving game to finished games if user signing up from game end screen and deleting from current games
  if (saveScore) {
    const { tempUser } = await server.cookies
    try {
      const [[score]] = (await client.queryArray(`
        SELECT score
        FROM current_games
        WHERE username = $1`,
        tempUser)).rows
      await client.queryObject(`
        INSERT INTO finished_games(username, score, created_at)
        VALUES($1, $2, NOW())`,
        username, score)
      await client.queryObject(`
        DELETE FROM current_games
        WHERE username = $1`,
        tempUser)
      await server.setCookie({
        name: "tempUser",
        value: "",
        path: "/",
        secure: Deno.env.get('DENO_ENV') === 'production',
        sameSite: Deno.env.get('DENO_ENV') === 'production' ? 'none' : 'lax',
        expires: new Date(0),
      });
    }
    catch { return await server.json({message: 'Successful signup but score not saved'})}
  }
  
  await server.json({message: 'Success'}) //return to stories page after submission
  
}

export default registerUser