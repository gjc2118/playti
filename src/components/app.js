import React, { Component } from 'react';
import fire from './fire';
import {browserHistory} from 'react-router';
import {BrowserRouter as Router, 
  Link} from 'react-router-dom';

// import RoomHome from '../containers/room_home'
//https://react-bootstrap.github.io/components.html


export default class App extends Component {

  render() {
    return (
    <div className='container'>
          <h1>Welcome to Playtii. </h1>
          <br></br>
          <Link className = "btn btn-primary" to='/home'>
              Create new room
          </Link>
           <Link className = "btn btn-info" to='/join'>
              Enter existing room
          </Link>
      </div>
    
    );
  }

}
