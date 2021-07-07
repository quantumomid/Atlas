import React, { Component } from 'react';

class Game extends Component {
  state = {
    letter: '',
    userInput: '',
    firstTurn: true,
  }

  async buttonChoice() {
    if (this.state.firstTurn) {
      console.log('first turn')
      // on first turn, DELETE request to game (if it exists from prior session)
      // await fetch(...)

      // then call a new letter
      await this.callLetter()
      this.setState({firstTurn: false})
      

    } else {
      // otherwise, just call a new letter
      console.log('not first turn')
      await this.callLetter()
    }
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
      body: JSON.stringify({userInput,letter})
    })

    const parsedResp = await response.json()
    console.log('resp: ', parsedResp)

    // if response is no... end game
    
  }

  inputError() {
    if (this.state.userInput.length > 60) return "nope"
  }

  render() {
    const { letter, userInput } = this.state

    return (
      <main>
        <button onClick={() => this.buttonChoice()}>Start game</button>
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