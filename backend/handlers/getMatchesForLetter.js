import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import getUserFromCookies from "./helperFunctions/getUserFromCookies.js"
import getCountryArray from "./helperFunctions/getCountryArray.js"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

export default async function getMatchesForLetter(server) {
    const { letter } = await server.body

    // finds user, prioritising registered log in over temporary users
    let user = await getUserFromCookies(server)
    if (!user) throw new Error ('No user detected')

    // find already played countries in this game
    const countryArray = await getCountryArray(user)

    // pass through list of what countries would have been correct answers
    // DAVID'S NOTE: the edge case of no correct answers is not possible, as we check that on the AI turn before giving the letter
    let allMatches = (await client.queryArray(`
        SELECT country_name
        FROM countries
        WHERE LOWER(SUBSTRING(country_name, 1, 1)) = $1;`,
         letter.toLowerCase())).rows
    
    // filter out those that have been played
    allMatches = allMatches.flat()
    allMatches = allMatches.filter(country => !countryArray.includes(country))

    await server.json({allMatches})
}