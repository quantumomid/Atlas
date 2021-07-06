import React, { Component } from 'react';

class Game extends Component {
  state = {
    letter: ''
  }

  async startGame() {
    const response = await fetch(`http://localhost:8080/letter`)
    const initialLetter = await response.json()
    console.log(initialLetter.letter)
    this.setState({letter: initialLetter.letter})
  }


  render() {
    const { letter } = this.state
    return (
      <main>
        <button onClick={() => this.startGame()}>Start game</button>
        {letter}
      </main>
    )
  }
}

export default Game