export default function (state = null, action){
	switch(action.type) {
		case 'LOGIN':
			console.log('participant reducer caught: name '+action.payload.name);
			return action.payload.name
	}
	return state;
}