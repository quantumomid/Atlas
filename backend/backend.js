import { Application } from 'https://deno.land/x/abc@v1.3.1/mod.ts'
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { cors } from 'https://deno.land/x/abc@v1.3.1/middleware/cors.ts'
// import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { DB } from 'https://deno.land/x/sqlite/mod.ts'
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import registerUser from './handlers/registerUser.js'
import letterGenHandler from './handlers/letterGenHandler.js';
import updateGameHandler from './handlers/updateGameHandler.js';
// import loginHandler from './loginHandler.js'

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'

config({ path: `./.env.${DENO_ENV}`, export: true })
// const client = new Client(Deno.env.get('PG_URL'))
// await client.connect()

const db = new DB('./atlas.db')
// turn on foreign key constraints
db.query('PRAGMA foreign_keys = ON;')

const app = new Application()
const PORT = Number(Deno.env.get('PORT'))

const headersWhitelist = [
    "Authorization",
    "Content-Type",
    "Accept",
    "Origin",
    "User-Agent",
]
app.use(cors({ allowHeaders: headersWhitelist, allowCredentials: true, allowOrigins: Deno.env.get('ALLOWED_ORIGINS')}))

app
    .post('/users', registerUser)
    //.post('/login', loginHandler)
    .get('/letter', letterGenHandler)
    .post('/game', updateGameHandler)
    .start({ port: PORT })

console.log(`Server running on http://localhost:${PORT}`)
