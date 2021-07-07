import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

export default async function globalScoresHandler(server) {
    const tableLength = 20
    const gameData = (await client.queryObject(`
        SELECT username, score, created_at
        FROM finished_games
        ORDER BY score DESC
        LIMIT $1`,
        tableLength)).rows
    await server.json({gameData})
}