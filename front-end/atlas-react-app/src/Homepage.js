import React, { Component } from 'react';
import GlobalScoresBoard from './GlobalScoreBoard';
import PersonalScoreboard from './PersonalScoreboard'
import './Homepage.css'

class Homepage extends Component {
    render() {
      return (
        <div className = 'homepage-container'>
          <div className = 'scoreboards'>
          <GlobalScoresBoard />
          { this.props.isLoggedIn && <PersonalScoreboard /> }
          </div>
        </div>
      )
    }
}

export default Homepage