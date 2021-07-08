import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import getUserFromCookies from "./helperFunctions/getUserFromCookies.js"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

async function aiTurnHandler(server) {
    let { lastLetter } = await server.body
    // console.log('AI turn triggered with ', lastLetter)

    // finds user, prioritising registered log in over temporary users
    const user = await getUserFromCookies(server)
    if (!user) throw new Error("You shouldn't be here!")

    // get current countries that have been played
    let [[countryArray]] = (await client.queryArray(`SELECT played_countries FROM current_games WHERE username = $1;`, user)).rows
    countryArray = JSON.parse(countryArray)
    // console.log('countryArray: ', countryArray)

    // // find all possible right answers for this letter
    // let aiCountries = (await client.queryArray(`SELECT country_name
    //                                               FROM countries 
    //                                               WHERE LOWER(SUBSTRING(country_name, 1, 1)) = $1;`, lastLetter.toLowerCase())).rows

    // // turn array of arrays into 1D array of strings                                                  
    // aiCountries = aiCountries.flat()                                                  
    // // console.log('aiCountries not filtered: ', aiCountries)

    // const filteredAiCountries = aiCountries.filter(country => !countryArray.includes(country))
    // console.log('aiCountries filtered: ', filteredAiCountries)

    // // if (filteredAiCountries.length === 0) throw new Error('no possible countries remaining')
    // if (filteredAiCountries.length === 0) {
    //     const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

    //     let timesTried = 0
    //     let foundSolution = false
    //     while (timesTried < 26 && !foundSolution) {
    //         let letterIndex = alphabet.findIndex(lastLetter.toLowerCase())
    //         if (letterIndex === -1) throw new Error("How did you get here?")
    //         if (letterIndex === 25) letterIndex = -1
    //         const newLetter = alphabet[letterIndex + 1]
    //         timesTried += 1

    //         // do SQL query and make foundSolution true if found correct country
    //     }
    // }

    let timesTried = 0
    let foundSolution = false
    const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    
    do {
        // find all possible right answers for this letter
        let aiCountries = (await client.queryArray(`SELECT country_name
                                                    FROM countries 
                                                    WHERE LOWER(SUBSTRING(country_name, 1, 1)) = $1;`, lastLetter.toLowerCase())).rows

        // turn array of arrays into 1D array of strings                                                  
        aiCountries = aiCountries.flat()                                                  
        // console.log('aiCountries not filtered: ', aiCountries)

        const filteredAiCountries = aiCountries.filter(country => !countryArray.includes(country))
        console.log('aiCountries filtered: ', filteredAiCountries)

        if (filteredAiCountries.length > 0) {
            foundSolution = true
        
        } else {
            // if (filteredAiCountries.length === 0) throw new Error('no possible countries remaining')
            
            let letterIndex = alphabet.findIndex(lastLetter.toLowerCase())
            if (letterIndex === -1) throw new Error("How did you get here?")
            if (letterIndex === 25) letterIndex = -1 // accounts for ending with Z
            lastLetter = alphabet[letterIndex + 1] // set lastLetter equal to new letter, to loop back through and check
            
        }

        timesTried += 1
        if (timesTried > 25) break // after checking every letter once, break out of loop with foundSolution still false
    } while (!foundSolution)

    // if (!foundSolution) still, game ends
    if (!foundSolution) {
        console.log('No more countries left!')
        const allCountriesPlayed = true
        await server.json({allCountriesPlayed})

    } else {

        //select random country from possible right answers
        const aiCountryChoice = filteredAiCountries[Math.floor(Math.random() * filteredAiCountries.length)]
        console.log('ai country choice: ', aiCountryChoice)

        // add it to the array of played countries
        countryArray.push(aiCountryChoice)
        // console.log('ai turn countryArray: ', countryArray)
        
        // re-stringify and update current_game table
        await client.queryObject(`UPDATE current_games
                                SET played_countries = $1
                                WHERE username = $2;`, JSON.stringify(countryArray), user)

        // return the AI's chosen country to the frontend
        timesTried = 0
        let foundLetter = false
        do {
            // find all possible right answers for this letter
            let aiCountries = (await client.queryArray(`SELECT country_name
                                                        FROM countries 
                                                        WHERE LOWER(SUBSTRING(country_name, 1, 1)) = $1;`, lastLetter.toLowerCase())).rows
    
            // turn array of arrays into 1D array of strings                                                  
            aiCountries = aiCountries.flat()                                                  
            // console.log('aiCountries not filtered: ', aiCountries)
    
            const filteredAiCountries = aiCountries.filter(country => !countryArray.includes(country))
            console.log('aiCountries filtered: ', filteredAiCountries)
    
            if (filteredAiCountries.length > 0) {
                foundLetter = true
            
            } else {
                // if (filteredAiCountries.length === 0) throw new Error('no possible countries remaining')
                
                let letterIndex = alphabet.findIndex(lastLetter.toLowerCase())
                if (letterIndex === -1) throw new Error("How did you get here?")
                if (letterIndex === 25) letterIndex = -1 // accounts for ending with Z
                lastLetter = alphabet[letterIndex + 1] // set lastLetter equal to new letter, to loop back through and check
                
            }
    
            timesTried += 1
            if (timesTried > 25) break // after checking every letter once, break out of loop with foundSolution still false
        } while (!foundLetter)

        if (!foundLetter) {
            console.log('No more countries left!')
            const allCountriesPlayed = true
            await server.json({allCountriesPlayed})
        }

        await server.json({aiCountryChoice, letter: lastLetter})
        

        // TO DO: CHECK FOR ANSWERS TO LAST LETTER OF AI RESPONSE, CHANGE SENT LETTER BACK IF NEED BE
    }
}

export default aiTurnHandler