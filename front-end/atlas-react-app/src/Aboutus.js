import {Component} from 'react'
import davidimg from './davidimg.jpg'
import joannaimg from './joannaimg.jpg'
import guyimg from './guyimg.jpg'
import michaelimg from './michaelimg.jpg'
import omidimg from './omidimg.jpeg'
import AboutMember from './AboutMember'

import './aboutus.css'

const memberDataObject = {
    david: {
        fullName: 'David Ingram',
        image: davidimg,
        description: 'Doctoral (PhD) graduate in Physics from UCL. Fan of Python (Pandas, NumPy, Matplotlib, Seaborn), full stack Javascript, data science/visualisation (SQL), and machine learning. Looking for an opportunity where I can use my technical and analytical expertise to help solve a variety of complex problems, as well as challenge myself to learn and develop new skills. ',
        linkedIn: 'https://uk.linkedin.com/in/david-ingram-2984139b',
        github: 'https://github.com/Dingram23'
    },
    guy: {
        fullName: 'Guy Hotchin',
        image: guyimg,
        description: 'Helloing...'.repeat(30),
        linkedIn: 'htteps.s.s.s',
        github: 'https://github.com/Dingram23'
    },
    joanna: {
        fullName: 'Joanna Hawthorne',
        image: joannaimg,
        description: 'Helloing...'.repeat(30),
        linkedIn: 'https://www.linkedin.com/in/joanna-hawthorne-9685921b1/',
        github: 'https://github.com/joannah62'
    },
    michael: {
        fullName: 'Michael Baugh',
        image: michaelimg,
        description: 'Helloing...'.repeat(30),
        linkedIn: 'https://www.linkedin.com/in/michael-baugh-90126a4b/',
        github: 'https://github.com/mbaugh99'
    },
    omid: {
        fullName: 'Omid Wakili',
        image: omidimg,
        description: 'Helloing...'.repeat(30),
        linkedIn: 'https://uk.linkedin.com/in/omid-wakili-34781b12a',
        github: 'https://github.com/quantumomid'
    },
}

export default class Aboutus extends Component{
    state={
        memberClicked: false,
        memberData: []
    }
    componentDidMount() {
        this.props.setInAboutusStatus()
      }

    handleClick(event){
        const { name } = event.target
        this.setState({
            memberClicked: true,
            memberData: memberDataObject[name]
        })
    }

    handleReset(){
        this.setState({memberClicked: false})
    }
    
    componentWillUnmount() {
        this.props.clearInAboutusStatus()
      }

    render(){
        const allMemberArticles = Object.keys(memberDataObject).map(member => {
            return (
                <article key={memberDataObject[member].fullName} className='container'>
                    <img name={member} src={memberDataObject[member].image} alt="Headshot of David" onClick={(event) => this.handleClick(event)}/>
                    <div>
                        <h3 className='name-tag'>{memberDataObject[member].fullName}</h3>
                    </div>
                </article>
            )})
            
        if(!this.state.memberClicked) {
            return (
                <div className='overall-container'>
                    <h1>Meet our team</h1>
                    <div className='whole-team-container'>
                        {allMemberArticles}
                    </div>
                </div>
            )
        } else{
            return (
                <AboutMember 
                    memberData={this.state.memberData}
                    handleReset={() => this.handleReset()}
                />
            )
        }
    }
}