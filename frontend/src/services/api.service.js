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
  });
};

export default createApi;
