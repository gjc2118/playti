import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm } from "redux-form";
import {bindActionCreators} from 'redux';
import fire from '../components/fire';
import {Link} from 'react-router-dom';
import {login} from "../actions";
import {validateRoom} from "../actions";

// help: https://redux-form.com/6.7.0/examples/submitvalidation/

//TODO
//need to push the participant name to the room via firebase and render it in the home page
//need to validate the room number that it exists and handle errors
//need to ensure user enters a name
// FIGURE OUT DISPATCH...

class Join extends Component {

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

  // ROOM VALIDATION IS CLEARLY NOT WORKING
  // once the game is started, we should prevent people from joining
  
	onSubmit(values) {
		validateRoom;
		this.props.login(values);
		this.props.history.push("/play");
	}

	render() {
		const  {error, handleSubmit, pristine, reset, submitting} = this.props;

		return (
			<div className='page'>
			<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
			<Field
			label="Room"
			name="room"
			component={this.renderField}
			/>
			{error && <strong>{error}</strong>}
			<Field
			label="Name"
			name="name"
			component={this.renderField}
			/>
			<button type="submit" className="btn btn-primary">Get me in</button>
			<Link to="/" className="btn btn-danger">Nevermind</Link>
			</form>
			</div>
			);
		}
}

// add validation to make sure room exists
function validate(values) {
	const errors = {};

  if (!values.room) {
    errors.room = "Enter a room";
  }
  if (!values.name) {
    errors.name = "Enter a name";
  }
  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
}

function mapDispatchToProps(dispatch) {
  // Whenever login is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({ 
  	participant: login,
  	room: login
  	 }, dispatch);
}

export default reduxForm({
	validate,
		form: "JoinForm"
	})(connect(mapDispatchToProps, { login })(Join));