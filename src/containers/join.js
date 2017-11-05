import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm } from "redux-form";
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {login} from "../actions";
import {validateRoom} from "../actions";

//TODO
//need to validate the room number that it exists and handle errors
//need to ensure user enters a name
// once the game is started, we should prevent people from joining
// add validation to make sure room exists

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
  
	onSubmit(values) {
		validateRoom;
		this.props.login(values);
		this.props.history.push("/play");
	}

	render() {
		const  {error, handleSubmit, pristine, reset, submitting} = this.props;

		return (
			<div className='container'>
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

function validate(values) {
	const errors = {};

  if (!values.room) {
    errors.room = "Enter a room";
  }
  if (!values.name) {
    errors.name = "Enter a name";
  }
  return errors;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
  	participant: login,
  	room: login
  	 }, dispatch);
}

export default reduxForm({
	validate,
		form: "JoinForm"
	})(connect(mapDispatchToProps, { login })(Join));