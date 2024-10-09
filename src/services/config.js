export const BaseURL = 'http://localhost:3030/api/' //process.env.REACT_APP_BASE_URL

export const login = BaseURL + 'login';
export const register = BaseURL + 'register';
export const checkuser = BaseURL +'@me';
export const logoutuser = BaseURL + 'logout';
export const forgotpassword = BaseURL + 'resetpassword';
export const sendmailforgotpass = BaseURL + 'sendmailforgotpass';
export const verifyEmail = BaseURL + 'verifyemail';
export const changepass = BaseURL + 'changepass'