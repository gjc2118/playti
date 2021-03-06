import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Field, reduxForm } from "redux-form";
import {submit} from "../actions";
import {vote} from "../actions";
import fire from '../components/fire';
import '../style/style.css';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
import {reset} from 'redux-form';



// MAKE ROUND NUMBER DYNAMIC
// FIGURE OUT BUG WITH VOTE OPTIONS SWITCHING

class UserHome extends Component {

	constructor(props){
	 	super(props);

	 	this.state = {
	 		round_nb: 1,
	 		status: 'pending',
	 		word: null,
	 		definitions: []
	 	}
	 }

// need an action in the database that listens to when the round is active, then displays the form --> DONE
// need action when you submit the form, form disapears and answer gets submitted in the right place --> DONE
// when the round is no longer active, then hide the form --> DONE
// when the round is in voting mode, then show the voting widget --> DONE
// when the round is no longer in voting mode, then show the results (in game room) --> DONE
// when the round is active, start over...

	 componentDidMount(){
	 	let roomsRef = fire.database().ref('rooms');

	 	// catch if the round status updates, word changes, round chanages
	 	roomsRef.child(this.props.room).child('round').on('value', snap => {
	      		this.setState({
	      			status: snap.val().status
	      		});
	      		if(snap.val().word){
		      		this.setState({word: snap.val().word.word});
	 			}
	 			if(snap.val().round_nb){
	 				this.setState({round_nb: snap.val().round_nb});
	 			}
	 	});
	 	
	 	// when there is a new definition submitted, update the state to include this definition
	 	roomsRef.child(this.props.room).child('definitions').child(this.state.round_nb).on('value', snap => {
  			var definitions = [];
  			for (var key in snap.val()) {
    			if (snap.val().hasOwnProperty(key)) {
        			var definition = {
        				definition: snap.val()[key].definition,
        				participant: snap.val()[key].participant,
        				vote: snap.val()[key].vote
        			};
        			definitions.push(definition)
        			this.setState({definitions: definitions,
        				round_nb: this.state.round_nb});
    			}
			}
		});
	 }

	 renderField(field) {
	const {input, label, type, meta: {touched, error}}= field;
    const className = `form-group ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input className="form-control" type="text" {...field.input} />
      </div>
    );
  }

	onSubmit(values) {
		this.props.submit({
			definition: values.definition,
			participant: this.props.participant,
			room:  this.props.room, 
			round_nb: this.state.round_nb
		});

		this.props.reset('SubmitForm');
		this.setState({status: 'waiting'})
		console.log('Submitted!');
		// return resetForm();
	}

	onSubmitVote(values) {
		vote({
			participant_voted: values.definition.participant,
			participant: this.props.participant,
			room:  this.props.room,
			round_nb: this.state.round_nb
		});
		console.log('Voted!');
		this.setState({status: 'results'})
	}

	shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;
	  while (0 !== currentIndex) {
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }
	  return array;
	}

  renderChoices() {
  		// randomize the responses
  		var choices = this.shuffle(this.state.definitions);
		return choices.map(definition => {
			// only show if it is not your vote
			if (this.props.participant == definition.participant)
				return;
			return (
				<div><Button key={definition.participant} type="submit" className="btn btn-secondary" onClick={() => this.onSubmitVote({definition})}>{definition.definition}
				</Button><br/>
				</div>
			);
			});
	}

	render() {
		const  {error, handleSubmit, pristine, reset, submitting} = this.props;

		return(
			<div className='container'>
				<h1>Welcome to room {this.props.room}, {this.props.participant}!</h1>
				<br/>
				<h3>Round: {this.state.round_nb}, status: {this.state.status}</h3>

			{this.state.status == 'submitting' &&
			<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
			<h3>Word: {this.state.word}</h3>
			<Field
			label="Definition"
			name="definition"
			component={this.renderField}
			/>
			<button type="submit" className="btn btn-primary">Submit</button>
			</form>
			}

			{this.state.status == 'voting' &&
			<div>
			<h3>Word: {this.state.word}</h3>
        		{this.renderChoices()}
      		</div>
			}

			</div>
		)
	}
}
			

function mapStateToProps(state) {
	return {room: state.room,
		word: state.word, 
		participant: state.participant,
		round: state.round};
}

// function mapDispatchToProps(dispatch) {
//   // Whenever login is called, the result shoudl be passed
//   // to all of our reducers
//   return bindActionCreators({ 
//   	definition: submit,
//   	participant: submit,
//   	room: submit
//   	 }, dispatch);
// }

export default reduxForm({
		form: "SubmitForm"
	})(connect(mapStateToProps, {submit})(UserHome));