import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Field, reduxForm } from "redux-form";
import {submit} from "../actions";
import fire from '../components/fire';
import '../style/style.css';


class UserHome extends Component {

	constructor(props){
	 	super(props);

	 	this.state = {
	 		round_nb: 1,
	 		status: 'pending'
	 	}
	 }

// need an action in the database that listens to when the round is active, then displays the form --> DONE
// need action when you submit the form, form disapears and answer gets submitted in the right place
// when the round is no longer active, then hide the form 
// when the round is in voting mode, then show the voting widget
// when the round is no longer in voting mode, then show the results
// when the round is active, start over...

	 componentDidMount(){
        var name = this.props.room
	 	let roomsRef = fire.database().ref('rooms');
	 	roomsRef.child(name).child('round').on('value', snap => {
	 			let status = snap.val().status;
	 			console.log(status);
	      		this.setState({status: status});
	 	});
	 }

	 renderField(field) {
	const {input, label, type, meta: {touched, error}}= field;
    const className = `form-group ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input className="form-control" type="text" {...field.input} />
        <div className="text-help">
           {touched && error && <span>{error}</span>}
        </div>
      </div>
    );
  }

	onSubmit(values) {
		// debugger;
		this.props.submit({
			definition: values.definition,
			participant: this.props.participant,
			room:  this.props.room, 
			round_nb: this.state.round_nb
		});
		// this.props.history.push("/play");
		console.log('SUBMIT!');
	}

	render() {
		const  {error, handleSubmit, pristine, reset, submitting} = this.props;

		return(
			<div className='container'>
				<h1>Welcome to room {this.props.room}, {this.props.participant}!</h1>
				<br/>
				<h2>Round: {this.state.round_nb}</h2>
				<h2>Status: {this.state.status}</h2>

			{this.state.status == 'submitting' &&
				<div className='container'>
			<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
			<Field
			label="Definition"
			name="definition"
			component={this.renderField}
			/>
			<button type="submit" className="btn btn-primary">Submit</button>
			</form>
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