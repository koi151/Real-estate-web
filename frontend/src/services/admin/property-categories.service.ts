import createApi from '../api.service';
import { GetPropertiesOptions, ValidStatus } from '../../../../backend/commonTypes';

class PropertyCategoriesServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/property-categories") {
    this.api = createApi(baseUrl);
  }

  private getAuthHeaders() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Access token not found in localStorage');
    }
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`
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

  async getPropertyCategories(options: GetPropertiesOptions) {
    const request = this.api.get("/", { 
      params: options,
      ...this.getAuthHeaders()
    });
    return this.handleRequest(request);
  }

  async getCategoryTree() {
    const request = this.api.get(`/category-tree`, this.getAuthHeaders());
    return this.handleRequest(request);
  };

  async getSingleCategory(id: string) { //
    const request = this.api.get(`/detail/${id}`, this.getAuthHeaders());
    return this.handleRequest(request);
  }

  async changeCategoryStatus(id: string, status: ValidStatus) { //
    const request = this.api.patch(`/change-status/${status}/${id}`, {}, this.getAuthHeaders());
    return this.handleRequest(request);
  }

  async createCategory(category: any) { 
    const authHeaders = this.getAuthHeaders();
    const config = {
      headers: {
        ...authHeaders.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    const request = this.api.post('/create', category, config);
    return this.handleRequest(request);
  }

  async updateCategory(category: any, id: string) { 
    const authHeaders = this.getAuthHeaders();
    const config = {
      headers: {
        ...authHeaders.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    const request = this.api.patch(`/edit/${id}`, category, config);
    return this.handleRequest(request);
  }

  async deleteCategory(id: string) { 
    const request = this.api.delete(`/delete/${id}`, this.getAuthHeaders());
    return this.handleRequest(request);
  }
}

const propertyCategoriesService = new PropertyCategoriesServiceAdmin();

export default propertyCategoriesService;
