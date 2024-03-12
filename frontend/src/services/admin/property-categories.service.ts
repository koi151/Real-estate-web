import createApi from '../api.service';
import { GetPropertiesOptions, ValidStatus } from '../../../../backend/commonTypes';

class PropertyCategoriesServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/property-categories") {
    this.api = createApi(baseUrl);
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
    });
    return this.handleRequest(request);
  }

  async getCategoryTree() {
    const request = this.api.get(`/category-tree`);
    return this.handleRequest(request);
  };

  async getParentCategory(id: string) {
    const request = this.api.get(`/parent/${id}`);
    return this.handleRequest(request);
  };

  async getSingleCategory(id: string) { 
    const request = this.api.get(`/detail/${id}`);
    return this.handleRequest(request);
  }

  async changeCategoryStatus(id: string, status: ValidStatus) { 
    const request = this.api.patch(`/change-status/${status}/${id}`, {});
    return this.handleRequest(request);
  }

  async createCategory(category: any) { 
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const request = this.api.post('/create', category, config);
    return this.handleRequest(request);
  }

  async updateCategory(category: any, id: string) { 
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const request = this.api.patch(`/edit/${id}`, category, config);
    return this.handleRequest(request);
  }

  async deleteCategory(id: string) { 
    const request = this.api.delete(`/delete/${id}`);
    return this.handleRequest(request);
  }
}

const propertyCategoriesService = new PropertyCategoriesServiceAdmin();

export default propertyCategoriesService;
