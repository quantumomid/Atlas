import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts' // environment variables

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

// fetches country capital cities
async function countryAndCapital() {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/capital")
    const parsed = await response.json()
    // console.log(parsed.data)
    const countries = parsed.data
    return countries
}

let countries = await countryAndCapital()

// test country letter loop
//countries = [{name: 'France', capital: 'Paris'}, {name: 'Germany', capital: 'Berlin'}, {name: 'UK', capital: 'London'},  {name: 'USA', capital: 'Washington'}]

countries.forEach(async (country) => await client.queryObject("INSERT INTO countries (country_name, capital, created_at) VALUES($1, $2, NOW())", country.name, country.capital))

