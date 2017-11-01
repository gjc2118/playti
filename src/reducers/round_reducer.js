export default function (state = {
				round_nb: 1,
				status: 'submission'
			}, action){
	switch(action.type) {
		case 'ROUND_DONE':
			console.log('round reducer caught: round '+action.payload.round_nb + ' done');
			console.log('round is now: '+action.payload.status);
			return action.payload

		case 'ROUND_STARTED':
			console.log('round reducer caught: round '+action.payload.round_nb + ' started');
			console.log('round is now: '+action.payload.status);
			return action.payload
	}
	return state;
}