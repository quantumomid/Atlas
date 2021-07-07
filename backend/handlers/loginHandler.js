import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { config } from 'https://deno.land/x/dotenv/mod.ts' // environment variables
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { v4 } from "https://deno.land/std/uuid/mod.ts";

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })
const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

export default async function loginHandler(server) {
    const { username, password } = await server.body
    const [userInfo] = (await client.queryObject('SELECT id, password_encrypted FROM users WHERE username = $1', username)).rows

    try{
        if (!userInfo) throw new Error('User doesnt exist - please try again')
        const passwordCorrect = await bcrypt.compare(password, userInfo.password_encrypted)
        if (!passwordCorrect) throw new Error('Invalid password')
        const sessionID = v4.generate()
        await client.queryArray(`
            INSERT INTO sessions (uuid, user_id, created_at, expires_at) 
            VALUES ($1, $2, NOW(),(NOW() + interval '7 days'))`,
            sessionID, userInfo.id);
        server.setCookie({
            name: "sessionID",
            value: sessionID,
            path: "/",
            secure: Deno.env.get('DENO_ENV') === 'production',
            sameSite: Deno.env.get('DENO_ENV') === 'production' ? 'none' : 'lax',
            expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) // expiry optional
        });
        return await server.json({ message: 'Success' })
    } catch(error){
        return await server.json({ message: error.message })
    }
}

