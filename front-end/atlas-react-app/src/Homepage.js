import React, { Component } from 'react';
import GlobalScoresBoard from './GlobalScoreBoard';
import './Homepage.css';
import PersonalScoreboard from './PersonalScoreboard';
import { Link } from "react-router-dom";

class Homepage extends Component {
    render() {
      return (
        <div className = 'homepage-container'>
          <div className = 'scoreboards'>
          <GlobalScoresBoard />
          { this.props.isLoggedIn ? <PersonalScoreboard /> :
          <div className='game-description'> 
            <ul >
              <li>Can you name every country in the world?</li>
              <li>Play Atlas to find out!</li>
              <li>Play against the computer, naming a new country for the given letter until you can't think of any more</li>
              <li>Test your knowledge on capital cities to earn bonus points</li>
            </ul>
            <Link className='play-link' to='/game'>Play game</Link>
          </div>
           }
          </div>
        </div>
      )
    }
}

export default Homepage