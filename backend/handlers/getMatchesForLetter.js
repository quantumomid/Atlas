import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import getUserFromCookies from "./helperFunctions/getUserFromCookies.js"

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
    let [[countryArray]] = (await client.queryArray(`SELECT played_countries FROM current_games WHERE username = $1;`, user)).rows

    if (countryArray) countryArray = JSON.parse(countryArray); // parse the JSON stringified array
    if (!countryArray) countryArray = [] // if null (first turn), initialise as empty array

    // console.log('country array parsed = ' + countryArray)

    // also pass through list of what countries would have been correct answers
    // NOTE: the edge case of no correct answers is not possible, as we check that on the AI turn before giving the letter
    let allMatches = (await client.queryArray(`
        SELECT country_name
        FROM countries
        WHERE LOWER(SUBSTRING(country_name, 1, 1)) = $1;`,
         letter.toLowerCase())).rows
    // console.log('allMatches: ', allMatches)
    
    // filter out those that have been played
    allMatches = allMatches.flat()
    allMatches = allMatches.filter(country => !countryArray.includes(country))
    console.log('filtered test allMatches: ', allMatches)

    await server.json({allMatches})
}