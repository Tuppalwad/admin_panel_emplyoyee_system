import axios from 'axios';
import { BaseURL } from '../components/healper/apiConstant';
 
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

export const makeApiRequest = ({method, url, data, params, headers}) =>
    new Promise(async (resolve, reject) => {
      const options = {
        method,
        url,
        data,
        params,
      };

      // Only set when a caller needs to override the JSON default (e.g. file uploads)
      if (headers) {
        options.headers = headers;
      }
  
      options.validateStatus = () => {
        return true;
      };
  
      axiosInstance(options)
        .then(response => {
          console.log(response);
          if (response?.status !== 500) {
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
