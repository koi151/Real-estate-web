import { ValidStatus } from '../../../../backend/commonTypes';
import createApi from '../api.service';

class AccountsServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/accounts") {
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

  async getAccounts() {
    const request = this.api.get("/", this.getAuthHeaders());
    return this.handleRequest(request);
  }

  async getAvatar(id: string) {
    const request = this.api.get(`/avatar/${id}`, this.getAuthHeaders());
    return this.handleRequest(request);
  }

  async getSingleAccount(id: string) {
    const request = this.api.get(`/detail/${id}`, this.getAuthHeaders());
    return this.handleRequest(request);
  }

  async getSingleAccountLocal() {
    const request = this.api.get(`/detail/local/`, this.getAuthHeaders());
    return this.handleRequest(request);
  }

  async changeAccountStatus(id: string, status: ValidStatus) {
    const request = this.api.patch(`/change-status/${status}/${id}`, {}, this.getAuthHeaders());
    return this.handleRequest(request);
  }

  // async multiChangeProperties(ids: string[], type: ValidMultiChangeType) {
  //   return (await this.api.patch(`/multi-change`, {ids, type})).data;
  // }

  async createAccount(info: any) {
    const authHeaders = this.getAuthHeaders();
    const config = {
      headers: {
        ...authHeaders.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    const request = this.api.post('/create', info, config);
    return this.handleRequest(request);
  }

  async updateAccount(info: any, id: string) {
    const authHeaders = this.getAuthHeaders();
    const config = {
      headers: {
        ...authHeaders.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    const request = this.api.patch(`/edit/${id}`, info, config);
    return this.handleRequest(request);
  }

  async deleteAccount(id: string) {
    const request = this.api.delete(`/delete/${id}`, this.getAuthHeaders());
    return this.handleRequest(request);
  }
}

const adminAccountsService = new AccountsServiceAdmin();

export default adminAccountsService;
