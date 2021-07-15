# Atlas: Group Project

In the final two weeks of the Sigma Labs traning, students were assigned to various group projects, one of which was the Atlas project. The Atlas team consisted of five members: David Ingram, Guy Hotchin, Joanna Hawthorne, Michael Baugh and Omid Wakili. 

Our motivation behind the project was to build an enjoyable game, which would challenge the player's knowledge of the countries of the world.

### How does the game work?

In its simplest form, between two players, player 1 is presented with a random letter of the alphabet. PLayer 1 has to name a country beginning with that letter. Player 2, in turn, has to name a country, which begins with the final letter of player 1's response. The two players then continue, in turn, each one naming another country beginning with the other's last letter. Failure to name a country results in loss of a player. 

In our first implementation, the user would be playing against the computer. The user would gain points for every correct country they can name, and they would lose if they fail to do so. The user could play as a guest, or sign up and login. As a logged in user, the player can keep track of their previous scores in a personal scoreboard. There is also a global scoreboard keeping track of the scores of all players on the site. 

In our second iteration, following correct naming of a country, the user then also has the option to the name the capital city of the said country. The user can skip this or take on this challenge for extra points! However, getting the capital city wrong would result in loss!

Some design decisions with regards to the game play:
-Timed turns: the user has to return a response within a specified (i.e. 15 seconds) time period
-All countries named: if all countries have been named then the game finished and the user scores are tallied up
-No choices left for letter: if all countries beginning with a specific letter have been named, then the user presented with such a letter has to instead name a country beginning with the next letter of the alphabet following said letter
-Incorrect naming of country or capital city (including misspellings) results in loss of game


## Data Architecture: How we set up our database

## Backend: How we set up our backend

### Deployment

For our backend, we used heroku...........

## Frontend: How we set up our frontend

### Deployment

For our frontend, we used netlify...........