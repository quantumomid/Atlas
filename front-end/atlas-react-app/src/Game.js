import React, { Component } from 'react';

class Game extends Component {
  state = {
    letter: '',
    userInput: '',
    needStart: true,
    isPlayerTurn: true,
    lastLetter: '',
  }

  async callLetter() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/letter`)
    const initialLetter = await response.json()
    console.log(initialLetter.letter)
    this.setState({letter: initialLetter.letter})
  }

  async handleStartGame() {
    await fetch(`${process.env.REACT_APP_API_URL}/game/new`, {
      method: "POST",
      credentials: "include",
    })

    this.callLetter()
    this.setState({needStart: false})
  }

  handleUserInputChange(e) {
    this.setState({userInput: e.target.value})
    // console.log(this.state.userInput)
  }

  async handleSubmitUserCountry(e) {
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
    console.log('correct: ', correct)
    console.log('lastLetter response:', lastLetter)
    this.setState({lastLetter})

    if (correct) {
      // only want to trigger ai turn if player was correct (otherwise ends game)
      this.setState({isPlayerTurn: false})
    }

    // if response is no... don't change isPlayerTurn state (so componentDidUpdate doesn't trigger), and end the game
    
  }

  async componentDidUpdate(_prevProps, prevState) {
    // triggers toggling between player and AI turns

    // only runs when isPlayerTurn state changes (which is when they give a right answer)
    if (this.state.isPlayerTurn !== prevState.isPlayerTurn) {
      if (this.state.isPlayerTurn && !this.state.needStart) {
        // non-first player turns
        console.log('non-first player turn is called')

      } else if (!this.state.isPlayerTurn) {
        // ai turn
        console.log('ai turn is called')
        await this.triggerAiTurn()
      }
    }
  }

  async triggerAiTurn() {
    const {lastLetter} = this.state
    const response = await fetch(`${process.env.REACT_APP_API_URL}/game/ai`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({lastLetter})
    })
    this.setState({isPlayerTurn: true})
  }

  inputError() {
    if (this.state.userInput.length > 60) return "nope"
  }

  render() {
    const { letter, userInput } = this.state

    return (
      <main>
        {this.state.needStart && <button onClick={() => this.handleStartGame()}>Start Game</button>}
        {letter}
        <form>
          <input 
            type = "text" 
            placeholder = "Enter country beginnning with this letter" 
            name="userInput" 
            value={userInput} 
            onChange ={(e) => this.handleUserInputChange(e)}
          />
          <button 
            type = "submit"
            onClick = {(e) => this.handleSubmitUserCountry(e)}
            disabled = {userInput === "" || this.inputError()}
          >
            Submit
          </button>
        </form>
      </main>
    )
  }
}

export default Game