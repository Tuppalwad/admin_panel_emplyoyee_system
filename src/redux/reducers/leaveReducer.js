import { SET_LEAVES,LEAVE_REFRESH } from "../actiontypes";


const initialState = {
    leaves: [],
    refresh : false
};





const leaveReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LEAVES:
            return {
                ...state,
                leaves: action.payload
            }
        case LEAVE_REFRESH:
            return {
                ...state,
                refresh: !state.refresh
            }

        default:
            return state;
    }
}


export default leaveReducer;