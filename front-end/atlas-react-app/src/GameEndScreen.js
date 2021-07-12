import { Component } from "react";
import PersonalScoreBoard from "./PersonalScoreboard";
import Registration from "./Registration";
import './GameEndScreen.css'

class GameEndScreen extends Component {

    state = {
        score: 0,
        playedCountryArray: []
    }

    async componentDidMount() {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/endgamedata`,
            {
                method: 'POST',
                credentials: 'include'
            }
        )
        const { score, playedCountryArray } = await response.json()
        this.setState({score, playedCountryArray})
    }

    renderCountriesList(countryList) {
        const countryListElems = countryList.map((country, i) => <p key={i}>{country}</p>)
        return (
            <ul className='country-list'>
                {countryListElems}
            </ul>
        )
    }

    render() {
        const { isLoggedIn, allMatches } = this.props
        console.log('in end screen allMatches: ', allMatches)
        const { score, playedCountryArray } = this.state
        return (
            <div className='endgame-page'>
                <div className='register-or-scoreboard'>
                    {isLoggedIn ? 
                    <PersonalScoreBoard 
                    score={score} /> 
                    : (
                        <div className='end-game-register'>
                            <h2>Register to save your score</h2>
                            <Registration
                            saveScore={true}
                            />
                        </div>
                    )}
                </div>
                <div className='score-and-replay'>
                    <h2>Final Score</h2>
                    <p className='final-score'>{score}</p>
                    <button onClick={() => this.props.handleGameReset()}> Play again</button>
                </div>
                <div className='countries-played-and-could-container'>
                    {playedCountryArray.length !== 0 && 
                    <div>
                        <h2>Your played countries</h2>
                        {this.renderCountriesList(playedCountryArray)}
                    </div>}
                    { allMatches.length !== 0 && 
                    <div>
                        <h2>You could have played these!</h2>
                        {this.renderCountriesList(allMatches)}
                    </div>}
                </div>
            </div>
        )
    }
}

export default GameEndScreen