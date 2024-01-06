import createApi from '../api.service'

const baseUrl = 'http://localhost:3000/api/v1/admin';

export const getProperties = async (options = {}) => {
  try {
    const response = await createApi(baseUrl).get('/properties', options);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
