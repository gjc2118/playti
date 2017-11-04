export default function (state = {
				round_nb: 1,
				status: 'submission'
			}, action){
	switch(action.type) {
		case 'ROUND_STARTED':
			console.log('Round '+action.payload.round_nb + ' started!');
			console.log('round is now: '+action.payload.status);
			console.log('word is:'+action.payload.word.word);
			return action.payload

		case 'ROUND_DONE':
			console.log('Round '+action.payload.round_nb + ' done!');
			console.log('round is now: '+action.payload.status);
			console.log('word is:'+action.payload.word.word);
			return action.payload

		case 'VOTE_DONE':
			console.log('Vote on round '+action.payload.round_nb + ' done!');
			console.log('round is now: '+action.payload.status);
			console.log('word is:'+action.payload.word.word);
			return action.payload

	}
	return state;
}