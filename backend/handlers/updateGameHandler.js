import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import { v4 } from "https://deno.land/std/uuid/mod.ts"

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

    // temporarily hard code user, will use either sessionId cookie or temp user cookie when implemented
    const username = 'quantumguy'
    const { userInput, letter } = await server.body

    // console.log('userInput: ', userInput)
    // console.log('letter: ', letter)

    // basic validations mirroring front end validations
    if (typeof userInput !== 'string' || userInput.length > 60 || userInput.length === 0) throw new Error('Bad userInput.')
    
    // validate country input and disregard case
    const [matches] = (await client.queryArray(`SELECT country_name 
                                               FROM countries 
                                               WHERE LOWER(country_name) = $1
                                               AND SUBSTRING(country_name, 1, 1) = $2;`, userInput.toLowerCase(), letter)).rows
    console.log('matches: ', matches)

    // if input correct, input into table
    if (matches.length !== 0) {

        // TO DO: unique country check 

        const [[countryArray]] = (await client.queryArray(`SELECT played_countries FROM current_games WHERE username = $1;`, username)).rows
        console.log('countryArray: ', countryArray)

    } // temp for testing

        // take JSON object of country array and parses it to an array of countries:
    //     let countryArray = JSON.parse(countryArray) 

    //     if (!countryArray) countryArray = []

    //     // add new country
    //     console.log('user input before push: ' + userInput)
    //     countryArray.push(userInput)
    //     console.log('country array : ' + countryArray)

    //     // re-stringify and update current_game
    //     await client.queryObject(`UPDATE current_games
    //                     SET played_countries = $1
    //                     WHERE username = $2;`, JSON.stringify(countryArray), trackedName)
                        
    //     await server.json({response: 'yep'})
    // } else {
    // // if input incorrect, end game
    //     console.log('incorrect input')
    //     await server.json({response: 'nope'})
    // }

    
}

export default updateGameHandler