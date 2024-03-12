import axios from 'axios';

const commonConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

const createApi = (baseURL) => {
  return axios.create({
    baseURL,
    ...commonConfig,
    withCredentials: true,
    timeout: 120000
  });
};

export default createApi;
