import { GET_PROJECTS, SET_MANAGER_LIST, SET_REFRESH_PROJECT } from "../actiontypes";



const initialState = {
    projects: [],
    refresh: false,
    listOfManager: []
}



export const projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PROJECTS:
            return {
                ...state,
                projects: action.payload
            }

        case SET_REFRESH_PROJECT:
            return {
                ...state,

                refresh: action.payload
            }
        case SET_MANAGER_LIST:
            return {
                ...state,
                listOfManager: action.payload
            }
        default:
            return state;
    }
}