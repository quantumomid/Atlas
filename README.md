# Atlas: Group Project

In the final two weeks of the Sigma Labs traning, students were assigned to various group projects, one of which was the Atlas project. The Atlas team consisted of five members: David Ingram, Guy Hotchin, Joanna Hawthorne, Michael Baugh and Omid Wakili. 

Our motivation behind the project was to build an enjoyable game, which would challenge the player's knowledge of the countries of the world.

### How does the game work?

In its simplest form, between two players, player 1 is presented with a random letter of the alphabet. PLayer 1 has to name a country beginning with that letter. Player 2, in turn, has to name a country, which begins with the final letter of player 1's response. The two players then continue, in turn, each one naming another country beginning with the other's last letter. Failure to name a country results in loss of a player. 

In our first implementation, the user would be playing against the computer. The user would gain points for every correct country they can name, and they would lose if they fail to do so. The user could play as a guest, or sign up and login. As a logged in user, the player can keep track of their previous scores in a personal scoreboard. There is also a global scoreboard keeping track of the scores of all players on the site. 

In our second iteration, following correct naming of a country, the user then also has the option to the name the capital city of the said country. The user can skip this or take on this challenge for extra points! However, getting the capital city wrong would result in loss!

Some design decisions with regards to the game play:
- Timed turns: the user has to return a response within a specified (i.e. 15 seconds) time period
- Scoring: 10 points for naming a country correctly and 5 points for naming the capital city correctly
- All countries named: if all countries have been named then the game finished and the user scores are tallied up
- No choices left for letter: if all countries beginning with a specific letter have been named, then the user presented with such a letter has to instead name a country beginning with the next letter of the alphabet following said letter
- Incorrect naming of country or capital city (including misspellings) results in loss of game
- Played countries: at the end of the game, the user can view the list of countries that were played during the game
- Possible countries: at the end of the game, the user can view a list of possible countries which they could have played
- Correct capital city: at the end of the game, a user who incorrectly named a capital city and view the correct response


## Data Architecture: How we set up our database

In the first few days of the project, we began by setting up our database using SQLite due to our better understanding of the library. However, following some well-recieved feedback from our coach, the team then swiftly moved on to using PostgreSQL instead. This was, in part, to avoid any later complications that could have resulted by switching from SQLite to PostgreSQL.

In our database schema, we decided on using five tables:
- countries
- users
- sessions
- current_games
- finished_games

### Countries data
When it came to the data for all of the countries and their capital cities, we decided to use the [countries-now-space](https://countriesnow.space) API. This API was chosen because it provided more commonly known colloquial names of the countries, instead of their strictly official names, which many English speaking users may not be aware of. 

One of the issues that the team had to address was whether to include all countries included in the API, such as Greenland, the Réunion island, etc. We decided to use the United Nations [member states](https://www.un.org/en/about-us/member-states) as a guide to deciding which countries to include. 

We also decided to change the name of a few countries to their more commonly-known or most-latest accepted names, i.e. North Macedonia (insead of Macedonia), or Palestine (instead of Palestinian Territory).

## Backend: How we set up our backend

### Deployment

For our backend, we used heroku...........

## Frontend: How we set up our frontend

### Deployment

For our frontend, we used netlify...........