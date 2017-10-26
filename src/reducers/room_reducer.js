export default function (state = null, action){
	switch(action.type) {
		case 'ROOM_CREATED':
			console.log('reducer caught: '+action.payload.room);
			return action.payload.room
		case 'LOGIN':
			console.log('reducer caught: '+action.payload.room);
			return action.payload.room
	}
	return state;
}