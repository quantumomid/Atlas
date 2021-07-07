import getCurrentUser from './helperFunctions/getCurrentUser.js'
import { config } from 'https://deno.land/x/dotenv/mod.ts' // environment variables
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })
const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

export default async function sessionsHandler(server){

    // handles checking whether user is currently logged in - is cookie valid
    const user = await getCurrentUser(server)
    // console.log("user.....", user)
    const isLoggedIn = (user) ? true : false
    // console.log("...isLoggedIn from backend (FROM /sessions/exists)", isLoggedIn)
    
    await server.json({isLoggedIn})
}