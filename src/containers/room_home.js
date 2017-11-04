import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createRoom} from "../actions";
import fire from '../components/fire';
import {Link} from 'react-router-dom';

class RoomHome extends Component {

	 constructor(props){
	 	super(props);
	 	this.state = {
	 		participants: []
	 	}
	 }
 
	 componentDidMount(){
        var name = this.props.createRoom().payload.room;
	 	let roomsRef = fire.database().ref('rooms');
	 	roomsRef.child(name).child('participants').on('child_added', snapshot => {
	 			let participant = { name: snapshot.val().name, id: snapshot.key };
	      		this.setState({ participants: [participant].concat(this.state.participants) });
	 	});
	 }

	 renderPartipants(){
	 	if (!this.state.participants) {
	 		return
	 	}
	 	return this.state.participants.map((participant) => {
	 		return (
	 			<div>
	 			<li key={participant.name}> {participant.name} </li>
	 			</div>
	 		)
	 	});
	 }


	render() {
		const { room } = this.props;
		if (!room) {
      		return <div>Loading...</div>;
    	}

		return(
			<div className='container'>
			<h1> Welcome to the Game Room </h1> 
			<h2> Room number:  {this.props.room}</h2>
			<h3> Go on your phones to playtii.herokuapp.com/join and enter the room number </h3>
			<strong><br/>Instructions:</strong>
			<br/>You will be shown a word
			<br/>Write down a definition
			<br/>Players will vote on which word they think is right
			<br/>Trick your friends into thinking your definition is correct
			<br/>Win points by tricking others and guessing the right word
			<br /> 
	 		<br /> 
	 		<h3> Participants: </h3>
			{this.renderPartipants()}
			<br/>
			<br/>
			<Link to="/game" className="btn btn-danger">Start Game</Link>
			</div>
		)
		
	}
}

	
function mapStateToProps(state) {
	//whatever is returned will show up as props inside of roomhome
	return {room: state.room};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({createRoom: createRoom}, dispatch)

}

export default connect(mapStateToProps, mapDispatchToProps)(RoomHome);