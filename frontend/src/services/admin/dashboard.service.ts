import createApi from '../api.service';

class DashboardService {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/dashboard") {
    this.api = createApi(baseUrl);
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
    const request = this.api.get("/");
    return this.handleRequest(request);
  } 
}

const dashboardService = new DashboardService();

export default dashboardService;
