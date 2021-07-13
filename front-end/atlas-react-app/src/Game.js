import React, { Component } from 'react';
import GameEndScreen from './GameEndScreen';
import './Game.css'


const timeGiven = 15

class Game extends Component {  
  
  initialState = {
    letter: '',
    userInput: '',
    userInputCity: '',
    needStart: true,
    isPlayerTurn: true,
    lastLetter: '',
    aiCountryChoice: '',
    showCapitalCityQuestion: false,
    gameOver: false,
    score: 0,
    time: timeGiven,
    allMatches: [],
    aiLooped: false,
    nextPlayerLooped: false,
    correctCity: ''
  }
  
  state = this.initialState

  componentDidMount() {
    this.props.setInGameStatus()
  }
  
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
    //trigger end game page
    clearInterval(this.timerInterval)
    this.setState({gameOver: true})
  }

  async getAllMatches() {
    //get possible solutions to display on end game page
    const {letter} = this.state
    const response = await fetch(`${process.env.REACT_APP_API_URL}/getmatches`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({letter})
    })
    const {allMatches} = await response.json()
    console.log('allMatches: ', allMatches)
    this.setState({allMatches})
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

    const { name, value } = e.target

    this.setState({[name]: value})
    console.log(name, value)
    // this.setState({userInput: e.target.value})
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
    this.setState({lastLetter, score})

    if (correct) {
      // only want to trigger AI turn if player was correct (otherwise ends game)
      this.setState({letter: '✓'})
      this.correctTimeout = setTimeout(() => {
          this.setState({showCapitalCityQuestion: true, letter:'?'})
          this.handleRestart()
          this.correctTimeout = 0
        }, 1000)      
    }

    // if response is no... don't change isPlayerTurn state (so componentDidUpdate doesn't trigger), and end the game
    if (!correct) {

      this.getAllMatches()
      //render endgame
      this.setState({letter: '✗'})
      // this.setState({allMatches})
      this.incorrectTimeout = setTimeout(() => {
          this.handleLoss()
          this.incorrectTimeout = 0
        }, 1000)
    }
  }

  async checkCapitalCity(e) {
    e.preventDefault()
    const { userInputCity } = this.state
    console.log(userInputCity)
    const response = await fetch(`${process.env.REACT_APP_API_URL}/game/city`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({userInputCity})
    })

    const { isCorrectCity, correctCity, score } = await response.json()
    console.log('isCorrectCity: ', isCorrectCity)
    console.log('score from cap city: ', score)

    if (isCorrectCity) {
      this.setState({letter: '✓', score})
      this.correctTimeout = setTimeout(() => {
          this.setState({isPlayerTurn: false, userInputCity: '', userInput: '', showCapitalCityQuestion: false})
          this.handleRestart()
          this.correctTimeout = 0
        }, 1000) 

    } else {
      this.getAllMatches()
      this.setState({letter: '✗', correctCity})
      this.incorrectTimeout = setTimeout(() => {
          this.handleLoss()
          this.incorrectTimeout = 0
        }, 1000)
      // something to do with correctCity
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
    const { aiCountryChoice, allCountriesPlayed, letter, aiLooped, nextPlayerLooped } = await response.json()
    // console.log('aiLooped: ', aiLooped, 'nextPlayerLooped: ', nextPlayerLooped)

    // console.log(allCountriesPlayed) //undefined
    if (allCountriesPlayed) {
      console.log('game ends due to no more countries')
      this.handleLoss() // if all countries have been played

    } else {
      console.log('ai country pick: ', aiCountryChoice)

      // trigger next player turn, displaying new lastLetter
      this.setState({isPlayerTurn: true, aiCountryChoice, letter, aiLooped, nextPlayerLooped})
    }
  }

  async componentDidUpdate(_prevProps, prevState) {
    // handles time running out
    if (this.state.time === 0 && !this.state.gameOver) {
      this.getAllMatches()
      this.handleLoss()
    }
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
    this.props.clearInGameStatus()
  }

  handleGameReset() {
    this.setState(this.initialState)
  }

  render() {
    const { needStart, letter, userInput, userInputCity, aiCountryChoice, isPlayerTurn, gameOver, time, score, allMatches, aiLooped, nextPlayerLooped, showCapitalCityQuestion, correctCity } = this.state
  
    if (gameOver) return <GameEndScreen
                            currentGameID={0}
                            isLoggedIn={this.props.isLoggedIn}
                            handleGameReset = {() => this.handleGameReset()}
                            allMatches = {allMatches}
                            time={time}
                            correctCity={correctCity}
                            userInputCity={userInputCity}
                         />
    
    return (
      <main className = 'game-page'>
        <div className="start-button-container">
          {needStart && <button onClick={() => this.handleStartGame()}>Start Game</button>}
        </div>
        <div className = 'game-container'>
        {!needStart && <section className="top-game-bar">
            <div className = 'timer'>Time remaining:
              <div>{this.state.time}</div>
            </div>
            {/* conditionally show flow of game as is appropriate */}
            <div className="player-score">Your score: 
              <div>{score}</div>
            </div>
          </section>}
          {isPlayerTurn && aiCountryChoice && aiLooped ? <div className="ai-response">No more countries beginning with that last letter!</div> : <div className="ai-response-placeholder" />}
          {isPlayerTurn && aiCountryChoice ? <div className="ai-response">The AI picked {aiCountryChoice}</div> : <div className="ai-response-placeholder" />}
          { !needStart && <div className="letter-question-container">
            {letter && nextPlayerLooped ? <div className="ai-response">No more countries beginning with the AI's last letter!</div> : <div className="ai-response-placeholder" />}
            {letter && !showCapitalCityQuestion && <div>Name a country beginning with:</div>}
            <div className="letter">{letter}</div>
          </div> }
          <section>
            {!needStart && !showCapitalCityQuestion && <form className="game-input-container">
                <input className="game-input-bar"
                  type = "text" 
                  placeholder = "Enter country beginning with this letter" 
                  name="userInput" 
                  value={userInput} 
                  onChange ={(e) => this.handleUserInputChange(e)}
                  autoComplete = 'off' // prevents browser remembering past inputs (cheating!)
                />
                <button className="game-submit"
                  type = "submit"
                  onClick = {(e) => this.handleSubmitUserCountry(e)}
                  disabled = {userInput === "" || userInput.length > 60}
                >
                  Submit
                </button>
              </form> }
            {/* optional capital city question: */}
            {showCapitalCityQuestion && <div><form className="game-input-container">
              <input className="game-input-bar"
                type = "text" 
                placeholder = {`For a bonus point, name the capital city of ${userInput}`}
                name="userInputCity" 
                value={userInputCity} 
                onChange ={(e) => this.handleUserInputChange(e)}
                autoComplete = 'off' 
              />
              <button className="game-submit"
                type = "submit"
                onClick = {(e) => this.checkCapitalCity(e)}
                disabled = {userInputCity === "" || userInputCity.length > 60}
              >
                Submit
              </button>
            </form> 
            <button
              onClick={() => this.setState({isPlayerTurn: false, showCapitalCityQuestion: false, userInput: '', userInputCity: ''})}
            >
              Skip
            </button></div> }
          </section>
      </div>
     </main>
    )
  }
}

export default Game