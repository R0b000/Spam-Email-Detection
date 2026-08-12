import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit'; 
import counterReducer from './reducers';

const rootReducer = combineReducers({
  counter: counterReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return [...getDefaultMiddleware()];
  },
});

export default store;