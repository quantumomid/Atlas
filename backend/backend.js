import { Application } from 'https://deno.land/x/abc@v1.3.1/mod.ts'
import { cors } from 'https://deno.land/x/abc@v1.3.1/middleware/cors.ts'
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import registerUser from './handlers/registerUser.js'
import letterGenHandler from './handlers/letterGenHandler.js';
import startGameHandler from './handlers/startGameHandler.js';
import loginHandler from './handlers/loginHandler.js';
import updateGameHandler from './handlers/updateGameHandler.js';
import sessionsHandler from './handlers/sessionsHandler.js'
import logoutHandler from './handlers/logoutHandler.js'
import globalScoresHandler from './handlers/globalScoresHandler.js'
import personalTopScoresHandler from './handlers/personalTopScoresHandler.js'
import aiTurnHandler from './handlers/aiTurnHandler.js'
import endgameDataHandler from './handlers/endgameDataHandler.js'
import usernameExistanceCheckerHandler from './handlers/usernameExistenceCheckerHandler.js'
import emailExistanceCheckerHandler from './handlers/emailExistenceCheckerHandler.js'
import getMatchesForLetter from './handlers/getMatchesForLetter.js'
import capitalCityCheck from './handlers/capitalCityHandler.js'
import allCountries from './handlers/allCountries.js'

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'

config({ path: `./.env.${DENO_ENV}`, export: true })
const client = new Client(Deno.env.get('PG_URL'))
await client.connect()

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
    .post('/sessions', loginHandler)
    .post('/users', registerUser)
    .get('/sessions/exists', sessionsHandler)
    .get('/letter', letterGenHandler)
    .post('/game/new', startGameHandler)
    .post('/game', updateGameHandler)
    .delete('/sessions', logoutHandler)
    .get('/globalscores/:dateFilter/:country', globalScoresHandler)
    .get('/personaltopscores/:dateFilter', personalTopScoresHandler)
    .post('/game/ai', aiTurnHandler)
    .post('/endgamedata', endgameDataHandler)
    .post('/usernameexists', usernameExistanceCheckerHandler)
    .post('/emailexists', emailExistanceCheckerHandler)
    .post('/getmatches', getMatchesForLetter)
    .post('/game/city', capitalCityCheck)
    .get('/allcountries', allCountries)
    .start({ port: PORT })


