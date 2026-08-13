import { api, DELETE, GET, POST, PUT } from "../../components/healper/apiConstant";
import { makeApiRequest } from "../../services/axios";
import { GET_ASSETS, SET_ASSET_ENUMS, SET_REFRESH_ASSET } from "../actiontypes";
import { setLoading } from "./helpActions";


/* ---------------- Asset CRUD & lifecycle ---------------- */

export const getAssets = (filters) => async (dispatch) => {
    try {
        const response = await makeApiRequest({ method: GET, url: api.getAllAssets, params: filters });
        if (response.data.code === 200) {
            dispatch({
                type: GET_ASSETS,
                payload: response.data.data
            })
        }
        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const getAssetById = (assetId) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: GET, url: api.getAssetById, params: { assetId } })
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


export const createAsset = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: POST, url: api.addAsset, data });
        if (res.data.code === 200 || res.data.code === 201) {
            dispatch({ type: SET_REFRESH_ASSET, payload: true })
        }
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error);
        dispatch(setLoading(false))
    }
}


export const editAsset = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: PUT, url: api.editAsset, data });
        if (res.data.code === 200) {
            dispatch({ type: SET_REFRESH_ASSET, payload: true })
        }
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error);
        dispatch(setLoading(false))
    }
}


export const deleteAsset = (assetId) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: DELETE, url: api.deleteAsset, params: { assetId } });
        if (res.data.code === 200) {
            dispatch({ type: SET_REFRESH_ASSET, payload: true })
        }
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


export const retireAsset = (assetId) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: POST, url: api.retireAsset, data: { assetId } });
        if (res.data.code === 200) {
            dispatch({ type: SET_REFRESH_ASSET, payload: true })
        }
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


export const markAssetDead = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: POST, url: api.markDeadAsset, data });
        if (res.data.code === 200) {
            dispatch({ type: SET_REFRESH_ASSET, payload: true })
        }
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


export const searchAssets = (query) => async (dispatch) => {
    try {
        const res = await makeApiRequest({ method: GET, url: api.searchAsset, params: { query } });
        if (res.data.code === 200) {
            dispatch({ type: GET_ASSETS, payload: res.data.data })
        }
        return res.data
    } catch (error) {
        console.log(error)
    }
}


export const getAssetsByEmpId = (empId) => async (dispatch) => {
    try {
        const res = await makeApiRequest({ method: GET, url: api.getAssetsByEmpId, params: { empId } });
        return res.data
    } catch (error) {
        console.log(error)
    }
}


export const getEmployeeAssetHistory = (empId) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: GET, url: api.getEmployeeAssetHistory, params: { empId } });
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


export const assignAsset = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: POST, url: api.assignAsset, data });
        if (res.data.code === 200) {
            dispatch({ type: SET_REFRESH_ASSET, payload: true })
        }
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


export const returnAsset = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: POST, url: api.returnAsset, data });
        if (res.data.code === 200) {
            dispatch({ type: SET_REFRESH_ASSET, payload: true })
        }
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


export const transferAsset = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: POST, url: api.transferAsset, data });
        if (res.data.code === 200) {
            dispatch({ type: SET_REFRESH_ASSET, payload: true })
        }
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


export const getAssetHistory = (assetId) => async (dispatch) => {
    try {
        const res = await makeApiRequest({ method: GET, url: api.getAssetHistory, params: { assetId } });
        return res.data
    } catch (error) {
        console.log(error)
    }
}


export const getAssetCategories = () => async (dispatch) => {
    try {
        const res = await makeApiRequest({ method: GET, url: api.getAssetCategories });
        if (res.data.code === 200) {
            dispatch({ type: SET_ASSET_ENUMS, payload: res.data.data })
        }
        return res.data
    } catch (error) {
        console.log(error)
    }
}


/* ---------------- Legacy register import ---------------- */

/* Multipart upload — the Content-Type override stops the axios instance's JSON
   default from serialising the FormData; the browser fills in the boundary. */
export const importLegacyRegister = ({ excelFile, importedBy }) => async (dispatch) => {
    try {
        dispatch(setLoading(true))

        const formData = new FormData();
        formData.append('excelFile', excelFile);
        formData.append('importedBy', importedBy);

        const res = await makeApiRequest({
            method: POST,
            url: api.importAssetRegister,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.code === 200 || res.data.code === 201) {
            dispatch({ type: SET_REFRESH_ASSET, payload: true })
        }

        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


/* ---------------- Maintenance ---------------- */

export const addMaintenance = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: POST, url: api.addMaintenance, data });
        if (res.data.code === 200 || res.data.code === 201) {
            dispatch({ type: SET_REFRESH_ASSET, payload: true })
        }
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


export const updateMaintenance = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: PUT, url: api.updateMaintenance, data });
        if (res.data.code === 200) {
            dispatch({ type: SET_REFRESH_ASSET, payload: true })
        }
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


export const getMaintenance = (assetId) => async (dispatch) => {
    try {
        const res = await makeApiRequest({ method: GET, url: api.getMaintenance, params: { assetId } });
        return res.data
    } catch (error) {
        console.log(error)
    }
}


/* ---------------- Dashboard ---------------- */

export const getAssetCountByStatus = () => async (dispatch) => {
    try {
        const res = await makeApiRequest({ method: GET, url: api.getAssetCountByStatus });
        return res.data
    } catch (error) {
        console.log(error)
    }
}


export const getAssetCountByCategory = () => async (dispatch) => {
    try {
        const res = await makeApiRequest({ method: GET, url: api.getAssetCountByCategory });
        return res.data
    } catch (error) {
        console.log(error)
    }
}


export const getWarrantyExpiring = (days) => async (dispatch) => {
    try {
        const res = await makeApiRequest({ method: GET, url: api.getWarrantyExpiring, params: { days } });
        return res.data
    } catch (error) {
        console.log(error)
    }
}


export const getAssetOverview = () => async (dispatch) => {
    try {
        const res = await makeApiRequest({ method: GET, url: api.getAssetOverview });
        return res.data
    } catch (error) {
        console.log(error)
    }
}
