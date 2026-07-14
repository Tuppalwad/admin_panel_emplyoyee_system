import { GET_ALL_EMPLOYEES, GET_EMPLOYEE_INFO } from '../actiontypes';

const initialState = {
  allEmployees: [],
  allemployeeInfo: [],
};

const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EMPLOYEES:
      return {
        ...state,
        allEmployees: action.payload,
      };
    case GET_EMPLOYEE_INFO:
      return {
        ...state,
        allemployeeInfo: action.payload,
      };
    default:
      return state;
  }
};

export default employeeReducer;
