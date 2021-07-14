// import {Component} from 'react'
import davidimg from './davidimg.jpg'
import './aboutus.css'

export default function Aboutus(){
    return (
        <div className='whole-team-container'>
            <h1>Meet our team</h1>
            <article>
            <h3 className='name-tag'>David Ingram</h3>
            <img src={davidimg} alt="Image of some of the food the restaurant offers" />
            <p className='descriptions'>Helloing.......Helloing.......Helloing.......Helloing.......</p>
            </article>

        </div>
    )
}