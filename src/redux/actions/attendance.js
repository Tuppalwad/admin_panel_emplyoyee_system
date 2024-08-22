import axiosInstance, { makeApiRequest } from "../../services/axios";
import { SET_ADMIN_INFO } from "../actiontypes";
import { setLoading } from "./helpActions";
import { GET, POST, PUT, DELETE, api } from '../../components/healper/apiConstant';


export const getAttendanceToday = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await makeApiRequest({ method: GET, url: api.getemployeeattendanceToday });
        console.log(response);
        dispatch(setLoading(false));
        return response.data;
    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
        throw error;
    }
}



export const getemployeeattendanceInfo = (data) => async (dispatch) => {

    try {
        dispatch(setLoading(true));
        const response = await makeApiRequest({ method: POST, url: api.getemployeeattendanceInfo ,data:data});
        console.log(response);
        dispatch(setLoading(false));
        return response.data;
    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
        throw error;
    }
}



export const getMonthlyAttendance = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await makeApiRequest({ method: POST, url: api.getemployeeattendanceMonthly ,data:data});
        console.log(response);
        dispatch(setLoading(false));
        return response.data;
    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
        throw error;
    }
}
