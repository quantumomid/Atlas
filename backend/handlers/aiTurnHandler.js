import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import getCurrentUser from "./helperFunctions/getCurrentUser.js"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

async function aiTurnHandler(server) {
    const { lastLetter } = await server.body
    console.log('AI turn triggered with ', lastLetter)

    // find game from current cookies
    const { sessionID, tempUser } = await server.cookies

    // finds user, prioritising registered log in over temporary users
    let user
    if (sessionID) {
        const userData = await getCurrentUser(server)
        if (userData) user = userData.username
        if (!userData) throw new Error('Session has expired. Please log back in to continue or refresh to play as guest.')
    } else if (tempUser) {
        user = tempUser
    } else {
        throw new Error("You should not be here!")
    }

    const aiCountries = (await client.queryArray(`SELECT country_name
                                                  FROM countries 
                                                  WHERE LOWER(SUBSTRING(country_name, 1, 1)) = $1;`, lastLetter.toLowerCase())).rows

    const [aiCountryChoice] = aiCountries[Math.floor(Math.random() * aiCountries.length)]
    console.log('ai country choice: ', aiCountryChoice)

    let [[countryArray]] = (await client.queryArray(`SELECT played_countries FROM current_games WHERE username = $1;`, user)).rows
    countryArray = JSON.parse(countryArray)
    console.log('ai turn countryArray: ', countryArray)
    // console.log('country array is a ' + (typeof countryArray))
    countryArray.push(aiCountryChoice)
    
    // re-stringify and update current_game table
    await client.queryObject(`UPDATE current_games
                              SET played_countries = $1
                              WHERE username = $2;`, JSON.stringify(countryArray), user)

    await server.json({aiCountryChoice})
}

export default aiTurnHandler