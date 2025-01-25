import { api, GET } from "../../components/healper/apiConstant";
import { makeApiRequest } from "../../services/axios";
import { setLoading } from "./helpActions";

export const getDashboardCountdata = (data) => async (dispatch) => {
    try {
        const response = await makeApiRequest({ method: GET, url: api.getDashboardCount, data });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
   
}
