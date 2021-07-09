import React, { Component } from 'react';
import GameEndScreen from './GameEndScreen';
const timeGiven = 15
class Game extends Component {
  
  
  initialState = {
    letter: '',
    userInput: '',
    needStart: true,
    isPlayerTurn: true,
    lastLetter: '',
    aiCountryChoice: '',
    gameOver: false,
    score: 0,
    time: timeGiven,
  }
  
  state = this.initialState
  
  handleStart() {
    this.timerInterval = setInterval(() => {
        this.setState(prevState => {
            return {time: prevState.time - 1}
        })
    }, 1000)
  }

  handleRestart() {
    clearInterval(this.timerInterval)
    this.setState({time: timeGiven})
    this.handleStart()
  }

  handleLoss() {
    clearInterval(this.timerInterval)
    this.setState({gameOver: true})
  }

  async callLetter() {
    // calls a random letter that a country starts with
    const response = await fetch(`${process.env.REACT_APP_API_URL}/letter`)
    const initialLetter = await response.json()
    console.log(initialLetter.letter)
    this.setState({letter: initialLetter.letter})
  }

  async handleStartGame() {
    // on refresh, you see a start game button
    // on click we call a random letter and hide this button

    await fetch(`${process.env.REACT_APP_API_URL}/game/new`, {
      method: "POST",
      credentials: "include",
    })

    this.callLetter()
    this.setState({needStart: false})
    this.handleStart()
  }

  handleUserInputChange(e) {
    // handles user input to form element
    this.setState({userInput: e.target.value})
    // console.log(this.state.userInput)
  }

  async handleSubmitUserCountry(e) {
    // submits the completed player input to the backend to be checked
    // response marks whether or not the game continues or ends
    
    e.preventDefault()
    const {userInput, letter} = this.state
    console.log('input: ', userInput)
    const response = await fetch(`${process.env.REACT_APP_API_URL}/game`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({userInput, letter})
    })

    const {correct, lastLetter, score} = await response.json()
    // if user input correct, returns true else returns false
    console.log('correct: ', correct)
    // console.log('lastLetter response:', lastLetter)

    // reset the input form to empty and update the lastLetter for the AI turn
    this.setState({lastLetter, userInput: '', score})

    if (correct) {
      // only want to trigger AI turn if player was correct (otherwise ends game)
      this.setState({isPlayerTurn: false})
      this.handleRestart()
    }

    // if response is no... don't change isPlayerTurn state (so componentDidUpdate doesn't trigger), and end the game
    if (!correct) {
      //render endgame
      this.handleLoss()
      
    }
  }

  async triggerAiTurn() {
    // handles the AI turn with the provided lastLetter from user input
    const {lastLetter} = this.state
    const response = await fetch(`${process.env.REACT_APP_API_URL}/game/ai`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({lastLetter})
    })
    //returns country name that AI plays
    const { aiCountryChoice, allCountriesPlayed, letter } = await response.json()

    if (allCountriesPlayed) {
      console.log('game ends due to no more countries')
      this.handleLoss() // if all countries have been played

    } else {
      console.log('ai country pick: ', aiCountryChoice)

      // trigger next player turn, displaying new lastLetter
      this.setState({isPlayerTurn: true, aiCountryChoice, letter})
    }
  }

  async componentDidUpdate(_prevProps, prevState) {
    // handles time running out
    if (this.state.time === 0 && !this.state.gameOver) this.handleLoss()

    // triggers toggling between player and AI turns
    // only runs when isPlayerTurn state changes (which is when they give a right answer)
    if (this.state.isPlayerTurn !== prevState.isPlayerTurn) {
      if (this.state.isPlayerTurn && !this.state.needStart) {
        // non-first player turns (don't actually need to call a function again, player turn called on submit)
        console.log('non-first player turn is called')

      } else if (!this.state.isPlayerTurn) {
        // call AI turn
        console.log('ai turn is called')
        await this.triggerAiTurn()
      }
    }
  }

  handleGameReset() {
    this.setState(this.initialState)
  }

  render() {
    const { needStart, letter, userInput, aiCountryChoice, isPlayerTurn, gameOver, score } = this.state
  
    if (gameOver) return <GameEndScreen
                          currentGameID={0}
                          isLoggedIn={this.props.isLoggedIn}
                          handleGameReset = {() => this.handleGameReset()}
                         />
    
    return (
      <main>
        <h2>Time remaining: {this.state.time}</h2>
        {/* conditionally show flow of game as is appropriate */}
        {needStart && <button onClick={() => this.handleStartGame()}>Start Game</button>}
        {isPlayerTurn && aiCountryChoice && <div>The AI picked {aiCountryChoice}</div>}
        {letter && <div>Name a country beginning with {letter} </div>}
        {!needStart && <div>Your score: {score}</div>}
        <form>
          <input 
            type = "text" 
            placeholder = "Enter country beginning with this letter" 
            name="userInput" 
            value={userInput} 
            onChange ={(e) => this.handleUserInputChange(e)}
            autoComplete = 'off' // prevents browser remembering past inputs (cheating!)
          />
          <button 
            type = "submit"
            onClick = {(e) => this.handleSubmitUserCountry(e)}
            disabled = {userInput === "" || userInput.length > 60}
          >
            Submit
          </button>
        </form>
      </main>
    )
  }
}

export default Game