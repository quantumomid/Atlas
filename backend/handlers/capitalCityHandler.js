import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import getUserFromCookies from "./helperFunctions/getUserFromCookies.js"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

async function capitalCityCheck(server) {
    // handles the optional capital city question
    // needs the country, the user input for capital city, and the cookies to find the user and therefore current_game
    // if the answer is right, adds another point to the score of the current_game, and returns a boolean marking it as true
    // 

    const { city, country } = await server.body
    const 


}

export default capitalCityCheck