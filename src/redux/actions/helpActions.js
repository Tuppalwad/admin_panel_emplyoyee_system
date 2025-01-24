import 
  { 
    LOADING,
    TOGGLE_SIDEBAR,
  } 
from "../actiontypes";


export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR,
});


export const setLoading = (payload) => ({
  type: LOADING,
  payload:payload
})

