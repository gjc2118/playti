export default function (state = {}, action){
	switch(action.type) {
		case 'UPDATE_VOTE':
			console.log('round reducer caught: vote update');
			return action.payload
		case 'ROUND_STARTED':
			console.log('round reducer caught: vote cleared');
			return {results: null};
	}
	return state;
}