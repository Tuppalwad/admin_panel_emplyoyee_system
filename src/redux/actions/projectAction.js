import { api, DELETE, GET, POST, PUT } from "../../components/healper/apiConstant";
import { makeApiRequest } from "../../services/axios";
import { GET_PROJECTS, SET_MANAGER_LIST, SET_REFRESH_PROJECT } from "../actiontypes";
import { setLoading } from "./helpActions";



export const createProject = (project) => async (dispatch) => {
    try {
        const response = await makeApiRequest({ method: POST, url: api.addProject, data: project });
        dispatch({
            type: SET_REFRESH_PROJECT,
            payload: true
        })
        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const getProjects = () => async (dispatch) => {
    try {
        const response = await makeApiRequest({ method: GET, url: api.getProject });
        // console.log(response,'kkkk')
        if (response.data.code === 200) {
            dispatch({
                type: GET_PROJECTS,
                payload: response.data.data
            })
        }
    } catch (error) {
        console.log(error);
    }
}


export const getProjectById = (data) => async (dispatch) => {
    try {
        console.log(data)
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: POST, url: api.getProjectById, data: data })
        if (res.data.code === 200) {
            dispatch(setLoading(false))
            return res.data
        } else {
            dispatch(setLoading(false))
            return res.data.message
        }
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}



export const getProjectByEmpId = (data) => async (dispatch) => {
    try {
        console.log(data)
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: POST, url: api.getProjectsbyEmpId, data: data })
        if (res.data.code === 200) {
            dispatch(setLoading(false))
            return res.data
        } else {
            dispatch(setLoading(false))
            return res.data.message
        }
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}




export const deleteProject = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: DELETE, url: api.deleteProject, data: data });
        if (res.data.code === 200) {
            dispatch({ type: SET_REFRESH_PROJECT, payload: true })
            dispatch(setLoading(false))
            return res.data
        }
        else {
            dispatch(setLoading(false))
            return res.data.message
        }
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
    }
}


export const getManagerList = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: GET, url: api.getManagerList, data: data });
        if (res.data.code === 200) {
            dispatch({ type: SET_MANAGER_LIST, payload: res?.data?.data })
            dispatch(setLoading(false))
            return res.data
        }
        else {
            dispatch(setLoading(false))
            return res.data.message
        }
    } catch (error) {
        dispatch(setLoading(false))
        console.log(error)
    }
}


export const editProjectData = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await makeApiRequest({ method: PUT, url: api.editProjectData, data: data });
        if (res.data.code === 200) {
            // dispatch({ type: SET_MANAGER_LIST, payload: res?.data?.data })
            dispatch(setLoading(false))
            return res.data
        }
        else {
            dispatch(setLoading(false))
            return res.data.message
        }
    } catch (error) {
        console.log(error)
    }
}