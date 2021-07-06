import { DB } from 'https://deno.land/x/sqlite/mod.ts'

const db = new DB('./atlas.db')

const letterGenHandler = async (server) => {
    // handles returning a random letter that a country in our countries table starts with
    // NOTE: doesn't take into account countries being unique yet

    const letters = await [...db.query(`SELECT SUBSTR(country_name, 1, 1) AS letter
                                        FROM countries
                                        GROUP BY letter;`)]

    // postgreSQL version:
    // const letters = await [...db.query(`SELECT SUBSTRING(country_name, 1, 1) AS letter
    //                                     FROM countries
    //                                     GROUP BY letter;`)]                                        
    
    // console.log(letters)

    const [letter] = letters[Math.floor(Math.random() * letters.length)]

    // console.log(letter)

    await server.json({ letter })
}



export default letterGenHandler