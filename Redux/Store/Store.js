// import {createStore} from 'redux';
// import reducer from '../Reducer/Reducer';
// export default store = createStore(reducer);
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import combineReducer from '../Reducer/combineReducer';

const initialState = {};
const middleware = [thunk];
const store = createStore(
  combineReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ),
);

export default store;
