import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import fire from '../components/fire';

class UserHome extends Component {

	constructor(props){
	 	super(props);
	 }

	render() {
		return(
			<div className='page'>
				<h1>Welcome to room {this.props.room}, {this.props.participant}!</h1>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		room: state.room,
		participant: state.participant
	};
}

export default connect(mapStateToProps)(UserHome);