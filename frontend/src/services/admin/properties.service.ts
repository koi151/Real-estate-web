import createApi from '../api.service';
import { GetPropertiesOptions, ValidMultiChangeType, ValidStatus } from '../../../../backend/commonTypes';

class PropertiesServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/properties") {
    this.api = createApi(baseUrl);
  }

  // private getAuthHeaders() {
  //   const accessToken = localStorage.getItem('accessToken');
    
  //   if (!accessToken) {
  //     console.log("Access token not found");
  //     throw new Error('Unauthorized');
  //   }
  //   return {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`
  //     }
  //   };
  // }

  private async handleRequest(request: Promise<any>): Promise<any> {
    try {
      const response = await request;
      return response.data;

    } catch (err: any) {
      console.log('Error occurred in handleRequest:', err)
      if (err.message === 'Access token not found') {
        throw new Error('Unauthorized')

      } else if (err.response && err.response.status === 401) {

        // Attempt to refresh the token
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('Refresh token not found in localStorage');
          }
  
          const refreshResponse = await this.api.post('/refresh', { refreshToken });
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
  
          return await this.handleRequest(request);

        } catch (refreshError) {
          throw new Error('Unauthorized');
        }

      } else {
        console.error('An error occurred:', err);
        throw new Error('An unexpected error occurred. Please try again later.');
      }
    }
  }

  async getApprovedProperties(options: GetPropertiesOptions) {
    const request = this.api.get("/", { 
      params: options,
    });
    return this.handleRequest(request);
  }

  async getPendingProperties() {
    const request = this.api.get("/pending");
    return this.handleRequest(request);
  }

  async getSingleProperty(id: string) {
    const request = this.api.get(`/detail/${id}`);
    return this.handleRequest(request);
  }

  async changePropertyStatus(id: string, status: ValidStatus) {
    const request = this.api.patch(`/change-status/${status}/${id}`, {});
    return this.handleRequest(request);
  }

  async multiChangeProperties(ids: string[], type: ValidMultiChangeType) {
    const request = this.api.patch(`/multi-change`, { ids, type });
    return this.handleRequest(request);
  }

  async createProperty(property: any) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    };
    const request = this.api.post('/create', property, config);
    return this.handleRequest(request);
  }

  async updateProperty(property: any, id: string) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const request = this.api.patch(`/edit/${id}`, property, config);
    return this.handleRequest(request);
  }

  async deleteProperty(id: string) {
    const request = this.api.delete(`/delete/${id}`);
    return this.handleRequest(request);
  }

  async getPropertyStatistic() {
    const request = this.api.get(`/statistics`);
    return this.handleRequest(request);
  }
  
}

const propertiesService = new PropertiesServiceAdmin();

export default propertiesService;
