import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import { v4 } from "https://deno.land/std/uuid/mod.ts"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

const startGameHandler = async (server) => {
    // handles checking the current user, making a temporary user if need be
    // and either creating a new game or accessing one in progress

    const username = 'quantumguy' // temp hard-coding username
    
    // TO DO (IMPORTANT): need to change way of getting username to use cookie?

    const [existingGame] = (await client.queryObject(`SELECT game_id FROM current_games WHERE username=$1;`, username)).rows
    console.log('game: ', existingGame)

    const [[userExists]] = (await client.queryArray('SELECT COUNT(*)::integer FROM users WHERE username = $1;', username)).rows
    console.log('userExists: ', userExists)

    // if user is guest, generate a temporary username for them
    const trackedName = userExists === 1 ? username : v4.generate()
    console.log('trackedName: ', trackedName)

    // create a temporary user with the uuid (to account for foreign key constraint on current_games)
    if (userExists !== 1) await client.queryObject('INSERT INTO users (username, email, password_encrypted, created_at, updated_at) VALUES ($1, $1, $1, NOW(), NOW());', trackedName)
    
    // TO DO: REMEMBER TO DELETE THIS TEMPORARY USER AFTER GAME ENDS/USER MAYBE REGISTERS

    if (!existingGame) {
        // create new game if one doesn't exist
        await client.queryObject(`INSERT INTO current_games (username, created_at) VALUES ($1, NOW());`, trackedName)
    } 
}

export default startGameHandler