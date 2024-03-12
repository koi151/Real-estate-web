import createApi from '../api.service';

class AccountsServiceClient {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/accounts") {
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

  async getSingleAccount(id: string) {
    const request = this.api.get(`/detail/${id}`);
    return this.handleRequest(request);
  }

  async getSingleAccountLocal() {
    const request = this.api.get(`/detail/local/`);
    return this.handleRequest(request);
  }
}

const clientAccountsService = new AccountsServiceClient();

export default clientAccountsService;
