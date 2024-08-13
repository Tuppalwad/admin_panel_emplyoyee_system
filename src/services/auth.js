import { GET ,POST,} from '../components/healper/apiConstant';
import { setLoading } from '../redux/actions/helpActions';
import { SET_ADMIN_INFO } from '../redux/actiontypes';
import { makeApiRequest } from './axios';
import { login, checkuser, logoutuser, forgotpassword, register, verifyEmail, sendmailforgotpass, changepass } from './config';

export const registerAdmin = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await makeApiRequest({ method: POST, url: register, data: data });
    console.log(res.data);
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    dispatch(setLoading(false));
    return error.message;
  }
}

export const verifyadminEmail = (email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await makeApiRequest({ method: POST, url: verifyEmail, data: { email: email } });
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    dispatch(setLoading(false));
    return error.message;
  }
}

export const Login = (email, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await makeApiRequest({ method: POST, url: login, data: { email: email, password: password } });
    localStorage.setItem('token', res.data?.data?.token);
    dispatch({
      type: SET_ADMIN_INFO,
      payload: res.data?.data
    })
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    console.log(error);
    dispatch(setLoading(false));
    return error.message;
  }
}

export const sendResetLink = (email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await makeApiRequest({ method: POST, url: sendmailforgotpass, data: { email: email } });
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    dispatch(setLoading(false));
    return error.message;
  }
}

export const resetPassword = (token, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await makeApiRequest({ method: POST, url: forgotpassword, data: { token: token, password: password } });
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    dispatch(setLoading(false));
    return error.message;
  }
}

export const changePassword = ( email,oldpassword,newpassword) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await makeApiRequest({ method: POST, url: changepass, data: {email:email, oldpassword: oldpassword,newpassword:newpassword } });
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    dispatch(setLoading(false));
    return error.message;
  }
}



export const isLoggedinUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await makeApiRequest({ method: GET, url: checkuser });
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    dispatch(setLoading(false));
    return error.message;
  }
}

export const logout = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem('token');
    const res = await makeApiRequest({ method: POST, url: logoutuser, data: { token: token } });
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    dispatch(setLoading(false));
    return error.message;
  }
}
