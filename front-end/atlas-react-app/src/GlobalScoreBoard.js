import { Component } from 'react'
import ScoreBoard from './ScoreBoard.js'

export default class globalScoresBoard extends Component{

    state = {
        gameData: []
    }
    
    async componentDidMount(){
        const response = await fetch(`${process.env.REACT_APP_API_URL}/globalscores`)
        const { gameData } = await response.json()
        this.setState({gameData})
    }

    render(){
        const { gameData } = this.state
        return (
        <div>
            <h2>Global Scoreboard</h2>
            {gameData.length === 0 ? <p>No global scores</p> : <ScoreBoard gameData={gameData} />}
        </div>
        )
    }
} 

