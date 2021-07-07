import { config } from 'https://deno.land/x/dotenv/mod.ts' // environment variables
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })
const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

export default async function logoutHandler(server) {
    const { sessionID } = await server.cookies
    await client.queryArray(`
            DELETE FROM sessions 
            WHERE uuid = $1`,
            sessionID);
    await server.setCookie({
    name: "sessionID",
    value: "",
    path: "/",
    secure: Deno.env.get('DENO_ENV') === 'production',
    sameSite: Deno.env.get('DENO_ENV') === 'production' ? 'none' : 'lax',
    expires: new Date(0),
  });
  return await server.json({loggedOut: true})
}