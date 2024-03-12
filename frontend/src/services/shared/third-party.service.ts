import createApi from '../api.service';

class ThirdPartyAPIService {
  private api: any;

  constructor(baseUrl = "http://localhost:3000/api/v1/third-party-api") {
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

  async getGoogleCloudAPI() {
    const request = this.api.get(`/google-cloud`);
    return this.handleRequest(request); 
  }

  async getOpenCageAPI() {
    const request = this.api.get(`/open-cage`);
    return this.handleRequest(request);   }
}

const thirdPartyAPIService = new ThirdPartyAPIService();

export default thirdPartyAPIService;
