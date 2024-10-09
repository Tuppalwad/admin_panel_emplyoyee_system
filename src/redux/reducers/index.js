import { combineReducers } from 'redux';
import sidebarReducer from './sidebarReducer';
import loadingReducer from './loadingReducer';
import employeeReducer from './employeeReducer';
import adminInfoReducer from './adminInfoReducer';
import leaveReducer from './leaveReducer';
import { projectReducer } from './porjectReducer';

// Combine all individual reducers into a root reducer
const appReducer = combineReducers({
  sidebar: sidebarReducer,
  loading: loadingReducer,
  employee: employeeReducer,
  admininfo: adminInfoReducer,
  leaves: leaveReducer,
  projects: projectReducer
});

// Root reducer that handles reset action
const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    state = undefined; // This will reset the entire Redux state
  }
  return appReducer(state, action);
};

export default rootReducer;
