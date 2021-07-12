import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

export default async function getCountryArray(user) {
    let [[countryArray]] = (await client.queryArray(`SELECT played_countries FROM current_games WHERE username = $1;`, user)).rows

    if (countryArray) countryArray = JSON.parse(countryArray); // parse the JSON stringified array
    if (!countryArray) countryArray = []
    return countryArray
}