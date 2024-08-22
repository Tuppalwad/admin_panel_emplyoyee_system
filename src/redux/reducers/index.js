// reducers/index.js
import { combineReducers } from 'redux';
import sidebarReducer from './sidebarReducer';
import loadingReducer from './loadingReducer';
import employeeReducer from './employeeReducer';
import adminInfoReducer from './adminInfoReducer';
import leaveReducer from './leaveReducer';

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  loading: loadingReducer,
  employee: employeeReducer,
  admininfo: adminInfoReducer,
  leaves: leaveReducer,
});

export default rootReducer;
