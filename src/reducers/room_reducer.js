export default function (state = null, action){
	switch(action.type) {
		case 'ROOM_CREATED':
			console.log('room reducer caught with room created: '+action.payload.room);
			return action.payload.room
		case 'LOGIN':
			console.log('room reducer caught with room login: '+action.payload.room);
			return action.payload.room
	}
	return state;
}