import { combineReducers } from 'redux';
import { reducer as formReducer } from "redux-form";
import roomReducer from './room_reducer'
import participantReducer from './participant_reducer'

const rootReducer = combineReducers({
	room: roomReducer,
	participant: participantReducer,
	form: formReducer
});

export default rootReducer;
