import React, { Component } from 'react';

class Game extends Component {
  state = {
    letter: '',
    userInput: ''
  }

  async startGame() {
    const response = await fetch(`http://localhost:8080/letter`)
    const initialLetter = await response.json()
    console.log(initialLetter.letter)
    this.setState({letter: initialLetter.letter})
  }

  handleUserChange(e) {
    this.setState({userInput: e.target.value})
    console.log(this.state.userInput)
  }

  async handleSubmitUserCountry(e) {
    e.preventDefault()
    const {userInput, letter} = this.state
    console.log('input: ', userInput)
    const response = await fetch('http://localhost:8080/game', {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({userInput,letter})
    })

    const parsedResp = await response.json()
    console.log('resp: ', parsedResp)
  }

  inputError() {
    if (this.state.userInput.length > 60) return "nope"
  }

  render() {
    const { letter, userInput } = this.state

    return (
      <main>
        <button onClick={() => this.startGame()}>Start game</button>
        {letter}
        <form>
          <input 
            type = "text" 
            placeholder = "Enter country beginnning with this letter" 
            name="userInput" 
            value={userInput} 
            onChange ={(e) => this.handleUserChange(e)}
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