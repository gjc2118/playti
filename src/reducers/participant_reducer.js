export default function (state = null, action){
	switch(action.type) {
		case 'LOGIN':
			console.log('reducer caught: '+action.payload.name);
			return action.payload.name
	}
	return state;
}