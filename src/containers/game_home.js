import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createRoom} from "../actions";
import fire from '../components/fire';
import {startRound} from "../actions";
import {finishRound} from "../actions";


class RoomHome extends Component {


	constructor(props){
	 	super(props);
	 }

	 componentDidMount(){
	 	// debugger;
	 	this.props.startRound({room: this.props.room, round_nb: this.props.round.round_nb});
	 	var elem = document.getElementById("myBar");   
		  var width = 100;
		  	var id = setInterval(() => {
		    if (width == 0) {
		      clearInterval(id);
		      // debugger;
		      this.props.finishRound(this.props.round.round_nb);
		    } else {
		      width--; 
		      elem.style.width = width + '%'; 
		      elem.innerHTML = width * 1;
		    }
		  	}, 10); //ms

		let word = this.props.word[this.props.round.round_nb-1].word;
		console.log('word: ' + word);

		// NEED TO SHOW WHEN USERS SUBMITTED WORDS - NICE TO HAVE
	 	// let roomsRef = fire.database().ref('rooms');
	 	// roomsRef.child(this.props.room).child('words').set({name: word});
	 	// roomsRef.child(name).child('participants').on('child_added', snapshot => {
	 	// 		let participant = { name: snapshot.val().name, id: snapshot.key };
	  //     		this.setState({ participants: [participant].concat(this.state.participants) });
	 	// });

		}

	renderWord() {
		var header = '';
		if(this.props.round.status == 'submission'){
			header = 'The word is: '+ this.props.word[this.props.round.round_nb-1].word;
		}
		if(this.props.round.status == 'voting'){
			header =  'Get your votes in!';

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
			{this.renderWord()}
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
		startRound: startRound}, 
		dispatch)

}

export default connect(mapStateToProps, mapDispatchToProps)(RoomHome);