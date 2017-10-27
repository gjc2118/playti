import { combineReducers } from 'redux';
import { reducer as formReducer } from "redux-form";
import roomReducer from './room_reducer';
import participantReducer from './participant_reducer';
import wordReducer from './word_reducer';
import roundReducer from './round_reducer';

const rootReducer = combineReducers({
	room: roomReducer,
	participant: participantReducer,
	form: formReducer,
	word: wordReducer,
	round: roundReducer
});

export default rootReducer;
