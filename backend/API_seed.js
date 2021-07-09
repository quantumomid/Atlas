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
// countries = [{name: 'France', capital: 'Paris'}, {name: 'Germany', capital: 'Berlin'}, {name: 'Uk', capital: 'London'}]

countries.forEach(async (country) => await client.queryObject("INSERT INTO countries (country_name, capital, created_at) VALUES($1, $2, NOW())", country.name, country.capital))

//let unwantedCountries = ['Bouvet Island', 'Bonaire, Saint Eustatius and Saba ', 'Tokelau', 'Heard Island and McDonald Islands', 'Vatican City State (Holy See)', 'Cocos (Keeling) Islands', 'United States Minor Outlying Islands', 'U.S. Virgin Islands', 'Antarctica' ]
let nonUNCountries = ['Wallis and Futuna', 'Saint Barthelemy', 'Bermuda', 'Bouvet Island', 'Bonaire, Saint Eustatius and Saba ', 'Réunion', 'Tokelau', 'Guam', 'South Georgia and the South Sandwich Islands', 'Guadeloupe', 'Guernsey', 'Greenland', 'Gibraltar', 'Hong Kong', 'Heard Island and McDonald Islands', 'Vatican City State (Holy See)', 'Svalbard and Jan Mayen', 'French Polynesia', 'Pitcairn', 'Saint Pierre and Miquelon', 'Cocos (Keeling) Islands', 'Saint Martin', 'Macau', 'Martinique', 'Northern Mariana Islands', 'Montserrat', 'Isle of Man', 'British Indian Ocean Territory', 'Saint Helena', 'Falkland Islands', 'Faroe Islands', 'New Caledonia', 'Norfolk Island', 'Niue', 'Cook Islands', 'Cocos Islands', 'Christmas Island', 'Curacao', 'Sint Maarten', 'Cayman Islands', 'British Virgin Islands', 'Mayotte', 'United States Minor Outlying Islands', 'French Southern Territories', 'Turks and Caicos Islands', 'Anguilla', 'U.S. Virgin Islands', 'Antarctica', 'American Samoa', 'Aruba', 'Aland Islands', 'Puerto Rico']

// macedonia is now called north macedonia
await client.queryObject(`
    UPDATE countries
    SET country_name = 'North Macedonia'
    WHERE country_name = 'Macedonia'`,
    )

// change palestinian terrotories to palestine
await client.queryObject(`
    UPDATE countries
    SET country_name = 'Palestinian Territory'
    WHERE country_name = 'Palestine'`,
    )

// deleting all countries that aren't on the UNs website of official countries
nonUNCountries.forEach(async (country) => await client.queryObject(`
    DELETE FROM countries
    WHERE country_name = $1`,
    country))


// unwantedCountries.forEach(async (country) => await client.queryObject(`
// DELETE FROM countries
// WHERE country_name = $1`,
// country))