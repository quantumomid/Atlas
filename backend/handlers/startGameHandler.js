import { v4 } from "https://deno.land/std/uuid/mod.ts"
import getCurrentUser from "./helperFunctions/getCurrentUser.js"

const startGameHandler = async (server, client) => {
    // handles checking the current user, making a temporary user if need be
    // and either creating a new game or accessing one in progress
    // find logged in user, prioritising registered log ins
    const user = await getCurrentUser(server, client)
    console.log('user:', user)

    // if user is NEW guest, generate a temporary username for them
    const trackedName = user ? user.username : v4.generate()
    console.log('trackedName: ', trackedName)

    // create a temporary user with the uuid (to account for foreign key constraint on current_games)
    if (!user) {
        await client.queryObject('INSERT INTO users (username, email, password_encrypted, created_at, updated_at) VALUES ($1, $1, $2, NOW(), NOW());', trackedName, v4.generate())

        // set a cookie for the temporary user to track their game //
        server.setCookie({
            name: "tempUser",
            value: trackedName,
            path: "/",
            expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24) // a day
        })
    }

    const [existingGame] = (await client.queryObject(`SELECT game_id FROM current_games WHERE username=$1;`, trackedName)).rows
    // console.log('game: ', existingGame)

    if (existingGame) {
        // delete game if exists
        await client.queryObject(`DELETE FROM current_games WHERE username=$1;`, trackedName)
        console.log('deleted existing game for user:', trackedName)        
    } 

    await client.queryObject(`INSERT INTO current_games (username, created_at, updated_at) VALUES ($1, NOW(), NOW());`, trackedName)
    console.log('created game for user:', trackedName)

    // delete old games from current_games    (IMPORTANT CODE FOR LATER)
    await client.queryObject("DELETE FROM current_games WHERE created_at < NOW() - interval '1 day';")

    // delete old temporary users from users
    await client.queryObject("DELETE FROM users WHERE created_at < NOW() - interval '1 day' AND username = email;")
}

export default startGameHandler