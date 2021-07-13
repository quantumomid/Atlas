import { Component } from "react";
import PersonalScoreBoard from "./PersonalScoreboard";
import Registration from "./Registration";
import './GameEndScreen2.css'

class GameEndScreen extends Component {

    state = {
        score: 0,
        playedCountryArray: [],
        finalCountry: ''
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
        let finalCountry
        if (this.props.time !== 0) finalCountry = playedCountryArray.pop()
        this.setState({score, playedCountryArray, finalCountry})
    }

    renderReasonForLoss() {
        const { playedCountryArray, finalCountry} = this.state
        if (this.props.time === 0) {
            return <h2>You ran out of time!</h2>
        } else {
            return (
            <div className="final-input-container">
                <h2>Your final played country was {finalCountry}</h2>
                {playedCountryArray.includes(finalCountry) ? 
                <h2>This country has already been played!</h2> :
                <h2>That is not a valid country!</h2>}
            </div> 
            )
        }
        
    }

    renderCountriesList(countryList) {
        const countryListElems = countryList.map((country, i) => <li key={i}>{country}</li>)
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
                    {this.renderReasonForLoss()}
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