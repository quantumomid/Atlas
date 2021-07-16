import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

const letterGenHandler = async (server) => {
    // handles returning a random letter that a country in our countries table starts with
    // NOTE: doesn't take into account countries being unique yet

    const letters = (await client.queryArray(`SELECT SUBSTRING(country_name, 1, 1) AS letter
                                        FROM countries
                                        GROUP BY letter;`)).rows                                      
    
    

    const [letter] = letters[Math.floor(Math.random() * letters.length)]


    await server.json({ letter })
}

export default letterGenHandler