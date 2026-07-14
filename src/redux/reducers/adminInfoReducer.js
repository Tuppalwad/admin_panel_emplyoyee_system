import { SET_ADMIN_INFO } from "../actiontypes";

const initialState = {
    adminInfo: {}
}

const adminInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ADMIN_INFO:
            return {
                ...state,
                adminInfo: action.payload
            }
        default:
            return state;
    }
}

export default adminInfoReducer;