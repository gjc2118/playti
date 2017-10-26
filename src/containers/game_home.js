import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createRoom} from "../actions";
import fire from '../components/fire';

class RoomHome extends Component {



	render() {
		
		return(
			<div className='page'>
			<h1> Let's get this game started </h1> 

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