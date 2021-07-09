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
          <h1 className = 'title'>This is the Homepage</h1>
          </section>
          <section className = 'centre'>
          <div className = 'scoreboards'>
          <section className = 'scoreboard'>
          <GlobalScoresBoard />
          </section>
          <section className = 'scoreboard'>
          { this.props.isLoggedIn && <PersonalScoreboard /> }
          </section>
          </div>
          </section>
        </div>
      </div>
      )
    }
}

export default Homepage