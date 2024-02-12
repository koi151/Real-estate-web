import { RolesType } from '../../../../backend/commonTypes';
import createApi from '../api.service';

class RolesServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/roles") {
    this.api = createApi(baseUrl);
  }

  async getRoleTitles() {
    return (await this.api.get("/titles")).data;
  }

  async getRoles() {
    try {
      const accessToken = localStorage.getItem('accessToken');
  
      if (!accessToken) {
        throw new Error('Access token not found in localStorage');
      }
  
      const response = await this.api.get("/", { 
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      return response.data;
  
    } catch (error: any) {
      if (error.status === 401) {
        throw error;
      } else {
        console.error('Error while fetching administrator roles:', error);
        throw error;
      }
    }
  }

  async deleteRole(id: string) {
    return (await this.api.delete(`/delete/${id}`)).data;
  }

  async getSingleRole(id: string) {
    return (await this.api.get(`/detail/${id}`)).data;
  }

  async createRole(role: RolesType) {
    return (await this.api.post(`/create`, role)).data;
  }

  async updateRole(role: RolesType, id: string) {
    return (await this.api.patch(`/edit/${id}`, role)).data;
  }
}

const AdminRolesService = new RolesServiceAdmin();

export default AdminRolesService;
