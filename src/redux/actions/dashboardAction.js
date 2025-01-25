import { api, GET } from "../../components/healper/apiConstant";
import { makeApiRequest } from "../../services/axios";

export const getDashboardCountdata = (data) => async (dispatch) => {
    try {
        const response = await makeApiRequest({ method: GET, url: api.getDashboardCount, data });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }

}


export const getDashboardAttendance = (data) => async (dispatch) => {
    try {
        const response = await makeApiRequest({ method: GET, url: api.getDashboardAttendancedata, data });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export const getDashboardProject = (data) => async (dispatch) => {
    try {
        const response = await makeApiRequest({ method: GET, url: api.getDashboardProjectData, data });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }

}


