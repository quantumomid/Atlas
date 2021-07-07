import React, { Component } from 'react';

class Game extends Component {
  state = {
    letter: '',
    userInput: '',
    needStart: true,
  }

  async callLetter() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/letter`)
    const initialLetter = await response.json()
    console.log(initialLetter.letter)
    this.setState({letter: initialLetter.letter})
  }

  handleUserInputChange(e) {
    this.setState({userInput: e.target.value})
    console.log(this.state.userInput)
  }

  async handleStartGame() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/game/new`, {
      method: "POST",
      credentials: "include",
    })

    this.callLetter()
    this.setState({needStart: false})
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

    const {correct} = await response.json()
    console.log('resp: ', correct)

    // if response is no... end game
    
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