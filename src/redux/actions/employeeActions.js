import axiosInstance, { makeApiRequest } from "../../services/axios";
import { GET_ALL_EMPLOYEES } from "../actiontypes";
import { setLoading } from "./helpActions";
import { GET, POST, PUT, DELETE, api } from '../../components/healper/apiConstant';

export const getAllEmployees = () => async (dispatch) => {
  try {
    const response = await makeApiRequest({ method: GET, url: api.getAllEmployee });
    console.log(response.data.data);
    dispatch({
      type: GET_ALL_EMPLOYEES,
      payload: response.data.data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const setEmployee = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await makeApiRequest({ method: POST, url: api.setEmployee, data });
    console.log(response);
    await dispatch(getAllEmployees());
    dispatch(setLoading(false));
    return response.data;
  } catch (error) {
    console.log(error);
    dispatch(setLoading(false));
    throw error;
  }
};

export const deleteEmployee = (empId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await makeApiRequest({ method: DELETE, url: `${api.deleteEmployee}?empId=${empId}` });
    console.log(response.data);
    await dispatch(getAllEmployees());
    dispatch(setLoading(false));
    return response.data;
  } catch (error) {
    console.log(error);
    dispatch(setLoading(false));
    throw error;
  }
};

export const updateEmployee = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await makeApiRequest({ method: PUT, url: api.updateEmployee, data });
    await dispatch(getAllEmployees());
    dispatch(setLoading(false));
    return response.data;
  } catch (error) {
    console.log(error);
    dispatch(setLoading(false));
    throw error;
  }
};
