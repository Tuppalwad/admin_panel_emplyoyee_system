import axios from 'axios';

const BaseURL = 'http://localhost:3030/api/' //process.env.REACT_APP_BACKEND_URL || "http://localhost:3030/api/";

const axiosInstance = axios.create({
    baseURL: BaseURL,
    headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
    }
});

axiosInstance.interceptors.request.use(
    async config => {
        const token = await localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export const makeApiRequest = ({method, url, data, params}) =>
    new Promise(async (resolve, reject) => {
      const options = {
        method,
        url,
        data,
        params,
      };
  
      options.validateStatus = () => {
        return true;
      };
  
      axiosInstance(options)
        .then(response => {
          console.log(response);
          if (response.status !== 500) {
            resolve(response);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });

export default axiosInstance;
