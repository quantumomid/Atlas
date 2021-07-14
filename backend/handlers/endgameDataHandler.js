import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import getUserFromCookies from "./helperFunctions/getUserFromCookies.js"


const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

export default async function endgameDataHandler(server) {
    const username = await getUserFromCookies(server)
    const [gameData] = (await client.queryObject(`
        SELECT score, played_countries
        FROM current_games
        WHERE username = $1`,
        username)).rows
    let { score, played_countries } = gameData
    // move game into finished games if username logged in
    if (username.length <= 20 ) {
        let [userCountry] = (await client.queryArray(`
            SELECT country FROM users
            WHERE username = $1`,
            username)).rows
        userCountry = userCountry[0] ? userCountry[0] : null
        await client.queryObject(`
            INSERT INTO finished_games(username, country, score, created_at)
            VALUES($1, $2, $3, NOW())`,
            username, userCountry, score)
        await client.queryObject(`
            DELETE FROM current_games
            WHERE username = $1`,
            username)
    }
    let playedCountryArray = []
    if (played_countries) playedCountryArray =  JSON.parse(played_countries)
    await server.json({score, playedCountryArray})

}