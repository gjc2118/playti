import fire from '../components/fire';
import {SubmissionError} from 'redux-form';

export const LOGIN = "LOGIN";
export const ROOM_CREATED = "ROOM_CREATED";
export const ROUND_DONE = 'ROUND_DONE';
export const ROUND_STARTED = 'ROUND_STARTED';
export const SUBMIT = 'SUBMIT';
export const VOTE = 'VOTE';
export const VOTE_DONE = 'VOTE_DONE';
export const UPDATE_VOTE = 'UPDATE_VOTE';
export const POST_RESULTS = 'POST_RESULTS';
export const POST_SCORE = 'POST_SCORE';

// Room status: pending, submitting, voting, results, finished
// You can only enter the room if it is pending
// will have to add validation if the name is already taken
// you can only vote during voting
// you can only submit during submitting

export function createRoom() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	let roomsRef = fire.database().ref('rooms');
	roomsRef.child(text).set({
		name: text});
	roomsRef.child(text).child('round').set({
		status: 'pending'});
	return {
		type: ROOM_CREATED,
		payload: {
			room: text
		}}
	}

export function login(values, callback) {
		let roomsRef = fire.database().ref('rooms');
		roomsRef.child(values.room).child('participants').child(values.name).set({name: values.name,
			score: 0});
		return {
			type: LOGIN,
			payload: {
				name: values.name,
				room: values.room
			}
		};
	}

	 		// room: this.props.room, 
	 		// round_nb: this.props.round.round_nb,
	 		// word: word
// start round should take the selected word and send it to the round. also send it to database
// and adds the right definition of the word as part of the voting
export function startRound(values, callback) {
	let round_nb = values.round_nb+1;
	let roomsRef = fire.database().ref('rooms');
	roomsRef.child(values.room).child('round').set({
		status: 'submitting',
		round_nb: round_nb,
		word: values.word});
	roomsRef.child(values.room).child('definitions').child(round_nb).child('ADMIN').set({
		definition: values.word.definition,
		participant: 'ADMIN'
	});
	return {
		type: ROUND_STARTED,
		payload: {
			round_nb: round_nb,
			status: 'submitting',
			word: values.word,
		}
	};
}

// finish round updates status to voting 
export function finishRound(values, callback) {
	let roomsRef = fire.database().ref('rooms');
	roomsRef.child(values.room).child('round').update({status: 'voting'});
	return {
		type: ROUND_DONE,
		payload: {
			round_nb: values.round_nb,
			status: 'voting',
			word: values.word
		}
	};
}

// results: results, 
export function updateVote(values, callback){
	return {
		type: UPDATE_VOTE,
		payload: {
			results: values.results
		}
	}
}

// round_nb: this.props.round.round_nb,
// room: this.props.room
// mark status as results
export function finishVote(values, callback) {
	let roomsRef = fire.database().ref('rooms');
	roomsRef.child(values.room).child('round').update({status: 'results'});
	return{
		type: VOTE_DONE,
		payload: {
			round_nb: values.round_nb,
			status: 'results',
			word: values.word
		}
	}
}

// participant
// participant_voted: values.definition.participant,
// room:  this.props.room,
// round_nb: this.state.round_nb
// this function will be used to submit a vote: round, participant that got the vote
export function vote(values, callback){
	let roomsRef = fire.database().ref('rooms');
	roomsRef.child(values.room).child('definitions').child(values.round_nb).child(values.participant_voted).once('value', snap => {
		let vote = snap.val().vote+1;
		
		// if the vote was actually from participant = ADMIN then give that person a correct point
		if(values.participant_voted == 'ADMIN') {
			roomsRef.child(values.room).child('definitions').child(values.round_nb).child(values.participant).update({correct: 1});
		}
		if(values.participant_voted != 'ADMIN') {
			roomsRef.child(values.room).child('definitions').child(values.round_nb).child(values.participant_voted).update({vote: vote});	
		}

	});
	return {
		type: UPDATE_VOTE, 
		payload: {

		}
	}
}

				// result: result,
				// final_score: final_score,
				// room: this.props.room
export function postResults(values, callback){
	let roomsRef = fire.database().ref('rooms');
	let score = null;
	roomsRef.child(values.room).child('results').child(values.result.name).once('value', snap => {
		
		if (snap.val()){
			score = snap.val().score ? snap.val().score+values.final_score : values.final_score;
		}
		else {
			score = values.final_score;
		}
		roomsRef.child(values.room).child('results').child(values.result.name).update({score: score});
	});
	
	return {
		type: POST_RESULTS,
		payload: {
		}
	}
}

export function updateScore(values, callback){
	return {
		type: POST_SCORE,
		payload: {
			score: values
		}
	}

}

// this will only update the database, not the app state
// dont understand why I need to return a type here... maybe I am not using redux correctly
export function submit(values, callback) {
	let roomsRef = fire.database().ref('rooms');
	roomsRef.child(values.room).child('definitions').child(values.round_nb).child(values.participant).set({
		definition: values.definition,
		participant: values.participant,
		vote: 0,
		correct: 0
	});
	// IF LAST PERSON TO SUBMIT, THEN UPDATE DB STATE AND ENSURE IT FLOWS THROUGH GAME HOME TO CALL 
	// if definitions.round.child.count-1 (for admin) == particpant.child.count, then update round.status to voting

	return {
		type: SUBMIT,
		payload: {
			participant: values.participant,
			room: values.room_nb
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