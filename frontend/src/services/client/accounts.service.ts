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
        console.log('An error occurred:', err);
        throw new Error('An unexpected error occurred. Please try again later.');
      }
    }
  }

  async getSingleAccount(id: string, accountType: string) {
    const request = this.api.get(`detail/${id}/${accountType}`, accountType);
    return this.handleRequest(request);
  }

  async getSingleAccountLocal() {
    const request = this.api.get(`/detail-local`);
    return this.handleRequest(request);
  }

  async updateFavoriteList(accountId: string, postId: string) {
    const request = this.api.patch(`/favorite-posts/${accountId}`, { postId });
    return this.handleRequest(request);
  }
  
  async updateAccountBalance(accountId: string, amount: number, deposit: boolean) {
    const request = this.api.patch(`/update-balance/${accountId}`, { amount, deposit });
    return this.handleRequest(request);
  }
}

const clientAccountsService = new AccountsServiceClient();

export default clientAccountsService;
