import React, { Component } from 'react';
import GameEndScreen from './GameEndScreen';

class Game extends Component {
  state = {
    letter: '',
    userInput: '',
    needStart: true,
    isPlayerTurn: true,
    lastLetter: '',
    aiCountryChoice: '',
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

    const {correct, lastLetter} = await response.json()
    // if user input correct, returns true else returns false
    console.log('correct: ', correct)
    // console.log('lastLetter response:', lastLetter)

    // reset the input form to empty and update the lastLetter for the AI turn
    this.setState({lastLetter, userInput: ''})

    if (correct) {
      // only want to trigger AI turn if player was correct (otherwise ends game)
      this.setState({isPlayerTurn: false})
    }

    // TO DO: if response is no... don't change isPlayerTurn state (so componentDidUpdate doesn't trigger), and end the game
    if (!correct) {
      //render endgame
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
    const { aiCountryChoice } = await response.json()
    console.log('ai country pick: ', aiCountryChoice)

    // trigger next player turn, displaying new lastLetter
    this.setState({isPlayerTurn: true, aiCountryChoice, letter: aiCountryChoice.slice(-1).toUpperCase()})
  }

  async componentDidUpdate(_prevProps, prevState) {
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

  render() {
    const { needStart, letter, userInput, aiCountryChoice, isPlayerTurn, gameOver } = this.state
  
    if (gameOver) return <GameEndScreen
                          score={0}
                          isLoggedIn={this.props.isLoggedIn}
                         />
    
    return (
      <main>
        {/* conditionally show flow of game as is appropriate */}
        {needStart && <button onClick={() => this.handleStartGame()}>Start Game</button>}
        {isPlayerTurn && aiCountryChoice && <div>The AI picked {aiCountryChoice}</div>}
        {letter && <div>Name a country beginning with {letter} </div>}
        <form>
          <input 
            type = "text" 
            placeholder = "Enter country beginnning with this letter" 
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