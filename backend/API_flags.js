async function countryAndFlag() {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images")
    const parsed = await response.json()
    // console.log(parsed.data)
    const flags = parsed.data
    return flags
}

let flags = await countryAndFlag()

console.log(flags) // 220 country-flag pairs