import fire from '../components/fire';
import {SubmissionError} from 'redux-form'

export const LOGIN = "LOGIN";
export const ROOM_CREATED = "ROOM_CREATED";
export const ROUND_DONE = 'ROUND_DONE';

export function createRoom() {
	  var text = "";
	  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	  for (var i = 0; i < 5; i++)
	    text += possible.charAt(Math.floor(Math.random() * possible.length));
		
		let roomsRef = fire.database().ref('rooms');
		roomsRef.child(text).set({
			name: text});

	  return {
	  	type: ROOM_CREATED,
	  	payload: {
	  		room: text
	  	}}
}

//will have to add validation if the name is already taken
export function login(values, callback) {
	let roomsRef = fire.database().ref('rooms');
	roomsRef.child(values.room).child('participants').child(values.name).set({name: values.name});
  return {
    type: LOGIN,
    payload: {
    	name: values.name,
    	room: values.room
    }
  };
}

// NEED TO CHANGE THIS
export function finishRound(values, callback) {
	// let roomsRef = fire.database().ref('rooms');
	// roomsRef.child(values.room).child('participants').child(values.name).set({name: values.name});
  return {
    type: ROUND_DONE,
    payload: {
    	round_nb: values,
    	status: 'voting'
    }
  };
}

//this is not being used
export function validateRoom(value){

	let roomsRef = fire.database().ref('rooms');
		roomsRef.orderByValue().equalTo(value.room).once("value",snapshot => {
		    if (!snapshot.val()){
		    	throw new SubmissionError({
        		room: 'Room does not exist',
        		_error: 'Login failed!'
      		})
		    }
		});
}