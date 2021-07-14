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
        description: 'Helloing.......Helloing.......Helloing.......Helloing.......',
        linkedIn: 'htteps.s.s.s',
    },
    guy: {
        fullName: 'Guy Hotchin',
        image: guyimg,
        description: 'Helloing.......Helloing.......Helloing.......Helloing.......',
        linkedIn: 'htteps.s.s.s',
    },
    joanna: {
        fullName: 'Joanna Hawthorne',
        image: joannaimg,
        description: 'Helloing.......Helloing.......Helloing.......Helloing.......',
        linkedIn: 'htteps.s.s.s',
    },
    michael: {
        fullName: 'Michael Baugh',
        image: michaelimg,
        description: 'Helloing.......Helloing.......Helloing.......Helloing.......',
        linkedIn: 'htteps.s.s.s',
    },
    omid: {
        fullName: 'Omid Wakili',
        image: omidimg,
        description: 'Helloing.......Helloing.......Helloing.......Helloing.......',
        linkedIn: 'htteps.s.s.s',
    },
}

export default class Aboutus extends Component{
    state={
        memberClicked: false,
        memberData: []
    }

    handleClick(event){
        const { name } = event.target
        this.setState({
            memberClicked: true,
            memberData: memberDataObject[name]
        })
    }

    render(){
        if(!this.state.memberClicked) {
            return (
                <div className='overall-container'>
                <h1>Meet our team</h1>
                <div className='whole-team-container'>
                
                <article className='container'>
                <img name='david' src={davidimg} alt="Headshot of David" onClick={(event) => this.handleClick(event)}/>
                <div>
                <h3 className='name-tag'>David Ingram</h3>
                <p className='descriptions'>Helloing.......Helloing.......Helloing.......Helloing.......</p>
                </div>
                </article>
    
                <article className='container'>
                <img name='joanna' src={joannaimg} alt="Headshot of Joanna" onClick={(event) => this.handleClick(event)}/>
                <div>
                <h3 className='name-tag'>Joanna Hawthorne</h3>
                <p className='descriptions'>Hello.......Helloing.......Helloing.......Helloing.......</p>
                </div>
                </article>
    
                <article>
                <img name='guy' src={guyimg} alt="Headshot of Guy" onClick={(event) => this.handleClick(event)}/>
                <div>
                <h3 className='name-tag'>Guy Hotchin</h3>
                <p className='descriptions'>Helloing.......Helloing.......Helloing.......Helloing.......</p>
                </div>
                </article>
    
                <article>
                <img name='michael' src={michaelimg} alt="Headshot of Michael" onClick={(event) => this.handleClick(event)}/>
                <div>
                <h3 className='name-tag'>Michael Baugh</h3>
                <p className='descriptions'>Helloing.......Helloing.......Helloing.......Helloing.......</p>
                </div>
                </article>
    
                <article>
                <img name='omid' src={omidimg} alt="Headshot of Omid" onClick={(event) => this.handleClick(event)}/>
                <div>
                <h3 className='name-tag'>Omid Wakili</h3>
                <p className='descriptions'>Helloing.......Helloing.......Helloing.......Helloing.......</p>
                </div>
                </article>
                </div>
            </div>
            )
        } else{
            return <AboutMember memberData={this.state.memberData}/>

        }
    }
}