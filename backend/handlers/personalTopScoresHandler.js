import getCurrentUser from './helperFunctions/getCurrentUser.js'
import { config } from 'https://deno.land/x/dotenv/mod.ts' // environment variables
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })
const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

export default async function personalTopScoresHandler(server) {
    const tableLength = 20
    const currentUser = await getCurrentUser(server)
    let gameData = []
    if (currentUser) {
        gameData = (await client.queryObject(`
            SELECT (RANK() OVER (ORDER BY score DESC))::integer AS ranking, username, score, created_at
            FROM finished_games
            WHERE username = $1
            ORDER BY ranking
            LIMIT $2`,
            currentUser.username, tableLength)).rows
    }
    await server.json({gameData}) 
}
