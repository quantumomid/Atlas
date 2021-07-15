import React, { Component } from 'react';
import GameEndScreen from './GameEndScreen';
import './Game.css'
import ReactCountdownClock from 'react-countdown-clock';

const timeGiven = 15
const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

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
    correctCity: '',
    flag: ''
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
    this.setState({time: timeGiven})
    this.handleStart()
  }

  handleLoss() {
    //trigger end game page
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
    clearInterval(this.timerInterval)

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

    const {correct, lastLetter, score, flag} = await response.json()
    // if user input correct, returns true else returns false
    console.log('correct: ', correct)
    // console.log('lastLetter response:', lastLetter)

    // reset the input form to empty and update the lastLetter for the AI turn
    this.setState({lastLetter, score})

    if (correct) {
      // only want to trigger AI turn if player was correct (otherwise ends game)
      this.setState({letter: '✓', flag})
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
    clearInterval(this.timerInterval)
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
      clearInterval(this.timerInterval)
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

  handleSkip() {
    this.setState({isPlayerTurn: false, showCapitalCityQuestion: false, userInput: '', userInputCity: ''})
    clearInterval(this.timerInterval)
    this.handleRestart()
  }

  render() {
    const { needStart, letter, userInput, userInputCity, aiCountryChoice, isPlayerTurn, gameOver, time, score, allMatches, aiLooped, nextPlayerLooped, showCapitalCityQuestion, correctCity } = this.state
    const numbers = [0,1,2,3,4,5,6,7,8,9]
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
        {needStart && <div className="start-instructions">
          <h3>Welcome to Atlas game!</h3>
          <p>
            On clicking start game, the AI will provide you with a random letter. <br />
            For ten points, you will need to <span className="instruction-correct">enter the name of a country beginning with that letter</span>. <br />
            If you are correct, you can then <span className="instruction-correct">enter the name of that country's capital city</span> for a bonus five points, <span className="instruction-correct">or skip</span> if you aren't sure.<br />
            The AI will then pick a country that starts with the last letter of your chosen country.<br />
            You then guess again, for the last letter of the AI's pick.
          </p>
          <p>
            Any <span className="instruction-error">incorrect answers</span>, or <span className="instruction-error">picking a country that has already been played by you or the AI</span>, will <span className="instruction-error">lead to game over!</span><br />
            If there are no remaining countries starting with a letter, we move on to the next letter in the alphabet instead, repeating until all 201 countries have been played.<br />
          </p>
          <p>
            <span className="instruction-error">Don't let the timer run out</span> or it's game over!
          </p>
          <h3>
            Have fun!
          </h3>
        </div>}
        <div className="start-button-container">
          {needStart && <button onClick={() => this.handleStartGame()}>Start Game</button>}
        </div>
        <div className = 'game-container'>
        {!needStart && <section className="top-game-bar">
            <div className = 'timer'>Time remaining
              {/* <div>{this.state.time}</div> */}
              {isPlayerTurn && !showCapitalCityQuestion && <div className = 'game-clock-container'>
                <ReactCountdownClock
                seconds={15}
                color="#34778D"
                alpha={0.9}
                size={100}
                />
              </div>}
              {showCapitalCityQuestion && <div className = 'game-clock-container'>
                <ReactCountdownClock
                seconds={15}
                color="#34778D"
                alpha={0.9}
                size={100}
                />
              </div>}
            </div>
            {/* conditionally show flow of game as is appropriate */}
            <div className="player-score"> Score:
              <span>{score}</span>
            </div>
          </section>}
          { !needStart && <div className="letter-question-container">
            <div className="question-container">
              {(isPlayerTurn && aiCountryChoice && aiLooped & !showCapitalCityQuestion) || (letter && nextPlayerLooped && !showCapitalCityQuestion) ? <div className="ai-response">No more countries beginning with that last letter!</div> : <div />}
              {isPlayerTurn && aiCountryChoice && !showCapitalCityQuestion ? <div className="ai-response">The AI picked {aiCountryChoice}</div> : <div />}
              {/* {letter && nextPlayerLooped && !showCapitalCityQuestion ? <div className="ai-response">No more countries beginning with the AI's last letter!</div> : <div />} */}
              {letter && !showCapitalCityQuestion ? <div className="main-question">Name a country beginning with:</div> : <div>For bonus points, name the capital city of {formatUserGameInput(userInput)}</div>}
              </div>
              {showCapitalCityQuestion ? 
              <div style={{ 
                    backgroundImage: `url(${this.state.flag})`, color:'white' }} 
                    className="letter"
                  >
                    {letter}
              </div>
              :
              <div className="letter">{letter}</div>
              }
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
                  autoFocus={true}
                />
                <button className="game-submit"
                  type = "submit"
                  onClick = {(e) => this.handleSubmitUserCountry(e)}
                  disabled = {numbers.some(number => userInput.includes(number)) || userInput === "" || !userInput.toLowerCase().split('').some(character => alphabet.includes(character)) || userInput.length > 60}
                >
                  Submit
                </button>
              </form> }
              {/* optional capital city question: */}
              {showCapitalCityQuestion && <form className="game-input-container">
                <input className="game-input-bar"
                  type = "text" 
                  placeholder = {`Name the capital city of ${formatUserGameInput(userInput)}`}
                  name="userInputCity" 
                  value={userInputCity} 
                  onChange ={(e) => this.handleUserInputChange(e)}
                  autoComplete = 'off'
                  autoFocus={true}
                />
                <button className="game-submit"
                  type = "submit"
                  onClick = {(e) => this.checkCapitalCity(e)}
                  disabled = {numbers.some(number => userInputCity.includes(number)) || userInputCity === "" || !userInputCity.toLowerCase().split('').some(character => alphabet.includes(character)) || userInputCity.length > 60}
                >
                  Submit
                </button>
                <button className="game-skip"
                    onClick={() => this.handleSkip()}
                  >
                    Skip
                </button>
              </form>  }
            </section>
        </div>
     </main>
    )
  }
}

export default Game

function formatUserGameInput(userInput) {
  if (!userInput) return
  // hard codes capitalisation for all inputs, accounting for those with 'of', 'the' and 'and' (all edge cases)
  userInput = userInput.toLowerCase()
  userInput = userInput.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  userInput = userInput.split('').filter(elem => alphabet.includes(elem) || elem === '-' || elem === ' ').join('')
  userInput = userInput.trim()
  const nonCapitalizedWords = ['and', 'of', 'the', 'au', 'la']
  userInput = userInput.split(' ').map(word => nonCapitalizedWords.includes(word) ? word : word[0].toUpperCase() + word.slice(1)).join(' ')
  userInput = userInput.split('-').map(word => nonCapitalizedWords.includes(word) ? word : word[0].toUpperCase() + word.slice(1)).join('-')
  return userInput
}