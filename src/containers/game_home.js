import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createRoom} from "../actions";
import fire from '../components/fire';
import {startRound} from "../actions";
import {finishRound} from "../actions";
import {finishVote} from "../actions";
import {updateVote} from "../actions";
import { Navbar, Jumbotron, Button } from 'react-bootstrap';

class RoomHome extends Component {

	constructor(props){
	 	super(props);
	 }

	 componentDidMount(){
	 	this.nextRound();

	 	let roomsRef = fire.database().ref('rooms');
		roomsRef.child(this.props.room).child('definitions').child(this.props.round.round_nb).on('value', snap => {
			var results = [];
  			for (var key in snap.val()) {
    			if (snap.val().hasOwnProperty(key)) {
    				if (snap.val()[key].participant != 'ADMIN'){
    					results.push({
	    					name: snap.val()[key].participant,
	    					definition: snap.val()[key].definition,
	    					votes: snap.val()[key].vote,
	    					correct_vote: snap.val()[key].correct
    					})
    				}
    			}
			}
			if (this.props.round.status == 'voting')
				this.props.updateVote({
					results: results, 
					round_nb: this.props.round.round_nb,
					status: this.props.round.status
				});
		});	

	}

	nextRound() {
		// pick a random word. word here has word, country, and definition
	 	let word = this.props.word[Math.floor(Math.random() * this.props.word.length)];
	 	let round_nb = this.props.round.round_nb +1;
	 	this.renderBar('submitting');
	 	this.props.startRound({
	 		room: this.props.room, 
	 		round_nb: round_nb,
	 		word: word
	 	});
	}

	renderBar(status) {
		var elem = document.getElementById("myBar");   
	  	var width = 100;
	  	var timer = 1000;
	  	if (status == 'voting') 
	  		timer = timer/3;

	  	var id = setInterval(() => {
	    if (width == 0) {
	      clearInterval(id);
	      if (status == 'submitting'){
	      		this.props.finishRound({
		      	round_nb: this.props.round.round_nb,
		      	room: this.props.room,
		      	word: this.props.round.word
		      });
	      }
	      if (status == 'voting'){
	      	this.props.finishVote({
		      	round_nb: this.props.round.round_nb,
		      	room: this.props.room,
		      	word: this.props.round.word
		      });
	      }
	    } else {
	      width--; 
	      elem.style.width = width + '%'; 
	      elem.innerHTML = width * 1;
	    }
	  	}, timer); //ms
	}


	renderResults(){
		if (this.props.results.results == null)
			return <div> No votes! </div>
		return this.props.results.results.map(result => {
			let final_score = result.votes*250 + result.correct_vote*500
			return (
				<div>
					<h2> {result.name} score: {final_score}</h2>
					<ul>
					<li> Definition: {result.definition}</li>
					<li> Votes (x250 pts): {result.votes}</li>
					<li> Correct Vote Bonus (500 pts): {result.correct_vote}</li>
					</ul>
				</div>
			);
		});
	}

	renderWord() {
		var header = '';
		if(this.props.round.status == 'submitting'){
			header = 'The word is: '+ this.props.round.word.word;
			// if (document.getElementById("myBar").attributes.style.value == "width: 0%;")
			// 	this.renderBar('submitting');
		}
		if(this.props.round.status == 'voting'){
			// only rerender if time is out
			if (document.getElementById("myBar").attributes.style.value == "width: 0%;")
				this.renderBar('voting');

			header =  'Get your votes in for round'+this.props.round.round_nb+'!';
		}
		return(
			<div>
				<div id="myProgress" className='my-progress'>
				  <div id="myBar" className='my-bar'>100s</div>
				</div>
				<h1> {header} </h1>
			</div>
		)
	}
	
	render() {	
		return(
			<div className='container'>
			<h1> ROUND: {this.props.round.round_nb} </h1> 
			{this.props.round.round_nb == 4 && <h2> FINAL ROUND: BONUS ROUND! </h2>}
			<ul>{this.renderWord()}</ul>
			{this.props.round.status == 'results' &&
			<div>
				<h1> Results for round {this.props.round.round_nb}: </h1>
				<br/>
				<h2> {this.props.round.word.word} means "{this.props.round.word.definition}" in {this.props.round.word.country}! </h2>
				<br/>
				{this.renderResults()}
				<br/>
				{this.props.round.round_nb != 4 
					&& <Button type="submit" className="btn btn-secondary" onClick={() => this.nextRound()}>Next round!</Button>}
      		</div>
			}
			</div>
		)	
	}
}

function mapStateToProps(state) {
	return {room: state.room,
		word: state.word, 
		round: state.round,
		results: state.results};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({finishRound: finishRound,
		startRound: startRound,
		finishVote: finishVote,
		updateVote: updateVote}, 
		dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomHome);