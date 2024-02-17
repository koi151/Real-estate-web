import createApi from '../api.service';

class DashboardService {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/dashboard") {
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
    } catch (err: any) {
      if (err.status === 401) {
        throw new Error('Unauthorized: Please log in to access this feature.');
      } else {
        console.error('An error occurred:', err);
        throw new Error('An unexpected error occurred. Please try again later.');
      }
    }
  }

  async getStatistics() {
    const request = this.api.get("/", this.getAuthHeaders());
    return this.handleRequest(request);
  } 
}

const dashboardService = new DashboardService();

export default dashboardService;
