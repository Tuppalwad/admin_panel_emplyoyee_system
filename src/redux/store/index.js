import { legacy_createStore as createStore, compose, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; // Correct import for thunk
import rootReducer from '../reducers'; // Assuming your rootReducer is properly defined
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // For web, use the default storage from redux-persist

// Initial state
const initialState = {};

// Redux Persist configuration
const persistConfig = {
  key: 'primary',
  storage, // Using default storage for web
  keyPrefix: '', // Removes 'persist:' prefix
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Setting up composeEnhancers for Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create the Redux store with persisted reducer and thunk middleware
const store = createStore(
  persistedReducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

// Creating the persistor for the store
export const persistor = persistStore(store);

export default store;
