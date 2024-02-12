import createApi from '../api.service';
import { GetPropertiesOptions, ValidMultiChangeType, ValidStatus } from '../../../../backend/commonTypes';

class PropertiesServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/properties") {
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

  async getProperties(options: GetPropertiesOptions) {
    const request = this.api.get("/", { 
      params: options,
      ...this.getAuthHeaders()
    });
    return this.handleRequest(request);
  }

  async getSingleProperty(id: string) {
    const request = this.api.get(`/detail/${id}`, this.getAuthHeaders());
    return this.handleRequest(request);
  }

  async changePropertyStatus(id: string, status: ValidStatus) {
    const request = this.api.patch(`/change-status/${status}/${id}`, {}, this.getAuthHeaders());
    return this.handleRequest(request);
  }

  async multiChangeProperties(ids: string[], type: ValidMultiChangeType) {
    const request = this.api.patch(`/multi-change`, { ids, type }, this.getAuthHeaders());
    return this.handleRequest(request);
  }

  async createProperty(property: any) {
    const authHeaders = this.getAuthHeaders();
    const config = {
      headers: {
        ...authHeaders.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    const request = this.api.post('/create', property, config);
    return this.handleRequest(request);
  }

  async updateProperty(property: any, id: string) {
    const authHeaders = this.getAuthHeaders();
    const config = {
      headers: {
        ...authHeaders.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    const request = this.api.patch(`/edit/${id}`, property, config);
    return this.handleRequest(request);
  }

  async deleteProperty(id: string) {
    const request = this.api.delete(`/delete/${id}`, this.getAuthHeaders());
    return this.handleRequest(request);
  }
}

const propertiesService = new PropertiesServiceAdmin();

export default propertiesService;
