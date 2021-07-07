import { Component } from 'react'
import ScoreBoard from './ScoreBoard.js'

export default class PersonalScoreBoard extends Component{

    state = {
        gameData: []
    }
    
    async componentDidMount(){
        const response = await fetch(`${process.env.REACT_APP_API_URL}/personaltopscores`)
        const { gameData } = await response.json()
        this.setState({gameData})
    }

    render(){
        const { gameData } = this.state
        return (
        <div>
            <h2>Personal Scoreboard</h2>
            {gameData.length === 0 ? <p>No personal scores</p> : <ScoreBoard gameData={gameData} />}
        </div>
        )
    }
} 
