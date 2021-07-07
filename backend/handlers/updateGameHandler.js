import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

const updateGameHandler = async (server) => {
    // we want an entry in current_games table
    // const username = `temp ${Math.random()}`
    const username = 'quantumguy'
    const { userInput, letter } = await server.body
    // need to change way of getting username to cookie?

    // console.log('userInput: ', userInput)
    // console.log('letter: ', letter)

    //basic validations mirroring front end validations
    if (typeof userInput !== 'string' || userInput.length > 60 || userInput.length === 0) throw new Error('No.')

    const [existingGame] = (await client.queryObject(`SELECT game_id FROM current_games WHERE username=$1;`, username)).rows
    console.log('game: ', existingGame)

    if (!existingGame) {
        await client.queryObject(`INSERT INTO current_games (username, created_at) VALUES ($1, NOW());`, username)
    } 
    
    // validate country input
    const matches = (await client.queryObject(`SELECT country_name 
                                  FROM countries 
                                  WHERE country_name = $1
                                  AND SUBSTR(country_name, 1, 1) = $2;`, userInput, letter)).rows
    // console.log('matches: ', matches)

    // if input correct, input into table
    if (matches.length !== 0) {

        // TO DO: unique country check

        const [countryArrayJSON] = (await client.queryObject(`SELECT played_countries FROM current_games WHERE username = $1;`, username)).rows
        
        // take JSON object of country array and parses it to an array of countries:
        const countryArray = JSON.parse(Object.values(countryArrayJSON)[0]) 

        // add new country
        countryArray.push(userInput)

        // re-stringify and update current_game
        await client.queryObject(`UPDATE current_games
                        SET played_countries = $1
                        WHERE username = $2;`, JSON.stringify(countryArray), username)
                        
        await server.json({response: 'yep'})
    } else {
    // if input incorrect, end game
        console.log('incorrect input')
        await server.json({response: 'nope'})
    }

    
}

export default updateGameHandler