import { Component } from "react";
import PersonalScoreBoard from "./PersonalScoreboard";
import Registration from "./Registration";

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

    render() {
        const { isLoggedIn } = this.props
        const { score, playedCountryArray } = this.state
        return (
            <div>
                {isLoggedIn ? <PersonalScoreBoard /> : (
                    <div>
                        <h2>Register to save your score</h2>
                        <Registration
                        saveScore={true}
                        />
                    </div>
                )}
                <div>
                    <h2>Your final score</h2>
                    <p>{score}</p>
                </div>
                <div>
                    <h2>Your played countries</h2>
                    <p>{playedCountryArray}</p>
                </div>
                <button onClick={() => this.props.handleGameReset()}> Play again</button>
            </div>
        )
    }
}

export default GameEndScreen