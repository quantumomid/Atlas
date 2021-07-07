import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import { v4 } from "https://deno.land/std/uuid/mod.ts"
import getCurrentUser from "./helperFunctions/getCurrentUser.js"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

const updateGameHandler = async (server) => {
    // takes user country input
    // updates entry in current_games table
    // checks validity of answer
    // if invalid, adds game to finished_games and removes it from current_games, and returns a message/boolean etc. that we can check on frontend to trigger end game screen
    // if valid somehow triggers AI turn

    const { sessionID, tempUser } = await server.cookies
    // console.log('sessionID: ', sessionID, 'tempUser: ', tempUser)

    let user
    if (sessionID) {
        const userData = await getCurrentUser(server)
        user = userData.username
    } else if (tempUser) {
        user = tempUser
    } else {
        throw new Error("You should not be here!")
    }
    // console.log('user: ', user)

    const { userInput, letter } = await server.body

    console.log('userInput: ', userInput)
    console.log('letter: ', letter)

    // basic validations mirroring front end validations
    if (typeof userInput !== 'string' || userInput.length > 60 || userInput.length === 0) throw new Error('Bad userInput.')

    let [[countryArray]] = (await client.queryArray(`SELECT played_countries FROM current_games WHERE username = $1;`, user)).rows
    console.log('countryArray: ', countryArray)

    if (!countryArray) countryArray = []
    
    // add most recent input to list
    countryArray.push(userInput)
    console.log('after push', countryArray)

    // re-stringify and update current_game
    await client.queryObject(`UPDATE current_games
                              SET played_countries = $1
                              WHERE username = $2;`, JSON.stringify(countryArray), user)

    // validate country input and disregard case
    const [matches] = (await client.queryArray(`SELECT country_name 
                                                FROM countries 
                                                WHERE LOWER(country_name) = $1
                                                AND SUBSTRING(country_name, 1, 1) = $2;`, userInput.toLowerCase(), letter)).rows
    console.log('matches: ', matches)

    if (!matches) {
        // if answer is incorrect, add to finished_games, delete from current_games, and return some response

    } else {
        // return some other response
    }
}

export default updateGameHandler