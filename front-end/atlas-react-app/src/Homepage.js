import React, { Component } from 'react';
import GlobalScoresBoard from './GlobalScoreBoard';
import PersonalScoreboard from './PersonalScoreboard'
import './Homepage.css'

class Homepage extends Component {
    render() {
      return (
        <div className ='centre'>
        <div className = 'page'>
          <section className = 'centre'>
          <div className = 'scoreboards'>
          <GlobalScoresBoard />
          { this.props.isLoggedIn && <PersonalScoreboard /> }
          </div>
          </section>
        </div>
      </div>
      )
    }
}

export default Homepage