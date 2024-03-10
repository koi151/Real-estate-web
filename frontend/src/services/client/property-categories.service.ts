import createApi from '../api.service';

class PropertyCategoriesServiceClient {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/property-categories") {
    this.api = createApi(baseUrl);
  }

  private getAuthHeaders() {
    const clientAccessToken = localStorage.getItem('clientAccessToken');
    if (!clientAccessToken) {
      throw new Error('Access token not found');
    }
    return {
      headers: {
        Authorization: `Bearer ${clientAccessToken}`
      }
    };
  }

  private async handleRequest(request: Promise<any>) {
    try {
      const response = await request;
      return response.data;
    } catch (error: any) {
      if (error.status === 401) {
        throw new Error('Unauthorized: Please log in to access this feature.');
      } else {
        console.error('An error occurred:', error);
        throw new Error('An unexpected error occurred. Please try again later.');
      }
    }
  }

  async getCategoryTree() {
    const request = this.api.get(`/category-tree`, this.getAuthHeaders());
    return this.handleRequest(request);
  };
}

const propertyCategoriesServiceClient = new PropertyCategoriesServiceClient();

export default propertyCategoriesServiceClient;
