export default function (state = {}, action){
	switch(action.type) {
		case 'POST_SCORE':
			console.log('Posting results via reducer');
			return action.payload
	}
	return state;
}