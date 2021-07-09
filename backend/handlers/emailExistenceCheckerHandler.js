import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

export default async function emailExistanceCheckerHandler(server) {
    const { email } = await server.body
    const [emailCheck] = (await client.queryArray(`SELECT 1 FROM users WHERE email = $1;`, email)).rows
    await server.json({uniqueEmail: !emailCheck})
}