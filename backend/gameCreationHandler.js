import { DB } from 'https://deno.land/x/sqlite/mod.ts'

const db = new DB('./atlas.db')

const gameCreationHandler = async (server) => {
    // we want an entry in current_games table
    const { username } = await server.body

    await db.query(`INSERT INTO current_games (username, created_at) VALUES (?, DATETIME('now'));`, [username])
    const successfulGameCreation = true

    await server.json({ successfulGameCreation })
}

export default gameCreationHandler