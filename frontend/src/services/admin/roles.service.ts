import { RolesType } from '../../../../backend/commonTypes';
import createApi from '../api.service';

class RolesServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/roles") {
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

  async getRoleTitles() {
    const request = this.api.get(`/titles`);
    return this.handleRequest(request);
  }

  async getPermissions() { // redux
    const request = this.api.get(`/permissions`);
    return this.handleRequest(request);
  }

  async getRoles() { 
    const request = this.api.get("/");
    return this.handleRequest(request);
  }

  async getSingleRole(id: string) {
    const request = this.api.get(`/detail/${id}`);
    return this.handleRequest(request);
  }

  async createRole(role: any) {
    const request = this.api.post('/create', role);
    return this.handleRequest(request);
  }

  async updateRole(role: RolesType, id: string) {
    const request = this.api.patch(`/edit/${id}`, role);
    return this.handleRequest(request);
  }

  async deleteRole(id: string) {
    const request = this.api.delete(`/delete/${id}`);
    return this.handleRequest(request);
  }
}

const AdminRolesService = new RolesServiceAdmin();

export default AdminRolesService;
