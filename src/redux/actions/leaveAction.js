import axiosInstance, { makeApiRequest } from "../../services/axios";
import { GET_ALL_EMPLOYEES, LEAVE_REFRESH, SET_LEAVES } from "../actiontypes";
import { setLoading } from "./helpActions";
import { GET, POST, PUT, DELETE, api } from '../../components/healper/apiConstant';



export const getallEmpLeaves = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await makeApiRequest({ method: GET, url: api.getAllLeaves });
        console.log(response.data.data);
        dispatch({type:SET_LEAVES,payload:response.data.data});
        dispatch(setLoading(false));
        return response.data.data;
    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}



export const setStatusofLeave = (data) => async (dispatch) => {
    try {
        console.log(data,"data")
        dispatch(setLoading(true));
        const response = await makeApiRequest({ method: POST, url: api.leaveStatus,data:data });

        dispatch({type:LEAVE_REFRESH,payload:true});
        dispatch(setLoading(false));
        return response.data;
    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
        throw error;
    }
}
