import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import { v4 } from "https://deno.land/std/uuid/mod.ts"
import getCurrentUser from "./helperFunctions/getCurrentUser.js"
import getUserFromCookies from "./helperFunctions/getUserFromCookies.js"

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

    // finds user, prioritising registered log in over temporary users
    let user = await getUserFromCookies(server)
    if (!user) throw new Error ('No user detected')

    // take user input and letter assigned to check it's a correct answer
    const { userInput, letter } = await server.body

    console.log('userInput: ', userInput, 'for letter: ', letter)

    // basic validations mirroring front end validations
    if (typeof userInput !== 'string' || userInput.length > 60 || userInput.length === 0) throw new Error('Bad userInput.')

    // find already played countries in this game
    let [[countryArray]] = (await client.queryArray(`SELECT played_countries FROM current_games WHERE username = $1;`, user)).rows

    if (countryArray) countryArray = JSON.parse(countryArray) // parse the JSON stringified array
    if (!countryArray) countryArray = [] // if null (first turn), initialise as empty array

    // add most recent input to array
    countryArray.push(userInput)

    // re-stringify and update current_game table
    await client.queryObject(`UPDATE current_games
                              SET played_countries = $1
                              WHERE username = $2;`, JSON.stringify(countryArray), user)

    // check correctness of suggested country answer (disregarding case)
    const [matches] = (await client.queryArray(`SELECT country_name 
                                                FROM countries 
                                                WHERE LOWER(country_name) = $1
                                                AND SUBSTRING(country_name, 1, 1) = $2;`, userInput.toLowerCase(), letter)).rows

    const [[score]]  = (await client.queryArray(`SELECT score FROM current_games WHERE username = $1;`, user)).rows

    if (!matches) {
        // if answer is incorrect, add to finished_games, delete from current_games, and return some response ***ADD SCORE***

        const correct = false
        await server.json({correct, score})

    } else {
        // return a response with the letter for the next AI turn
        // update score in current_games
        // 1 is placeholder for whatever we decide a correct answer is worth!
        await client.queryObject(`UPDATE current_games
                                  SET score = $1
                                  WHERE username = $2;`, score + 1, user)
        // test:                                  
        // let [[update]]  = (await client.queryArray(`SELECT score FROM current_games WHERE username = $1;`, user)).rows
        // console.log('correct! updated score: ', scoreYes)

        const correct = true
        const lastLetter = userInput.slice(-1)
        // console.log('lastLetter: ', lastLetter)
        await server.json({correct, lastLetter, score: score + 1})
    }
}

export default updateGameHandler