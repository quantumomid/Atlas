import React, { Component } from 'react';
import GameEndScreen from './GameEndScreen';
import './css_styling.css'

const timeGiven = 150

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
    allMatches: []
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

    let {correct, lastLetter, score, allMatches} = await response.json()
    allMatches = allMatches ? allMatches : []
    // if user input correct, returns true else returns false
    console.log('correct: ', correct)
    // console.log('lastLetter response:', lastLetter)

    // reset the input form to empty and update the lastLetter for the AI turn
    this.setState({lastLetter, userInput: '', score})

    if (correct) {
      // only want to trigger AI turn if player was correct (otherwise ends game)
      this.setState({letter: '✓'})
      this.correctTimeout = setTimeout(() => {
          this.setState({isPlayerTurn: false})
          this.handleRestart()
          this.correctTimeout = 0
        }, 1000)      
    }

    // if response is no... don't change isPlayerTurn state (so componentDidUpdate doesn't trigger), and end the game
    if (!correct) {
      //render endgame
      this.setState({letter: 'X'})
      this.setState({allMatches})
      this.incorrectTimeout = setTimeout(() => {
          this.handleLoss()
          this.incorrectTimeout = 0
        }, 1000)
      console.log('allMatches: ', allMatches)
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
    console.log(allCountriesPlayed) //undefined
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

  async componentWillUnmount() {
    clearInterval(this.timerInterval)
    clearTimeout(this.correctTimeout)
    clearTimeout(this.incorrectTimeout)
  }

  handleGameReset() {
    this.setState(this.initialState)
  }

  render() {
    const { needStart, letter, userInput, aiCountryChoice, isPlayerTurn, gameOver, score, allMatches } = this.state
  
    if (gameOver) return <GameEndScreen
                          currentGameID={0}
                          isLoggedIn={this.props.isLoggedIn}
                          handleGameReset = {() => this.handleGameReset()}
                          allMatches = {allMatches}
                         />
    
    return (
      <div className = 'centre'>
      <section className="top-game-bar">
          {!needStart && <div className = 'timer'>Time remaining: {this.state.time}</div>}
          {/* conditionally show flow of game as is appropriate */}
          {isPlayerTurn && aiCountryChoice && <div>The AI picked {aiCountryChoice}</div>}
          {!needStart && <div>Your score: {score}</div>}
        </section>
      <main className = 'page'>
        <div className="start-button-container">
        {needStart && <button onClick={() => this.handleStartGame()}>Start Game</button>}
        </div>
        <div className="letter-question-container">
        {letter && <div>Name a country beginning with:</div>}
        <div className="letter">{letter}</div>

        {/* <GivenLetter letter={letter}/> */}
        </div>
        <section>
          <form className = 'gameform'>
            <section>
            <input 
              type = "text" 
              placeholder = "Enter country beginning with this letter" 
              name="userInput" 
              value={userInput} 
              onChange ={(e) => this.handleUserInputChange(e)}
              autoComplete = 'off' // prevents browser remembering past inputs (cheating!)
            />
            </section>
            <section>
            <button
              type = "submit"
              onClick = {(e) => this.handleSubmitUserCountry(e)}
              disabled = {userInput === "" || userInput.length > 60 || needStart}
            >
              Submit
            </button>
            </section>
          </form>
        </section>
      </main>
     </div>
    )
  }
}

export default Game