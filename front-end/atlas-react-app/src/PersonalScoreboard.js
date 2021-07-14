import { Component } from 'react'
import ScoreBoard from './ScoreBoard.js'

export default class PersonalScoreBoard extends Component{

    state = {
        gameData: []
    }
    
    async componentDidMount(){
        this.fetchScores()
    }

    async fetchScores() {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/personaltopscores`,
            {
                credentials: 'include'
            })
        const { gameData } = await response.json()
        this.setState({gameData})
    }

    async componentDidUpdate(prevProps) {
        if (this.props.score !== prevProps.score) this.fetchScores()
    }

    render(){
        const { gameData } = this.state
        return (
        <div className = 'scoreboard' >
            <h2>Personal Scoreboard</h2>
            <div>
            {gameData.length === 0 ? <p>No personal scores</p> : <ScoreBoard gameData={gameData} personal={true} />}
            </div>
        </div>
        )
    }
} 
