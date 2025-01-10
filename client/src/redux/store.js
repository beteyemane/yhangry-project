import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import setMenusReducer from './reducers/setMenusReducer';

const rootReducer = combineReducers({
    setMenus: setMenusReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;