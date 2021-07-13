import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import getUserFromCookies from "./helperFunctions/getUserFromCookies.js"
import getCountryArray from "./helperFunctions/getCountryArray.js"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

async function capitalCityCheck(server) {
    // handles the optional capital city question
    // needs the user input for capital city, and the cookies to find the user and therefore current_game/country array
    // if the answer is right, adds another point to the score of the current_game, and returns a boolean marking it as true
    // if the answer is wrong, returns a boolean marking it as false, which ends the game

    const { city } = await server.body

    // finds user, prioritising registered log in over temporary users
    let user = await getUserFromCookies(server)
    if (!user) throw new Error ('No user detected')

    // finds country (most recent in current_games)
    const countryArray = getCountryArray(user)
    const lastCountry = countryArray.slice(-1)

    const [[correctCity]] = (await client.queryArray(`SELECT capital 
                                                   FROM countries
                                                   WHERE country_name = $1;`, lastCountry)).rows
    
    console.log('correct city: ', correctCity)

    let isCorrectCity = false
    if (correctCity === city) {
        isCorrectCity = true

        // increase score for correct answer
        const [[score]]  = (await client.queryArray(`SELECT score FROM current_games WHERE username = $1;`, user)).rows
        await client.queryObject(`UPDATE current_games
                                  SET score = $1
                                  WHERE username = $2;`, score + 1, user)
    }

    await server.json({isCorrectCity})
}

export default capitalCityCheck