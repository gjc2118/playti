import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createRoom} from "../actions";
import fire from '../components/fire';
import {startRound} from "../actions";
import {finishRound} from "../actions";
import {finishVote} from "../actions";
import {updateVote} from "../actions";
import {postResults} from "../actions";
import {updateScore} from "../actions";
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
import SweetAlert from 'sweetalert2-react';

class RoomHome extends Component {

	constructor(props){
	 	super(props);
	 }

	 componentDidMount(){
		this.nextRound();

	 	let roomsRef = fire.database().ref('rooms');

	 	roomsRef.child(this.props.room).child('results').on('value', snap => {
	 		var results = [];
	 		if (snap.val()){
	 			var values = snap.val();
	  			for (var key in values) {
	    			if (values.hasOwnProperty(key)) {
	    					results.push({
		    					name: key,
		    					score: values[key].score
	    					})
	    			}
				}
				this.props.updateScore(results);
	 		}
		});

		roomsRef.child(this.props.room).child('definitions').on('value', snap => {
			var results = [];

			var values = snap.val()[this.props.round.round_nb];
  			for (var key in values) {
    			if (values.hasOwnProperty(key)) {
    				if (values[key].participant != 'ADMIN'){
    					results.push({
	    					name: values[key].participant,
	    					definition: values[key].definition,
	    					votes: values[key].vote,
	    					correct_vote: values[key].correct
    					})
    				}
    			}
			}
			if (this.props.round.status == 'voting'){
				this.props.updateVote({
					results: results, 
					round_nb: this.props.round.round_nb,
					status: this.props.round.status
				});
			}
				
		});

	}

	nextRound() {
		// pick a random word. word here has word, country, and definition
	 	let word = this.props.word[Math.floor(Math.random() * this.props.word.length)];
	 	
	 	this.renderBar('submitting');
	 	this.props.startRound({
	 		room: this.props.room, 
	 		round_nb: this.props.round.round_nb,
	 		word: word
	 	});
	}

	renderBar(status) {
		var elem = document.getElementById("myBar");   
	  	var width = 100;
	  	var timer = 1500;
	  	if (status == 'voting') 
	  		timer = timer/2;

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
	      	this.postResultsToAction();
	      }
	    } else {
	      width--; 
	      elem.style.width = width + '%'; 
	      elem.innerHTML = width * 1;
	    }
	  	}, timer); //ms
	}

// TODO: show the results  by person - e.g. here is the definition, here is who voted for it, here is who wrote it. haha
// TODO: sum up the results for the 4 rounds. Do the bonus round. Show the winners
// TODO: make room caps lock
// TODO: make the word lower case
// TODO: fix the results!!

	postResultsToAction(){
		if (this.props.results.results == null)
			return;

		this.props.results.results.map(result => {
			let final_score = result.votes*250 + result.correct_vote*500
			this.props.postResults({
					result: result,
					final_score: final_score,
					room: this.props.room
				});
		});
	}
	renderScore(){
		if (Object.keys(this.props.score).length === 0)
			return;
		return this.props.score.score.map(score => {
			return( 
				<div> <h3>{score.name}: {score.score} </h3></div>
			);
		});
	}


	renderResults(){
		if (this.props.results.results == null)
			return <div> No votes! </div>

		return this.props.results.results.map(result => {
			let final_score = result.votes*250 + result.correct_vote*500
			return (
				<div>
					{result.name} score: {final_score}
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
		}
		if(this.props.round.status == 'voting'){
			// only rerender if time is out
			if (document.getElementById("myBar").attributes.style.value == "width: 0%;"){
				this.renderBar('voting');
			}

			header =  'Get your votes in for round '+this.props.round.round_nb+'!';
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
			<ul>{this.renderWord()}</ul>
			{this.props.round.status == 'results' &&
			<div>
				<br/>
				<h3> {this.props.round.word.word} means "{this.props.round.word.definition}" in {this.props.round.word.country}! </h3>
				<br/>
				<h2>Total Score: </h2>
				<br/>
				{this.renderScore()}
				<br/>
				<h2> Results for round {this.props.round.round_nb}: </h2>
				<br/>
				{this.renderResults()}
				<br/>
				{this.props.round.round_nb != 3 
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
		results: state.results,
		score: state.score};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({finishRound: finishRound,
		startRound: startRound,
		finishVote: finishVote,
		postResults: postResults,
		updateVote: updateVote,
		updateScore: updateScore}, 
		dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomHome);