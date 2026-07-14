// const baseUri = "https://backend-hr-management-vcxb.onrender.com/api/"//
//  const baseUri = 'https://employeesystemserver.vercel.app/api/' //process.env.REACT_APP_BASE_URL
//  const baseUri = 'http://localhost:3030/api/'
const baseUri = 'https://backend-hr-management-vcxb.onrender.com/api/'

export const login = baseUri + 'login';
export const register = baseUri + 'register';
export const checkuser = baseUri +'@me';
export const logoutuser = baseUri + 'logout';
export const forgotpassword = baseUri + 'resetpassword';
export const sendmailforgotpass = baseUri + 'sendmailforgotpass';
export const verifyEmail = baseUri + 'verifyemail';
export const changepass = baseUri + 'changepass'