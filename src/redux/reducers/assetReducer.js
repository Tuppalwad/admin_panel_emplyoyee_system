import { GET_ASSETS, SET_ASSET_ENUMS, SET_REFRESH_ASSET } from "../actiontypes";

/* Kept in sync with the backend enums, used until GET /asset/categories responds */
const initialState = {
    assets: [],
    /* A counter, not a flag: a boolean that is only ever set to true fires a
       dependent effect once and then goes stale on every later mutation. */
    refresh: 0,
    enums: {
        ASSET_CATEGORIES: ['Laptop', 'Mobile', 'Keyboard', 'Mouse', 'Headphone', 'RAM', 'SSD', 'Monitor', 'Charger', 'Other'],
        ASSET_STATUS: ['Available', 'Assigned', 'UnderMaintenance', 'Lost', 'Retired', 'Dead'],
        CONDITIONS: ['New', 'Good', 'Fair', 'Damaged', 'Beyond Repair']
    }
}

export const assetReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ASSETS:
            return {
                ...state,
                assets: action.payload
            }

        case SET_REFRESH_ASSET:
            return {
                ...state,
                refresh: (state.refresh || 0) + 1
            }

        case SET_ASSET_ENUMS:
            return {
                ...state,
                enums: {
                    ...state.enums,
                    ...action.payload
                }
            }

        default:
            return state;
    }
}
