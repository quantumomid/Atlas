import { DB } from 'https://deno.land/x/sqlite/mod.ts'

const db = new DB('./atlas.db')

const updateGameHandler = async (server) => {
    // we want an entry in current_games table
    const username = `temp ${Math.random()}`
    const { userInput, letter } = await server.body
    // need to change way of getting username to cookie?

    console.log('userInput: ', userInput)
    console.log('letter: ', letter)

    //basic validations mirroring front end validations
    if (typeof userInput !== 'string' || userInput.length > 60 || userInput.length === 0) throw new Error('No.')

    const existingGame = [... db.query(`SELECT game_id FROM current_games WHERE username=?;`, [username]).asObjects()]
    console.log('game: ', existingGame)

    if (!existingGame) {
        await db.query(`INSERT INTO current_games (username, created_at) VALUES (?, DATETIME('now'));`, [username])    
    }

    // validate country input
    const matches = [...db.query(`SELECT country_name 
                                  FROM countries 
                                  WHERE country_name = ?
                                  AND SUBSTR(country_name, 1, 1) = ?;`, [userInput, letter]).asObjects()]
    console.log('matches: ', matches)

    // if input correct, input into table
    if (matches.length !== 0) {
        console.log('correct input')
        await server.json({response: 'yep'})
    } else {
    // if input incorrect, end game
        console.log('incorrect input')
        await server.json({response: 'nope'})
    }

    
}

export default updateGameHandler