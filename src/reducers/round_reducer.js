export default function (state = {
				round_nb: 0,
				status: 'submission'
			}, action){
	switch(action.type) {
		case 'ROUND_STARTED':
			console.log('Round '+action.payload.round_nb + ' started!');
			console.log('Word is: '+action.payload.word.word);
			console.log('Round is now: '+action.payload.status);
			return action.payload

		case 'ROUND_DONE':
			console.log('Round '+action.payload.round_nb + ' done!');
			console.log('Round is now: '+action.payload.status);
			return action.payload

		case 'VOTE_DONE':
			console.log('Vote on round '+action.payload.round_nb + ' done!');
			console.log('Round is now: '+action.payload.status);
			return action.payload

	}
	return state;
}