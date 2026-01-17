// src/redux/store.js
import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from '../Redux/Reducers/index';

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk),
);
