import React, { Component } from 'react';
import GlobalScoresBoard from './GlobalScoreBoard';
import PersonalScoreboard from './PersonalScoreboard'
import './Homepage.css'

class Homepage extends Component {
    render() {
      return (
        <div className = 'homepage'>
          <div className = 'scoreboard-container'>
          <GlobalScoresBoard />
          { this.props.isLoggedIn && <PersonalScoreboard /> }
          </div>
        </div>
      )
    }
}

export default Homepage