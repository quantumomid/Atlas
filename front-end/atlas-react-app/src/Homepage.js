import React, { Component } from 'react';
import GlobalScoresBoard from './GlobalScoreBoard';
import PersonalScoreboard from './PersonalScoreboard'

class Homepage extends Component {
    render() {
      return (
        <div>
          <h1>This is the Homepage</h1>
          <GlobalScoresBoard />
          { this.props.isLoggedIn && <PersonalScoreboard /> }
        </div>
      )
    }
}

export default Homepage