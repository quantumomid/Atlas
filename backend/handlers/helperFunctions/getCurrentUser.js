import { config } from 'https://deno.land/x/dotenv/mod.ts' // environment variables
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })
const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

export default async function getCurrentUser(server){
    const { sessionID } = await server.cookies
    // const [user] = (await client.queryObject("SELECT users.id FROM users JOIN sessions ON users.id = sessions.user_id WHERE sessions.created_at > datetime('now', '-7 days') AND uuid=$1", sessionId)).rows
    try {
        const [user] = (await client.queryObject(`
        SELECT users.* FROM users 
        JOIN sessions 
        ON users.id = sessions.user_id 
        WHERE uuid=$1 AND NOW() < expires_at`
        , sessionID)).rows
        return user
    } catch {
        return null
    }
    
    
  }