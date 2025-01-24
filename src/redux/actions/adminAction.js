import axiosInstance, { makeApiRequest } from "../../services/axios";
import { SET_ADMIN_INFO } from "../actiontypes";
import { setLoading } from "./helpActions";
import { GET, POST, PUT, DELETE, api } from '../../components/healper/apiConstant';

export const setAdmininfo = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await makeApiRequest({ method: POST, url: api.setAdminInfo, data });
        dispatch({
            type: SET_ADMIN_INFO,
            payload: response.data.data,
        });
        console.log(response);
        dispatch(setLoading(false));
        return response.data;
    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
        throw error;
    }
    }


export const getAdmininfo = (email) => async (dispatch) => {
    try {
        const response = await makeApiRequest({ method: POST, url: api.getAdminInfo, data:{email:email} });
        console.log(response.data.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}