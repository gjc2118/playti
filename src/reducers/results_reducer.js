export default function (state = {}, action){
	switch(action.type) {
		case 'UPDATE_VOTE':
			console.log('round reducer caught: vote update');
			return action.payload
	}
	return state;
}