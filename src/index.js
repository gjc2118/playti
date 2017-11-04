import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';

import App from './components/app';
import RoomHome from './containers/room_home';
import Join from './containers/join';
import UserHome from './containers/user_home';
import GameHome from './containers/game_home';
import reducers from './reducers';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';



const createStoreWithMiddleware = applyMiddleware()(createStore);


ReactDOM.render(<Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
    	<div>
    		<Switch>
				<Route exact path="/home" component={RoomHome} />
				<Route exact path="/join" component={Join} />
				<Route exact path="/play" component={UserHome} />
        <Route exact path="/game" component={GameHome} />
    			<Route exact path="*" component={App} />
			</Switch>
    	</div>
    </BrowserRouter>
  </Provider>, document.getElementById('root'));
registerServiceWorker();
