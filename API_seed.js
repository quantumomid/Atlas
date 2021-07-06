import { DB } from 'https://deno.land/x/sqlite/mod.ts'

const db = new DB('./atlas.db')

// fetches country capital cities
async function countryAndCapital() {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/capital")
    const parsed = await response.json()
    // console.log(parsed.data)
    const countries = parsed.data
    return countries
}

const countries = await countryAndCapital()

countries.forEach(country => await db.query("INSERT INTO countries (country_name, capital, created_at) VALUES(?, ?, datetime('now'))", [country.name, country.capital]))

// test doing something to each row/country/capital (for input into postgreSQL table)
// capitals.forEach(capital => console.log(capital, 'and'))

