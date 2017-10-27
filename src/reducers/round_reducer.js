export default function (state = {
				round_nb: 1,
				status: 'submission'
			}, action){
	switch(action.type) {
		case 'ROUND_DONE':
			console.log('reducer caught: '+action.payload.round_nb);
			return action.payload
		case 'LOGIN':
			console.log('reducer caught: '+action.payload);
			return action.payload.room
	}
	return state;
}