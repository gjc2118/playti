import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createRoom} from "../actions";
import fire from '../components/fire';
import {startRound} from "../actions";
import {finishRound} from "../actions";
import {finishVote} from "../actions";


class RoomHome extends Component {


	constructor(props){
	 	super(props);

	 	this.state = {
	 		results: null
	 	}
	 }

	 componentDidMount(){
	 	// pick a random word
	 	let word = this.props.word[Math.floor(Math.random() * this.props.word.length)];
	 	// word here has word, country, and definition
		console.log('word: ' + word.word);
	 	this.props.startRound({
	 		room: this.props.room, 
	 		round_nb: this.props.round.round_nb,
	 		word: word
	 	}
	 	);

		this.renderBar('submitting');

		// NEED TO SHOW WHEN USERS SUBMITTED WORDS - NICE TO HAVE
	 	// let roomsRef = fire.database().ref('rooms');
	 	// roomsRef.child(this.props.room).child('words').set({name: word});
	 	// roomsRef.child(name).child('participants').on('child_added', snapshot => {
	 	// 		let participant = { name: snapshot.val().name, id: snapshot.key };
	  //     		this.setState({ participants: [participant].concat(this.state.participants) });
	 	// });


	 	/// THIS IS A HACK NEED TO MOVE THIS OUT 
	 	let roomsRef = fire.database().ref('rooms');

	 	var results = [];
		roomsRef.child(this.props.room).child('definitions').child(this.props.round.round_nb).on('value', snap => {

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
			this.setState({results: results})
		});	

		}

		renderBar(status) {
			var elem = document.getElementById("myBar");   
		  var width = 100;
		  	var id = setInterval(() => {
		    if (width == 0) {
		      clearInterval(id);
		      debugger;
		      if (status == 'submitting'){
		      		this.props.finishRound({
			      	round_nb: this.props.round.round_nb,
			      	room: this.props.room
			      });
		      }
		      if (status == 'voting'){
		      	this.props.finishVote({
			      	round_nb: this.props.round.round_nb,
			      	room: this.props.room
			      });
		      }
		    } else {
		      width--; 
		      elem.style.width = width + '%'; 
		      elem.innerHTML = width * 1;
		    }
		  	}, 10); //ms

		}


	// pull once from the DB the results of the round
	renderResults(){
		debugger;
		return this.state.results.map(result => {
			return (
				<div>
					<li>Name: {result.name}, votes: {result.votes}, votes: {result.correct_vote}
					</li>
				</div>
			);
		});
	}

	renderWord() {
		var header = '';
		if(this.props.round.status == 'submitting'){
			debugger;
			header = 'The word is: '+ this.props.round.word.word;
		}
		if(this.props.round.status == 'voting'){
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
			<ul>{this.renderWord()}</ul>
			{this.props.round.status == 'results' &&
			<div>
				Results for round {this.props.round.round_nb}:
				<br/>
				<ul>
				{this.renderResults()}
				</ul>
      		</div>
			}
			</div>
		)	
	}
}


function mapStateToProps(state) {
	//whatever is returned will show up as props inside of roomhome
	return {room: state.room,
		word: state.word, 
		round: state.round};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({finishRound: finishRound,
		startRound: startRound,
		finishVote: finishVote}, 
		dispatch)

}

export default connect(mapStateToProps, mapDispatchToProps)(RoomHome);