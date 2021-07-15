import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import getUserFromCookies from "./helperFunctions/getUserFromCookies.js"
import getCountryArray from "./helperFunctions/getCountryArray.js"
import formatUserGameInput from './helperFunctions/formatUserGameInput.js'

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

//helper function to input country played into countries_played
async function insertToTable(countryArray, userInput, user) {
    countryArray.push(userInput)

    // re-stringify and update current_game table
    await client.queryObject(`UPDATE current_games
                              SET played_countries = $1, updated_at = NOW()
                              WHERE username = $2;`, JSON.stringify(countryArray), user)

}

const updateGameHandler = async (server) => {
    // takes user country input
    // updates entry in current_games table
    // checks validity of answer
    // if invalid, adds game to finished_games and removes it from current_games, and returns a message/boolean etc. that we can check on frontend to trigger end game screen
    // if valid somehow triggers AI turn

    //define points for correct country
    const countryPoints = 10

    // finds user, prioritising registered log in over temporary users
    let user = await getUserFromCookies(server)
    if (!user) throw new Error ('No user detected')

    // backend timer to prevent them hacking the frontend clock to gain more time
    const backendTimer = (await client.queryObject("SELECT username FROM current_games WHERE username = $1 AND updated_at > NOW() - interval '20 seconds';",user)).rows
    //console.log('backendTimer length',backendTimer.length)
    
    if (backendTimer.length === 0){
        //console.log('backendTimer',backendTimer)
        throw new Error('backend timeout')
    } 

    // take user input and letter assigned to check it's a correct answer
    let { userInput, letter } = await server.body

    userInput = formatUserGameInput(userInput)
    console.log('fixed userInput: ', userInput)
    //console.log('userInput: ', userInput, 'for letter: ', letter)

    // basic validations mirroring front end validations
    if (typeof userInput !== 'string' || userInput.length > 60 || userInput.length === 0) throw new Error('Bad userInput.')

    // get current score of this game
    const [[score]]  = (await client.queryArray(`SELECT score FROM current_games WHERE username = $1;`, user)).rows

    //MAYBE MAKE A HELPER FUNCTION?? CALLED AGAIN IN GETMATCHESFORLETTER
    // find already played countries in this game
    const countryArray = await getCountryArray(user)

    let flag // initialise flag as undefined for later
    
    if (countryArray.includes(userInput)) {
        // if country has already been used this game, end the game

        await insertToTable(countryArray, userInput, user)
        console.log('this country has been used, ending game')
        const correct = false
        await server.json({correct, score})

    } else {
        await insertToTable(countryArray, userInput, user)
        // check correctness of suggested country answer (disregarding case)
        console.log('userInput: ', userInput.toLowerCase(), 'for letter: ', letter)
        const [matches] = (await client.queryArray(`SELECT country_name 
                                                    FROM countries 
                                                    WHERE LOWER(country_name) = $1
                                                    AND LOWER(SUBSTRING(country_name, 1, 1)) = $2;`, userInput.toLowerCase(), letter.toLowerCase())).rows
        console.log('matches: ', matches)
        if (!matches) {
            // if answer is incorrect, add to finished_games, delete from current_games, and return some response
            const correct = false
            await server.json({correct, score})

        } else {
            // return a response with the letter for the next AI turn
            // update score in current_games
            // 1 is placeholder for whatever we decide a correct answer is worth!
            await client.queryObject(`UPDATE current_games
                                    SET score = $1
                                    WHERE username = $2;`, score + countryPoints, user)
            // test:                                  
            // let [[update]]  = (await client.queryArray(`SELECT score FROM current_games WHERE username = $1;`, user)).rows
            // console.log('correct! updated score: ', scoreYes)

            const correct = true
            const lastLetter = userInput.slice(-1)
            //console.log('lastLetter: ', lastLetter)

            flag = (await client.queryArray(`SELECT flag FROM countries WHERE country_name = $1;`, userInput)).rows
            console.log('flag link: ', flag)

            await server.json({correct, lastLetter, score: score + countryPoints, flag})
        }
    }
}

export default updateGameHandler